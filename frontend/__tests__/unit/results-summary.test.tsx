/**
 * Unit Tests for ResultsSummary Component
 *
 * Tests the rendering and behavior of the ResultsSummary component
 * including all required elements and user interactions.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ResultsSummary } from "@/components/results-summary";
import type { QuizResult } from "@/lib/types";
import { ContentDomain } from "@/lib/types";

/**
 * Helper function to create a mock QuizResult
 */
function createMockResult(overrides?: Partial<QuizResult>): QuizResult {
  return {
    sessionId: "test-session",
    totalQuestions: 20,
    correctAnswers: 15,
    percentageScore: 75,
    totalTimeSeconds: 1200,
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
        correctAnswers: 3,
        percentage: 60,
      },
      {
        domain: ContentDomain.MIGRATION_MODERNIZATION,
        totalQuestions: 5,
        correctAnswers: 4,
        percentage: 80,
      },
    ],
    completedAt: Date.now(),
    ...overrides,
  };
}

describe("ResultsSummary Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByRole("region", { name: /quiz results/i })).toBeInTheDocument();
    });

    it("should display total correct answers", () => {
      const result = createMockResult({ correctAnswers: 15 });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/15\/20/)).toBeInTheDocument();
    });

    it("should display percentage score", () => {
      const result = createMockResult({ percentageScore: 75 });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/75%/)).toBeInTheDocument();
    });

    it("should display formatted time", () => {
      const result = createMockResult({ totalTimeSeconds: 1200 }); // 20 minutes
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/20:00/)).toBeInTheDocument();
    });

    it("should display domain breakdown section", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/分野別パフォーマンス/)).toBeInTheDocument();
    });

    it("should display all four domain performance cards", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      // Check for domain names
      expect(screen.getByText(/複雑な組織/)).toBeInTheDocument();
      expect(screen.getByText(/新規ソリューション/)).toBeInTheDocument();
      expect(screen.getByText(/継続的な改善/)).toBeInTheDocument();
      expect(screen.getByText(/移行とモダナイゼーション/)).toBeInTheDocument();
    });

    it("should display restart button", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      const button = screen.getByRole("button", { name: /start a new quiz/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(/新しいクイズを始める/);
    });
  });

  describe("Performance Messages", () => {
    it("should show perfect score message for 100%", () => {
      const result = createMockResult({
        correctAnswers: 20,
        percentageScore: 100,
      });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/Perfect score/i)).toBeInTheDocument();
    });

    it("should show passing message for 70%+", () => {
      const result = createMockResult({
        correctAnswers: 15,
        percentageScore: 75,
      });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/合格レベル/)).toBeInTheDocument();
    });

    it("should show encouraging message for low scores", () => {
      const result = createMockResult({
        correctAnswers: 10,
        percentageScore: 50,
      });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/Keep learning/i)).toBeInTheDocument();
    });
  });

  describe("Ghost Reactions", () => {
    it("should display ghost reaction emoji", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      // Check for ghost emoji in the document
      const ghostReaction = screen.getByRole("img", { name: /ghost reaction/i });
      expect(ghostReaction).toBeInTheDocument();
    });

    it("should show celebration emoji for perfect score", () => {
      const result = createMockResult({
        correctAnswers: 20,
        percentageScore: 100,
      });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      const ghostReaction = screen.getByRole("img", { name: /ghost reaction/i });
      expect(ghostReaction).toHaveTextContent("🎉👻🎉");
    });
  });

  describe("User Interactions", () => {
    it("should call onRestart when restart button is clicked", async () => {
      const result = createMockResult();
      const onRestart = vi.fn();
      const user = userEvent.setup();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      const button = screen.getByRole("button", { name: /start a new quiz/i });
      await user.click(button);

      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it("should have accessible restart button", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      const button = screen.getByRole("button", { name: /start a new quiz/i });
      expect(button).toHaveAccessibleName();
    });
  });

  describe("Domain Performance Display", () => {
    it("should display correct answers for each domain", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      // Check for domain scores
      const domainScores = screen.getAllByText(/\/5/);
      expect(domainScores).toHaveLength(4); // 4 domains
    });

    it("should display percentage for each domain", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      // Check for percentage displays in domain cards (there will be multiple)
      const percentages = screen.getAllByText(/\d+%/);
      expect(percentages.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero score correctly", () => {
      const result = createMockResult({
        correctAnswers: 0,
        percentageScore: 0,
        domainPerformance: [
          {
            domain: ContentDomain.COMPLEX_ORGANIZATIONS,
            totalQuestions: 5,
            correctAnswers: 0,
            percentage: 0,
          },
          {
            domain: ContentDomain.NEW_SOLUTIONS,
            totalQuestions: 5,
            correctAnswers: 0,
            percentage: 0,
          },
          {
            domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
            totalQuestions: 5,
            correctAnswers: 0,
            percentage: 0,
          },
          {
            domain: ContentDomain.MIGRATION_MODERNIZATION,
            totalQuestions: 5,
            correctAnswers: 0,
            percentage: 0,
          },
        ],
      });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/0\/20/)).toBeInTheDocument();
      // Check for 0% in the main score card (there will be multiple 0% in domain cards too)
      const zeroPercentages = screen.getAllByText(/0%/);
      expect(zeroPercentages.length).toBeGreaterThan(0);
    });

    it("should handle perfect score correctly", () => {
      const result = createMockResult({
        correctAnswers: 20,
        percentageScore: 100,
        domainPerformance: [
          {
            domain: ContentDomain.COMPLEX_ORGANIZATIONS,
            totalQuestions: 5,
            correctAnswers: 5,
            percentage: 100,
          },
          {
            domain: ContentDomain.NEW_SOLUTIONS,
            totalQuestions: 5,
            correctAnswers: 5,
            percentage: 100,
          },
          {
            domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
            totalQuestions: 5,
            correctAnswers: 5,
            percentage: 100,
          },
          {
            domain: ContentDomain.MIGRATION_MODERNIZATION,
            totalQuestions: 5,
            correctAnswers: 5,
            percentage: 100,
          },
        ],
      });
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/20\/20/)).toBeInTheDocument();
      // Check for 100% in the main score card (there will be multiple 100% in domain cards too)
      const perfectPercentages = screen.getAllByText(/100%/);
      expect(perfectPercentages.length).toBeGreaterThan(0);
    });

    it("should handle very long time correctly", () => {
      const result = createMockResult({ totalTimeSeconds: 7200 }); // 2 hours
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByText(/120:00/)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      expect(screen.getByRole("region", { name: /quiz results/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /start a new quiz/i })).toBeInTheDocument();
    });

    it("should have accessible ghost reaction", () => {
      const result = createMockResult();
      const onRestart = vi.fn();

      render(<ResultsSummary result={result} onRestart={onRestart} />);

      const ghostReaction = screen.getByRole("img", { name: /ghost reaction/i });
      expect(ghostReaction).toHaveAttribute("aria-label");
    });
  });
});
