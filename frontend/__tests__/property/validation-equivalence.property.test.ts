/**
 * Property-Based Tests for Validation Equivalence
 * 
 * **Feature: code-refactoring, Property 3: Validation behavior equivalence**
 * **Validates: Requirements 2.2**
 * 
 * Tests that the unified validation functions behave consistently
 * across a wide range of randomly generated question objects.
 */

import { isValidQuestion, validateQuestion, validateQuestions } from "@/lib/question-loader";
import { ContentDomain } from "@/lib/types";
import * as fc from "fast-check";
import { describe, it } from "vitest";

// Arbitrary for generating valid Choice objects
const validChoiceArbitrary = fc.record({
  id: fc.constantFrom("a", "b", "c", "d"),
  text: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
});

// Arbitrary for generating valid Question objects
const validQuestionArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  domain: fc.constantFrom(
    ContentDomain.COMPLEX_ORGANIZATIONS,
    ContentDomain.NEW_SOLUTIONS,
    ContentDomain.CONTINUOUS_IMPROVEMENT,
    ContentDomain.MIGRATION_MODERNIZATION
  ),
  text: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  choices: fc.tuple(
    validChoiceArbitrary,
    validChoiceArbitrary,
    validChoiceArbitrary,
    validChoiceArbitrary
  ).map(choices => [
    { ...choices[0], id: "a" },
    { ...choices[1], id: "b" },
    { ...choices[2], id: "c" },
    { ...choices[3], id: "d" },
  ]),
  correctChoiceId: fc.constantFrom("a", "b", "c", "d"),
  explanation: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
  difficulty: fc.constantFrom("medium" as const, "hard" as const),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
});

// Arbitrary for generating potentially invalid Question objects
const questionArbitrary = fc.record({
  id: fc.string({ maxLength: 50 }),
  domain: fc.oneof(
    fc.constantFrom(
      ContentDomain.COMPLEX_ORGANIZATIONS,
      ContentDomain.NEW_SOLUTIONS,
      ContentDomain.CONTINUOUS_IMPROVEMENT,
      ContentDomain.MIGRATION_MODERNIZATION
    ),
    fc.constant(undefined as any),
    fc.constant(null as any)
  ),
  text: fc.string({ maxLength: 500 }),
  choices: fc.oneof(
    fc.array(
      fc.record({
        id: fc.string({ maxLength: 10 }),
        text: fc.string({ maxLength: 200 }),
      }),
      { minLength: 0, maxLength: 6 }
    ),
    fc.constant(undefined as any),
    fc.constant(null as any)
  ),
  correctChoiceId: fc.string({ maxLength: 10 }),
  explanation: fc.string({ maxLength: 1000 }),
  difficulty: fc.oneof(
    fc.constantFrom("medium" as const, "hard" as const),
    fc.constant("easy" as any),
    fc.constant(undefined as any),
    fc.constant(null as any)
  ),
  tags: fc.oneof(
    fc.array(fc.string({ maxLength: 50 }), { minLength: 0, maxLength: 10 }),
    fc.constant(undefined as any),
    fc.constant(null as any)
  ),
});

describe("Validation Equivalence Property Tests", () => {
  describe("Property 3: Validation behavior equivalence", () => {
    it("validateQuestion and isValidQuestion should agree on validity", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          const detailedResult = validateQuestion(question);
          const quickResult = isValidQuestion(question);
          
          // The two validation methods should agree on validity
          return detailedResult.isValid === quickResult;
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should return isValid=true with no errors for valid questions", () => {
      fc.assert(
        fc.property(validQuestionArbitrary, (question) => {
          const result = validateQuestion(question);
          
          // Valid questions should have isValid=true and no errors
          return result.isValid === true && result.errors.length === 0;
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should return isValid=false with errors for invalid questions", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          const result = validateQuestion(question);
          
          // If isValid is false, there must be at least one error
          // If isValid is true, there must be no errors
          return result.isValid ? result.errors.length === 0 : result.errors.length > 0;
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestions should validate each question independently", () => {
      fc.assert(
        fc.property(fc.array(questionArbitrary, { minLength: 1, maxLength: 10 }), (questions) => {
          const batchResult = validateQuestions(questions);
          const individualResults = questions.map((q, i) => validateQuestion(q, i));
          
          // Batch validation should aggregate all individual errors
          const allIndividualErrors = individualResults.flatMap(r => r.errors);
          const allValid = individualResults.every(r => r.isValid);
          
          return (
            batchResult.isValid === allValid &&
            batchResult.errors.length === allIndividualErrors.length
          );
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestions should be consistent with multiple calls", () => {
      fc.assert(
        fc.property(fc.array(questionArbitrary, { minLength: 0, maxLength: 5 }), (questions) => {
          const result1 = validateQuestions(questions);
          const result2 = validateQuestions(questions);
          
          // Multiple calls with same input should produce same result
          return (
            result1.isValid === result2.isValid &&
            result1.errors.length === result2.errors.length
          );
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect missing or empty id", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.constantFrom("", undefined as any, null as any),
          (question, invalidId) => {
            const invalidQuestion = { ...question, id: invalidId };
            const result = validateQuestion(invalidQuestion);
            
            // The validation checks for falsy id (empty string, undefined, null)
            // but not for whitespace-only strings
            return !result.isValid && result.errors.some(e => e.includes("Missing id"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect missing or empty text", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.constantFrom("", "   ", "  \n  "),
          (question, invalidText) => {
            const invalidQuestion = { ...question, text: invalidText };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => e.includes("Missing or empty text"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect missing or empty explanation", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.constantFrom("", "   ", "  \n  "),
          (question, invalidExplanation) => {
            const invalidQuestion = { ...question, explanation: invalidExplanation };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => e.includes("Missing or empty explanation"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect wrong number of choices", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.array(validChoiceArbitrary, { minLength: 0, maxLength: 6 }).filter(arr => arr.length !== 4),
          (question, invalidChoices) => {
            const invalidQuestion = { ...question, choices: invalidChoices };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => e.includes("Must have exactly 4 choices"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect invalid correctChoiceId", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => !["a", "b", "c", "d"].includes(s)),
          (question, invalidChoiceId) => {
            const invalidQuestion = { ...question, correctChoiceId: invalidChoiceId };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => e.includes("correctChoiceId not found in choices"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect invalid difficulty", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.constantFrom("easy" as any, "trivial" as any, "" as any, undefined as any),
          (question, invalidDifficulty) => {
            const invalidQuestion = { ...question, difficulty: invalidDifficulty };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => e.includes("Invalid difficulty"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect missing or empty tags", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.constantFrom([] as string[], undefined as any, null as any),
          (question, invalidTags) => {
            const invalidQuestion = { ...question, tags: invalidTags };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => e.includes("Missing or empty tags"));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should use custom index in error messages", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.integer({ min: 0, max: 100 }),
          (question, index) => {
            const invalidQuestion = { ...question, id: "" };
            const result = validateQuestion(invalidQuestion, index);
            
            return result.errors.some(e => e.includes(`Question ${index}:`));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestions with empty array should return valid result", () => {
      fc.assert(
        fc.property(fc.constant([]), (emptyArray) => {
          const result = validateQuestions(emptyArray);
          
          return result.isValid === true && result.errors.length === 0;
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestions should accumulate errors from all questions", () => {
      fc.assert(
        fc.property(
          fc.array(questionArbitrary, { minLength: 1, maxLength: 5 }),
          (questions) => {
            const batchResult = validateQuestions(questions);
            const individualResults = questions.map((q, i) => validateQuestion(q, i));
            
            // Count total errors from individual validations
            const totalIndividualErrors = individualResults.reduce(
              (sum, r) => sum + r.errors.length,
              0
            );
            
            // Batch validation should have the same number of errors
            return batchResult.errors.length === totalIndividualErrors;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validation should be deterministic for the same input", () => {
      fc.assert(
        fc.property(questionArbitrary, (question) => {
          const result1 = validateQuestion(question);
          const result2 = validateQuestion(question);
          const result3 = validateQuestion(question);
          
          // All results should be identical
          return (
            result1.isValid === result2.isValid &&
            result2.isValid === result3.isValid &&
            result1.errors.length === result2.errors.length &&
            result2.errors.length === result3.errors.length
          );
        }),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect empty choice text", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          fc.constantFrom("", "   ", "  \n  "),
          (question, choiceIndex, emptyText) => {
            const invalidQuestion = {
              ...question,
              choices: question.choices.map((choice, i) =>
                i === choiceIndex ? { ...choice, text: emptyText } : choice
              ),
            };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => 
              e.includes(`Choice ${choiceIndex}:`) && e.includes("Missing or empty text")
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it("validateQuestion should detect missing choice id", () => {
      fc.assert(
        fc.property(
          validQuestionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          (question, choiceIndex) => {
            const invalidQuestion = {
              ...question,
              choices: question.choices.map((choice, i) =>
                i === choiceIndex ? { ...choice, id: "" } : choice
              ),
            };
            const result = validateQuestion(invalidQuestion);
            
            return !result.isValid && result.errors.some(e => 
              e.includes(`Choice ${choiceIndex}:`) && e.includes("Missing id")
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
