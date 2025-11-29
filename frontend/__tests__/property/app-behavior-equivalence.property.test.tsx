/**
 * Property-Based Test: Application Behavior Equivalence
 * 
 * **Feature: code-refactoring, Property 9: Application behavior equivalence**
 * **Validates: Requirements 5.5**
 * 
 * This test verifies that the complete quiz flow behaves identically before and after refactoring.
 * It tests the entire application flow from quiz initialization through to results display.
 */

import { isValidQuestion, validateQuestion, validateQuestions } from "@/lib/question-loader";
import {
    completeQuizSession,
    getCorrectAnswerCount,
    getCurrentQuestion,
    getDomainDistribution,
    isQuizComplete,
    moveToNextQuestion,
    recordAnswer,
    validateDomainRepresentation,
} from "@/lib/quiz-manager";
import { calculateQuizResult } from "@/lib/score-calculator";
import type { Question, QuizSession } from "@/lib/types";
import { ContentDomain } from "@/lib/types";
import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

describe("Property 9: Application Behavior Equivalence", () => {
  // Generator for valid questions (non-whitespace strings only)
  const nonWhitespaceString = (minLength: number, maxLength: number) =>
    fc
      .string({ minLength, maxLength })
      .filter((s) => s.trim().length > 0)
      .map((s) => s.trim());

  // Generator for questions with unique IDs
  const questionArbitrary = fc.integer({ min: 0, max: 999 }).chain((index) =>
    fc.record({
      id: fc.constant(`q${index}`), // Unique ID based on index
      domain: fc.constantFrom(
        ContentDomain.COMPLEX_ORGANIZATIONS,
        ContentDomain.NEW_SOLUTIONS,
        ContentDomain.CONTINUOUS_IMPROVEMENT,
        ContentDomain.MIGRATION_MODERNIZATION
      ),
      text: nonWhitespaceString(10, 200),
      choices: fc.tuple(
        fc.record({ id: fc.constant("a"), text: nonWhitespaceString(1, 50) }),
        fc.record({ id: fc.constant("b"), text: nonWhitespaceString(1, 50) }),
        fc.record({ id: fc.constant("c"), text: nonWhitespaceString(1, 50) }),
        fc.record({ id: fc.constant("d"), text: nonWhitespaceString(1, 50) })
      ),
      correctChoiceId: fc.constantFrom("a", "b", "c", "d"),
      explanation: nonWhitespaceString(10, 200),
      difficulty: fc.constantFrom("medium" as const, "hard" as const),
      tags: fc.array(nonWhitespaceString(1, 20), { minLength: 1, maxLength: 5 }),
    })
  );

  // Generator for quiz sessions with valid timestamps and unique question IDs
  const quizSessionArbitrary = fc
    .record({
      id: nonWhitespaceString(1, 20),
      // Generate 20 questions with sequential unique IDs
      questions: fc.constant(
        Array.from({ length: 20 }, (_, i) => ({
          id: `q${i}`,
          domain: [
            ContentDomain.COMPLEX_ORGANIZATIONS,
            ContentDomain.NEW_SOLUTIONS,
            ContentDomain.CONTINUOUS_IMPROVEMENT,
            ContentDomain.MIGRATION_MODERNIZATION,
          ][i % 4],
          text: `Question ${i}`,
          choices: [
            { id: "a", text: "Choice A" },
            { id: "b", text: "Choice B" },
            { id: "c", text: "Choice C" },
            { id: "d", text: "Choice D" },
          ],
          correctChoiceId: "a",
          explanation: `Explanation ${i}`,
          difficulty: "medium" as const,
          tags: ["test"],
        }))
      ),
      currentQuestionIndex: fc.integer({ min: 0, max: 19 }),
      answers: fc.array(
        fc.record({
          questionId: fc.integer({ min: 0, max: 19 }).map((i) => `q${i}`),
          selectedChoiceId: fc.constantFrom("a", "b", "c", "d"),
          isCorrect: fc.boolean(),
          answeredAt: fc.integer({ min: Date.now() - 3600000, max: Date.now() }),
        }),
        { minLength: 0, maxLength: 20 }
      ),
      startTime: fc.integer({ min: Date.now() - 3600000, max: Date.now() }),
      isComplete: fc.boolean(),
    })
    .chain((session) => {
      // Generate endTime that is after startTime if present
      return fc
        .option(fc.integer({ min: session.startTime, max: Date.now() + 3600000 }))
        .map((endTime) => ({
          ...session,
          endTime,
        }));
    });

  describe("Quiz Session Flow Invariants", () => {
    it("should maintain quiz session integrity when recording answers", () => {
      fc.assert(
        fc.property(
          quizSessionArbitrary,
          fc.constantFrom("a", "b", "c", "d"),
          fc.boolean(),
          (session, choiceId, isCorrect) => {
            // Skip if quiz is already complete
            if (session.isComplete || session.answers.length >= session.questions.length) {
              return true;
            }

            // Use a valid questionId from the session
            const questionId = session.questions[session.currentQuestionIndex].id;

            const initialAnswerCount = session.answers.length;
            const newSession = recordAnswer(session, questionId, choiceId, isCorrect);

            // Verify answer was recorded
            expect(newSession.answers.length).toBe(initialAnswerCount + 1);

            // Verify session structure is preserved
            expect(newSession.id).toBe(session.id);
            expect(newSession.questions).toEqual(session.questions);
            expect(newSession.startTime).toBe(session.startTime);
            expect(newSession.currentQuestionIndex).toBe(session.currentQuestionIndex);
            // Note: isComplete is not checked here as it's managed by completeQuizSession

            // Verify the new answer has correct structure
            const newAnswer = newSession.answers[newSession.answers.length - 1];
            expect(newAnswer.questionId).toBe(questionId);
            expect(newAnswer.selectedChoiceId).toBe(choiceId);
            expect(newAnswer.isCorrect).toBe(isCorrect);
            expect(newAnswer.answeredAt).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should maintain quiz session integrity when moving to next question", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Skip if already at the end
          if (session.currentQuestionIndex >= session.questions.length - 1) {
            return true;
          }

          const initialIndex = session.currentQuestionIndex;
          const newSession = moveToNextQuestion(session);

          // Verify index was incremented
          expect(newSession.currentQuestionIndex).toBe(initialIndex + 1);

          // Verify session structure is preserved
          expect(newSession.id).toBe(session.id);
          expect(newSession.questions).toEqual(session.questions);
          expect(newSession.answers).toEqual(session.answers);
          expect(newSession.startTime).toBe(session.startTime);
          expect(newSession.isComplete).toBe(session.isComplete);
        }),
        { numRuns: 100 }
      );
    });

    it("should correctly determine quiz completion status", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          const isComplete = isQuizComplete(session);
          const expectedComplete = session.answers.length >= session.questions.length;

          expect(isComplete).toBe(expectedComplete);
        }),
        { numRuns: 100 }
      );
    });

    it("should correctly retrieve current question", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          const currentQuestion = getCurrentQuestion(session);

          if (session.currentQuestionIndex >= session.questions.length) {
            expect(currentQuestion).toBeUndefined();
          } else {
            expect(currentQuestion).toEqual(session.questions[session.currentQuestionIndex]);
          }
        }),
        { numRuns: 100 }
      );
    });

    it("should correctly count correct answers", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          const correctCount = getCorrectAnswerCount(session);
          const expectedCount = session.answers.filter((a) => a.isCorrect).length;

          expect(correctCount).toBe(expectedCount);
        }),
        { numRuns: 100 }
      );
    });

    it("should mark session as complete when completing", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          const completedSession = completeQuizSession(session);

          expect(completedSession.isComplete).toBe(true);
          expect(completedSession.endTime).toBeGreaterThan(0);

          // Verify other properties are preserved
          expect(completedSession.id).toBe(session.id);
          expect(completedSession.questions).toEqual(session.questions);
          expect(completedSession.answers).toEqual(session.answers);
          expect(completedSession.startTime).toBe(session.startTime);
          expect(completedSession.currentQuestionIndex).toBe(session.currentQuestionIndex);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Question Validation Consistency", () => {
    it("should consistently validate questions across different validation methods", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Test that isValidQuestion and validateQuestion agree
          const isValid = isValidQuestion(question);
          const validationResult = validateQuestion(question);

          expect(isValid).toBe(validationResult.isValid);

          // If invalid, there should be errors
          if (!isValid) {
            expect(validationResult.errors.length).toBeGreaterThan(0);
          } else {
            expect(validationResult.errors.length).toBe(0);
          }
        }),
        { numRuns: 100 }
      );
    });

    it("should consistently validate question batches", () => {
      fc.assert(
        fc.property(
          fc.array(questionArbitrary, { minLength: 1, maxLength: 20 }),
          (questions) => {
            const batchResult = validateQuestions(questions);
            const individualResults = questions.map((q, i) => validateQuestion(q, i));

            // Batch validation should be valid only if all individual validations are valid
            const allValid = individualResults.every((r) => r.isValid);
            expect(batchResult.isValid).toBe(allValid);

            // Batch errors should be the sum of individual errors
            const totalErrors = individualResults.reduce((sum, r) => sum + r.errors.length, 0);
            expect(batchResult.errors.length).toBe(totalErrors);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Score Calculation Consistency", () => {
    it("should calculate consistent quiz results", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Skip if session doesn't have enough data
          if (session.questions.length === 0 || session.answers.length === 0) {
            return true;
          }

          const result = calculateQuizResult(session);

          // Verify basic result structure
          expect(result.sessionId).toBe(session.id);
          expect(result.totalQuestions).toBe(session.questions.length);

          // Verify correct answer count
          const expectedCorrect = session.answers.filter((a) => a.isCorrect).length;
          expect(result.correctAnswers).toBe(expectedCorrect);

          // Verify percentage calculation
          const expectedPercentage = (expectedCorrect / session.questions.length) * 100;
          expect(result.percentageScore).toBeCloseTo(expectedPercentage, 1);

          // Verify time calculation
          const endTime = session.endTime || Date.now();
          const expectedTime = Math.floor((endTime - session.startTime) / 1000);
          expect(result.totalTimeSeconds).toBeGreaterThanOrEqual(0);

          // Verify domain performance is calculated
          expect(result.domainPerformance).toBeDefined();
          expect(Array.isArray(result.domainPerformance)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it("should maintain domain distribution consistency", () => {
      fc.assert(
        fc.property(
          fc.array(questionArbitrary, { minLength: 4, maxLength: 20 }),
          (questions) => {
            const distribution = getDomainDistribution(questions);

            // Verify all questions are counted
            const totalCount = Array.from(distribution.values()).reduce((sum, count) => sum + count, 0);
            expect(totalCount).toBe(questions.length);

            // Verify each domain count matches actual questions
            for (const [domain, count] of distribution.entries()) {
              const actualCount = questions.filter((q) => q.domain === domain).length;
              expect(count).toBe(actualCount);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Complete Quiz Flow Behavior", () => {
    it("should maintain consistent behavior through complete quiz flow", () => {
      fc.assert(
        fc.property(
          fc.array(fc.boolean(), { minLength: 20, maxLength: 20 }),
          (correctAnswers) => {
            // Create questions with unique IDs
            const questions: Question[] = Array.from({ length: 20 }, (_, i) => ({
              id: `q${i}`,
              domain: [
                ContentDomain.COMPLEX_ORGANIZATIONS,
                ContentDomain.NEW_SOLUTIONS,
                ContentDomain.CONTINUOUS_IMPROVEMENT,
                ContentDomain.MIGRATION_MODERNIZATION,
              ][i % 4],
              text: `Question ${i}`,
              choices: [
                { id: "a", text: "Choice A" },
                { id: "b", text: "Choice B" },
                { id: "c", text: "Choice C" },
                { id: "d", text: "Choice D" },
              ],
              correctChoiceId: "a",
              explanation: `Explanation ${i}`,
              difficulty: "medium" as const,
              tags: ["test"],
            }));

            // Create initial session
            let session: QuizSession = {
              id: "test-session",
              questions,
              currentQuestionIndex: 0,
              answers: [],
              startTime: Date.now(),
              isComplete: false,
            };

            // Simulate answering all questions
            for (let i = 0; i < questions.length; i++) {
              const question = questions[i];
              const isCorrect = correctAnswers[i];
              const choiceId = isCorrect ? question.correctChoiceId : "b";

              // Record answer
              session = recordAnswer(session, question.id, choiceId, isCorrect);

              // Verify answer was recorded
              expect(session.answers.length).toBe(i + 1);

              // Move to next question (except on last question)
              if (i < questions.length - 1) {
                session = moveToNextQuestion(session);
                expect(session.currentQuestionIndex).toBe(i + 1);
              }
            }

            // Verify quiz is complete
            expect(isQuizComplete(session)).toBe(true);

            // Complete the session
            session = completeQuizSession(session);
            expect(session.isComplete).toBe(true);
            expect(session.endTime).toBeGreaterThan(0);

            // Calculate results
            const result = calculateQuizResult(session);

            // Verify result consistency
            expect(result.totalQuestions).toBe(questions.length);
            const expectedCorrect = correctAnswers.filter((c) => c).length;
            expect(result.correctAnswers).toBe(expectedCorrect);

            // Verify percentage
            const expectedPercentage = (expectedCorrect / questions.length) * 100;
            expect(result.percentageScore).toBeCloseTo(expectedPercentage, 1);
          }
        ),
        { numRuns: 50 } // Reduced runs due to complexity
      );
    });

    it("should maintain domain representation throughout quiz flow", () => {
      fc.assert(
        fc.property(
          fc.array(questionArbitrary, { minLength: 20, maxLength: 20 }),
          (questions) => {
            // Ensure all domains are represented
            const domains = [
              ContentDomain.COMPLEX_ORGANIZATIONS,
              ContentDomain.NEW_SOLUTIONS,
              ContentDomain.CONTINUOUS_IMPROVEMENT,
              ContentDomain.MIGRATION_MODERNIZATION,
            ];

            // Modify questions to ensure domain representation
            const balancedQuestions = questions.map((q, i) => ({
              ...q,
              domain: domains[i % 4],
            }));

            const session: QuizSession = {
              id: "test-session",
              questions: balancedQuestions,
              currentQuestionIndex: 0,
              answers: [],
              startTime: Date.now(),
              isComplete: false,
            };

            // Verify domain representation
            const isValid = validateDomainRepresentation(session);
            expect(isValid).toBe(true);

            // Verify distribution
            const distribution = getDomainDistribution(balancedQuestions);
            expect(distribution.size).toBe(4); // All 4 domains should be present
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Idempotency Properties", () => {
    it("should produce same result when calculating quiz result multiple times", () => {
      fc.assert(
        fc.property(quizSessionArbitrary, (session) => {
          // Skip if session doesn't have enough data
          if (session.questions.length === 0 || session.answers.length === 0) {
            return true;
          }

          const result1 = calculateQuizResult(session);
          const result2 = calculateQuizResult(session);

          // Results should be identical
          expect(result1.sessionId).toBe(result2.sessionId);
          expect(result1.totalQuestions).toBe(result2.totalQuestions);
          expect(result1.correctAnswers).toBe(result2.correctAnswers);
          expect(result1.percentageScore).toBe(result2.percentageScore);
          expect(result1.domainPerformance).toEqual(result2.domainPerformance);
        }),
        { numRuns: 100 }
      );
    });

    it("should produce same validation result when validating question multiple times", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          const result1 = validateQuestion(question);
          const result2 = validateQuestion(question);

          expect(result1.isValid).toBe(result2.isValid);
          expect(result1.errors).toEqual(result2.errors);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Error Handling Consistency", () => {
    it("should handle invalid questions consistently", () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string(),
            domain: fc.constantFrom(
              ContentDomain.COMPLEX_ORGANIZATIONS,
              ContentDomain.NEW_SOLUTIONS,
              ContentDomain.CONTINUOUS_IMPROVEMENT,
              ContentDomain.MIGRATION_MODERNIZATION
            ),
            text: fc.string(),
            choices: fc.array(
              fc.record({
                id: fc.string(),
                text: fc.string(),
              }),
              { minLength: 0, maxLength: 10 }
            ),
            correctChoiceId: fc.string(),
            explanation: fc.string(),
            difficulty: fc.constantFrom("medium" as const, "hard" as const, "easy" as any),
            tags: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
          }),
          (question) => {
            const isValid = isValidQuestion(question as Question);
            const validationResult = validateQuestion(question as Question);

            // Both methods should agree on validity
            expect(isValid).toBe(validationResult.isValid);

            // If invalid, there should be specific error messages
            if (!isValid) {
              expect(validationResult.errors.length).toBeGreaterThan(0);
              expect(validationResult.errors.every((e) => typeof e === "string")).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
