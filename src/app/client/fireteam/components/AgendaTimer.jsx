import React, { useState, useEffect } from 'react';
import { FaClock, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

export default function AgendaTimer({ 
  duration, 
  isActive = false, 
  onTimeUp,
  stepTitle = "Current Step"
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Parse duration string and set initial time
  useEffect(() => {
    if (!duration || duration === "—" || duration === "-") {
      setTimeLeft(0);
      setTotalSeconds(0);
      return;
    }

    const match = duration.match(/(\d+)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = minutes * 60;
      setTimeLeft(seconds);
      setTotalSeconds(seconds);
    }
  }, [duration]);

  // Start timer when step becomes active
  useEffect(() => {
    if (isActive && timeLeft > 0 && !isPaused) {
      setIsRunning(true);
    }
  }, [isActive, timeLeft, isPaused]);

  // Countdown logic
  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (totalSeconds === 0) return 0;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getTimeColor = () => {
    if (timeLeft === 0) return 'text-gray-400';
    const percentage = (timeLeft / totalSeconds) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    setIsRunning(!isPaused);
  };

  const handleReset = () => {
    setTimeLeft(totalSeconds);
    setIsRunning(false);
    setIsPaused(false);
  };

  if (!duration || duration === "—" || duration === "-") {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Step Timer</span>
        </div>
        <span className="text-xs text-gray-500">{stepTitle}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft === 0 
                ? 'bg-gray-400' 
                : getProgressPercentage() > 75 
                ? 'bg-red-500' 
                : getProgressPercentage() > 50
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-between">
        <div className={`text-3xl font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleTogglePause}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused || !isRunning ? (
              <FaPlay className="text-green-600 w-4 h-4" />
            ) : (
              <FaPause className="text-yellow-600 w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Reset timer"
          >
            <FaRedo className="text-blue-600 w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time status */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        {timeLeft === 0 ? (
          <span className="text-green-600 font-semibold">✓ Step Complete</span>
        ) : (
          <span>Scheduled: {duration}</span>
        )}
      </div>
    </div>
  );
}

