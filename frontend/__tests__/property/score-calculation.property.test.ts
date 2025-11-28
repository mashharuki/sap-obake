/**
 * Property-Based Tests for Score Calculation
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness properties for score calculation
 * using fast-check for property-based testing with 100+ iterations.
 */

import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { calculateQuizResult } from "@/lib/score-calculator";
import type { QuizSession } from "@/lib/types";
import { ContentDomain } from "@/lib/types";

/**
 * Arbitrary generator for ContentDomain
 */
const contentDomainArbitrary = fc.constantFrom(
  ContentDomain.COMPLEX_ORGANIZATIONS,
  ContentDomain.NEW_SOLUTIONS,
  ContentDomain.CONTINUOUS_IMPROVEMENT,
  ContentDomain.MIGRATION_MODERNIZATION
);

/**
 * Arbitrary generator for a quiz session with answers
 * Generates sessions with 20 questions and varying numbers of correct answers
 * Ensures answers reference valid questions from the session
 * Ensures all question IDs are unique
 */
const quizSessionWithAnswersArbitrary = fc
  .record({
    id: fc.string({ minLength: 1 }),
    currentQuestionIndex: fc.nat({ max: 19 }),
    startTime: fc.integer({ min: 1000000000000, max: 9999999999999 }),
    endTime: fc.option(fc.integer({ min: 1000000000000, max: 9999999999999 })),
    isComplete: fc.constant(true),
  })
  .chain((baseSession) => {
    // Generate 20 questions with unique IDs
    return fc
      .array(
        fc.record({
          domain: contentDomainArbitrary,
          text: fc.string({ minLength: 10 }),
          choices: fc.array(
            fc.record({
              id: fc.string({ minLength: 1 }),
              text: fc.string({ minLength: 1 }),
            }),
            { minLength: 4, maxLength: 4 }
          ),
          correctChoiceId: fc.string({ minLength: 1 }),
          explanation: fc.string({ minLength: 10 }),
          difficulty: fc.constantFrom("medium" as const, "hard" as const),
          tags: fc.array(fc.string()),
        }),
        { minLength: 20, maxLength: 20 }
      )
      .map((questionSpecs) => {
        // Assign unique IDs to each question
        const questions = questionSpecs.map((spec, index) => ({
          ...spec,
          id: `question-${index}`,
        }));

        return { ...baseSession, questions };
      })
      .chain((sessionWithQuestions) => {
        // Generate answers that reference actual questions from the session
        return fc
          .array(
            fc.record({
              isCorrect: fc.boolean(),
              answeredAt: fc.integer({ min: 1000000000000, max: 9999999999999 }),
            }),
            { minLength: 20, maxLength: 20 }
          )
          .map((answerSpecs) => {
            // Create answers that reference actual questions
            const answers: UserAnswer[] = answerSpecs.map((spec, index) => ({
              questionId: sessionWithQuestions.questions[index].id,
              selectedChoiceId: sessionWithQuestions.questions[index].choices[0].id,
              isCorrect: spec.isCorrect,
              answeredAt: spec.answeredAt,
            }));

            // Ensure endTime is after startTime
            const endTime = sessionWithQuestions.endTime ?? sessionWithQuestions.startTime + 1000;

            return {
              ...sessionWithQuestions,
              answers,
              endTime: Math.max(endTime, sessionWithQuestions.startTime + 1),
            } as QuizSession;
          });
      });
  });

describe("Score Calculation - Property-Based Tests", () => {
  describe("Property 14: Results include all required metrics", () => {
    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should include total correct answers", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.2
          const result = calculateQuizResult(session);

          expect(result.correctAnswers).toBeDefined();
          expect(typeof result.correctAnswers).toBe("number");
          expect(result.correctAnswers).toBeGreaterThanOrEqual(0);
          expect(result.correctAnswers).toBeLessThanOrEqual(20);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should include total time taken", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.3
          const result = calculateQuizResult(session);

          expect(result.totalTimeSeconds).toBeDefined();
          expect(typeof result.totalTimeSeconds).toBe("number");
          expect(result.totalTimeSeconds).toBeGreaterThanOrEqual(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should include percentage score calculated as (correct / 20) * 100", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.4
          const result = calculateQuizResult(session);

          expect(result.percentageScore).toBeDefined();
          expect(typeof result.percentageScore).toBe("number");
          expect(result.percentageScore).toBeGreaterThanOrEqual(0);
          expect(result.percentageScore).toBeLessThanOrEqual(100);

          // Verify the calculation is correct
          const expectedPercentage = (result.correctAnswers / 20) * 100;
          expect(result.percentageScore).toBe(expectedPercentage);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should include all required fields", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.2, 4.3, 4.4
          const result = calculateQuizResult(session);

          // Check all required fields exist
          expect(result.sessionId).toBeDefined();
          expect(result.totalQuestions).toBeDefined();
          expect(result.correctAnswers).toBeDefined();
          expect(result.percentageScore).toBeDefined();
          expect(result.totalTimeSeconds).toBeDefined();
          expect(result.domainPerformance).toBeDefined();
          expect(result.completedAt).toBeDefined();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should have totalQuestions equal to 20", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.2
          const result = calculateQuizResult(session);

          expect(result.totalQuestions).toBe(20);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should calculate correct answer count accurately", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.2
          const result = calculateQuizResult(session);

          // Count correct answers manually
          const expectedCorrect = session.answers.filter((a) => a.isCorrect).length;
          expect(result.correctAnswers).toBe(expectedCorrect);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 14: Results include all required metrics** - should calculate time accurately from start to end", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 4.3
          const result = calculateQuizResult(session);

          // Calculate expected time in seconds
          const expectedTimeMs = (session.endTime ?? Date.now()) - session.startTime;
          const expectedTimeSeconds = Math.floor(expectedTimeMs / 1000);

          expect(result.totalTimeSeconds).toBe(expectedTimeSeconds);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 20: Results include domain breakdown", () => {
    it("**Feature: sap-obake-quiz, Property 20: Results include domain breakdown** - should include performance for all four domains", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 6.4
          const result = calculateQuizResult(session);

          expect(result.domainPerformance).toBeDefined();
          expect(Array.isArray(result.domainPerformance)).toBe(true);

          // Should have entries for all 4 domains
          const domains = result.domainPerformance.map((dp) => dp.domain);
          expect(domains).toContain(ContentDomain.COMPLEX_ORGANIZATIONS);
          expect(domains).toContain(ContentDomain.NEW_SOLUTIONS);
          expect(domains).toContain(ContentDomain.CONTINUOUS_IMPROVEMENT);
          expect(domains).toContain(ContentDomain.MIGRATION_MODERNIZATION);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 20: Results include domain breakdown** - should have correct structure for each domain performance", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 6.4
          const result = calculateQuizResult(session);

          for (const domainPerf of result.domainPerformance) {
            expect(domainPerf.domain).toBeDefined();
            expect(domainPerf.totalQuestions).toBeDefined();
            expect(domainPerf.correctAnswers).toBeDefined();
            expect(domainPerf.percentage).toBeDefined();

            expect(typeof domainPerf.totalQuestions).toBe("number");
            expect(typeof domainPerf.correctAnswers).toBe("number");
            expect(typeof domainPerf.percentage).toBe("number");

            expect(domainPerf.totalQuestions).toBeGreaterThanOrEqual(0);
            expect(domainPerf.correctAnswers).toBeGreaterThanOrEqual(0);
            expect(domainPerf.correctAnswers).toBeLessThanOrEqual(domainPerf.totalQuestions);
            expect(domainPerf.percentage).toBeGreaterThanOrEqual(0);
            expect(domainPerf.percentage).toBeLessThanOrEqual(100);
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 20: Results include domain breakdown** - should calculate domain percentages correctly", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 6.4
          const result = calculateQuizResult(session);

          for (const domainPerf of result.domainPerformance) {
            if (domainPerf.totalQuestions === 0) {
              expect(domainPerf.percentage).toBe(0);
            } else {
              const expectedPercentage =
                (domainPerf.correctAnswers / domainPerf.totalQuestions) * 100;
              expect(domainPerf.percentage).toBe(expectedPercentage);
            }
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 20: Results include domain breakdown** - should sum domain questions to total questions", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 6.4
          const result = calculateQuizResult(session);

          const totalDomainQuestions = result.domainPerformance.reduce(
            (sum, dp) => sum + dp.totalQuestions,
            0
          );

          expect(totalDomainQuestions).toBe(20);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 20: Results include domain breakdown** - should sum domain correct answers to total correct", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Validates: Requirements 6.4
          const result = calculateQuizResult(session);

          const totalDomainCorrect = result.domainPerformance.reduce(
            (sum, dp) => sum + dp.correctAnswers,
            0
          );

          expect(totalDomainCorrect).toBe(result.correctAnswers);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle 0% score correctly", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Create a session with all incorrect answers
          const allIncorrectSession: QuizSession = {
            ...session,
            answers: session.answers.map((a) => ({ ...a, isCorrect: false })),
          };

          const result = calculateQuizResult(allIncorrectSession);

          expect(result.correctAnswers).toBe(0);
          expect(result.percentageScore).toBe(0);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("should handle 100% score correctly", () => {
      fc.assert(
        fc.property(quizSessionWithAnswersArbitrary, (session) => {
          // Create a session with all correct answers
          const allCorrectSession: QuizSession = {
            ...session,
            answers: session.answers.map((a) => ({ ...a, isCorrect: true })),
          };

          const result = calculateQuizResult(allCorrectSession);

          expect(result.correctAnswers).toBe(20);
          expect(result.percentageScore).toBe(100);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
