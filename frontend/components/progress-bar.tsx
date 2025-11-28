/**
 * ProgressBar Component
 *
 * Displays quiz progress including:
 * - Current question number (X/20)
 * - Correct answer count
 * - Visual progress bar styled as haunted energy meter
 *
 * Validates: Requirements 1.4, 3.2, 3.3
 */

"use client";

import { useMemo } from "react";
import { colors, createGlow } from "@/lib/theme-constants";

export interface ProgressBarProps {
  /** Current question number (1-based, e.g., 1 for first question) */
  current: number;
  /** Total number of questions (always 20) */
  total: number;
  /** Number of correct answers so far */
  correctCount: number;
}

/** Number of segments in the energy meter */
const ENERGY_METER_SEGMENTS = 20;

/**
 * QuestionCounter sub-component
 * Displays the current question number in "Question X/20" format
 */
function QuestionCounter({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="font-medium"
      style={{ color: colors.ghostWhite }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-base sm:text-lg md:text-xl font-bold">
        Question {current}/{total}
      </span>
    </div>
  );
}

/**
 * CorrectAnswerCounter sub-component
 * Displays the number of correct answers with glow effect
 */
function CorrectAnswerCounter({ correctCount }: { correctCount: number }) {
  return (
    <div
      className="font-medium flex items-center gap-1.5 sm:gap-2"
      style={{ color: colors.correctGlow }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="text-xs sm:text-sm opacity-80">Correct:</span>
      <span
        className="text-base sm:text-lg md:text-xl font-bold"
        style={{
          textShadow: createGlow(colors.correctGlow, "low"),
        }}
      >
        {correctCount}
      </span>
    </div>
  );
}

/**
 * EnergyMeterSegments sub-component
 * Renders decorative segments for the energy meter
 */
function EnergyMeterSegments({ current }: { current: number }) {
  return (
    <div className="absolute inset-0 flex">
      {Array.from({ length: ENERGY_METER_SEGMENTS }).map((_, i) => (
        <div
          key={i}
          className="flex-1 border-r border-black/20"
          style={{
            opacity: i < current ? 0.3 : 0.1,
          }}
        />
      ))}
    </div>
  );
}

/**
 * ProgressBar component displays quiz progress with haunted theme styling
 *
 * Features:
 * - Shows "Question X/20" format
 * - Displays correct answer count
 * - Visual progress bar with haunted energy meter styling
 * - Glowing effects and animations
 * - Accessible with ARIA labels
 */
export function ProgressBar({ current, total, correctCount }: ProgressBarProps) {
  // Memoize progress percentage calculation
  const progressPercentage = useMemo(() => (current / total) * 100, [current, total]);

  return (
    <div className="w-full space-y-3 sm:space-y-4" role="region" aria-label="Quiz progress">
      {/* Question Number and Correct Count */}
      <div className="flex justify-between items-center text-sm md:text-base">
        <QuestionCounter current={current} total={total} />
        <CorrectAnswerCounter correctCount={correctCount} />
      </div>

      {/* Visual Progress Bar - Haunted Energy Meter */}
      <div
        className="relative w-full h-5 sm:h-6 rounded-lg overflow-hidden"
        style={{
          backgroundColor: colors.shadowGray,
          border: `2px solid ${colors.midnightPurple}`,
          boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.5), ${createGlow(colors.midnightPurple, "low")}`,
        }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Progress: ${current} of ${total} questions answered, ${correctCount} correct`}
      >
        {/* Progress Fill */}
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${colors.midnightPurple} 0%, ${colors.hauntedOrange} 50%, ${colors.poisonGreen} 100%)`,
            boxShadow: createGlow(colors.hauntedOrange, "medium"),
          }}
        >
          {/* Animated shimmer effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        {/* Energy meter segments (decorative) */}
        <EnergyMeterSegments current={current} />
      </div>

      {/* Progress Percentage Text */}
      <div
        className="text-center text-xs opacity-60"
        style={{ color: colors.ghostWhite }}
        aria-hidden="true"
      >
        {progressPercentage.toFixed(0)}% Complete
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
