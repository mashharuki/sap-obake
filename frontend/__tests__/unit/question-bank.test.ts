/**
 * Unit tests for question bank validation
 */

import { describe, expect, it } from "vitest";
import { getQuestionsByDomain, questionBank, validateQuestionBank } from "@/lib/question-bank";
import { ContentDomain } from "@/lib/types";

describe("Question Bank", () => {
  it("should have at least 40 questions", () => {
    expect(questionBank.length).toBeGreaterThanOrEqual(40);
  });

  it("should pass validation", () => {
    const result = validateQuestionBank();
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should have questions from all 4 domains", () => {
    const domains = Object.values(ContentDomain);
    domains.forEach((domain) => {
      const domainQuestions = getQuestionsByDomain(domain);
      expect(domainQuestions.length).toBeGreaterThan(0);
    });
  });

  it("should have balanced distribution across domains", () => {
    const domains = Object.values(ContentDomain);
    const counts = domains.map((domain) => getQuestionsByDomain(domain).length);

    // Each domain should have at least 8 questions (20% of 40)
    counts.forEach((count) => {
      expect(count).toBeGreaterThanOrEqual(8);
    });
  });

  it("should have all questions with Professional-level difficulty", () => {
    questionBank.forEach((question) => {
      expect(["medium", "hard"]).toContain(question.difficulty);
    });
  });

  it("should have all questions with AWS service tags", () => {
    questionBank.forEach((question) => {
      expect(question.tags.length).toBeGreaterThan(0);
    });
  });

  it("should have all questions with detailed explanations", () => {
    questionBank.forEach((question) => {
      // Explanations should be substantial (at least 100 characters)
      expect(question.explanation.length).toBeGreaterThan(100);
    });
  });

  it("should have all questions with AWS documentation references", () => {
    questionBank.forEach((question) => {
      // Check if explanation contains a reference URL
      expect(
        question.explanation.includes("https://docs.aws.amazon.com") ||
          question.explanation.includes("Reference:")
      ).toBe(true);
    });
  });
});
