/**
 * Property-Based Tests for Resume Option
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness property for offering resume option
 * when saved quiz state exists, using fast-check for property-based testing
 * with 100+ iterations.
 *
 * Tests cover:
 * - Property 24: Resume option is offered when state exists
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

describe("Resume Option - Property-Based Tests", () => {
  describe("Property 24: Resume option is offered when state exists", () => {
    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should detect saved state exists", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 8.3
            // This test verifies that when a quiz state is saved,
            // the application can detect its existence

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            // Record an answer and save state
            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);
            saveQuizState(updatedSession);

            // Load state to check if it exists
            const loadedState = loadQuizState();

            // State should exist and contain a current session
            expect(loadedState).not.toBeNull();
            expect(loadedState?.currentSession).toBeDefined();
            expect(loadedState?.currentSession).not.toBeUndefined();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should not detect state when none exists", () => {
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Validates: Requirements 8.3
          // This test verifies that when no quiz state is saved,
          // the application correctly detects the absence

          // Ensure localStorage is empty
          localStorage.clear();

          // Load state
          const loadedState = loadQuizState();

          // State should not exist
          expect(loadedState).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should detect state for partially completed quiz", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 1, maxLength: 10 }),
          (session, questionIndices) => {
            // Validates: Requirements 8.3
            // This test verifies that saved state is detected for
            // partially completed quizzes (not just fully completed ones)

            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            // Answer some questions (but not all 20)
            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);
            }

            // Save the partially completed session
            saveQuizState(currentSession);

            // Load state
            const loadedState = loadQuizState();

            // State should exist
            expect(loadedState).not.toBeNull();
            expect(loadedState?.currentSession).toBeDefined();

            // Session should not be complete
            expect(loadedState?.currentSession?.isComplete).toBe(false);

            // Should have the correct number of answers
            expect(loadedState?.currentSession?.answers.length).toBe(uniqueIndices.length);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should not detect state after clearing", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 8.3
            // This test verifies that after clearing state,
            // no resume option should be offered

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            // Record an answer and save state
            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);
            saveQuizState(updatedSession);

            // Verify state exists
            let loadedState = loadQuizState();
            expect(loadedState).not.toBeNull();

            // Clear the state
            clearQuizState();

            // Load state again
            loadedState = loadQuizState();

            // State should not exist anymore
            expect(loadedState).toBeNull();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should preserve session ID for resume", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 2, maxLength: 8 }),
          (session, questionIndices) => {
            // Validates: Requirements 8.3
            // This test verifies that the session ID is preserved
            // so the user can resume the exact same session

            let currentSession = session;
            const originalSessionId = session.id;
            const uniqueIndices = [...new Set(questionIndices)];

            // Answer some questions
            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);
            }

            // Save state
            saveQuizState(currentSession);

            // Load state
            const loadedState = loadQuizState();

            // Session ID should be preserved
            expect(loadedState).not.toBeNull();
            expect(loadedState?.currentSession).toBeDefined();
            expect(loadedState?.currentSession?.id).toBe(originalSessionId);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should detect state immediately after save", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.3
          // This test verifies that state is immediately detectable
          // after saving (no delay or async issues)

          // Save a fresh session (no answers yet)
          saveQuizState(session);

          // Immediately load state
          const loadedState = loadQuizState();

          // State should exist immediately
          expect(loadedState).not.toBeNull();
          expect(loadedState?.currentSession).toBeDefined();
          expect(loadedState?.currentSession?.id).toBe(session.id);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should handle multiple save-load cycles", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 3, maxLength: 12 }),
          (session, questionIndices) => {
            // Validates: Requirements 8.3
            // This test verifies that state detection works correctly
            // across multiple save-load cycles

            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);

              // Save after each answer
              saveQuizState(currentSession);

              // Load and verify state exists
              const loadedState = loadQuizState();
              expect(loadedState).not.toBeNull();
              expect(loadedState?.currentSession).toBeDefined();
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 24: Resume option is offered when state exists** - should distinguish between new and resumable sessions", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 8.3
          // This test verifies that we can distinguish between
          // a fresh session (no saved state) and a resumable session

          // Initially, no state should exist
          let loadedState = loadQuizState();
          expect(loadedState).toBeNull();

          // Save a session
          saveQuizState(session);

          // Now state should exist
          loadedState = loadQuizState();
          expect(loadedState).not.toBeNull();
          expect(loadedState?.currentSession).toBeDefined();

          // Clear state
          clearQuizState();

          // State should not exist again
          loadedState = loadQuizState();
          expect(loadedState).toBeNull();

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
