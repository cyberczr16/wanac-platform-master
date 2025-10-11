import React from 'react';

/**
 * Footer showing current step progress and total session time
 */
export default function MeetingFooter({ currentStep, agenda, totalTime }) {
  return (
    <footer className="p-4 border-t bg-white text-xs text-gray-500 flex justify-between items-center">
      <div>
        <span className="font-medium">
          Step {currentStep + 1} of {agenda.length}
        </span>
        {agenda[currentStep] && <span className="ml-4">{agenda[currentStep].title}</span>}
      </div>
      <div>
        Total Session Time:
        <span className="ml-2 text-black font-medium">{totalTime}</span>
      </div>
    </footer>
  );
}

