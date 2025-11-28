/**
 * Score Calculator - Quiz Result Calculation
 *
 * This module handles the calculation of quiz results including:
 * - Overall score and percentage
 * - Domain-specific performance breakdown
 * - Time tracking
 */

import type { DomainPerformance, QuizResult, QuizSession } from "./types";
import { ContentDomain } from "./types";

/**
 * Passing score threshold for AWS SAP exam (70%)
 */
const PASSING_SCORE_THRESHOLD = 70;

/**
 * Calculate the final quiz result from a completed quiz session
 *
 * This function computes:
 * - Total correct answers
 * - Percentage score
 * - Total time taken
 * - Performance breakdown by content domain
 *
 * @param session Completed quiz session
 * @returns QuizResult with all metrics calculated
 */
export function calculateQuizResult(session: QuizSession): QuizResult {
  // Calculate total correct answers
  const correctAnswers = session.answers.filter((answer) => answer.isCorrect).length;

  // Calculate percentage score
  const totalQuestions = session.questions.length;
  const percentageScore = calculatePercentage(correctAnswers, totalQuestions);

  // Calculate total time in seconds
  const endTime = session.endTime ?? Date.now();
  const totalTimeMs = endTime - session.startTime;
  const totalTimeSeconds = Math.floor(totalTimeMs / 1000);

  // Calculate domain-specific performance
  const domainPerformance = calculateDomainPerformance(session);

  // Create the result object
  const result: QuizResult = {
    sessionId: session.id,
    totalQuestions,
    correctAnswers,
    percentageScore,
    totalTimeSeconds,
    domainPerformance,
    completedAt: endTime,
  };

  return result;
}

/**
 * Calculate performance breakdown by content domain
 *
 * For each of the 4 content domains, this function calculates:
 * - Total questions in that domain
 * - Correct answers in that domain
 * - Percentage score for that domain
 *
 * @param session Quiz session with answers
 * @returns Array of domain performance metrics
 */
function calculateDomainPerformance(session: QuizSession): DomainPerformance[] {
  // Create a question map for O(1) lookups
  const questionMap = new Map(session.questions.map((q) => [q.id, q]));

  // Initialize counters for each domain
  const domainStats = new Map<ContentDomain, { total: number; correct: number }>();

  // Initialize all domains with zero counts
  for (const domain of Object.values(ContentDomain)) {
    domainStats.set(domain, { total: 0, correct: 0 });
  }

  // Count questions per domain
  for (const question of session.questions) {
    const stats = domainStats.get(question.domain);
    if (stats) {
      stats.total += 1;
    }
  }

  // Count correct answers per domain using the question map
  for (const answer of session.answers) {
    const question = questionMap.get(answer.questionId);
    if (question && answer.isCorrect) {
      const stats = domainStats.get(question.domain);
      if (stats) {
        stats.correct += 1;
      }
    }
  }

  // Build the domain performance array
  const domainPerformance: DomainPerformance[] = [];

  for (const [domain, stats] of domainStats.entries()) {
    const percentage = calculatePercentage(stats.correct, stats.total);

    domainPerformance.push({
      domain,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      percentage,
    });
  }

  return domainPerformance;
}

/**
 * Calculate percentage score from correct answers and total questions
 *
 * @param correctAnswers Number of correct answers
 * @param totalQuestions Total number of questions
 * @returns Percentage score (0-100)
 */
export function calculatePercentage(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) {
    return 0;
  }
  return (correctAnswers / totalQuestions) * 100;
}

/**
 * Format time in seconds to a human-readable string (MM:SS)
 *
 * @param seconds Total seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Get a performance message based on the percentage score
 *
 * @param percentageScore Percentage score (0-100)
 * @returns Encouraging message based on performance
 */
export function getPerformanceMessage(percentageScore: number): string {
  if (percentageScore === 100) {
    return "Perfect score! You're ready for the AWS SAP exam! 🎉";
  }
  if (percentageScore >= 90) {
    return "Excellent work! You're well-prepared! 👻";
  }
  if (percentageScore >= 80) {
    return "Great job! Keep practicing to reach mastery! 🌟";
  }
  if (percentageScore >= 70) {
    return "Good effort! Review the areas you missed. 📚";
  }
  if (percentageScore >= 60) {
    return "You're making progress! Keep studying! 💪";
  }
  return "Keep learning! Review the explanations and try again. 🎃";
}

/**
 * Determine if a score is passing (typically 70% or higher for AWS exams)
 *
 * @param percentageScore Percentage score (0-100)
 * @returns true if passing, false otherwise
 */
export function isPassing(percentageScore: number): boolean {
  return percentageScore >= PASSING_SCORE_THRESHOLD;
}
