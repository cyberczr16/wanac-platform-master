# Fireteam × Breakout Blueprint — Implementation Analysis
**Generated:** April 3, 2026 | **For:** WANAC Foundation Taproot Team

---

## What the Blueprint Is

The Breakout Developer Blueprint is a reverse-engineered spec of **Breakout Learning** — a live collaborative learning platform where small groups of students join video sessions, work through structured slide decks, answer questions, and receive AI-powered evaluations scored on Bloom's Taxonomy. The **Fireteam** feature inside the WANAC platform is WANAC's implementation of this concept, adapted for veterans instead of business school students.

The key insight: **Fireteam IS the Breakout app, rebranded and embedded into the WANAC platform.** The blueprint gives us a complete spec for how the original system works, so we can build ours correctly.

---

## What's Already Built (Audit)

The WANAC platform has a surprisingly solid foundation. Here is what exists:

### Pages / Routes ✅ Built
| Route | File | Status |
|---|---|---|
| `/client/fireteam` | `fireteam/page.jsx` | ✅ Working — lists assignments per fireteam |
| `/client/fireteam/experience/[id]` | `experience/[experienceid]/page.jsx` | ✅ Built — full live session page |
| `/client/fireteam/experience/[id]/evaluation` | `evaluation/page.jsx` | ✅ Built — results display |
| `/client/fireteam/overview/[id]` | `overview/[experienceid]/page.jsx` | ✅ Exists |
| `/admin/fireteammanagement` | `admin/fireteammanagement/` | ✅ Admin CRUD pages exist |

### Session UI Components ✅ Built
- `SlideComponent.jsx` — renders slides (partial — see gaps)
- `AgendaSidebar.jsx` + `EnhancedAgendaSidebar.jsx` — agenda with timer
- `AgendaTimer.jsx` — countdown per slide
- `LivekitVideoContainer.jsx` — LiveKit video grid
- `MeetingTopBar.jsx` + `MeetingFooter.jsx` — session chrome
- `ConfirmDialog.jsx`, `ProcessingOverlay.jsx`, `Toast.jsx`

### Results / Evaluation ✅ Built
- `ConversationMap.jsx` — animated conversation visualization
- `GroupBalanceScore.jsx` — group participation balance
- `IndividualEvaluation.jsx` — per-student rubric scores
- `RoleTabView.jsx` — admin vs client view toggle

### Services / API Layer ✅ Built
- `fireteam.service.ts` — fireteam CRUD
- `experience.service.ts` — full experience + agenda + exhibits CRUD
- `recording.service.ts` — recording lifecycle
- `meeting.service.ts` — meeting management
- `ai.service.ts` / `huggingface.service.ts` — AI evaluation hooks
- `/api/livekit/token` — LiveKit JWT token generation ✅

### Infrastructure ✅ Built
- LiveKit integration (`@livekit/components-react`) with real token generation
- `breakoutDeckParser.js` — parses Breakout's Firestore JSON into agenda steps
- `breakoutDeckMap.js` — maps deck IDs to content

---

## The Gaps — What Needs to Be Built

These are the critical missing pieces, ordered by priority.

---

### GAP 1 — Real-Time Slide Sync (CRITICAL)
**Blueprint reference:** Section 8, E8

The blueprint's core mechanic is that when the group leader advances a slide, ALL participants instantly see the same slide. Currently, each user's slide position is local — there is no shared `room_state` being pushed to participants in real time.

**What's needed:**
- A `room_state` table in the PostgreSQL database (or use LiveKit's `DataChannel` / Supabase Realtime)
- Fields: `activeSlide`, `groupLeaderUserIds`, `userIds`, `activeExhibitId`
- When the leader clicks "Next Slide" → write to DB → all other participants receive the update
- Implementation choice: **Supabase Realtime** (POSTGRES_CHANGES) is the cleanest option since the platform already appears to use a Laravel + Postgres backend

**Schema needed (PostgreSQL):**
```sql
CREATE TABLE fireteam.room_state (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES fireteam.experiences(id),
  active_slide INTEGER DEFAULT 0,
  active_slide_changed_at TIMESTAMPTZ DEFAULT NOW(),
  active_exhibit_id INTEGER,
  group_leader_user_ids INTEGER[] DEFAULT '{}',
  user_ids INTEGER[] DEFAULT '{}',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Frontend change:** In the live session page, subscribe to `room_state` updates. Only render `<NextSlide>` button if `currentUser.id` is in `groupLeaderUserIds`.

---

### GAP 2 — Slide Type Renderer (HIGH)
**Blueprint reference:** Section 5, E6

The current `SlideComponent.jsx` dispatches on slide **title strings** (`if (step.title === "Waiting Room")`), which is fragile. The blueprint defines 12 distinct `slideType` numeric values with specific rendering rules for each.

**What's needed:** Rewrite `SlideComponent.jsx` to dispatch on `step.breakout?.slideType` (or a mapped equivalent). The 12 types and their rendering rules:

| slideType | Render |
|---|---|
| `0` | Waiting room — member list, countdown, WANAC welcome |
| `1` | Standard content — image + optional video (most common) |
| `2` | Content with linked questions — no video, shows question inputs |
| `4` | Poll — interactive voting |
| `6` | **Discussion prompt** — the core discussion slide with exhibit sidebar |
| `7` | Grading/Info — static content card |
| `8` | Agenda — session outline with time allocations |
| `11` | **Session processing** — spinner + 5-star rating + AI trigger |
| `12` | End of session — farewell/completion screen |
| `17` | Quiz/Timer — countdown + question |
| `18` | Quiz question variant — MCQ format |
| `19` | Learning objectives variant |

The most important types for veteran sessions are `0` (waiting room), `1` (content), `6` (discussion), `11` (processing), and the evaluation display.

---

### GAP 3 — Pre-Work Quiz with Pass/Fail Gating (HIGH)
**Blueprint reference:** Section 11, E12

The blueprint specifies that students must **pass a quiz before they can join a live session**. The `QuizCard.jsx` component exists but there is no enforced gate preventing entry to the session page if the quiz hasn't been passed.

**What's needed:**
- Quiz questions stored per experience (the `questions` table in the fireteam schema)
- `questionType: 0` = pre-work multiple choice, with `correctAnswerIndex`
- Score calculation: pass threshold (typically 70%+)
- Gate logic: on navigating to `/client/fireteam/experience/[id]`, check quiz pass status. If not passed, redirect to quiz page
- Store quiz completion: `user_quiz_result` table with `passed: boolean`, `score: number`, `userId`, `experienceId`

**API needed:**
```
GET  /api/v1/fireteams/experience/{id}/quiz          → fetch questions
POST /api/v1/fireteams/experience/{id}/quiz/submit   → submit answers, get pass/fail
GET  /api/v1/fireteams/experience/{id}/quiz/status   → check if user already passed
```

---

### GAP 4 — AI Evaluation Pipeline (HIGH)
**Blueprint reference:** Sections 9, 10, E10

The blueprint defines a complete AI evaluation flow. The `recording.service.ts` and `huggingface.service.ts` exist but the pipeline connecting transcript → LLM evaluation → rubric results stored per student needs to be wired together.

**The complete flow:**
1. During session (slides 6-14), LiveKit recording captures audio
2. On slide 11 (Processing), recording stops
3. Transcript is assembled per participant per discussion slide
4. For each rubric, send to LLM:
   - The rubric prompt (e.g. "Did the student demonstrate understanding of market validation?")
   - The student's transcript segments for that discussion
5. LLM returns: `{ score: 0-6, arguments: string[], justification: string, disagreements: [] }`
6. Store results in `rubric_results` table
7. Load results on the evaluation page

**Blueprint's Bloom's Taxonomy scores (use these exact colors):**
| Score | Level | Color |
|---|---|---|
| 0 | Did Not Discuss | `#efefef` |
| 1 | Remembering | `#AEF4FF` |
| 2 | Understanding | `#3BB5C8` |
| 3 | Applying | `#BC9906` |
| 4 | Analyzing | `#FFCA00` |
| 5 | Evaluating | `#D15924` |
| 6 | Creating | `#282828` |

**The Fireteam variant uses Ollama with `qwen2.5:32b`** according to the HANDOFF.md referenced in the blueprint. This can also use the OpenAI API (already wired in `openai.service.ts`).

**Database schema needed:**
```sql
CREATE TABLE fireteam.rubric_results (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER,
  user_id INTEGER,
  rubric_id INTEGER,
  score INTEGER CHECK (score BETWEEN 0 AND 6),
  arguments TEXT[],
  justification TEXT,
  disagreements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fireteam.rubrics (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER,
  rubric TEXT,
  rubric_description TEXT,
  rubric_prompt TEXT,       -- the actual AI evaluation prompt
  rubric_type INTEGER DEFAULT 0,  -- 0=Bloom's, 1=Pass/Fail
  slide_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### GAP 5 — Transcript / Caption Capture (MEDIUM)
**Blueprint reference:** E9

The blueprint acknowledges this is the hardest unresolved piece. The production Breakout app captures captions but the mechanism isn't in the source. For Fireteam, the recommended approach:

**Option A — LiveKit server-side recording** (recommended): Enable LiveKit's built-in room recording. The recording is stored server-side and can be transcribed via OpenAI Whisper or similar after the session ends. This is what `useRecording.js` appears to be setting up.

**Option B — Browser Web Speech API**: Real-time, free, no server needed. Unreliable across browsers but works for a demo/MVP.

The `useRecording.js` hook exists. What's needed is the **server-side endpoint** to:
1. Receive the recording/transcript
2. Split it by participant
3. Feed it into the evaluation pipeline (Gap 4)

---

### GAP 6 — 5-Star Session Rating on Processing Slide (MEDIUM)
**Blueprint reference:** Section 7, E6 (slideType 11)

The blueprint documents that slide 15 (Session Processing / slideType 11) includes a 5-star rating widget that students submit before results appear. The current `SlideComponent.jsx` shows a spinner but no rating input.

**What's needed:**
- A 5-star rating component inside the Processing slide
- Rating stored via `POST /api/v1/fireteams/experience/{id}/rating` with `{ stars: 1-5, userId }`

---

### GAP 7 — Exhibit Sidebar during Discussion Slides (MEDIUM)
**Blueprint reference:** Sections 4, 7, E6

During discussion slides (slideType 6), an "Exhibits" tab appears in the right sidebar showing images, diagrams, or documents that support the discussion topic. The `EnhancedAgendaSidebar.jsx` exists but exhibits aren't clearly wired in.

**What's needed:**
- `exhibits` displayed in the sidebar when the active slide is a discussion slide (type 6)
- Each exhibit has: `exhibitType` (0=image, 1=video), `exhibitURL`, `exhibitAltText`, `exhibitCaption`
- The group leader can change the active exhibit (`activeExhibitId` in room_state)
- All participants see the same exhibit when the leader selects one

---

### GAP 8 — Group Leader Assignment (MEDIUM)
**Blueprint reference:** Sections 7, 8

The blueprint specifies that only users in `groupLeaderUserIds` can advance slides. Currently there's no mechanism to assign a group leader when a session starts.

**What's needed:**
- When a session starts (first user joins), assign one user as group leader
- Show "Next Slide" button ONLY to the group leader
- API: `POST /api/v1/fireteams/experience/{id}/set-leader` → `{ userId }`
- Allow admin to reassign leader mid-session

---

## What to Build First — Prioritized Sprint Plan

### Sprint 1 (Weeks 1-2): Real-Time Core
1. Add `room_state` table to PostgreSQL (or use Supabase Realtime)
2. Wire up Supabase Realtime channel subscription in the live session page
3. Implement group leader assignment on session start
4. Make "Next Slide" button only appear for the group leader
5. Test: 2 browser tabs — advance slide in Tab A, confirm Tab B updates

### Sprint 2 (Weeks 3-4): Slide Types + Pre-Work
6. Rewrite `SlideComponent.jsx` to dispatch on `slideType` enum
7. Implement slideType 6 (Discussion) with exhibit sidebar
8. Implement slideType 11 (Processing) with 5-star rating
9. Build pre-work quiz flow with pass/fail gating
10. Add `quiz_results` table and API endpoints

### Sprint 3 (Weeks 5-6): AI Evaluation
11. Add `rubrics` and `rubric_results` tables
12. Build the transcript assembly pipeline (per participant, per discussion slide)
13. Build the LLM evaluation endpoint (OpenAI or Ollama + Bloom's taxonomy prompt)
14. Wire evaluation results to the existing evaluation page components
15. Update `IndividualEvaluation.jsx` to use the exact Bloom's colors from the blueprint

### Sprint 4 (Weeks 7-8): Polish + Admin
16. Admin: Create/edit experiences with rubrics, exhibits, and slide content
17. Admin: View all evaluation results across fireteams
18. End-to-end test: quiz → join session → all 16 slides → AI eval → results
19. Mobile responsiveness check on the live session page

---

## Key Technical Decisions for the Team

**1. Real-time sync mechanism:**
Use **Supabase Realtime** (POSTGRES_CHANGES) if the backend is on Supabase. If the backend is a standalone Laravel API, use **Laravel Echo + Pusher/Soketi** for WebSocket-based sync. Avoid polling — it creates jitter in the slide experience.

**2. AI provider for evaluation:**
The platform already has `openai.service.ts` wired. Use `gpt-4o-mini` for cost efficiency. The prompt structure is documented in the blueprint (Section 9) — you know exactly what to send.

**3. Room naming for LiveKit:**
The blueprint specifies `fireteam-exp-{experienceId}` as the room name. The LiveKit token route already handles arbitrary room names, so this just needs to be enforced consistently.

**4. The breakoutDeckParser is already working:**
`breakoutDeckParser.js` correctly converts Breakout Learning's Firestore JSON into an agenda format. The only thing missing is feeding each slide's `slideType` field through to `SlideComponent.jsx` so it can render correctly.

**5. Bloom's Taxonomy evaluation is the differentiator:**
This is what makes Fireteam meaningfully different from a generic video call. Getting the AI evaluation pipeline right — with real Bloom's scoring and meaningful justification text — should be treated as a core feature, not a nice-to-have.

---

## Files That Need the Most Attention

| File | Current State | What to Do |
|---|---|---|
| `components/SlideComponent.jsx` | Dispatches on title strings | Rewrite to dispatch on `slideType` number |
| `experience/[experienceid]/page.jsx` | No real-time sync | Add Supabase/Pusher subscription to room_state |
| `experience/hooks/useRecording.js` | Starts recording but no eval pipeline | Wire to transcript → LLM → rubric_results |
| `evaluation/hooks/useEvaluationData.js` | Fetches data but schema may not match | Map to Bloom's rubric_results schema |
| (New) `experience/hooks/useRoomState.js` | Does not exist | Build: subscribe to room_state, expose activeSlide + isGroupLeader |
| (New) `components/QuizGate.jsx` | Does not exist | Build: check quiz pass status, redirect or allow |
| (New) `components/ExhibitSidebar.jsx` | Does not exist | Build: show exhibits in right panel for discussion slides |

---

*This document was generated by reviewing the Breakout Developer Blueprint (Parts 1 & 2) against the existing WANAC platform codebase at `/wanac-platform/src/app/client/fireteam/`.*
