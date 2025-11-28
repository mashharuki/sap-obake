"use client";

/**
 * Home Page - SAP Obake Quiz Application
 *
 * Landing page with haunted mansion theme featuring:
 * - Floating ghost mascot with wave animation
 * - Glowing "Start Quiz" button with pulse animation
 * - Cobweb decorations
 * - Brief app description with spooky typography
 * - Check for saved quiz state on load
 * - Show resume/new quiz options if saved state exists
 *
 * Requirements: 1.1, 8.2, 8.3
 *
 * Refactored for:
 * - Better performance with useCallback for event handlers
 * - Cleaner code structure
 * - Improved maintainability
 */

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { loadQuizState } from "@/lib/storage-manager";
import { colors, createGlow } from "@/lib/theme-constants";

// Lazy load HauntedLayout for better initial load performance
const HauntedLayout = dynamic(
  () => import("@/components/haunted-layout").then((mod) => ({ default: mod.HauntedLayout })),
  {
    loading: () => (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.darkVoid }}
      >
        <p className="text-xl" style={{ color: colors.ghostWhite }}>
          Loading...
        </p>
      </div>
    ),
    ssr: true,
  }
);

export default function Home() {
  const router = useRouter();
  const [hasSavedState, setHasSavedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved quiz state on load
  // Validates: Requirements 8.2, 8.3
  useEffect(() => {
    const checkSavedState = () => {
      try {
        const savedState = loadQuizState();
        setHasSavedState(savedState !== null && savedState.currentSession !== undefined);
      } catch (error) {
        console.error("Error checking saved state:", error);
        setHasSavedState(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedState();
  }, []);

  // Memoize navigation handlers to prevent unnecessary re-renders
  const handleStartNewQuiz = useCallback(() => {
    router.push("/quiz");
  }, [router]);

  const handleResumeQuiz = useCallback(() => {
    router.push("/quiz?resume=true");
  }, [router]);

  return (
    <HauntedLayout showGhosts={true} animationIntensity="medium">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] py-8 px-4">
        {/* Haunted Mansion Background Effect */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M50 10 L90 50 L90 90 L10 90 L10 50 Z" fill="%23F8F8FF" /%3E%3Crect x="30" y="60" width="15" height="20" fill="%232A2A2A" /%3E%3Crect x="55" y="60" width="15" height="20" fill="%232A2A2A" /%3E%3Crect x="42" y="40" width="16" height="16" fill="%232A2A2A" /%3E%3C/svg%3E\')',
            backgroundSize: "200px 200px",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />

        {/* Floating Ghost Mascot */}
        <div
          className="relative mb-8"
          style={{
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <div className="text-8xl sm:text-9xl" role="img" aria-label="Friendly ghost mascot">
            👻
          </div>
          {/* Wave animation hand */}
          <div
            className="absolute -right-4 top-8 text-4xl"
            style={{
              animation: "wave 2s ease-in-out infinite",
            }}
            aria-hidden="true"
          >
            👋
          </div>
        </div>

        {/* App Title with Spooky Typography */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-center mb-4 tracking-wider"
          style={{
            fontFamily: "var(--font-creepster), Creepster, cursive",
            color: colors.hauntedOrange,
            textShadow: createGlow(colors.hauntedOrange, "medium"),
          }}
        >
          SAP Obake
        </h1>

        {/* Subtitle in Japanese */}
        <p
          className="text-xl sm:text-2xl text-center mb-2"
          style={{
            color: colors.ghostWhite,
            fontFamily: "var(--font-creepster), Creepster, cursive",
          }}
        >
          サップおばけ
        </p>

        {/* App Description */}
        <p
          className="text-base sm:text-lg text-center max-w-2xl mb-12 leading-relaxed px-4"
          style={{
            color: colors.ghostWhite,
            opacity: 0.9,
          }}
        >
          AWS Solutions Architect Professional 認定試験の合格に必要な知識を、
          <br className="hidden sm:block" />
          楽しく効率的に習得できるクイズアプリケーション
        </p>

        {/* Action Buttons */}
        {isLoading ? (
          <div className="text-center" style={{ color: colors.ghostWhite }}>
            Loading...
          </div>
        ) : hasSavedState ? (
          // Show resume/new quiz options when saved state exists
          // Validates: Requirements 8.3
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
            <button
              onClick={handleResumeQuiz}
              className="flex-1 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
              style={
                {
                  backgroundColor: colors.hauntedOrange,
                  color: colors.darkVoid,
                  boxShadow: createGlow(colors.hauntedOrange, "medium"),
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  "--tw-ring-color": colors.hauntedOrange,
                } as React.CSSProperties
              }
              aria-label="Resume your previous quiz session"
            >
              👻 Resume Quiz
            </button>
            <button
              onClick={handleStartNewQuiz}
              className="flex-1 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
              style={
                {
                  backgroundColor: colors.midnightPurple,
                  color: colors.ghostWhite,
                  boxShadow: createGlow(colors.midnightPurple, "low"),
                  border: `2px solid ${colors.ghostWhite}`,
                  "--tw-ring-color": colors.ghostWhite,
                } as React.CSSProperties
              }
              aria-label="Start a new quiz session"
            >
              🎃 New Quiz
            </button>
          </div>
        ) : (
          // Show only start button when no saved state
          // Validates: Requirements 1.1
          <button
            onClick={handleStartNewQuiz}
            className="py-4 px-12 rounded-lg font-semibold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
            style={
              {
                backgroundColor: colors.hauntedOrange,
                color: colors.darkVoid,
                boxShadow: createGlow(colors.hauntedOrange, "high"),
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "--tw-ring-color": colors.hauntedOrange,
              } as React.CSSProperties
            }
            aria-label="Start a new quiz session"
          >
            🎃 Start Quiz
          </button>
        )}

        {/* Quiz Info */}
        <div
          className="mt-12 text-center space-y-2"
          style={{ color: colors.ghostWhite, opacity: 0.7 }}
        >
          <p className="text-sm">📝 20 Questions per Session</p>
          <p className="text-sm">⏱️ Time Attack Format</p>
          <p className="text-sm">🎯 Professional Level Difficulty</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </HauntedLayout>
  );
}
