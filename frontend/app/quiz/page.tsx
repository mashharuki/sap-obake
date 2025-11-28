"use client";

/**
 * Quiz Page
 *
 * Main quiz page that renders the QuizSession component wrapped in HauntedLayout.
 * Handles quiz initialization and navigation to results page on completion.
 *
 * Features:
 * - Quiz initialization (new or resume)
 * - QuizSession component integration
 * - Navigation to results page on completion
 * - HauntedLayout wrapper for consistent theming
 * - Error handling for session loading
 *
 * Requirements: 1.1, 1.3, 4.1
 *
 * Refactored for:
 * - Better error handling
 * - Cleaner code structure
 * - Improved performance with useCallback
 * - Suspense boundary for useSearchParams
 */

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { HauntedLayout } from "@/components/haunted-layout";
import { QuizSession } from "@/components/quiz-session";
import { loadQuizState } from "@/lib/storage-manager";
import { colors } from "@/lib/theme-constants";
import type { QuizResult, QuizSession as QuizSessionType } from "@/lib/types";

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldResume = searchParams.get("resume") === "true";

  const [isLoading, setIsLoading] = useState(true);
  const [resumeSession, setResumeSession] = useState<QuizSessionType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved session if resuming
  useEffect(() => {
    const loadSession = async () => {
      if (shouldResume) {
        try {
          const savedState = loadQuizState();
          if (savedState?.currentSession) {
            setResumeSession(savedState.currentSession);
          } else {
            setError("No saved session found. Starting a new quiz.");
          }
        } catch (err) {
          console.error("Error loading saved session:", err);
          setError("Failed to load saved session. Starting a new quiz.");
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, [shouldResume]);

  /**
   * Handle quiz completion
   * Stores result and navigates to results page
   * Memoized to prevent unnecessary re-renders
   */
  const handleQuizComplete = useCallback(
    (result: QuizResult) => {
      try {
        // Store result in sessionStorage for results page
        sessionStorage.setItem("quiz-result", JSON.stringify(result));

        // Navigate to results page
        router.push("/results");
      } catch (err) {
        console.error("Error storing quiz result:", err);
        setError("Failed to save quiz results. Please try again.");
      }
    },
    [router]
  );

  // Loading state
  if (isLoading) {
    return (
      <HauntedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl" style={{ color: colors.ghostWhite }}>
            Loading quiz...
          </p>
        </div>
      </HauntedLayout>
    );
  }

  // Error state (still allow quiz to start)
  if (error) {
    console.warn(error);
  }

  return (
    <HauntedLayout showGhosts={false} animationIntensity="low">
      <div className="min-h-screen py-8">
        <QuizSession onComplete={handleQuizComplete} resumeSession={resumeSession ?? undefined} />
      </div>
    </HauntedLayout>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <HauntedLayout>
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-xl" style={{ color: colors.ghostWhite }}>
              Loading quiz...
            </p>
          </div>
        </HauntedLayout>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
