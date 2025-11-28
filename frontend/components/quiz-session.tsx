"use client";

/**
 * QuizSession Component
 *
 * Main component that orchestrates the quiz flow.
 * Integrates QuestionCard, Timer, and ProgressBar components.
 *
 * Features:
 * - Quiz session initialization
 * - Question navigation with next button after feedback
 * - State persistence after each answer
 * - Quiz completion detection and transition to results
 * - Real-time timer tracking
 * - Progress display
 *
 * Requirements: 1.1, 1.3, 1.4, 2.5, 4.1, 8.1
 */

import { ProgressBar } from "@/components/progress-bar";
import { QuestionCard } from "@/components/question-card";
import Timer from "@/components/timer";
import type { Locale } from "@/i18n";
import {
  getCorrectAnswerCount,
  getCurrentQuestion,
  initializeQuizSession,
  isQuizComplete,
  moveToNextQuestion,
  recordAnswer,
} from "@/lib/quiz-manager";
import { calculateQuizResult } from "@/lib/score-calculator";
import { saveQuizState } from "@/lib/storage-manager";
import { colors } from "@/lib/theme-constants";
import type { QuizResult, QuizSession as QuizSessionType } from "@/lib/types";
import { useLocale } from "next-intl";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

export interface QuizSessionProps {
  /** Callback when quiz is completed */
  onComplete: (result: QuizResult) => void;
  /** Optional: Resume from a saved session */
  resumeSession?: QuizSessionType;
}

/**
 * QuizSession component manages the entire quiz flow
 */
export function QuizSession({ onComplete, resumeSession }: QuizSessionProps) {
  const locale = useLocale() as Locale;

  // Initialize quiz session state
  const [session, setSession] = useState<QuizSessionType | null>(resumeSession ?? null);
  const [isInitializing, setIsInitializing] = useState(!resumeSession);

  // Initialize quiz session if not resuming
  useEffect(() => {
    if (!resumeSession && !session) {
      setIsInitializing(true);
      initializeQuizSession(locale)
        .then((newSession) => {
          setSession(newSession);
          setIsInitializing(false);
        })
        .catch((error) => {
          console.error("Failed to initialize quiz session:", error);
          setIsInitializing(false);
        });
    }
  }, [locale, resumeSession, session]);

  // Track if feedback is currently being shown
  const [showFeedback, setShowFeedback] = useState(false);

  // Track the user's answer for the current question
  const [currentAnswer, setCurrentAnswer] = useState<string | undefined>(undefined);

  // Memoize derived values to prevent unnecessary recalculations
  const currentQuestion = useMemo(() => (session ? getCurrentQuestion(session) : null), [session]);
  const correctCount = useMemo(() => (session ? getCorrectAnswerCount(session) : 0), [session]);
  const currentQuestionNumber = session ? session.currentQuestionIndex + 1 : 0;
  const quizComplete = useMemo(() => (session ? isQuizComplete(session) : false), [session]);

  /**
   * Handle answer selection
   * Records the answer and shows feedback immediately
   */
  const handleAnswer = useCallback(
    (answerId: string) => {
      if (!currentQuestion || !session) return;

      // Record the answer and update session in one operation
      const updatedSession = recordAnswer(session, currentQuestion.id, answerId);
      setSession(updatedSession);

      // Save to localStorage immediately after answer
      saveQuizState(updatedSession);

      // Update UI state
      setCurrentAnswer(answerId);
      setShowFeedback(true);
    },
    [session, currentQuestion]
  );

  /**
   * Handle moving to next question or completing quiz
   */
  const handleNext = useCallback(() => {
    if (!session) return;

    // Check if quiz is complete
    if (quizComplete) {
      // Calculate final results using score calculator
      const result = calculateQuizResult(session);
      onComplete(result);
      return;
    }

    // Move to next question
    const updatedSession = moveToNextQuestion(session);
    setSession(updatedSession);
    saveQuizState(updatedSession);

    // Reset feedback state
    setShowFeedback(false);
    setCurrentAnswer(undefined);
  }, [session, quizComplete, onComplete]);

  /**
   * Handle 30-minute warning from timer
   */
  const handleTimerWarning = useCallback(() => {
    console.log("30-minute warning triggered");
    // Could show a toast notification here
  }, []);

  // Save state when session changes
  useEffect(() => {
    if (session) {
      saveQuizState(session);
    }
  }, [session]);

  // Show loading state while initializing
  if (isInitializing || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl" style={{ color: colors.ghostWhite }}>
          Loading quiz...
        </p>
      </div>
    );
  }

  // If no current question, quiz is complete
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl" style={{ color: colors.ghostWhite }}>
          Loading results...
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="quiz-session"
      className="quiz-session w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6"
      style={{
        maxWidth: "100%",
        overflowX: "hidden",
      }}
      role="region"
      aria-label={`Quiz session: Question ${currentQuestionNumber} of ${session.questions.length}`}
    >
      {/* Header: Timer and Progress */}
      <QuizHeader
        startTime={session.startTime}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={session.questions.length}
        correctCount={correctCount}
        onTimerWarning={handleTimerWarning}
      />

      {/* Question Card */}
      <div className="quiz-content">
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showFeedback={showFeedback}
          userAnswer={currentAnswer}
        />
      </div>

      {/* Next Button (appears after feedback) */}
      {showFeedback && (
        <NextButton
          onClick={handleNext}
          isComplete={quizComplete}
          nextQuestionNumber={currentQuestionNumber + 1}
        />
      )}
    </div>
  );
}

/**
 * QuizHeader component - Displays timer and progress bar
 * Memoized to prevent unnecessary re-renders
 */
interface QuizHeaderProps {
  startTime: number;
  currentQuestionNumber: number;
  totalQuestions: number;
  correctCount: number;
  onTimerWarning: () => void;
}

const QuizHeader = memo(function QuizHeader({
  startTime,
  currentQuestionNumber,
  totalQuestions,
  correctCount,
  onTimerWarning,
}: QuizHeaderProps) {
  return (
    <header className="quiz-header space-y-3 sm:space-y-4" aria-label="Quiz progress and timer">
      {/* Timer */}
      <div className="flex justify-center">
        <Timer startTime={startTime} onWarning={onTimerWarning} />
      </div>

      {/* Progress Bar */}
      <ProgressBar
        current={currentQuestionNumber}
        total={totalQuestions}
        correctCount={correctCount}
      />
    </header>
  );
});

/**
 * NextButton component - Navigation button that appears after feedback
 * Memoized to prevent unnecessary re-renders
 */
interface NextButtonProps {
  onClick: () => void;
  isComplete: boolean;
  nextQuestionNumber: number;
}

const NextButton = memo(function NextButton({
  onClick,
  isComplete,
  nextQuestionNumber,
}: NextButtonProps) {
  const buttonText = isComplete ? "View Results" : "Next Question →";
  const ariaLabel = isComplete
    ? "View quiz results and final score"
    : `Continue to question ${nextQuestionNumber}`;

  return (
    <nav className="quiz-navigation flex justify-center mt-4 sm:mt-6" aria-label="Quiz navigation">
      <button
        data-testid="next-button"
        type="button"
        onClick={onClick}
        className="next-button px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
        style={
          {
            backgroundColor: colors.hauntedOrange,
            color: colors.darkVoid,
            border: `2px solid ${colors.hauntedOrange}`,
            boxShadow: `0 0 20px ${colors.hauntedOrange}66`,
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            minHeight: "48px",
            minWidth: "120px",
            "--tw-ring-color": colors.hauntedOrange,
          } as React.CSSProperties
        }
        aria-label={ariaLabel}
      >
        {buttonText}
      </button>
    </nav>
  );
});
