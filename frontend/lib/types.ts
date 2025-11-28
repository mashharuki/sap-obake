/**
 * SAP Obake - Data Models and Type Definitions
 * AWS Solutions Architect Professional Quiz Application
 */

/**
 * Content domains for AWS SAP-C02 exam
 */
export enum ContentDomain {
  COMPLEX_ORGANIZATIONS = "complex-organizations",
  NEW_SOLUTIONS = "new-solutions",
  CONTINUOUS_IMPROVEMENT = "continuous-improvement",
  MIGRATION_MODERNIZATION = "migration-modernization",
}

/**
 * Answer choice for a question
 */
export interface Choice {
  id: string;
  text: string;
}

/**
 * Quiz question with AWS SAP Professional level content
 */
export interface Question {
  id: string;
  domain: ContentDomain;
  text: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  difficulty: "medium" | "hard";
  tags: string[];
}

/**
 * User's answer to a question
 */
export interface UserAnswer {
  questionId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  answeredAt: number;
}

/**
 * Active quiz session state
 */
export interface QuizSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: number;
  endTime?: number;
  isComplete: boolean;
}

/**
 * Performance breakdown by content domain
 */
export interface DomainPerformance {
  domain: ContentDomain;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}

/**
 * Final quiz results
 */
export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  percentageScore: number;
  totalTimeSeconds: number;
  domainPerformance: DomainPerformance[];
  completedAt: number;
}

/**
 * LocalStorage schema for quiz state persistence
 */
export interface StoredQuizState {
  version: string;
  currentSession?: QuizSession;
  completedSessions: QuizResult[];
  lastUpdated: number;
}

/**
 * Type guard to check if a value is a valid ContentDomain
 */
export function isContentDomain(value: unknown): value is ContentDomain {
  return typeof value === "string" && Object.values(ContentDomain).includes(value as ContentDomain);
}

/**
 * Type guard to check if a value is a valid Choice
 */
export function isChoice(value: unknown): value is Choice {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "text" in value &&
    typeof (value as Choice).id === "string" &&
    typeof (value as Choice).text === "string"
  );
}

/**
 * Type guard to check if a value is a valid Question
 */
export function isQuestion(value: unknown): value is Question {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const q = value as Question;

  return (
    typeof q.id === "string" &&
    isContentDomain(q.domain) &&
    typeof q.text === "string" &&
    Array.isArray(q.choices) &&
    q.choices.length === 4 &&
    q.choices.every(isChoice) &&
    typeof q.correctChoiceId === "string" &&
    typeof q.explanation === "string" &&
    (q.difficulty === "medium" || q.difficulty === "hard") &&
    Array.isArray(q.tags)
  );
}

/**
 * Type guard to check if a value is a valid QuizSession
 */
export function isQuizSession(value: unknown): value is QuizSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as QuizSession;

  return (
    typeof session.id === "string" &&
    Array.isArray(session.questions) &&
    session.questions.every(isQuestion) &&
    typeof session.currentQuestionIndex === "number" &&
    Array.isArray(session.answers) &&
    typeof session.startTime === "number" &&
    typeof session.isComplete === "boolean"
  );
}

/**
 * Type guard to check if a value is a valid StoredQuizState
 */
export function isStoredQuizState(value: unknown): value is StoredQuizState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const state = value as StoredQuizState;

  return (
    typeof state.version === "string" &&
    Array.isArray(state.completedSessions) &&
    typeof state.lastUpdated === "number" &&
    (state.currentSession === undefined || isQuizSession(state.currentSession))
  );
}
