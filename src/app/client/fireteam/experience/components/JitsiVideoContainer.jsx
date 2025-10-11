import React from 'react';

/**
 * Jitsi video container with loading and error overlays
 */
export default function JitsiVideoContainer({
  jitsiContainerId,
  showSlide,
  loading,
  error,
}) {
  return (
    <>
      {/* Jitsi container - always rendered, visibility toggled */}
      <div
        id={jitsiContainerId}
        className={`w-full h-full rounded-lg overflow-hidden bg-gray-900 shadow-2xl ${
          showSlide ? 'absolute top-0 left-0 opacity-0 pointer-events-none' : ''
        }`}
        style={{
          visibility: showSlide ? 'hidden' : 'visible',
          position: showSlide ? 'absolute' : 'relative',
        }}
      />

      {/* Loading overlay */}
      {loading && !showSlide && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 rounded-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-white">Launching meeting...</p>
            <p className="text-gray-400 text-sm mt-2">This should only take a moment</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && !showSlide && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg border border-red-300 z-10">
          {error}
        </div>
      )}
    </>
  );
}

