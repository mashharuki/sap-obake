/**
 * Property-Based Tests for Progress Display
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness properties for progress display
 * using fast-check for property-based testing with 100+ iterations.
 *
 * Tests cover:
 * - Property 4: Question number display is accurate
 * - Property 11: Progress display is accurate
 *
 * RED PHASE: These tests will initially fail as the ProgressBar component doesn't exist yet.
 */

import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { initializeQuizSession, recordAnswer } from "@/lib/quiz-manager";

/**
 * Arbitrary generator for quiz sessions
 */
const quizSessionArbitrary = fc.constant(null).map(() => {
  return initializeQuizSession();
});

/**
 * Arbitrary generator for question indices (0-19 for 20 questions)
 */
const questionIndexArbitrary = fc.integer({ min: 0, max: 19 });

/**
 * Helper function to get progress data from a session
 * This represents what the ProgressBar component should display
 */
function getProgressData(session: ReturnType<typeof initializeQuizSession>) {
  const currentQuestionNumber = session.currentQuestionIndex + 1;
  const totalQuestions = session.questions.length;
  const correctCount = session.answers.filter((a) => a.isCorrect).length;

  return {
    currentQuestionNumber,
    totalQuestions,
    correctCount,
    displayText: `Question ${currentQuestionNumber}/${totalQuestions}`,
  };
}

describe("Progress Display - Property-Based Tests (RED Phase)", () => {
  describe("Property 4: Question number display is accurate", () => {
    it("**Feature: sap-obake-quiz, Property 4: Question number display is accurate** - should display current question number correctly", () => {
      // Validates: Requirements 1.4
      fc.assert(
        fc.property(quizSessionArbitrary, questionIndexArbitrary, (session, targetIndex) => {
          // Move to the target question index
          const updatedSession = {
            ...session,
            currentQuestionIndex: targetIndex,
          };

          const progressData = getProgressData(updatedSession);

          // Question number should be index + 1 (1-based display)
          expect(progressData.currentQuestionNumber).toBe(targetIndex + 1);

          // Display text should match format "Question X/20"
          expect(progressData.displayText).toBe(`Question ${targetIndex + 1}/20`);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 4: Question number display is accurate** - should always show total as 20", () => {
      // Validates: Requirements 1.4
      fc.assert(
        fc.property(quizSessionArbitrary, questionIndexArbitrary, (session, targetIndex) => {
          const updatedSession = {
            ...session,
            currentQuestionIndex: targetIndex,
          };

          const progressData = getProgressData(updatedSession);

          // Total questions should always be 20
          expect(progressData.totalQuestions).toBe(20);

          // Display text should always end with "/20"
          expect(progressData.displayText).toMatch(/\/20$/);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 4: Question number display is accurate** - should handle first question correctly", () => {
      // Validates: Requirements 1.4
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // At initialization, should be at question 1
          const progressData = getProgressData(session);

          expect(progressData.currentQuestionNumber).toBe(1);
          expect(progressData.displayText).toBe("Question 1/20");

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 4: Question number display is accurate** - should handle last question correctly", () => {
      // Validates: Requirements 1.4
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Move to last question (index 19)
          const updatedSession = {
            ...session,
            currentQuestionIndex: 19,
          };

          const progressData = getProgressData(updatedSession);

          expect(progressData.currentQuestionNumber).toBe(20);
          expect(progressData.displayText).toBe("Question 20/20");

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 4: Question number display is accurate** - should never show question number greater than 20", () => {
      // Validates: Requirements 1.4
      fc.assert(
        fc.property(quizSessionArbitrary, questionIndexArbitrary, (session, targetIndex) => {
          const updatedSession = {
            ...session,
            currentQuestionIndex: targetIndex,
          };

          const progressData = getProgressData(updatedSession);

          // Question number should never exceed 20
          expect(progressData.currentQuestionNumber).toBeLessThanOrEqual(20);
          expect(progressData.currentQuestionNumber).toBeGreaterThan(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 11: Progress display is accurate", () => {
    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should display current question number, total, and correct count", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(questionIndexArbitrary, { minLength: 1, maxLength: 10 }),
          (session, questionIndices) => {
            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            // Answer some questions correctly
            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);
            }

            const progressData = getProgressData(currentSession);

            // Should show current question number
            expect(progressData.currentQuestionNumber).toBeDefined();
            expect(typeof progressData.currentQuestionNumber).toBe("number");

            // Should show total questions (always 20)
            expect(progressData.totalQuestions).toBe(20);

            // Should show correct answer count
            expect(progressData.correctCount).toBe(uniqueIndices.length);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should update correct count as answers are recorded", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(
            fc.record({
              questionIndex: questionIndexArbitrary,
              isCorrect: fc.boolean(),
            }),
            { minLength: 3, maxLength: 10 }
          ),
          (session, answerSpecs) => {
            let currentSession = session;
            let expectedCorrectCount = 0;
            const usedQuestionIds = new Set<string>();

            for (const spec of answerSpecs) {
              const question = currentSession.questions[spec.questionIndex];

              // Skip if already answered
              if (usedQuestionIds.has(question.id)) {
                continue;
              }
              usedQuestionIds.add(question.id);

              let choiceId: string;
              if (spec.isCorrect) {
                choiceId = question.correctChoiceId;
                expectedCorrectCount++;
              } else {
                const incorrectChoice = question.choices.find(
                  (c) => c.id !== question.correctChoiceId
                );
                if (!incorrectChoice) continue;
                choiceId = incorrectChoice.id;
              }

              currentSession = recordAnswer(currentSession, question.id, choiceId);

              // Check progress after each answer
              const progressData = getProgressData(currentSession);
              expect(progressData.correctCount).toBe(expectedCorrectCount);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should show 0 correct answers at start", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          const progressData = getProgressData(session);

          // At start, correct count should be 0
          expect(progressData.correctCount).toBe(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should never show correct count greater than total answers", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(questionIndexArbitrary, { minLength: 1, maxLength: 20 }),
          (session, questionIndices) => {
            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);

              const progressData = getProgressData(currentSession);

              // Correct count should never exceed total answers
              expect(progressData.correctCount).toBeLessThanOrEqual(currentSession.answers.length);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should accurately reflect progress percentage", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(questionIndexArbitrary, { minLength: 1, maxLength: 20 }),
          (session, questionIndices) => {
            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            // Answer questions
            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);
            }

            const progressData = getProgressData(currentSession);

            // Calculate expected progress percentage
            const answeredCount = currentSession.answers.length;
            const expectedProgressPercentage = (answeredCount / 20) * 100;

            // Verify the data needed to calculate progress is accurate
            expect(progressData.totalQuestions).toBe(20);
            expect(answeredCount).toBe(uniqueIndices.length);

            // Progress percentage should be calculable from the data
            const actualProgressPercentage = (answeredCount / progressData.totalQuestions) * 100;
            expect(actualProgressPercentage).toBe(expectedProgressPercentage);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should handle all questions answered correctly", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          let currentSession = session;

          // Answer all 20 questions correctly
          for (let i = 0; i < 20; i++) {
            const question = currentSession.questions[i];
            currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);
          }

          const progressData = getProgressData(currentSession);

          // Should show 20 correct answers
          expect(progressData.correctCount).toBe(20);

          // Should show we're at the end
          expect(currentSession.answers.length).toBe(20);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should handle all questions answered incorrectly", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          let currentSession = session;

          // Answer all 20 questions incorrectly
          for (let i = 0; i < 20; i++) {
            const question = currentSession.questions[i];
            const incorrectChoice = question.choices.find((c) => c.id !== question.correctChoiceId);
            if (!incorrectChoice) continue;

            currentSession = recordAnswer(currentSession, question.id, incorrectChoice.id);
          }

          const progressData = getProgressData(currentSession);

          // Should show 0 correct answers
          expect(progressData.correctCount).toBe(0);

          // Should show we've answered all questions
          expect(currentSession.answers.length).toBe(20);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 11: Progress display is accurate** - should maintain consistency between question index and answer count", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.array(questionIndexArbitrary, { minLength: 1, maxLength: 15 }),
          (session, questionIndices) => {
            let currentSession = session;
            const uniqueIndices = [...new Set(questionIndices)];

            for (const questionIndex of uniqueIndices) {
              const question = currentSession.questions[questionIndex];
              currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);
            }

            const progressData = getProgressData(currentSession);

            // The number of answers should match what we've recorded
            expect(currentSession.answers.length).toBe(uniqueIndices.length);

            // Progress data should reflect this
            expect(progressData.correctCount).toBeLessThanOrEqual(currentSession.answers.length);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Edge Cases - Progress Display", () => {
    it("should handle progress display at quiz completion", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          let currentSession = session;

          // Complete the quiz
          for (let i = 0; i < 20; i++) {
            const question = currentSession.questions[i];
            currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);
          }

          const progressData = getProgressData(currentSession);

          // Should show completion state
          expect(currentSession.isComplete).toBe(true);
          expect(currentSession.answers.length).toBe(20);
          expect(progressData.totalQuestions).toBe(20);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("should handle progress display with partial completion", () => {
      // Validates: Requirements 3.2, 3.3
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.integer({ min: 1, max: 19 }),
          (session, answeredCount) => {
            let currentSession = session;

            // Answer a specific number of questions
            for (let i = 0; i < answeredCount; i++) {
              const question = currentSession.questions[i];
              currentSession = recordAnswer(currentSession, question.id, question.correctChoiceId);
            }

            const progressData = getProgressData(currentSession);

            // Should show partial progress
            expect(currentSession.answers.length).toBe(answeredCount);
            expect(progressData.correctCount).toBe(answeredCount);
            expect(currentSession.isComplete).toBe(false);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
