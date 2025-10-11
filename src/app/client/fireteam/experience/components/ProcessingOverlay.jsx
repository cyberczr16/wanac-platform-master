import React from 'react';

/**
 * Overlay shown when processing recording with AI
 */
export default function ProcessingOverlay({ isProcessing }) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Processing Recording</h3>
          <p className="text-gray-600 text-center">
            Transcribing audio and generating AI summaries...
            <br />
            This may take a minute.
          </p>
        </div>
      </div>
    </div>
  );
}

