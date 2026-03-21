import React from 'react';

/**
 * Footer showing current step progress and total session time
 */
export default function MeetingFooter({ currentStep, agenda, totalTime }) {
  return (
    <footer className="flex items-center justify-between border-t border-breakout-border bg-breakout-muted px-6 py-3 text-[11px] text-core-on-tertiary/70">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-core-on-tertiary">
          Step {currentStep + 1} of {agenda.length}
        </span>
        {agenda[currentStep] && (
          <>
            <span className="h-3 w-px bg-breakout-border" />
            <span className="truncate max-w-xs">{agenda[currentStep].title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Planned session time:</span>
        <span className="font-semibold text-core-on-tertiary">{totalTime}</span>
      </div>
    </footer>
  );
}

