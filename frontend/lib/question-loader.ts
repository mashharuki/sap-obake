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
 * Validate question structure
 * @param question - Question to validate
 * @returns true if valid, false otherwise
 */
export function isValidQuestion(question: Question): boolean {
  return (
    typeof question.id === "string" &&
    question.id.length > 0 &&
    typeof question.domain === "string" &&
    typeof question.text === "string" &&
    question.text.trim().length > 0 &&
    Array.isArray(question.choices) &&
    question.choices.length === 4 &&
    question.choices.every(
      (choice) =>
        typeof choice.id === "string" &&
        choice.id.length > 0 &&
        typeof choice.text === "string" &&
        choice.text.trim().length > 0
    ) &&
    typeof question.correctChoiceId === "string" &&
    question.choices.some((c) => c.id === question.correctChoiceId) &&
    typeof question.explanation === "string" &&
    question.explanation.trim().length > 0
  );
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
