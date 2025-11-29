/**
 * Question Bank Loader with i18n support
 *
 * Loads questions from locale-specific JSON files
 */

import type { Locale } from "@/i18n";
import type { Question } from "./types";

interface QuestionBankData {
  version: string;
  questions: Question[];
}

/**
 * Load questions for the specified locale
 * @param locale - The locale to load questions for (ja or en)
 * @returns Promise resolving to array of questions
 */
export async function loadQuestions(locale: Locale): Promise<Question[]> {
  try {
    const response = await fetch(`/data/questions-${locale}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.statusText}`);
    }

    const data: QuestionBankData = await response.json();

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid question bank format");
    }

    return data.questions;
  } catch (error) {
    console.error(`Error loading questions for locale ${locale}:`, error);
    throw error;
  }
}

/**
 * Validate a single question structure with detailed error reporting
 * @param question - Question to validate
 * @param index - Optional index for error messages (defaults to 0)
 * @returns Object with isValid boolean and array of error messages
 */
export function validateQuestion(
  question: Question,
  index = 0
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

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

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate multiple questions (batch validation)
 * @param questions - Array of questions to validate
 * @returns Object with isValid boolean and array of error messages
 */
export function validateQuestions(questions: Question[]): {
  isValid: boolean;
  errors: string[];
} {
  const allErrors: string[] = [];

  questions.forEach((question, index) => {
    const { errors } = validateQuestion(question, index);
    allErrors.push(...errors);
  });

  // Log errors if validation fails
  if (allErrors.length > 0) {
    console.error("Question validation failed:", allErrors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Quick validation check for a single question (type guard)
 * @param question - Question to validate
 * @returns true if valid, false otherwise
 */
export function isValidQuestion(question: Question): boolean {
  const { isValid } = validateQuestion(question);
  return isValid;
}

/**
 * Get question count for a locale without loading all questions
 * @param locale - The locale to check
 * @returns Promise resolving to question count
 */
export async function getQuestionCount(locale: Locale): Promise<number> {
  try {
    const questions = await loadQuestions(locale);
    return questions.filter(isValidQuestion).length;
  } catch (error) {
    console.error(`Error getting question count for locale ${locale}:`, error);
    return 0;
  }
}
