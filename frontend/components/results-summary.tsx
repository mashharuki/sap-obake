/**
 * ResultsSummary Component
 *
 * Displays final quiz results with haunted theme styling including:
 * - Total correct answers out of 20
 * - Total time taken
 * - Percentage score
 * - Domain breakdown with haunted stat cards
 * - Dramatic reveal animation
 * - Ghost reactions based on score
 * - Restart button
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 6.4
 */

"use client";

import { Button } from "@/components/ui/button";
import { formatTime, getPerformanceMessage, isPassing } from "@/lib/score-calculator";
import { colors, createGlow, domainColors } from "@/lib/theme-constants";
import type { QuizResult } from "@/lib/types";
import { ContentDomain } from "@/lib/types";
import { memo, useMemo } from "react";

export interface ResultsSummaryProps {
  /** Quiz result data with all metrics */
  result: QuizResult;
  /** Callback when user clicks restart button */
  onRestart: () => void;
}

/**
 * Get domain display name
 */
function getDomainDisplayName(domain: ContentDomain): string {
  const names: Record<ContentDomain, string> = {
    [ContentDomain.COMPLEX_ORGANIZATIONS]: "複雑な組織",
    [ContentDomain.NEW_SOLUTIONS]: "新規ソリューション",
    [ContentDomain.CONTINUOUS_IMPROVEMENT]: "継続的な改善",
    [ContentDomain.MIGRATION_MODERNIZATION]: "移行とモダナイゼーション",
  };
  return names[domain];
}

/**
 * Get ghost reaction emoji based on score
 */
function getGhostReaction(percentageScore: number): string {
  if (percentageScore === 100) return "🎉👻🎉";
  if (percentageScore >= 90) return "👻✨";
  if (percentageScore >= 80) return "👻🌟";
  if (percentageScore >= 70) return "👻📚";
  if (percentageScore >= 60) return "👻💪";
  return "👻🎃";
}

/**
 * ScoreCard sub-component
 * Displays a single metric with haunted styling
 * Memoized to prevent unnecessary re-renders
 * Optimized with will-change for better animation performance
 */
const ScoreCard = memo(function ScoreCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  const cardStyle = useMemo(
    () => ({
      backgroundColor: colors.shadowGray,
      borderColor: highlight ? colors.hauntedOrange : colors.midnightPurple,
      boxShadow: highlight
        ? `${createGlow(colors.hauntedOrange, "medium")}, inset 0 2px 4px rgba(0, 0, 0, 0.5)`
        : `${createGlow(colors.midnightPurple, "low")}, inset 0 2px 4px rgba(0, 0, 0, 0.5)`,
    }),
    [highlight]
  );

  const valueStyle = useMemo(
    () => ({
      color: highlight ? colors.hauntedOrange : colors.ghostWhite,
      textShadow: highlight ? createGlow(colors.hauntedOrange, "low") : "none",
    }),
    [highlight]
  );

  const labelStyle = useMemo(
    () => ({
      color: colors.ghostWhite,
    }),
    []
  );

  return (
    <div
      className="p-6 sm:p-8 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={cardStyle}
    >
      <div
        className="text-sm sm:text-base opacity-80 mb-2 uppercase tracking-wide"
        style={labelStyle}
      >
        {label}
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold" style={valueStyle}>
        {value}
      </div>
    </div>
  );
});

/**
 * DomainStatCard sub-component
 * Displays performance for a single content domain
 * Memoized to prevent unnecessary re-renders
 * Optimized with better spacing and hover effects
 */
const DomainStatCard = memo(function DomainStatCard({
  domain,
  totalQuestions,
  correctAnswers,
  percentage,
}: {
  domain: ContentDomain;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}) {
  const domainColor = useMemo(() => domainColors[domain], [domain]);
  const displayName = useMemo(() => getDomainDisplayName(domain), [domain]);
  const formattedPercentage = useMemo(() => percentage.toFixed(0), [percentage]);

  const cardStyle = useMemo(
    () => ({
      backgroundColor: colors.mistGray,
      borderColor: domainColor,
      boxShadow: `${createGlow(domainColor, "low")}, inset 0 2px 4px rgba(0, 0, 0, 0.5)`,
    }),
    [domainColor]
  );

  const progressBarStyle = useMemo(
    () => ({
      width: `${percentage}%`,
      backgroundColor: domainColor,
      boxShadow: createGlow(domainColor, "low"),
    }),
    [percentage, domainColor]
  );

  const domainNameStyle = useMemo(
    () => ({
      color: domainColor,
    }),
    [domainColor]
  );

  const textStyle = useMemo(
    () => ({
      color: colors.ghostWhite,
    }),
    []
  );

  return (
    <div
      className="p-5 sm:p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
      style={cardStyle}
    >
      <div
        className="text-xs sm:text-sm font-medium mb-3 uppercase tracking-wide"
        style={domainNameStyle}
      >
        {displayName}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl sm:text-3xl font-bold" style={textStyle}>
          {correctAnswers}/{totalQuestions}
        </span>
        <span className="text-sm sm:text-base opacity-70" style={textStyle}>
          ({formattedPercentage}%)
        </span>
      </div>

      {/* Mini progress bar with smooth animation */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.shadowGray }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${displayName} performance: ${formattedPercentage}%`}
      >
        <div className="h-full transition-all duration-700 ease-out" style={progressBarStyle} />
      </div>
    </div>
  );
});

/**
 * ResultsSummary component displays final quiz results with dramatic reveal
 *
 * Features:
 * - Total score display with percentage
 * - Time taken display
 * - Domain-specific performance breakdown
 * - Ghost reactions based on performance
 * - Encouraging message
 * - Restart button with haunted styling
 * - Dramatic reveal animation
 * - Accessible with ARIA labels
 */
export function ResultsSummary({ result, onRestart }: ResultsSummaryProps) {
  // Memoize computed values to prevent recalculation on re-renders
  const passing = useMemo(() => isPassing(result.percentageScore), [result.percentageScore]);
  const performanceMessage = useMemo(
    () => getPerformanceMessage(result.percentageScore),
    [result.percentageScore]
  );
  const ghostReaction = useMemo(
    () => getGhostReaction(result.percentageScore),
    [result.percentageScore]
  );
  const formattedTime = useMemo(
    () => formatTime(result.totalTimeSeconds),
    [result.totalTimeSeconds]
  );
  const formattedScore = useMemo(
    () => `${result.percentageScore.toFixed(0)}%`,
    [result.percentageScore]
  );
  const formattedAnswers = useMemo(() => `${result.correctAnswers}/20`, [result.correctAnswers]);

  // Memoize styles to prevent object recreation
  const titleStyle = useMemo(
    () => ({
      color: passing ? colors.correctGlow : colors.hauntedOrange,
      textShadow: createGlow(passing ? colors.correctGlow : colors.hauntedOrange, "medium"),
    }),
    [passing]
  );

  const sectionTitleStyle = useMemo(
    () => ({
      color: colors.ghostWhite,
      textShadow: createGlow(colors.midnightPurple, "low"),
    }),
    []
  );

  return (
    <div
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 animate-fadeIn"
      role="region"
      aria-label="Quiz results"
    >
      {/* Header with Ghost Reaction */}
      <header className="text-center space-y-3 sm:space-y-4">
        <div
          className="text-5xl sm:text-6xl md:text-7xl animate-bounce"
          role="img"
          aria-label={`Ghost reaction: ${ghostReaction}`}
        >
          {ghostReaction}
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold transition-colors duration-300"
          style={titleStyle}
        >
          {passing ? "合格レベル！" : "結果発表"}
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl px-4 max-w-2xl mx-auto"
          style={{ color: colors.ghostWhite }}
        >
          {performanceMessage}
        </p>
      </header>

      {/* Main Score Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6" aria-label="Quiz scores">
        <ScoreCard label="正答数" value={formattedAnswers} highlight={false} />
        <ScoreCard label="スコア" value={formattedScore} highlight={true} />
        <ScoreCard label="所要時間" value={formattedTime} highlight={false} />
      </section>

      {/* Domain Breakdown Section */}
      <section className="space-y-4 sm:space-y-6">
        <h2
          className="text-xl sm:text-2xl font-bold text-center transition-opacity duration-300"
          style={sectionTitleStyle}
        >
          分野別パフォーマンス
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {result.domainPerformance.map((domain) => (
            <DomainStatCard
              key={domain.domain}
              domain={domain.domain}
              totalQuestions={domain.totalQuestions}
              correctAnswers={domain.correctAnswers}
              percentage={domain.percentage}
            />
          ))}
        </div>
      </section>

      {/* Restart Button */}
      <footer className="flex justify-center pt-4 sm:pt-6">
        <Button
          onClick={onRestart}
          variant="primary"
          size="lg"
          ariaLabel="Start a new quiz"
        >
          新しいクイズを始める 🎃
        </Button>
      </footer>

      {/* Optimized Animations with reduced motion support */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
          will-change: transform;
        }
        
        /* Optimize transitions for better performance */
        .transition-all {
          transition-property: transform, box-shadow, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn {
            animation: none;
            opacity: 1;
            transform: none;
            will-change: auto;
          }
          
          .animate-bounce {
            animation: none;
            will-change: auto;
          }
          
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            will-change: auto !important;
          }
        }
        
        /* Improve focus ring visibility */
        button:focus-visible {
          outline: 2px solid var(--focus-ring-color, ${colors.hauntedOrange});
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
