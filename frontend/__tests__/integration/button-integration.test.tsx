/**
 * Button Integration Tests
 *
 * Tests for Button component integration with quiz-session and results-summary.
 * Requirements: 5.5
 */

import { QuizSession } from "@/components/quiz-session";
import { ResultsSummary } from "@/components/results-summary";
import type { QuizResult, QuizSession as QuizSessionType } from "@/lib/types";
import { ContentDomain } from "@/lib/types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Mock next-intl
vi.mock("next-intl", () => ({
  useLocale: () => "ja",
  useTranslations: () => (key: string) => key,
}));

describe("Button Integration Tests", () => {
  describe("QuizSession Button Integration", () => {
    const mockQuizSession: QuizSessionType = {
      id: "test-session-id",
      startTime: Date.now(),
      currentQuestionIndex: 0,
      questions: [
        {
          id: "q1",
          domain: ContentDomain.COMPLEX_ORGANIZATIONS,
          text: "Test question 1",
          choices: [
            { id: "a1", text: "Option 1" },
            { id: "a2", text: "Option 2" },
            { id: "a3", text: "Option 3" },
            { id: "a4", text: "Option 4" },
          ],
          correctChoiceId: "a1",
          explanation: "Test explanation",
          difficulty: "medium",
          tags: ["test"],
        },
        {
          id: "q2",
          domain: ContentDomain.NEW_SOLUTIONS,
          text: "Test question 2",
          choices: [
            { id: "b1", text: "Option 1" },
            { id: "b2", text: "Option 2" },
            { id: "b3", text: "Option 3" },
            { id: "b4", text: "Option 4" },
          ],
          correctChoiceId: "b1",
          explanation: "Test explanation 2",
          difficulty: "medium",
          tags: ["test"],
        },
      ],
      answers: [],
      isComplete: false,
    };

    it("should render next button after answering a question", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<QuizSession onComplete={onComplete} resumeSession={mockQuizSession} />);

      // Answer the question
      const option1 = screen.getByRole("radio", { name: /Choice A: Option 1/i });
      await user.click(option1);

      // Next button should appear
      await waitFor(() => {
        const nextButton = screen.getByTestId("next-button");
        expect(nextButton).toBeInTheDocument();
      });
    });

    it("should call moveToNextQuestion when next button is clicked", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<QuizSession onComplete={onComplete} resumeSession={mockQuizSession} />);

      // Answer the question
      const option1 = screen.getByRole("radio", { name: /Choice A: Option 1/i });
      await user.click(option1);

      // Click next button
      await waitFor(async () => {
        const nextButton = screen.getByTestId("next-button");
        await user.click(nextButton);
      });

      // Should move to next question
      await waitFor(() => {
        expect(screen.getByText("Test question 2")).toBeInTheDocument();
      });
    });

    it("should show 'View Results' button on last question", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      const lastQuestionSession: QuizSessionType = {
        ...mockQuizSession,
        currentQuestionIndex: 1, // Last question
        answers: [
          {
            questionId: "q1",
            selectedChoiceId: "a1",
            isCorrect: true,
            answeredAt: Date.now(),
          },
        ],
      };
      render(<QuizSession onComplete={onComplete} resumeSession={lastQuestionSession} />);

      // Answer the last question
      const option1 = screen.getByRole("radio", { name: /Choice A: Option 1/i });
      await user.click(option1);

      // Should show "View Results" button
      await waitFor(() => {
        const viewResultsButton = screen.getByRole("button", { name: /view.*results/i });
        expect(viewResultsButton).toBeInTheDocument();
      });
    });

    it("should call onComplete when View Results button is clicked", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      const lastQuestionSession: QuizSessionType = {
        ...mockQuizSession,
        currentQuestionIndex: 1, // Last question
        answers: [
          {
            questionId: "q1",
            selectedChoiceId: "a1",
            isCorrect: true,
            answeredAt: Date.now(),
          },
        ],
      };
      render(<QuizSession onComplete={onComplete} resumeSession={lastQuestionSession} />);

      // Answer the last question
      const option1 = screen.getByRole("radio", { name: /Choice A: Option 1/i });
      await user.click(option1);

      // Click View Results button
      await waitFor(async () => {
        const viewResultsButton = screen.getByRole("button", { name: /view.*results/i });
        await user.click(viewResultsButton);
      });

      // Should call onComplete
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("should have proper accessibility attributes on next button", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<QuizSession onComplete={onComplete} resumeSession={mockQuizSession} />);

      // Answer the question
      const option1 = screen.getByRole("radio", { name: /Choice A: Option 1/i });
      await user.click(option1);

      // Check next button accessibility
      await waitFor(() => {
        const nextButton = screen.getByTestId("next-button");
        expect(nextButton).toHaveAttribute("aria-label");
        expect(nextButton).toHaveAttribute("type", "button");
      });
    });

    it("should support keyboard navigation on next button", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      render(<QuizSession onComplete={onComplete} resumeSession={mockQuizSession} />);

      // Answer the question
      const option1 = screen.getByRole("radio", { name: /Choice A: Option 1/i });
      await user.click(option1);

      // Focus and activate next button with keyboard
      await waitFor(async () => {
        const nextButton = screen.getByTestId("next-button");
        nextButton.focus();
        expect(nextButton).toHaveFocus();
        await user.keyboard("{Enter}");
      });

      // Should move to next question
      await waitFor(() => {
        expect(screen.getByText("Test question 2")).toBeInTheDocument();
      });
    });
  });

  describe("ResultsSummary Button Integration", () => {
    const mockResult: QuizResult = {
      sessionId: "test-session-id",
      correctAnswers: 15,
      totalQuestions: 20,
      percentageScore: 75,
      totalTimeSeconds: 1800,
      completedAt: Date.now(),
      domainPerformance: [
        {
          domain: ContentDomain.COMPLEX_ORGANIZATIONS,
          totalQuestions: 5,
          correctAnswers: 4,
          percentage: 80,
        },
        {
          domain: ContentDomain.NEW_SOLUTIONS,
          totalQuestions: 5,
          correctAnswers: 4,
          percentage: 80,
        },
        {
          domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
          totalQuestions: 5,
          correctAnswers: 4,
          percentage: 80,
        },
        {
          domain: ContentDomain.MIGRATION_MODERNIZATION,
          totalQuestions: 5,
          correctAnswers: 3,
          percentage: 60,
        },
      ],
    };

    it("should render restart button", () => {
      const onRestart = vi.fn();
      render(<ResultsSummary result={mockResult} onRestart={onRestart} />);
      const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
      expect(restartButton).toBeInTheDocument();
    });

    it("should call onRestart when restart button is clicked", async () => {
      const user = userEvent.setup();
      const onRestart = vi.fn();
      render(<ResultsSummary result={mockResult} onRestart={onRestart} />);
      const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
      await user.click(restartButton);
      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it("should have proper styling on restart button", () => {
      const onRestart = vi.fn();
      render(<ResultsSummary result={mockResult} onRestart={onRestart} />);
      const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
      expect(restartButton.className).toContain("px-8");
      expect(restartButton.className).toContain("py-4");
      expect(restartButton.className).toContain("rounded-lg");
      expect(restartButton.className).toContain("font-bold");
    });

    it("should have proper accessibility attributes on restart button", () => {
      const onRestart = vi.fn();
      render(<ResultsSummary result={mockResult} onRestart={onRestart} />);
      const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
      expect(restartButton).toHaveAttribute("aria-label", "Start a new quiz");
      expect(restartButton).toHaveAttribute("type", "button");
    });

    it("should support keyboard navigation on restart button", async () => {
      const user = userEvent.setup();
      const onRestart = vi.fn();
      render(<ResultsSummary result={mockResult} onRestart={onRestart} />);
      const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
      restartButton.focus();
      expect(restartButton).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it("should support space key activation on restart button", async () => {
      const user = userEvent.setup();
      const onRestart = vi.fn();
      render(<ResultsSummary result={mockResult} onRestart={onRestart} />);
      const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
      restartButton.focus();
      await user.keyboard(" ");
      expect(onRestart).toHaveBeenCalledTimes(1);
    });
  });
});
