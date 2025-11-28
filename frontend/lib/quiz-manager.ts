/**
 * Quiz Manager - Question Selection and Quiz Session Management
 *
 * This module handles quiz initialization, question selection, and session management.
 * It implements the business logic for creating quiz sessions with proper domain distribution.
 */

import type { Locale } from "@/i18n";
import { loadQuestions } from "./question-loader";
import type { Question, QuizSession, UserAnswer } from "./types";
import { ContentDomain } from "./types";

/**
 * Error thrown when there are insufficient questions in the question bank
 */
export class InsufficientQuestionsError extends Error {
  constructor(available: number, required: number) {
    super(
      `Insufficient questions in question bank. Available: ${available}, Required: ${required}`
    );
    this.name = "InsufficientQuestionsError";
  }
}

/**
 * Error thrown when a domain has no questions available
 */
export class MissingDomainQuestionsError extends Error {
  constructor(domain: ContentDomain) {
    super(`No questions available for domain: ${domain}`);
    this.name = "MissingDomainQuestionsError";
  }
}

/**
 * Fisher-Yates shuffle algorithm for better randomization
 * More efficient and truly random compared to sort(() => Math.random() - 0.5)
 *
 * @param array Array to shuffle (modified in place)
 * @returns The shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Group questions by their content domain
 *
 * @param questions Array of questions to group
 * @returns Map of domain to questions in that domain
 */
function groupQuestionsByDomain(questions: Question[]): Map<ContentDomain, Question[]> {
  const questionsByDomain = new Map<ContentDomain, Question[]>();

  // Initialize empty arrays for all domains
  for (const domain of Object.values(ContentDomain)) {
    questionsByDomain.set(domain, []);
  }

  // Group questions by domain
  for (const question of questions) {
    const domainQuestions = questionsByDomain.get(question.domain);
    if (domainQuestions) {
      domainQuestions.push(question);
    }
  }

  return questionsByDomain;
}

/**
 * Select one random question from each available domain
 *
 * @param questionsByDomain Map of domain to questions
 * @returns Array of selected questions and set of used question IDs
 */
function selectOnePerDomain(questionsByDomain: Map<ContentDomain, Question[]>): {
  questions: Question[];
  usedIds: Set<string>;
} {
  const selectedQuestions: Question[] = [];
  const usedQuestionIds = new Set<string>();

  for (const [domain, domainQuestions] of questionsByDomain.entries()) {
    if (domainQuestions.length === 0) {
      console.warn(
        `Warning: No questions available for domain: ${domain}. Continuing with available questions.`
      );
      continue;
    }

    const randomIndex = Math.floor(Math.random() * domainQuestions.length);
    const selectedQuestion = domainQuestions[randomIndex];

    selectedQuestions.push(selectedQuestion);
    usedQuestionIds.add(selectedQuestion.id);
  }

  return { questions: selectedQuestions, usedIds: usedQuestionIds };
}

/**
 * Select 20 random questions from the question bank ensuring all 4 domains are represented
 *
 * Algorithm:
 * 1. Validate sufficient questions exist
 * 2. Group questions by domain
 * 3. Select 1 question from each available domain
 * 4. Randomly select remaining questions to reach 20 total
 * 5. Shuffle the final selection using Fisher-Yates algorithm
 *
 * @param locale - The locale to load questions for
 * @returns Promise resolving to array of 20 selected questions
 * @throws InsufficientQuestionsError if question bank has fewer than 20 questions
 */
export async function selectQuizQuestions(locale: Locale): Promise<Question[]> {
  const allQuestions = await loadQuestions(locale);
  const REQUIRED_QUESTION_COUNT = 20;

  // Validate we have enough questions
  if (allQuestions.length < REQUIRED_QUESTION_COUNT) {
    throw new InsufficientQuestionsError(allQuestions.length, REQUIRED_QUESTION_COUNT);
  }

  // Group questions by domain
  const questionsByDomain = groupQuestionsByDomain(allQuestions);

  // Select one question from each available domain
  const { questions: selectedQuestions, usedIds: usedQuestionIds } =
    selectOnePerDomain(questionsByDomain);

  if (selectedQuestions.length === 0) {
    throw new Error("No questions available in any domain");
  }

  // Select remaining questions to reach 20 total
  const remainingCount = REQUIRED_QUESTION_COUNT - selectedQuestions.length;
  const availableQuestions = allQuestions.filter((q) => !usedQuestionIds.has(q.id));

  // Shuffle and select remaining questions
  const shuffledAvailable = shuffleArray([...availableQuestions]);
  const remainingQuestions = shuffledAvailable.slice(0, remainingCount);

  selectedQuestions.push(...remainingQuestions);

  // Shuffle the final selection for random order
  return shuffleArray(selectedQuestions);
}

/**
 * Initialize a new quiz session with 20 randomly selected questions
 *
 * Creates a new quiz session with:
 * - Unique session ID
 * - 20 randomly selected questions (all 4 domains represented)
 * - Initial state (no answers, not complete)
 * - Start time set to current timestamp
 *
 * @param locale - The locale to load questions for
 * @returns Promise resolving to a new QuizSession object
 * @throws InsufficientQuestionsError if question bank has fewer than 20 questions
 */
export async function initializeQuizSession(locale: Locale): Promise<QuizSession> {
  const questions = await selectQuizQuestions(locale);

  // Generate a unique session ID
  const sessionId = `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const session: QuizSession = {
    id: sessionId,
    questions,
    currentQuestionIndex: 0,
    answers: [],
    startTime: Date.now(),
    isComplete: false,
  };

  return session;
}

/**
 * Get statistics about domain distribution in a set of questions
 *
 * @param questions Array of questions to analyze
 * @returns Map of domain to question count
 */
export function getDomainDistribution(questions: Question[]): Map<ContentDomain, number> {
  const distribution = new Map<ContentDomain, number>();

  for (const domain of Object.values(ContentDomain)) {
    distribution.set(domain, 0);
  }

  for (const question of questions) {
    const count = distribution.get(question.domain) || 0;
    distribution.set(question.domain, count + 1);
  }

  return distribution;
}

/**
 * Validate that a quiz session has proper domain representation
 *
 * @param session Quiz session to validate
 * @returns true if all domains are represented, false otherwise
 */
export function validateDomainRepresentation(session: QuizSession): boolean {
  const distribution = getDomainDistribution(session.questions);

  // Check that all 4 domains are present
  for (const domain of Object.values(ContentDomain)) {
    const count = distribution.get(domain) || 0;
    if (count === 0) {
      return false;
    }
  }

  return true;
}

/**
 * Record a user's answer to a question in the quiz session
 *
 * Creates a new quiz session with the answer recorded. This function is pure
 * and does not mutate the original session.
 *
 * If this is the last question, the session will be marked as complete.
 *
 * @param session Current quiz session
 * @param questionId ID of the question being answered
 * @param selectedChoiceId ID of the choice selected by the user
 * @returns New quiz session with the answer recorded
 */
export function recordAnswer(
  session: QuizSession,
  questionId: string,
  selectedChoiceId: string
): QuizSession {
  // Find the question
  const question = session.questions.find((q) => q.id === questionId);

  if (!question) {
    throw new Error(`Question with ID ${questionId} not found in session`);
  }

  // Check if the answer is correct
  const isCorrect = question.correctChoiceId === selectedChoiceId;

  // Create the user answer
  const userAnswer: UserAnswer = {
    questionId,
    selectedChoiceId,
    isCorrect,
    answeredAt: Date.now(),
  };

  // Create new answers array
  const newAnswers = [...session.answers, userAnswer];

  // Check if this was the last question
  const isComplete = newAnswers.length >= session.questions.length;

  // Return new session with the answer added
  return {
    ...session,
    answers: newAnswers,
    isComplete,
    endTime: isComplete ? Date.now() : session.endTime,
  };
}

/**
 * Move to the next question in the quiz session
 *
 * @param session Current quiz session
 * @returns New quiz session with currentQuestionIndex incremented
 */
export function moveToNextQuestion(session: QuizSession): QuizSession {
  const nextIndex = session.currentQuestionIndex + 1;

  // Check if we've reached the end
  if (nextIndex >= session.questions.length) {
    return {
      ...session,
      currentQuestionIndex: nextIndex,
      isComplete: true,
      endTime: Date.now(),
    };
  }

  return {
    ...session,
    currentQuestionIndex: nextIndex,
  };
}

/**
 * Check if the quiz session is complete
 *
 * A quiz is complete when all questions have been answered
 *
 * @param session Quiz session to check
 * @returns true if all questions have been answered
 */
export function isQuizComplete(session: QuizSession): boolean {
  return session.answers.length >= session.questions.length;
}

/**
 * Get the current question in the quiz session
 *
 * @param session Quiz session
 * @returns The current question, or undefined if the quiz is complete
 */
export function getCurrentQuestion(session: QuizSession): Question | undefined {
  if (session.currentQuestionIndex >= session.questions.length) {
    return undefined;
  }

  return session.questions[session.currentQuestionIndex];
}

/**
 * Get the number of correct answers in the quiz session
 *
 * @param session Quiz session
 * @returns Number of correct answers
 */
export function getCorrectAnswerCount(session: QuizSession): number {
  return session.answers.filter((answer) => answer.isCorrect).length;
}

/**
 * Complete the quiz session
 *
 * Marks the quiz as complete and sets the end time
 *
 * @param session Quiz session to complete
 * @returns New quiz session marked as complete
 */
export function completeQuizSession(session: QuizSession): QuizSession {
  return {
    ...session,
    isComplete: true,
    endTime: Date.now(),
  };
}
