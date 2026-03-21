import React from 'react';
import { FaChalkboard, FaVideo, FaSignOutAlt } from 'react-icons/fa';

/**
 * Inline control bar for top navigation
 * (Jitsi handles mic, camera, etc.)
 */
export default function WanacControlBar({
  showSlide,
  onToggleView,
  onLeaveMeeting,
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Toggle Slide/Video View */}
      <button
        onClick={onToggleView}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-breakout-accent focus:ring-offset-2 ${
          showSlide
            ? 'border-breakout-border bg-breakout-muted text-core-on-tertiary/80 hover:bg-breakout-border'
            : 'border-transparent bg-breakout-accent text-core-on-tertiary shadow-sm hover:bg-breakout-accent-hover'
        }`}
        title="Toggle between slides and video"
      >
        {showSlide ? (
          <>
            <FaVideo className="text-[12px]" />
            <span>Show video</span>
          </>
        ) : (
          <>
            <FaChalkboard className="text-[12px]" />
            <span>Show slides</span>
          </>
        )}
      </button>

      {/* End Meeting Button */}
      <button
        onClick={onLeaveMeeting}
        className="inline-flex items-center gap-1.5 rounded-full border border-breakout-border bg-core-tertiary px-3 py-1.5 text-xs font-medium text-core-on-tertiary/80 hover:bg-breakout-muted transition-colors focus:outline-none focus:ring-2 focus:ring-breakout-accent focus:ring-offset-2"
        title="End meeting and leave"
      >
        <FaSignOutAlt className="text-[12px]" />
        <span>End</span>
      </button>
    </div>
  );
}

