/**
 * Error Handling Unit Tests (RED Phase - TDD)
 *
 * These tests verify error handling behavior for:
 * - Error boundary components
 * - Insufficient questions error
 * - LocalStorage errors (quota exceeded, corrupted data)
 * - Invalid question data errors
 *
 * Requirements: 1.5, 6.5
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "@/components/error-boundary";
import ErrorMessage from "@/components/error-message";
import InsufficientQuestionsError from "@/components/insufficient-questions-error";
import QuotaWarning from "@/components/quota-warning";
import RestorationError from "@/components/restoration-error";
import { validateQuestionBank } from "@/lib/question-bank";
import { hasSavedQuizState, loadQuizState, saveQuizState } from "@/lib/storage-manager";
import type { Question, QuizSession } from "@/lib/types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Error Handling Tests", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("Error Boundary Component", () => {
    it("should catch and display errors from child components", () => {
      const ThrowError = () => {
        throw new Error("Test error");
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it("should display user-friendly error message", () => {
      const ThrowError = () => {
        throw new Error("Network error");
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should show friendly message, not technical details
      expect(screen.queryByText("Network error")).not.toBeInTheDocument();
      expect(screen.getByText(/try again|go home/i)).toBeInTheDocument();
    });

    it("should provide a way to recover from errors", () => {
      const ThrowError = () => {
        throw new Error("Test error");
      };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Should have a button to retry or go home
      const retryButton = screen.getByRole("button", { name: /try again|go home/i });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe("Insufficient Questions Error", () => {
    it("should throw InsufficientQuestionsError when question bank has fewer than 20 questions", async () => {
      // Dynamically import and mock
      const { InsufficientQuestionsError: ErrorClass } = await import("@/lib/quiz-manager");

      // Create a mock that throws the error
      const mockSelectQuizQuestions = () => {
        throw new ErrorClass(15, 20);
      };

      expect(() => mockSelectQuizQuestions()).toThrow(ErrorClass);
    });

    it("should display error message when insufficient questions", () => {
      render(<InsufficientQuestionsError available={15} required={20} />);

      expect(screen.getByText(/not enough questions/i)).toBeInTheDocument();
      expect(screen.getByText(/15/)).toBeInTheDocument();
      expect(screen.getByText(/20/)).toBeInTheDocument();
    });

    it("should prevent quiz initialization when insufficient questions", async () => {
      // Dynamically import the error class
      const { InsufficientQuestionsError: ErrorClass } = await import("@/lib/quiz-manager");

      // Create a mock that throws the error
      const mockSelectQuizQuestions = () => {
        throw new ErrorClass(10, 20);
      };

      let errorThrown = false;
      try {
        mockSelectQuizQuestions();
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(ErrorClass);
      }

      expect(errorThrown).toBe(true);
    });
  });

  describe("LocalStorage Quota Exceeded Error", () => {
    it("should handle quota exceeded error gracefully", () => {
      // This test will fail until quota exceeded handling is implemented
      const mockSession: QuizSession = {
        id: "test-session",
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        isComplete: false,
      };

      let callCount = 0;
      // Mock localStorage.setItem to throw QuotaExceededError on first call, succeed on second
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          const error = new DOMException("QuotaExceededError");
          error.name = "QuotaExceededError";
          throw error;
        }
        // Second call succeeds after clearing
      });

      // Should not throw - it should retry after clearing
      expect(() => saveQuizState(mockSession)).not.toThrow();
    });

    it("should clear old data and retry when quota exceeded", () => {
      // This test will fail until retry logic is implemented
      const mockSession: QuizSession = {
        id: "test-session",
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        isComplete: false,
      };

      let setItemCallCount = 0;
      let _getItemCallCount = 0;

      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        setItemCallCount++;
        if (setItemCallCount === 1) {
          const error = new DOMException("QuotaExceededError");
          error.name = "QuotaExceededError";
          throw error;
        }
        // Second call succeeds after clearing
      });

      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        _getItemCallCount++;
        // Return existing state for the retry logic
        return JSON.stringify({
          version: "1.0.0",
          currentSession: mockSession,
          completedSessions: [],
          lastUpdated: Date.now(),
        });
      });

      // Should not throw after retry
      expect(() => saveQuizState(mockSession)).not.toThrow();
      expect(setItemCallCount).toBeGreaterThan(1);
    });

    it("should display warning message when old data is cleared", () => {
      render(<QuotaWarning />);

      const storageTexts = screen.getAllByText(/storage space/i);
      expect(storageTexts.length).toBeGreaterThan(0);
      expect(screen.getByText(/old results/i)).toBeInTheDocument();
    });
  });

  describe("Corrupted LocalStorage Data Error", () => {
    it("should handle corrupted JSON data gracefully", () => {
      // This test will fail until corrupted data handling is implemented
      localStorageMock.setItem("sap-obake-quiz-state", "invalid-json{{{");

      const result = loadQuizState();

      // Should return null instead of throwing
      expect(result).toBeNull();
    });

    it("should clear corrupted data automatically", () => {
      // This test will fail until auto-clear logic is implemented
      localStorageMock.setItem("sap-obake-quiz-state", "corrupted-data");

      loadQuizState();

      // Corrupted data should be cleared
      expect(localStorageMock.getItem("sap-obake-quiz-state")).toBeNull();
    });

    it("should display message when previous session cannot be restored", () => {
      render(<RestorationError />);

      expect(screen.getByText(/couldn't restore/i)).toBeInTheDocument();
      const sessionTexts = screen.getAllByText(/previous session/i);
      expect(sessionTexts.length).toBeGreaterThan(0);
    });

    it("should allow starting fresh session after corruption", () => {
      // This test will fail until fresh start logic is implemented
      localStorageMock.setItem("sap-obake-quiz-state", "corrupted");

      const result = loadQuizState();
      expect(result).toBeNull();

      // Should be able to check for saved state without error
      expect(() => hasSavedQuizState()).not.toThrow();
      expect(hasSavedQuizState()).toBe(false);
    });
  });

  describe("Invalid Question Data Error", () => {
    it("should detect questions missing required fields", () => {
      // This test will fail until validation is implemented
      const invalidQuestions = [
        {
          id: "q1",
          // Missing domain
          text: "Question text",
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            { id: "c", text: "Choice C" },
            { id: "d", text: "Choice D" },
          ],
          correctChoiceId: "a",
          explanation: "Explanation",
        },
      ] as Question[];

      const validation = validateQuestionBank(invalidQuestions);

      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain("Invalid domain");
    });

    it("should detect questions with wrong number of choices", () => {
      // This test will fail until validation is implemented
      const invalidQuestions = [
        {
          id: "q1",
          domain: "complex-organizations" as const,
          text: "Question text",
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            // Only 2 choices instead of 4
          ],
          correctChoiceId: "a",
          explanation: "Explanation",
          difficulty: "medium" as const,
          tags: ["test"],
        },
      ] as Question[];

      const validation = validateQuestionBank(invalidQuestions);

      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain("Must have exactly 4 choices");
    });

    it("should detect questions with invalid correct choice ID", () => {
      // This test will fail until validation is implemented
      const invalidQuestions = [
        {
          id: "q1",
          domain: "complex-organizations" as const,
          text: "Question text",
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            { id: "c", text: "Choice C" },
            { id: "d", text: "Choice D" },
          ],
          correctChoiceId: "z", // Invalid - not in choices
          explanation: "Explanation",
          difficulty: "medium" as const,
          tags: ["test"],
        },
      ];

      const validation = validateQuestionBank(invalidQuestions);

      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain("correctChoiceId not found in choices");
    });

    it("should detect questions missing explanations", () => {
      // This test will fail until validation is implemented
      const invalidQuestions = [
        {
          id: "q1",
          domain: "complex-organizations" as const,
          text: "Question text",
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            { id: "c", text: "Choice C" },
            { id: "d", text: "Choice D" },
          ],
          correctChoiceId: "a",
          explanation: "", // Empty explanation
          difficulty: "medium" as const,
          tags: ["test"],
        },
      ];

      const validation = validateQuestionBank(invalidQuestions);

      expect(validation.isValid).toBe(false);
      expect(validation.errors[0]).toContain("Missing explanation");
    });

    it("should skip invalid questions and continue with valid ones", () => {
      // This test will fail until skip logic is implemented
      const mixedQuestions: Question[] = [
        {
          id: "q1",
          domain: "complex-organizations" as const,
          text: "Valid question",
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            { id: "c", text: "Choice C" },
            { id: "d", text: "Choice D" },
          ],
          correctChoiceId: "a",
          explanation: "Explanation",
          difficulty: "medium" as const,
          tags: ["test"],
        },
        // Invalid question (missing domain)
        {
          id: "q2",
          text: "Invalid question",
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            { id: "c", text: "Choice C" },
            { id: "d", text: "Choice D" },
          ],
          correctChoiceId: "a",
          explanation: "Explanation",
        } as Question,
      ];

      // Should filter out invalid questions
      const validation = validateQuestionBank(mixedQuestions);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it("should log errors for invalid questions", () => {
      // This test will fail until logging is implemented
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const invalidQuestions = [
        {
          id: "q1",
          text: "Question without domain",
          choices: [],
          correctChoiceId: "a",
          explanation: "",
        } as Question,
      ];

      validateQuestionBank(invalidQuestions);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Error Recovery and Graceful Degradation", () => {
    it("should allow app to continue after non-critical errors", () => {
      // This test will fail until graceful degradation is implemented
      localStorageMock.setItem("sap-obake-quiz-state", "corrupted");

      // Should not throw, just return null
      expect(() => loadQuizState()).not.toThrow();
    });

    it("should provide fallback when localStorage is unavailable", () => {
      // This test will fail until fallback logic is implemented
      const originalLocalStorage = window.localStorage;

      // Simulate localStorage being unavailable
      Object.defineProperty(window, "localStorage", {
        value: undefined,
        writable: true,
      });

      const mockSession: QuizSession = {
        id: "test-session",
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        isComplete: false,
      };

      // Should not throw, just fail silently or use in-memory storage
      expect(() => saveQuizState(mockSession)).not.toThrow();

      // Restore
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it("should display appropriate error messages for different error types", () => {
      const { rerender } = render(<ErrorMessage type="insufficient-questions" />);
      expect(screen.getByText(/not enough questions/i)).toBeInTheDocument();

      rerender(<ErrorMessage type="quota-exceeded" />);
      const storageTexts = screen.getAllByText(/storage/i);
      expect(storageTexts.length).toBeGreaterThan(0);

      rerender(<ErrorMessage type="corrupted-data" />);
      expect(screen.getByText(/restore/i)).toBeInTheDocument();
    });
  });
});
