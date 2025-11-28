/**
 * Property-Based Tests for LocalStorage Persistence
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness properties for quiz state persistence
 * using fast-check for property-based testing with 100+ iterations.
 *
 * Tests cover:
 * - Property 22: State is saved after each answer
 * - Property 23: Saved state is checked on load
 * - Property 25: State restoration is a round-trip
 * - Property 26: Completed quiz clears saved state
 */

import * as fc from "fast-check";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initializeQuizSession, recordAnswer } from "@/lib/quiz-manager";
import { clearQuizState, loadQuizState, saveQuizState } from "@/lib/storage-manager";

/**
 * Mock localStorage for testing
 * We need to clear it before and after each test
 */
beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

/**
 * Arbitrary generator for quiz sessions
 * Creates valid quiz sessions for property testing
 */
const quizSessionArbitrary = fc.constant(null).map(() => {
  return initializeQuizSession();
});

/**
 * Arbitrary generator for answer indices (0-19 for 20 questions)
 */
const answerIndexArbitrary = fc.integer({ min: 0, max: 19 });

/**
 * Arbitrary generator for choice indices (0-3 for 4 choices)
 */
const choiceIndexArbitrary = fc.integer({ min: 0, max: 3 });

describe("Persistence - Property-Based Tests", () => {
  describe("Property 22: State is saved after each answer", () => {
    it("**Feature: sap-obake-quiz, Property 22: State is saved after each answer** - should save quiz state to localStorage after recording an answer", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 8.1
            // This test will fail initially because saveQuizState is not implemented yet

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            // Record an answer
            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            // Save the state (this function doesn't exist yet - will fail)
            saveQuizState(updatedSession);

            // Verify state was saved to localStorage
            const savedData = localStorage.getItem("sap-obake-quiz-state");
            expect(savedData).not.toBeNull();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 22: State is saved after each answer** - should save state with correct structure", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 8.1

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            saveQuizState(updatedSession);

            const savedData = localStorage.getItem("sap-obake-quiz-state");
            expect(savedData).not.toBeNull();

            const parsedData = JSON.parse(savedData!);

            // Verify structure
            expect(parsedData).toHaveProperty("version");
            expect(parsedData).toHaveProperty("currentSession");
            expect(parsedData).toHaveProperty("completedSessions");
            expect(parsedData).toHaveProperty("lastUpdated");

            expect(typeof parsedData.version).toBe("string");
            expect(Array.isArray(parsedData.completedSessions)).toBe(true);
            expect(typeof parsedData.lastUpdated).toBe("number");

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 22: State is saved after each answer** - should update lastUpdated timestamp on each save", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 2, maxLength: 5 }),
          (session, questionIndices) => {
            // Validates: Requirements 8.1

            let currentSession = session;
            let previousTimestamp = 0;
            const uniqueIndices = [...new Set(questionIndices)];

            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);

              saveQuizState(currentSession);

              const savedData = localStorage.getItem("sap-obake-quiz-state");
              const parsedData = JSON.parse(savedData!);

              // Timestamp should be updated
              expect(parsedData.lastUpdated).toBeGreaterThanOrEqual(previousTimestamp);
              previousTimestamp = parsedData.lastUpdated;
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 23: Saved state is checked on load", () => {
    it("**Feature: sap-obake-quiz, Property 23: Saved state is checked on load** - should return null when no saved state exists", () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Validates: Requirements 8.2
          // This test will fail initially because loadQuizState is not implemented yet

          // Ensure localStorage is empty
          localStorage.clear();

          // Load state (this function doesn't exist yet - will fail)
          const loadedState = loadQuizState();

          // Should return null when no state exists
          expect(loadedState).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 23: Saved state is checked on load** - should return saved state when it exists", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 8.2

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            // Save state
            saveQuizState(updatedSession);

            // Load state
            const loadedState = loadQuizState();

            // Should return the saved state
            expect(loadedState).not.toBeNull();
            expect(loadedState).toHaveProperty("currentSession");

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 23: Saved state is checked on load** - should handle corrupted data gracefully", () => {
      fc.assert(
        fc.property(fc.string(), (corruptedData) => {
          // Validates: Requirements 8.2

          // Save corrupted data to localStorage
          localStorage.setItem("sap-obake-quiz-state", corruptedData);

          // Load state should handle corruption gracefully
          const loadedState = loadQuizState();

          // Should return null for corrupted data
          expect(loadedState).toBeNull();

          // localStorage should be cleared
          const savedData = localStorage.getItem("sap-obake-quiz-state");
          expect(savedData).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 23: Saved state is checked on load** - should validate loaded data structure", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.2

          // Save valid state
          saveQuizState(session);

          // Load state
          const loadedState = loadQuizState();

          // Should have valid structure
          expect(loadedState).not.toBeNull();
          expect(loadedState).toHaveProperty("version");
          expect(loadedState).toHaveProperty("currentSession");
          expect(loadedState).toHaveProperty("completedSessions");
          expect(loadedState).toHaveProperty("lastUpdated");

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 25: State restoration is a round-trip", () => {
    it("**Feature: sap-obake-quiz, Property 25: State restoration is a round-trip** - should restore exact quiz session after save and load", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 8.4
            // This is the round-trip property test

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            // Save state
            saveQuizState(updatedSession);

            // Load state
            const loadedState = loadQuizState();

            // Should have a current session
            expect(loadedState).not.toBeNull();
            expect(loadedState?.currentSession).toBeDefined();

            const restoredSession = loadedState?.currentSession!;

            // Verify round-trip: restored session should match original
            expect(restoredSession.id).toBe(updatedSession.id);
            expect(restoredSession.currentQuestionIndex).toBe(updatedSession.currentQuestionIndex);
            expect(restoredSession.answers.length).toBe(updatedSession.answers.length);
            expect(restoredSession.startTime).toBe(updatedSession.startTime);
            expect(restoredSession.isComplete).toBe(updatedSession.isComplete);

            // Verify questions are preserved
            expect(restoredSession.questions.length).toBe(updatedSession.questions.length);
            expect(restoredSession.questions[0].id).toBe(updatedSession.questions[0].id);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 25: State restoration is a round-trip** - should preserve all answers in round-trip", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 3, maxLength: 10 }),
          (session, questionIndices) => {
            // Validates: Requirements 8.4

            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            // Record multiple answers
            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);
            }

            // Save and load
            saveQuizState(currentSession);
            const loadedState = loadQuizState();
            const restoredSession = loadedState?.currentSession!;

            // All answers should be preserved
            expect(restoredSession.answers.length).toBe(currentSession.answers.length);

            for (let i = 0; i < currentSession.answers.length; i++) {
              expect(restoredSession.answers[i].questionId).toBe(
                currentSession.answers[i].questionId
              );
              expect(restoredSession.answers[i].selectedChoiceId).toBe(
                currentSession.answers[i].selectedChoiceId
              );
              expect(restoredSession.answers[i].isCorrect).toBe(
                currentSession.answers[i].isCorrect
              );
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 25: State restoration is a round-trip** - should preserve question order in round-trip", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.4

          // Save and load
          saveQuizState(session);
          const loadedState = loadQuizState();
          const restoredSession = loadedState?.currentSession!;

          // Question order should be preserved
          expect(restoredSession.questions.length).toBe(session.questions.length);

          for (let i = 0; i < session.questions.length; i++) {
            expect(restoredSession.questions[i].id).toBe(session.questions[i].id);
            expect(restoredSession.questions[i].text).toBe(session.questions[i].text);
            expect(restoredSession.questions[i].domain).toBe(session.questions[i].domain);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 25: State restoration is a round-trip** - should preserve current question index in round-trip", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 1, maxLength: 15 }),
          (session, questionIndices) => {
            // Validates: Requirements 8.4

            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            // Record answers and advance through questions
            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);
            }

            // Save and load
            saveQuizState(currentSession);
            const loadedState = loadQuizState();
            const restoredSession = loadedState?.currentSession!;

            // Current question index should be preserved
            expect(restoredSession.currentQuestionIndex).toBe(currentSession.currentQuestionIndex);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 26: Completed quiz clears saved state", () => {
    it("**Feature: sap-obake-quiz, Property 26: Completed quiz clears saved state** - should clear localStorage when quiz is completed", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.5
          // This test will fail initially because clearQuizState is not implemented yet

          // Save a session
          saveQuizState(session);

          // Verify it was saved
          let savedData = localStorage.getItem("sap-obake-quiz-state");
          expect(savedData).not.toBeNull();

          // Clear the state (this function doesn't exist yet - will fail)
          clearQuizState();

          // Verify it was cleared
          savedData = localStorage.getItem("sap-obake-quiz-state");
          expect(savedData).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 26: Completed quiz clears saved state** - should handle clearing when no state exists", () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Validates: Requirements 8.5

          // Ensure localStorage is empty
          localStorage.clear();

          // Clear state should not throw error
          expect(() => clearQuizState()).not.toThrow();

          // Should still be empty
          const savedData = localStorage.getItem("sap-obake-quiz-state");
          expect(savedData).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 26: Completed quiz clears saved state** - should clear state after completing all questions", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.5

          let currentSession = session;

          // Answer all 20 questions
          for (let i = 0; i < 20; i++) {
            const question = currentSession.questions[i];
            const correctChoiceId = question.correctChoiceId;

            currentSession = recordAnswer(currentSession, question.id, correctChoiceId);

            // Save after each answer
            saveQuizState(currentSession);
          }

          // Session should be complete
          expect(currentSession.isComplete).toBe(true);

          // Clear the completed quiz state
          clearQuizState();

          // Verify state was cleared
          const savedData = localStorage.getItem("sap-obake-quiz-state");
          expect(savedData).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 26: Completed quiz clears saved state** - should allow new session after clearing", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.5

          // Save a session
          saveQuizState(session);

          // Clear it
          clearQuizState();

          // Create and save a new session
          const newSession = initializeQuizSession();
          saveQuizState(newSession);

          // Load the state
          const loadedState = loadQuizState();

          // Should have the new session
          expect(loadedState).not.toBeNull();
          expect(loadedState?.currentSession).toBeDefined();
          expect(loadedState?.currentSession?.id).toBe(newSession.id);
          expect(loadedState?.currentSession?.id).not.toBe(session.id);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
