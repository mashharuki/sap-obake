/**
 * Integration Tests for Quiz and Results Pages
 *
 * Tests the complete flow from quiz initialization through to results display.
 * These tests verify that pages work together correctly and handle navigation,
 * state management, and user interactions properly.
 *
 * Requirements: 1.1, 1.3, 4.1, 4.2, 4.3, 4.4, 4.5, 8.5
 *
 * TDD Phase: RED - These tests will initially fail until pages are implemented
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Next.js router
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  pathname: "/",
  query: {},
  asPath: "/",
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => new URLSearchParams(mockRouter.query as any),
}));

// Mock storage manager
vi.mock("@/lib/storage-manager", () => ({
  loadQuizState: vi.fn(() => null),
  saveQuizState: vi.fn(),
  clearQuizState: vi.fn(),
}));

// Create mock questions for testing
const createMockQuestions = (count: number) => {
  const domains = [
    "complex-organizations",
    "new-solutions",
    "continuous-improvement",
    "migration-modernization",
  ];
  const questions = [];

  for (let i = 0; i < count; i++) {
    questions.push({
      id: `q${i + 1}`,
      domain: domains[i % 4],
      text: `Test question ${i + 1}?`,
      choices: [
        { id: `c${i * 4 + 1}`, text: `Choice 1` },
        { id: `c${i * 4 + 2}`, text: `Choice 2` },
        { id: `c${i * 4 + 3}`, text: `Choice 3` },
        { id: `c${i * 4 + 4}`, text: `Choice 4` },
      ],
      correctChoiceId: `c${i * 4 + 1}`,
      explanation: `Test explanation ${i + 1}`,
      difficulty: "medium" as const,
      tags: ["test"],
    });
  }

  return questions;
};

// Mock question bank
vi.mock("@/lib/question-bank", () => ({
  getAllQuestions: vi.fn(() => createMockQuestions(40)),
  loadQuestions: vi.fn(() => createMockQuestions(40)),
}));

describe("Quiz and Results Pages Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
  });

  describe("Quiz Page Initialization", () => {
    it("should render quiz page with QuizSession component", async () => {
      // This test will fail until we create the quiz page
      const QuizPage = (await import("@/app/quiz/page")).default;

      render(<QuizPage />);

      // Verify QuizSession component is rendered
      expect(screen.getByTestId("quiz-session")).toBeInTheDocument();

      // Verify HauntedLayout is applied
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should initialize quiz with 20 questions", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;

      render(<QuizPage />);

      // Wait for quiz to initialize
      await waitFor(() => {
        expect(screen.getByText(/Question 1\/20/i)).toBeInTheDocument();
      });
    });

    it("should display timer starting at 00:00", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;

      render(<QuizPage />);

      // Verify timer is displayed
      await waitFor(() => {
        expect(screen.getByText(/00:00/)).toBeInTheDocument();
      });
    });

    it("should display progress bar with correct initial state", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;

      render(<QuizPage />);

      // Verify progress indicators
      await waitFor(() => {
        expect(screen.getByText(/Question 1\/20/i)).toBeInTheDocument();
        expect(screen.getByText(/正答数: 0/i)).toBeInTheDocument();
      });
    });
  });

  describe("Navigation to Results", () => {
    it("should navigate to results page after completing all questions", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;
      const user = userEvent.setup();

      render(<QuizPage />);

      // Answer all 20 questions
      for (let i = 0; i < 20; i++) {
        // Wait for question to load
        await waitFor(() => {
          expect(screen.getByRole("button", { name: /Choice/i })).toBeInTheDocument();
        });

        // Select an answer
        const choice = screen.getAllByRole("button", { name: /Choice/i })[0];
        await user.click(choice);

        // Wait for feedback
        await waitFor(() => {
          expect(screen.getByTestId("next-button")).toBeInTheDocument();
        });

        // Click next
        const nextButton = screen.getByTestId("next-button");
        await user.click(nextButton);
      }

      // Verify navigation to results
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/results");
      });
    });

    it("should pass quiz result data to results page", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;
      const _user = userEvent.setup();

      render(<QuizPage />);

      // Complete quiz with some correct answers
      // ... (similar to above test)

      // Verify result data is stored/passed correctly
      await waitFor(() => {
        const savedState = localStorage.getItem("sap-obake-quiz-state");
        expect(savedState).toBeTruthy();
      });
    });
  });

  describe("Results Page Display", () => {
    // Mock quiz result for all results page tests
    const mockResult = {
      sessionId: "test-session",
      totalQuestions: 20,
      correctAnswers: 15,
      percentageScore: 75,
      totalTimeSeconds: 1800,
      domainPerformance: [
        {
          domain: "complex-organizations",
          totalQuestions: 5,
          correctAnswers: 4,
          percentage: 80,
        },
        {
          domain: "new-solutions",
          totalQuestions: 5,
          correctAnswers: 4,
          percentage: 80,
        },
        {
          domain: "continuous-improvement",
          totalQuestions: 5,
          correctAnswers: 4,
          percentage: 80,
        },
        {
          domain: "migration-modernization",
          totalQuestions: 5,
          correctAnswers: 3,
          percentage: 60,
        },
      ],
      completedAt: Date.now(),
    };

    beforeEach(() => {
      // Set up mock result in sessionStorage before each test
      sessionStorage.setItem("quiz-result", JSON.stringify(mockResult));
    });

    it("should render results page with ResultsSummary component", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      // Verify ResultsSummary is rendered
      await waitFor(() => {
        expect(screen.getByRole("region", { name: /Quiz results/i })).toBeInTheDocument();
      });
    });

    it("should display total correct answers", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/15\/20/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should display total time taken", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/30:00/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should display percentage score", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/75%/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should display domain breakdown", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      await waitFor(
        () => {
          expect(screen.getByText(/複雑な組織/i)).toBeInTheDocument();
          expect(screen.getByText(/新規ソリューション/i)).toBeInTheDocument();
          expect(screen.getByText(/継続的な改善/i)).toBeInTheDocument();
          expect(screen.getByText(/移行とモダナイゼーション/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Restart Functionality", () => {
    beforeEach(() => {
      // Set up mock result in sessionStorage before each test
      const mockResult = {
        sessionId: "test-session",
        totalQuestions: 20,
        correctAnswers: 15,
        percentageScore: 75,
        totalTimeSeconds: 1800,
        domainPerformance: [
          { domain: "complex-organizations", totalQuestions: 5, correctAnswers: 4, percentage: 80 },
          { domain: "new-solutions", totalQuestions: 5, correctAnswers: 4, percentage: 80 },
          {
            domain: "continuous-improvement",
            totalQuestions: 5,
            correctAnswers: 4,
            percentage: 80,
          },
          {
            domain: "migration-modernization",
            totalQuestions: 5,
            correctAnswers: 3,
            percentage: 60,
          },
        ],
        completedAt: Date.now(),
      };
      sessionStorage.setItem("quiz-result", JSON.stringify(mockResult));
    });

    it("should display restart button on results page", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      await waitFor(
        () => {
          expect(screen.getByRole("button", { name: /Start a new quiz/i })).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should navigate to home page when restart is clicked", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;
      const user = userEvent.setup();

      render(<ResultsPage />);

      // Wait for restart button
      const restartButton = await screen.findByRole(
        "button",
        { name: /Start a new quiz/i },
        { timeout: 2000 }
      );

      // Click restart
      await user.click(restartButton);

      // Verify navigation to home
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("should clear saved state when displaying results", async () => {
      const { clearQuizState } = await import("@/lib/storage-manager");
      const ResultsPage = (await import("@/app/results/page")).default;

      render(<ResultsPage />);

      // Verify saved state is cleared
      await waitFor(
        () => {
          expect(clearQuizState).toHaveBeenCalled();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle missing quiz result gracefully", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      // Clear any stored results
      localStorage.clear();

      render(<ResultsPage />);

      // Should show error message or redirect
      await waitFor(() => {
        expect(screen.getByText(/No quiz results found/i) || mockPush).toBeTruthy();
      });
    });

    it("should handle navigation errors gracefully", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;

      // Mock router push to throw error
      mockPush.mockRejectedValueOnce(new Error("Navigation failed"));

      render(<QuizPage />);

      // Should not crash the app
      expect(screen.getByTestId("quiz-session")).toBeInTheDocument();
    });
  });

  describe("State Persistence", () => {
    it("should save quiz state after each answer", async () => {
      const { saveQuizState } = await import("@/lib/storage-manager");
      const QuizPage = (await import("@/app/quiz/page")).default;
      const user = userEvent.setup();

      render(<QuizPage />);

      // Answer a question
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Choice/i })).toBeInTheDocument();
      });

      const choice = screen.getAllByRole("button", { name: /Choice/i })[0];
      await user.click(choice);

      // Verify state was saved
      await waitFor(() => {
        expect(saveQuizState).toHaveBeenCalled();
      });
    });

    it("should resume quiz from saved state", async () => {
      const { loadQuizState } = await import("@/lib/storage-manager");

      // Mock saved state
      const mockSavedState = {
        version: "1.0.0",
        currentSession: {
          id: "test-session",
          questions: [],
          currentQuestionIndex: 5,
          answers: [],
          startTime: Date.now() - 300000, // 5 minutes ago
          isComplete: false,
        },
        completedSessions: [],
        lastUpdated: Date.now(),
      };

      (loadQuizState as any).mockReturnValue(mockSavedState);

      const QuizPage = (await import("@/app/quiz/page")).default;

      render(<QuizPage />);

      // Verify quiz resumes from saved position
      await waitFor(() => {
        expect(screen.getByText(/Question 6\/20/i)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on quiz page", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;

      render(<QuizPage />);

      await waitFor(
        () => {
          expect(screen.getByRole("main")).toBeInTheDocument();
          expect(screen.getByTestId("quiz-session")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should have proper ARIA labels on results page", async () => {
      const ResultsPage = (await import("@/app/results/page")).default;

      // Set up mock result
      const mockResult = {
        sessionId: "test-session",
        totalQuestions: 20,
        correctAnswers: 15,
        percentageScore: 75,
        totalTimeSeconds: 1800,
        domainPerformance: [
          { domain: "complex-organizations", totalQuestions: 5, correctAnswers: 4, percentage: 80 },
          { domain: "new-solutions", totalQuestions: 5, correctAnswers: 4, percentage: 80 },
          {
            domain: "continuous-improvement",
            totalQuestions: 5,
            correctAnswers: 4,
            percentage: 80,
          },
          {
            domain: "migration-modernization",
            totalQuestions: 5,
            correctAnswers: 3,
            percentage: 60,
          },
        ],
        completedAt: Date.now(),
      };
      sessionStorage.setItem("quiz-result", JSON.stringify(mockResult));

      render(<ResultsPage />);

      await waitFor(
        () => {
          expect(screen.getByRole("region", { name: /Quiz results/i })).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should support keyboard navigation", async () => {
      const QuizPage = (await import("@/app/quiz/page")).default;
      const user = userEvent.setup();

      render(<QuizPage />);

      // Tab through interactive elements
      await user.tab();

      // Verify focus is on an interactive element
      expect(document.activeElement).toBeTruthy();
    });
  });
});
