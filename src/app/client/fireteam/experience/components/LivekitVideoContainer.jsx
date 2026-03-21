import React from 'react';
import {
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

/**
 * LiveKit video container with loading and error overlays.
 * Mirrors the behavior of JitsiVideoContainer so the meeting page can toggle
 * between slide and video views in the same way.
 */
export default function LivekitVideoContainer({
  showSlide,
  loading,
  error,
}) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <>
      <div
        className={`w-full h-full rounded-lg overflow-hidden bg-gray-900 shadow-2xl ${
          showSlide ? 'absolute top-0 left-0 opacity-0 pointer-events-none' : ''
        }`}
        style={{
          visibility: showSlide ? 'hidden' : 'visible',
          position: showSlide ? 'absolute' : 'relative',
        }}
      >
        {!showSlide && (
          <div className="relative h-full w-full">
            <RoomAudioRenderer />
            <GridLayout
              tracks={tracks}
              style={{ width: '100%', height: '100%' }}
            >
              <ParticipantTile />
            </GridLayout>
          </div>
        )}
      </div>

      {loading && !showSlide && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 rounded-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-white">Connecting to LiveKit...</p>
            <p className="text-gray-400 text-sm mt-2">This should only take a moment</p>
          </div>
        </div>
      )}

      {error && !showSlide && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg border border-red-300 z-10">
          {error}
        </div>
      )}
    </>
  );
}

