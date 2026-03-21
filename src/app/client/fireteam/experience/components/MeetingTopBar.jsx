import React from 'react';
import CompactTimer from './CompactTimer';

/**
 * Top navigation bar with title, timer, and slide navigation
 */
export default function MeetingTopBar({
  isAdmin,
  experienceTitle,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canNavigate = true,
  duration,
  onTimerComplete,
  controlBarComponent, // New prop for control bar
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-breakout-border bg-core-tertiary">
      {/* Left: Experience title and step indicator */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold tracking-tight text-core-on-tertiary">
            {experienceTitle || 'Fireteam Experience'}
          </h1>
          {isAdmin && (
            <span className="inline-flex items-center rounded-full bg-breakout-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-core-on-tertiary/70">
              Admin
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] font-medium text-core-on-tertiary/70">
          <span>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="h-3 w-px bg-breakout-border" />
          <span className="truncate max-w-xs">
            {duration ? `Timer: ${duration}` : 'No timer set'}
          </span>
        </div>
      </div>

      {/* Right: Timer, controls, navigation */}
      <div className="flex items-center gap-4">
        <CompactTimer
          duration={duration}
          isActive={true}
          onTimeUp={onTimerComplete}
          stepTitle={`Step ${currentStep + 1} of ${totalSteps}`}
        />

        {/* Inline control bar (view toggle, end meeting) */}
        {controlBarComponent && (
          <>
            <div className="h-6 w-px bg-breakout-border" />
            {controlBarComponent}
          </>
        )}

        <div className="h-6 w-px bg-breakout-border" />

        {/* Previous / Next pill buttons in Breakout style */}
        <div className="inline-flex items-center gap-2">
          <button
            className="rounded-full border border-breakout-border bg-breakout-muted px-3 py-1.5 text-xs font-medium text-core-on-tertiary/80 hover:bg-breakout-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-breakout-accent focus:ring-offset-2"
            onClick={onPrevious}
            disabled={!canNavigate || currentStep === 0}
            aria-label="Go to previous slide"
          >
            ← Previous
          </button>
          <button
            className="rounded-full bg-breakout-accent px-3 py-1.5 text-xs font-semibold text-core-on-tertiary shadow-sm hover:bg-breakout-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-breakout-accent focus:ring-offset-2"
            onClick={onNext}
            disabled={!canNavigate || currentStep >= totalSteps - 1}
            aria-label="Go to next slide"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

