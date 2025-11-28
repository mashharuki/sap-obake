/**
 * Property-Based Tests for Quiz Session State Management
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness properties for quiz session state management
 * using fast-check for property-based testing with 100+ iterations.
 *
 * Tests cover:
 * - Property 3: Timer starts at zero
 * - Property 6: User answers are recorded
 * - Property 12: Correct answer count increments properly
 */

import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { initializeQuizSession, recordAnswer } from "@/lib/quiz-manager";

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

describe("State Management - Property-Based Tests", () => {
  describe("Property 3: Timer starts at zero", () => {
    it("**Feature: sap-obake-quiz, Property 3: Timer starts at zero** - should initialize timer at current timestamp", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 1.3
          // The timer should start at a valid timestamp (not zero, but close to now)
          const now = Date.now();
          expect(session.startTime).toBeDefined();
          expect(typeof session.startTime).toBe("number");
          expect(session.startTime).toBeGreaterThan(0);
          // Should be within 1 second of current time
          expect(Math.abs(now - session.startTime)).toBeLessThan(1000);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 3: Timer starts at zero** - should have elapsed time of zero at initialization", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 1.3
          // Elapsed time should be zero (or very close) at initialization
          const elapsedTime = Date.now() - session.startTime;
          expect(elapsedTime).toBeLessThan(100); // Within 100ms
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 3: Timer starts at zero** - should not have an end time at initialization", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Validates: Requirements 1.3
          // End time should be undefined for a new session
          expect(session.endTime).toBeUndefined();
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 6: User answers are recorded", () => {
    it("**Feature: sap-obake-quiz, Property 6: User answers are recorded** - should record answer when user selects a choice", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 2.2
            // This test will fail initially because recordAnswer is not implemented yet

            // Get the question and choice
            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            // Record the answer (this function doesn't exist yet - will fail)
            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            // Verify the answer was recorded
            expect(updatedSession.answers.length).toBe(session.answers.length + 1);

            const recordedAnswer = updatedSession.answers[updatedSession.answers.length - 1];
            expect(recordedAnswer.questionId).toBe(question.id);
            expect(recordedAnswer.selectedChoiceId).toBe(selectedChoice.id);
            expect(typeof recordedAnswer.isCorrect).toBe("boolean");
            expect(typeof recordedAnswer.answeredAt).toBe("number");

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 6: User answers are recorded** - should mark answer as correct when correct choice is selected", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, answerIndexArbitrary, (session, questionIndex) => {
          // Validates: Requirements 2.2

          const question = session.questions[questionIndex];
          const correctChoiceId = question.correctChoiceId;

          // Record the correct answer
          const updatedSession = recordAnswer(session, question.id, correctChoiceId);

          const recordedAnswer = updatedSession.answers[updatedSession.answers.length - 1];
          expect(recordedAnswer.isCorrect).toBe(true);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 6: User answers are recorded** - should mark answer as incorrect when wrong choice is selected", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 2.2

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            // Skip if we accidentally selected the correct answer
            if (selectedChoice.id === question.correctChoiceId) {
              return true;
            }

            // Record the incorrect answer
            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            const recordedAnswer = updatedSession.answers[updatedSession.answers.length - 1];
            expect(recordedAnswer.isCorrect).toBe(false);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 6: User answers are recorded** - should preserve previous answers when recording new answer", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 2, maxLength: 5 }),
          (session, questionIndices) => {
            // Validates: Requirements 2.2

            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);
            }

            // All answers should be preserved
            expect(currentSession.answers.length).toBe(uniqueIndices.length);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 12: Correct answer count increments properly", () => {
    it("**Feature: sap-obake-quiz, Property 12: Correct answer count increments properly** - should increment correct count when correct answer is submitted", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, answerIndexArbitrary, (session, questionIndex) => {
          // Validates: Requirements 3.4

          const question = session.questions[questionIndex];
          const correctChoiceId = question.correctChoiceId;

          const initialCorrectCount = session.answers.filter((a) => a.isCorrect).length;

          // Record correct answer
          const updatedSession = recordAnswer(session, question.id, correctChoiceId);

          const newCorrectCount = updatedSession.answers.filter((a) => a.isCorrect).length;

          // Correct count should increase by exactly 1
          expect(newCorrectCount).toBe(initialCorrectCount + 1);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 12: Correct answer count increments properly** - should not increment correct count when incorrect answer is submitted", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          answerIndexArbitrary,
          choiceIndexArbitrary,
          (session, questionIndex, choiceIndex) => {
            // Validates: Requirements 3.4

            const question = session.questions[questionIndex];
            const selectedChoice = question.choices[choiceIndex];

            // Skip if we accidentally selected the correct answer
            if (selectedChoice.id === question.correctChoiceId) {
              return true;
            }

            const initialCorrectCount = session.answers.filter((a) => a.isCorrect).length;

            // Record incorrect answer
            const updatedSession = recordAnswer(session, question.id, selectedChoice.id);

            const newCorrectCount = updatedSession.answers.filter((a) => a.isCorrect).length;

            // Correct count should remain the same
            expect(newCorrectCount).toBe(initialCorrectCount);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 12: Correct answer count increments properly** - should accurately count multiple correct answers", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(answerIndexArbitrary, { minLength: 3, maxLength: 10 }),
          (session, questionIndices) => {
            // Validates: Requirements 3.4

            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];
            let expectedCorrectCount = 0;

            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              const correctChoiceId = question.correctChoiceId;

              currentSession = recordAnswer(currentSession, question.id, correctChoiceId);

              expectedCorrectCount++;
            }

            const actualCorrectCount = currentSession.answers.filter((a) => a.isCorrect).length;
            expect(actualCorrectCount).toBe(expectedCorrectCount);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 12: Correct answer count increments properly** - should handle mix of correct and incorrect answers", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(
            fc.record({
              questionIndex: answerIndexArbitrary,
              isCorrect: fc.boolean(),
            }),
            { minLength: 3, maxLength: 10 }
          ),
          (session, answerSpecs) => {
            // Validates: Requirements 3.4

            let currentSession = session;
            let expectedCorrectCount = 0;
            const usedQuestionIds = new Set<string>();

            for (const spec of answerSpecs) {
              const question = currentSession.questions[spec.questionIndex];

              // Skip if we already answered this question
              if (usedQuestionIds.has(question.id)) {
                continue;
              }
              usedQuestionIds.add(question.id);

              let choiceId: string;
              if (spec.isCorrect) {
                choiceId = question.correctChoiceId;
                expectedCorrectCount++;
              } else {
                // Find an incorrect choice
                const incorrectChoice = question.choices.find(
                  (c) => c.id !== question.correctChoiceId
                );
                if (!incorrectChoice) continue;
                choiceId = incorrectChoice.id;
              }

              currentSession = recordAnswer(currentSession, question.id, choiceId);
            }

            const actualCorrectCount = currentSession.answers.filter((a) => a.isCorrect).length;
            expect(actualCorrectCount).toBe(expectedCorrectCount);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
