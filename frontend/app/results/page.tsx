"use client";

/**
 * Results Page
 *
 * Displays quiz results using the ResultsSummary component wrapped in HauntedLayout.
 * Handles restart action and clears saved state when displaying results.
 *
 * Features:
 * - ResultsSummary component integration
 * - Restart functionality (navigate to home)
 * - Clear saved state on display
 * - HauntedLayout wrapper for consistent theming
 * - Error handling for missing results
 * - Automatic redirect if no results found
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 8.5
 *
 * Refactored for:
 * - Better error handling
 * - Cleaner code structure
 * - Improved performance with useCallback
 * - Automatic redirect on error
 */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HauntedLayout } from "@/components/haunted-layout";
import { ResultsSummary } from "@/components/results-summary";
import { clearQuizState } from "@/lib/storage-manager";
import { colors } from "@/lib/theme-constants";
import type { QuizResult } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load result from sessionStorage and clear saved quiz state
  useEffect(() => {
    const loadResult = async () => {
      try {
        // Get result from sessionStorage
        const storedResult = sessionStorage.getItem("quiz-result");

        if (!storedResult) {
          setError("No quiz results found. Please complete a quiz first.");
          // Redirect to home after 2 seconds
          setTimeout(() => router.push("/"), 2000);
          setIsLoading(false);
          return;
        }

        const parsedResult = JSON.parse(storedResult) as QuizResult;
        setResult(parsedResult);

        // Clear saved quiz state from localStorage
        // Validates: Requirements 8.5
        clearQuizState();

        // Clear result from sessionStorage after loading
        sessionStorage.removeItem("quiz-result");
      } catch (err) {
        console.error("Error loading quiz result:", err);
        setError("Failed to load quiz results. Please try again.");
        // Redirect to home after 2 seconds
        setTimeout(() => router.push("/"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [router]);

  /**
   * Handle restart action
   * Navigates back to home page to start a new quiz
   * Memoized to prevent unnecessary re-renders
   */
  const handleRestart = useCallback(() => {
    router.push("/");
  }, [router]);

  /**
   * Handle return to home
   * Memoized to prevent unnecessary re-renders
   */
  const handleReturnHome = useCallback(() => {
    router.push("/");
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <HauntedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl" style={{ color: colors.ghostWhite }}>
            Loading results...
          </p>
        </div>
      </HauntedLayout>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <HauntedLayout>
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
          <p className="text-xl text-center px-4" style={{ color: colors.incorrectGlow }}>
            {error || "No quiz results found"}
          </p>
          <p
            className="text-sm text-center px-4"
            style={{ color: colors.ghostWhite, opacity: 0.7 }}
          >
            Redirecting to home...
          </p>
          <button
            onClick={handleReturnHome}
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: colors.hauntedOrange,
              color: colors.darkVoid,
              border: `2px solid ${colors.hauntedOrange}`,
              boxShadow: `0 0 20px ${colors.hauntedOrange}66`,
            }}
            aria-label="Return to home page"
          >
            Return to Home
          </button>
        </div>
      </HauntedLayout>
    );
  }

  // Results display
  return (
    <HauntedLayout showGhosts={true} animationIntensity="medium">
      <div className="min-h-screen py-8 px-4">
        <ResultsSummary result={result} onRestart={handleRestart} />
      </div>
    </HauntedLayout>
  );
}
