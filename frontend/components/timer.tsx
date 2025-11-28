"use client";

/**
 * Timer Component
 * Displays elapsed time in a haunted pocket watch style
 *
 * Requirements: 3.1, 3.5
 */

import { useEffect, useRef, useState } from "react";
import { getTimerState } from "@/lib/timer";

// Inline SVG icons to reduce bundle size (replacing lucide-react)
const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface TimerProps {
  /** Start time in milliseconds (from Date.now()) */
  startTime: number;
  /** Optional callback when 30-minute warning is triggered */
  onWarning?: () => void;
}

/**
 * Timer component that displays elapsed time and shows warning at threshold
 */
export default function Timer({ startTime, onWarning }: TimerProps) {
  const [timerState, setTimerState] = useState(() => getTimerState(startTime));
  const warningTriggeredRef = useRef(false);

  useEffect(() => {
    // Update timer every second
    const intervalId = setInterval(() => {
      const newState = getTimerState(startTime);
      setTimerState(newState);

      // Trigger warning callback once when threshold is reached
      if (newState.showWarning && !warningTriggeredRef.current && onWarning) {
        warningTriggeredRef.current = true;
        onWarning();
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, onWarning]);

  const { formattedTime, showWarning } = timerState;

  return (
    <div
      data-testid="timer-container"
      className="haunted-timer flex items-center gap-2 sm:gap-3 rounded-lg border-2 border-hauntedOrange/30 bg-shadowGray/80 px-3 sm:px-4 py-2 sm:py-3 shadow-[0_0_20px_rgba(255,107,53,0.3)] backdrop-blur-sm transition-all hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]"
    >
      {/* Clock Icon */}
      <div className="relative">
        <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-hauntedOrange animate-pulse" />
        {showWarning && (
          <div className="absolute -right-1 -top-1">
            <AlertTriangleIcon className="h-3 w-3 text-warningGlow animate-pulse" />
          </div>
        )}
      </div>

      {/* Time Display */}
      <div
        data-testid="timer-display"
        aria-label={`Elapsed time: ${formattedTime}`}
        aria-live="polite"
        className="font-mono text-xl sm:text-2xl font-bold text-ghostWhite"
      >
        {formattedTime}
      </div>

      {/* Warning Message */}
      {showWarning && (
        <div
          data-testid="timer-warning"
          className="ml-1 sm:ml-2 flex items-center gap-1 rounded bg-warningGlow/20 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold text-warningGlow"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangleIcon className="h-3 w-3" />
          <span className="hidden sm:inline">30 min</span>
          <span className="sm:hidden">30m</span>
        </div>
      )}
    </div>
  );
}
