/**
 * Property-Based Tests for Data Model Validation
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness properties for question data models
 * using fast-check for property-based testing with 100+ iterations.
 */

import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { questionBank } from "@/lib/question-bank";
import { ContentDomain, isContentDomain, isQuestion } from "@/lib/types";

/**
 * Arbitrary generator for questions from the actual question bank
 * This ensures we test real questions that will be used in production
 */
const questionArbitrary = fc.constantFrom(...questionBank);

describe("Data Model Validation - Property-Based Tests", () => {
  describe("Property 5: Questions have required structure", () => {
    it("**Feature: sap-obake-quiz, Property 5: Questions have required structure** - should validate that all questions have exactly 4 choices", () => {
      // This test will initially fail because we don't have question data yet
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 2.1
          expect(question.choices).toHaveLength(4);
          expect(question.choices.every((c) => c.id && c.text)).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 5: Questions have required structure** - should validate that all questions have non-empty text", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 2.1
          expect(question.text).toBeTruthy();
          expect(question.text.length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 5: Questions have required structure** - should validate that all questions have a valid correct choice ID", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 2.1
          expect(question.correctChoiceId).toBeTruthy();
          expect(typeof question.correctChoiceId).toBe("string");
          // The correct choice ID should reference one of the choices
          const choiceIds = question.choices.map((c) => c.id);
          expect(choiceIds).toContain(question.correctChoiceId);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 5: Questions have required structure** - should validate question structure with type guard", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 2.1
          // All questions from the question bank should pass the type guard
          expect(isQuestion(question)).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 17: All questions have valid domain tags", () => {
    it("**Feature: sap-obake-quiz, Property 17: All questions have valid domain tags** - should validate that all questions have a valid ContentDomain", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 6.1
          expect(isContentDomain(question.domain)).toBe(true);
          expect(Object.values(ContentDomain)).toContain(question.domain);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 17: All questions have valid domain tags** - should validate that domain is one of the four valid domains", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 6.1
          const validDomains = [
            ContentDomain.COMPLEX_ORGANIZATIONS,
            ContentDomain.NEW_SOLUTIONS,
            ContentDomain.CONTINUOUS_IMPROVEMENT,
            ContentDomain.MIGRATION_MODERNIZATION,
          ];
          expect(validDomains).toContain(question.domain);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 31: All questions have explanations", () => {
    it("**Feature: sap-obake-quiz, Property 31: All questions have explanations** - should validate that all questions have non-empty explanations", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 10.3
          expect(question.explanation).toBeTruthy();
          expect(question.explanation.length).toBeGreaterThan(0);
          expect(typeof question.explanation).toBe("string");
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 31: All questions have explanations** - should validate that explanations are meaningful (not just whitespace)", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          // Validates: Requirements 10.3
          expect(question.explanation.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
