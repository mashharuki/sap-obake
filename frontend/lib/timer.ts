/**
 * Timer Utility Module
 * Provides functions for tracking and formatting elapsed time in quiz sessions
 */

/**
 * Warning threshold in seconds (30 minutes)
 */
export const WARNING_THRESHOLD_SECONDS = 1800;

/**
 * Calculate elapsed time in seconds from a start timestamp
 *
 * @param startTime - The start timestamp in milliseconds (from Date.now())
 * @returns Elapsed time in seconds (always >= 0)
 *
 * @example
 * const startTime = Date.now();
 * // ... some time passes ...
 * const elapsed = calculateElapsedTime(startTime);
 * console.log(`${elapsed} seconds have passed`);
 */
export function calculateElapsedTime(startTime: number): number {
  const now = Date.now();
  const elapsedMs = now - startTime;
  // Ensure we never return negative values
  const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  return elapsedSeconds;
}

/**
 * Format elapsed time in seconds to MM:SS format
 *
 * @param seconds - Elapsed time in seconds (should be >= 0)
 * @returns Formatted time string in MM:SS format
 *
 * @example
 * formatTime(0)     // "0:00"
 * formatTime(45)    // "0:45"
 * formatTime(90)    // "1:30"
 * formatTime(3661)  // "61:01"
 */
export function formatTime(seconds: number): string {
  // Ensure non-negative input
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  // Format seconds with leading zero if needed
  const secondsStr = remainingSeconds.toString().padStart(2, "0");

  return `${minutes}:${secondsStr}`;
}

/**
 * Check if the 30-minute warning threshold has been reached
 *
 * @param elapsedSeconds - Elapsed time in seconds
 * @returns True if elapsed time is >= 30 minutes (1800 seconds)
 *
 * @example
 * shouldShowWarning(1799)  // false
 * shouldShowWarning(1800)  // true
 * shouldShowWarning(2000)  // true
 */
export function shouldShowWarning(elapsedSeconds: number): boolean {
  return elapsedSeconds >= WARNING_THRESHOLD_SECONDS;
}

/**
 * Timer state returned by getTimerState
 */
export interface TimerState {
  /** Elapsed time in seconds */
  elapsedSeconds: number;
  /** Formatted time string (MM:SS) */
  formattedTime: string;
  /** Whether the 30-minute warning should be shown */
  showWarning: boolean;
}

/**
 * Get current elapsed time and formatted string for a quiz session
 *
 * @param startTime - The start timestamp in milliseconds
 * @returns Object containing elapsed seconds, formatted time, and warning status
 *
 * @example
 * const startTime = Date.now();
 * // ... some time passes ...
 * const { elapsedSeconds, formattedTime, showWarning } = getTimerState(startTime);
 * console.log(`Time: ${formattedTime} (${elapsedSeconds}s)`);
 * if (showWarning) console.log('Warning: 30 minutes reached!');
 */
export function getTimerState(startTime: number): TimerState {
  const elapsedSeconds = calculateElapsedTime(startTime);
  const formattedTime = formatTime(elapsedSeconds);
  const showWarning = shouldShowWarning(elapsedSeconds);

  return {
    elapsedSeconds,
    formattedTime,
    showWarning,
  };
}
