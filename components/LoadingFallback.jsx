'use client';
import React from 'react';

export default function LoadingFallback({ label = 'Loading' }) {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm px-6">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-orange-500/90 animate-pulse" />
          <div className="text-sm font-medium text-gray-700">{label}</div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="h-3 rounded bg-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-3 rounded bg-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
          <div className="h-3 w-2/3 rounded bg-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

