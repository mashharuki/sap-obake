/**
 * Question Loader Unit Tests (i18n)
 *
 * Tests for locale-specific question loading
 */

import {
    getQuestionCount,
    isValidQuestion,
    loadQuestions,
    validateQuestion,
    validateQuestions,
} from "@/lib/question-loader";
import type { Question } from "@/lib/types";
import { ContentDomain } from "@/lib/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch
global.fetch = vi.fn();

describe("Question Loader - i18n Support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadQuestions", () => {
    it("should load Japanese questions", async () => {
      const mockQuestions = {
        version: "1.0.0",
        questions: [
          {
            id: "q001",
            domain: ContentDomain.COMPLEX_ORGANIZATIONS,
            text: "日本語の問題文",
            choices: [
              { id: "a", text: "選択肢A" },
              { id: "b", text: "選択肢B" },
              { id: "c", text: "選択肢C" },
              { id: "d", text: "選択肢D" },
            ],
            correctChoiceId: "a",
            explanation: "日本語の解説",
            difficulty: "medium" as const,
            tags: ["test"],
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestions,
      });

      const questions = await loadQuestions("ja");

      expect(global.fetch).toHaveBeenCalledWith("/data/questions-ja.json");
      expect(questions).toHaveLength(1);
      expect(questions[0].text).toBe("日本語の問題文");
    });

    it("should load English questions", async () => {
      const mockQuestions = {
        version: "1.0.0",
        questions: [
          {
            id: "q001",
            domain: ContentDomain.COMPLEX_ORGANIZATIONS,
            text: "English question text",
            choices: [
              { id: "a", text: "Choice A" },
              { id: "b", text: "Choice B" },
              { id: "c", text: "Choice C" },
              { id: "d", text: "Choice D" },
            ],
            correctChoiceId: "a",
            explanation: "English explanation",
            difficulty: "medium" as const,
            tags: ["test"],
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestions,
      });

      const questions = await loadQuestions("en");

      expect(global.fetch).toHaveBeenCalledWith("/data/questions-en.json");
      expect(questions).toHaveLength(1);
      expect(questions[0].text).toBe("English question text");
    });

    it("should throw error when fetch fails", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      });

      await expect(loadQuestions("ja")).rejects.toThrow("Failed to load questions");
    });

    it("should throw error when JSON is invalid", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: "data" }),
      });

      await expect(loadQuestions("ja")).rejects.toThrow("Invalid question bank format");
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      await expect(loadQuestions("ja")).rejects.toThrow("Network error");
    });
  });

  describe("isValidQuestion", () => {
    const validQuestion: Question = {
      id: "q001",
      domain: ContentDomain.COMPLEX_ORGANIZATIONS,
      text: "Valid question text",
      choices: [
        { id: "a", text: "Choice A" },
        { id: "b", text: "Choice B" },
        { id: "c", text: "Choice C" },
        { id: "d", text: "Choice D" },
      ],
      correctChoiceId: "a",
      explanation: "Valid explanation",
      difficulty: "medium",
      tags: ["test"],
    };

    it("should validate a correct question", () => {
      expect(isValidQuestion(validQuestion)).toBe(true);
    });

    it("should reject question with empty id", () => {
      const invalid = { ...validQuestion, id: "" };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with empty text", () => {
      const invalid = { ...validQuestion, text: "" };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with whitespace-only text", () => {
      const invalid = { ...validQuestion, text: "   " };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with wrong number of choices", () => {
      const invalid = {
        ...validQuestion,
        choices: [
          { id: "a", text: "Choice A" },
          { id: "b", text: "Choice B" },
        ],
      };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with empty choice text", () => {
      const invalid = {
        ...validQuestion,
        choices: [
          { id: "a", text: "" },
          { id: "b", text: "Choice B" },
          { id: "c", text: "Choice C" },
          { id: "d", text: "Choice D" },
        ],
      };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with invalid correctChoiceId", () => {
      const invalid = { ...validQuestion, correctChoiceId: "invalid" };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with empty explanation", () => {
      const invalid = { ...validQuestion, explanation: "" };
      expect(isValidQuestion(invalid)).toBe(false);
    });

    it("should reject question with whitespace-only explanation", () => {
      const invalid = { ...validQuestion, explanation: "   " };
      expect(isValidQuestion(invalid)).toBe(false);
    });
  });

  describe("getQuestionCount", () => {
    it("should return count of valid questions", async () => {
      const mockQuestions = {
        version: "1.0.0",
        questions: [
          {
            id: "q001",
            domain: ContentDomain.COMPLEX_ORGANIZATIONS,
            text: "Question 1",
            choices: [
              { id: "a", text: "A" },
              { id: "b", text: "B" },
              { id: "c", text: "C" },
              { id: "d", text: "D" },
            ],
            correctChoiceId: "a",
            explanation: "Explanation",
            difficulty: "medium" as const,
            tags: ["test"],
          },
          {
            id: "q002",
            domain: ContentDomain.NEW_SOLUTIONS,
            text: "Question 2",
            choices: [
              { id: "a", text: "A" },
              { id: "b", text: "B" },
              { id: "c", text: "C" },
              { id: "d", text: "D" },
            ],
            correctChoiceId: "b",
            explanation: "Explanation",
            difficulty: "hard" as const,
            tags: ["test"],
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestions,
      });

      const count = await getQuestionCount("ja");
      expect(count).toBe(2);
    });

    it("should filter out invalid questions", async () => {
      const mockQuestions = {
        version: "1.0.0",
        questions: [
          {
            id: "q001",
            domain: ContentDomain.COMPLEX_ORGANIZATIONS,
            text: "Valid question",
            choices: [
              { id: "a", text: "A" },
              { id: "b", text: "B" },
              { id: "c", text: "C" },
              { id: "d", text: "D" },
            ],
            correctChoiceId: "a",
            explanation: "Explanation",
            difficulty: "medium" as const,
            tags: ["test"],
          },
          {
            id: "q002",
            domain: ContentDomain.NEW_SOLUTIONS,
            text: "", // Invalid: empty text
            choices: [
              { id: "a", text: "A" },
              { id: "b", text: "B" },
            ], // Invalid: only 2 choices
            correctChoiceId: "b",
            explanation: "Explanation",
            difficulty: "hard" as const,
            tags: ["test"],
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuestions,
      });

      const count = await getQuestionCount("ja");
      expect(count).toBe(1); // Only the valid question
    });

    it("should return 0 on error", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const count = await getQuestionCount("ja");
      expect(count).toBe(0);
    });
  });

  describe("Question structure validation", () => {
    it("should validate questions have all required fields", () => {
      const question: Question = {
        id: "test",
        domain: ContentDomain.COMPLEX_ORGANIZATIONS,
        text: "Test question",
        choices: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
          { id: "c", text: "C" },
          { id: "d", text: "D" },
        ],
        correctChoiceId: "a",
        explanation: "Test explanation",
        difficulty: "medium",
        tags: ["test"],
      };

      expect(isValidQuestion(question)).toBe(true);
      expect(question).toHaveProperty("id");
      expect(question).toHaveProperty("domain");
      expect(question).toHaveProperty("text");
      expect(question).toHaveProperty("choices");
      expect(question).toHaveProperty("correctChoiceId");
      expect(question).toHaveProperty("explanation");
      expect(question).toHaveProperty("difficulty");
      expect(question).toHaveProperty("tags");
    });
  });

  describe("validateQuestion", () => {
    const validQuestion: Question = {
      id: "q001",
      domain: ContentDomain.COMPLEX_ORGANIZATIONS,
      text: "Valid question text",
      choices: [
        { id: "a", text: "Choice A" },
        { id: "b", text: "Choice B" },
        { id: "c", text: "Choice C" },
        { id: "d", text: "Choice D" },
      ],
      correctChoiceId: "a",
      explanation: "Valid explanation",
      difficulty: "medium",
      tags: ["test"],
    };

    it("should return valid result for correct question", () => {
      const result = validateQuestion(validQuestion);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing id", () => {
      const invalid = { ...validQuestion, id: "" };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing id");
    });

    it("should detect empty text", () => {
      const invalid = { ...validQuestion, text: "" };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing or empty text");
    });

    it("should detect whitespace-only text", () => {
      const invalid = { ...validQuestion, text: "   " };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing or empty text");
    });

    it("should detect empty explanation", () => {
      const invalid = { ...validQuestion, explanation: "" };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing or empty explanation");
    });

    it("should detect whitespace-only explanation", () => {
      const invalid = { ...validQuestion, explanation: "   " };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing or empty explanation");
    });

    it("should detect wrong number of choices", () => {
      const invalid = {
        ...validQuestion,
        choices: [
          { id: "a", text: "Choice A" },
          { id: "b", text: "Choice B" },
        ],
      };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Must have exactly 4 choices");
    });

    it("should detect missing choice id", () => {
      const invalid = {
        ...validQuestion,
        choices: [
          { id: "", text: "Choice A" },
          { id: "b", text: "Choice B" },
          { id: "c", text: "Choice C" },
          { id: "d", text: "Choice D" },
        ],
      };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0, Choice 0: Missing id");
    });

    it("should detect empty choice text", () => {
      const invalid = {
        ...validQuestion,
        choices: [
          { id: "a", text: "" },
          { id: "b", text: "Choice B" },
          { id: "c", text: "Choice C" },
          { id: "d", text: "Choice D" },
        ],
      };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0, Choice 0: Missing or empty text");
    });

    it("should detect whitespace-only choice text", () => {
      const invalid = {
        ...validQuestion,
        choices: [
          { id: "a", text: "   " },
          { id: "b", text: "Choice B" },
          { id: "c", text: "Choice C" },
          { id: "d", text: "Choice D" },
        ],
      };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0, Choice 0: Missing or empty text");
    });

    it("should detect invalid correctChoiceId", () => {
      const invalid = { ...validQuestion, correctChoiceId: "invalid" };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: correctChoiceId not found in choices");
    });

    it("should detect missing domain", () => {
      const invalid = { ...validQuestion, domain: undefined as any };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing domain");
    });

    it("should detect invalid difficulty", () => {
      const invalid = { ...validQuestion, difficulty: "easy" as any };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Invalid difficulty (must be 'medium' or 'hard')");
    });

    it("should detect missing tags", () => {
      const invalid = { ...validQuestion, tags: undefined as any };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing or empty tags array");
    });

    it("should detect empty tags array", () => {
      const invalid = { ...validQuestion, tags: [] };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing or empty tags array");
    });

    it("should use custom index in error messages", () => {
      const invalid = { ...validQuestion, id: "" };
      const result = validateQuestion(invalid, 5);
      expect(result.errors).toContain("Question 5: Missing id");
    });

    it("should detect multiple errors", () => {
      const invalid = {
        ...validQuestion,
        id: "",
        text: "",
        explanation: "",
        choices: [{ id: "a", text: "A" }],
      };
      const result = validateQuestion(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain("Question 0: Missing id");
      expect(result.errors).toContain("Question 0: Missing or empty text");
      expect(result.errors).toContain("Question 0: Missing or empty explanation");
      expect(result.errors).toContain("Question 0: Must have exactly 4 choices");
    });
  });

  describe("validateQuestions", () => {
    const validQuestion1: Question = {
      id: "q001",
      domain: ContentDomain.COMPLEX_ORGANIZATIONS,
      text: "Question 1",
      choices: [
        { id: "a", text: "Choice A" },
        { id: "b", text: "Choice B" },
        { id: "c", text: "Choice C" },
        { id: "d", text: "Choice D" },
      ],
      correctChoiceId: "a",
      explanation: "Explanation 1",
      difficulty: "medium",
      tags: ["test"],
    };

    const validQuestion2: Question = {
      id: "q002",
      domain: ContentDomain.NEW_SOLUTIONS,
      text: "Question 2",
      choices: [
        { id: "a", text: "Choice A" },
        { id: "b", text: "Choice B" },
        { id: "c", text: "Choice C" },
        { id: "d", text: "Choice D" },
      ],
      correctChoiceId: "b",
      explanation: "Explanation 2",
      difficulty: "hard",
      tags: ["test"],
    };

    it("should validate all valid questions", () => {
      const result = validateQuestions([validQuestion1, validQuestion2]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect errors in first question", () => {
      const invalid = { ...validQuestion1, id: "" };
      const result = validateQuestions([invalid, validQuestion2]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 0: Missing id");
    });

    it("should detect errors in second question", () => {
      const invalid = { ...validQuestion2, text: "" };
      const result = validateQuestions([validQuestion1, invalid]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 1: Missing or empty text");
    });

    it("should detect errors in multiple questions", () => {
      const invalid1 = { ...validQuestion1, id: "" };
      const invalid2 = { ...validQuestion2, text: "" };
      const result = validateQuestions([invalid1, invalid2]);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors).toContain("Question 0: Missing id");
      expect(result.errors).toContain("Question 1: Missing or empty text");
    });

    it("should handle empty array", () => {
      const result = validateQuestions([]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate mixed valid and invalid questions", () => {
      const invalid = {
        ...validQuestion1,
        choices: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
        ],
      };
      const result = validateQuestions([validQuestion1, invalid, validQuestion2]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Question 1: Must have exactly 4 choices");
    });

    it("should accumulate all errors from all questions", () => {
      const invalid1 = {
        ...validQuestion1,
        id: "",
        text: "",
      };
      const invalid2 = {
        ...validQuestion2,
        explanation: "",
        difficulty: "easy" as any,
      };
      const result = validateQuestions([invalid1, invalid2]);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});
