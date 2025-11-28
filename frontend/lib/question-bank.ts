/**
 * Question Bank Module
 *
 * This module has been refactored to support i18n.
 * Questions are now loaded from locale-specific JSON files.
 *
 * @deprecated Use question-loader.ts for loading questions
 */

import type { Locale } from "@/i18n";
import { loadQuestions } from "./question-loader";
import type { Question } from "./types";

/**
 * Get all questions from the question bank
 *
 * @deprecated Use loadQuestions(locale) from question-loader.ts instead
 * This function is kept for backward compatibility only.
 *
 * @param locale - The locale to load questions for (defaults to 'ja')
 * @returns Promise resolving to array of questions
 */
export async function getAllQuestions(locale: Locale = "ja"): Promise<Question[]> {
  console.warn(
    "getAllQuestions() is deprecated. Use loadQuestions(locale) from question-loader.ts instead."
  );
  return loadQuestions(locale);
}

/**
 * Validate question bank structure
 *
 * @param questions - Array of questions to validate
 * @returns Object with isValid boolean and array of error messages
 */
export function validateQuestionBank(questions: Question[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  questions.forEach((question, index) => {
    // Check required fields
    if (!question.id) errors.push(`Question ${index}: Missing id`);
    if (!question.text || question.text.trim() === "")
      errors.push(`Question ${index}: Missing or empty text`);
    if (!question.explanation || question.explanation.trim() === "")
      errors.push(`Question ${index}: Missing or empty explanation`);

    // Check choices
    if (!question.choices || question.choices.length !== 4) {
      errors.push(`Question ${index}: Must have exactly 4 choices`);
    } else {
      // Check each choice
      question.choices.forEach((choice, choiceIndex) => {
        if (!choice.id) {
          errors.push(`Question ${index}, Choice ${choiceIndex}: Missing id`);
        }
        if (!choice.text || choice.text.trim() === "") {
          errors.push(`Question ${index}, Choice ${choiceIndex}: Missing or empty text`);
        }
      });
    }

    // Check correct choice ID exists
    if (question.choices) {
      const choiceIds = question.choices.map((c) => c.id);
      if (!choiceIds.includes(question.correctChoiceId)) {
        errors.push(`Question ${index}: correctChoiceId not found in choices`);
      }
    }

    // Check domain
    if (!question.domain) {
      errors.push(`Question ${index}: Missing domain`);
    }

    // Check difficulty
    if (!question.difficulty || !["medium", "hard"].includes(question.difficulty)) {
      errors.push(`Question ${index}: Invalid difficulty (must be 'medium' or 'hard')`);
    }

    // Check tags
    if (!question.tags || !Array.isArray(question.tags) || question.tags.length === 0) {
      errors.push(`Question ${index}: Missing or empty tags array`);
    }
  });

  // Log errors if validation fails
  if (errors.length > 0) {
    console.error("Question validation failed:", errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
