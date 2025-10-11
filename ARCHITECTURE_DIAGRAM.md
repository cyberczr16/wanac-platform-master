# Component Architecture Diagram

## Before (Monolithic)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              page.jsx (1,076 lines)                 │
│                                                     │
│  • All state management                             │
│  • Jitsi initialization                             │
│  • Recording logic                                  │
│  • Data loading                                     │
│  • AI processing                                    │
│  • All UI rendering                                 │
│  • Event handlers                                   │
│  • Everything mixed together                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## After (Component-Based)
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              page.jsx (375 lines) - Orchestrator             │
│                                                              │
│  Coordinates between hooks and components                    │
│                                                              │
└───────────────┬──────────────────────────┬───────────────────┘
                │                          │
                │                          │
     ┌──────────▼──────────┐    ┌──────────▼──────────┐
     │   Custom Hooks      │    │   UI Components     │
     │                     │    │                     │
     │  useJitsiMeeting    │    │  MeetingTopBar      │
     │  useRecording       │    │  JitsiVideoContainer│
     │  useMeetingData     │    │  MeetingFooter      │
     │                     │    │  ProcessingOverlay  │
     └─────────────────────┘    └─────────────────────┘
```

## Data Flow
```
┌─────────────────────────────────────────────────────────────┐
│                         User Action                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Main Page (Orchestrator)                 │
│                                                             │
│  • Receives event from UI component                         │
│  • Calls appropriate hook function                          │
│  • Updates UI state                                         │
└───────┬─────────────────────────────┬───────────────────────┘
        │                             │
        ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│  Custom Hook     │         │  UI Component    │
│                  │         │                  │
│  • Executes      │         │  • Re-renders    │
│    business      │         │    with new      │
│    logic         │         │    props         │
│  • Updates       │────────▶│                  │
│    internal      │         │                  │
│    state         │         │                  │
└──────────────────┘         └──────────────────┘
```

## Hook Dependencies
```
┌─────────────────────────────────────────────────────────────┐
│                      useMeetingData                         │
│  Loads: experience, fireteam, agenda, exhibits              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ provides data to
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     useJitsiMeeting                         │
│  Manages: Jitsi API, participants, attendance               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ jitsiApiRef & jitsiReady
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      useRecording                           │
│  Handles: Recording, transcription, AI summaries            │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy
```
<FireteamExperienceMeeting>              (Main Page)
  │
  ├── <AdminSidebar /> or <Sidebar />
  │
  └── <MainContent>
      │
      ├── <MeetingTopBar />              (New Component)
      │
      ├── <ContentArea>
      │   │
      │   ├── <AgendaTimer />
      │   │
      │   ├── <JitsiVideoContainer />    (New Component)
      │   │
      │   ├── <Slide />
      │   │
      │   └── <EnhancedMeetingControls />
      │
      ├── <EnhancedAgendaSidebar />
      │
      └── <MeetingFooter />               (New Component)
  
  <MeetingSummaryModal />
  <ProcessingOverlay />                   (New Component)
```

## File Size Comparison
```
Before:
█████████████████████████████████████████████████ 1,076 lines

After:
Main Page:    ███████████████████ 375 lines (65% smaller!)
Hooks:        ██████████████████████████████████ 773 lines
Components:   ███████ 139 lines
             ─────────────────────────────────────
Total:        ██████████████████████████████████████████████████ 1,287 lines
              (Organized across 8 files)
```

## Benefits Visualization
```
┌─────────────────────────────────────────────────────────────┐
│                   MAINTAINABILITY ↑                         │
│  ✓ Small, focused files                                     │
│  ✓ Clear responsibilities                                   │
│  ✓ Easy to find bugs                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    TESTABILITY ↑                            │
│  ✓ Test hooks independently                                 │
│  ✓ Mock dependencies easily                                 │
│  ✓ Isolate components                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   REUSABILITY ↑                             │
│  ✓ Share hooks across pages                                 │
│  ✓ Reuse components                                         │
│  ✓ Build component library                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PERFORMANCE ↑                             │
│  ✓ Memoize components                                       │
│  ✓ Optimize re-renders                                      │
│  ✓ Smaller component trees                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 DEVELOPER EXPERIENCE ↑                      │
│  ✓ Easier onboarding                                        │
│  ✓ Clear file structure                                     │
│  ✓ Self-documenting code                                    │
└─────────────────────────────────────────────────────────────┘
```

