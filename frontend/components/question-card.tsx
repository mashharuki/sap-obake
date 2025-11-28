"use client";

/**
 * QuestionCard Component
 *
 * Displays a quiz question with 4 answer choices and provides immediate feedback.
 * Features:
 * - Question text and 4 answer choices
 * - Answer selection state management
 * - Hover effects with haunted glow
 * - Immediate feedback display (correct/incorrect indicators)
 * - Correct answer and explanation display after submission
 * - Domain badge display
 * - Ornate border styling with haunted theme
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 5.3, 6.3, 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { memo, useCallback, useMemo, useState } from "react";
import { colors, createGlow, getDomainColor } from "@/lib/theme-constants";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answerId: string) => void;
  showFeedback: boolean;
  userAnswer?: string;
}

/**
 * Format domain name for display
 * Converts kebab-case to Title Case
 */
const formatDomainName = (domain: string): string => {
  return domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Get choice styling based on current state
 */
const getChoiceStyle = (
  isHovered: boolean,
  isSelected: boolean,
  isCorrect: boolean,
  showFeedback: boolean
): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: colors.mistGray,
    border: `2px solid ${colors.midnightPurple}`,
    color: colors.ghostWhite,
    transition: "all 0.2s ease-in-out",
  };

  // Hover state (only when feedback not shown)
  if (isHovered && !showFeedback) {
    return {
      ...baseStyle,
      backgroundColor: colors.shadowGray,
      border: `2px solid ${colors.hauntedOrange}`,
      boxShadow: createGlow(colors.hauntedOrange, "medium"),
      transform: "translateX(4px)",
    };
  }

  // Selected state (only when feedback not shown)
  if (isSelected && !showFeedback) {
    return {
      ...baseStyle,
      backgroundColor: colors.midnightPurple,
      border: `2px solid ${colors.hauntedOrange}`,
      boxShadow: createGlow(colors.hauntedOrange, "high"),
    };
  }

  // Correct answer feedback
  if (showFeedback && isCorrect) {
    return {
      ...baseStyle,
      backgroundColor: `${colors.correctGlow}22`,
      border: `2px solid ${colors.correctGlow}`,
      boxShadow: createGlow(colors.correctGlow, "high"),
    };
  }

  // Incorrect answer feedback
  if (showFeedback && isSelected && !isCorrect) {
    return {
      ...baseStyle,
      backgroundColor: `${colors.incorrectGlow}22`,
      border: `2px solid ${colors.incorrectGlow}`,
      boxShadow: createGlow(colors.incorrectGlow, "high"),
    };
  }

  return baseStyle;
};

export const QuestionCard = memo(function QuestionCard({
  question,
  onAnswer,
  showFeedback,
  userAnswer,
}: QuestionCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(userAnswer || null);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  // Memoize computed values
  const domainColor = useMemo(() => getDomainColor(question.domain), [question.domain]);

  const formattedDomainName = useMemo(() => formatDomainName(question.domain), [question.domain]);

  const isCorrectUserAnswer = useMemo(
    () => selectedChoice === question.correctChoiceId && showFeedback,
    [selectedChoice, question.correctChoiceId, showFeedback]
  );

  const isIncorrectUserAnswer = useMemo(
    () => selectedChoice !== question.correctChoiceId && showFeedback && selectedChoice !== null,
    [selectedChoice, question.correctChoiceId, showFeedback]
  );

  const correctAnswerText = useMemo(
    () => question.choices.find((c) => c.id === question.correctChoiceId)?.text,
    [question.choices, question.correctChoiceId]
  );

  // Event handlers
  const handleChoiceClick = useCallback(
    (choiceId: string) => {
      if (showFeedback) return;

      setSelectedChoice(choiceId);
      onAnswer(choiceId);
    },
    [showFeedback, onAnswer]
  );

  const handleChoiceHover = useCallback((choiceId: string | null) => {
    setHoveredChoice(choiceId);
  }, []);

  return (
    <div
      data-testid="question-card"
      className="question-card relative w-full max-w-4xl mx-auto p-4 sm:p-5 md:p-6"
      style={{
        backgroundColor: colors.shadowGray,
        border: `2px solid ${colors.midnightPurple}`,
        borderRadius: "12px",
        boxShadow: `0 0 30px rgba(138, 43, 226, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)`,
        maxWidth: "100%",
      }}
      role="group"
      aria-labelledby="question-text"
      aria-describedby="domain-badge"
    >
      {/* Domain Badge */}
      <div
        id="domain-badge"
        data-testid="domain-badge"
        className="domain-badge inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
        style={{
          backgroundColor: `${domainColor}33`,
          color: domainColor,
          border: `1px solid ${domainColor}`,
          boxShadow: createGlow(domainColor, "low"),
        }}
        role="status"
        aria-label={`Question category: ${formattedDomainName}`}
      >
        {formattedDomainName}
      </div>

      {/* Question Text */}
      <h2
        id="question-text"
        data-testid="question-text"
        className="question-text text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6"
        style={{
          color: colors.ghostWhite,
          lineHeight: "1.5",
        }}
      >
        {question.text}
      </h2>

      {/* Answer Choices */}
      <div
        className="choices-container space-y-2 sm:space-y-3"
        data-testid="choices-container"
        role="radiogroup"
        aria-label="Answer choices"
        aria-required="true"
      >
        {question.choices.map((choice, index) => {
          const isHovered = hoveredChoice === choice.id;
          const isSelected = selectedChoice === choice.id;
          const isCorrect = choice.id === question.correctChoiceId;
          const showCorrectIndicator = showFeedback && isCorrect;
          const showIncorrectIndicator = showFeedback && isSelected && !isCorrect;

          const choiceStyle = getChoiceStyle(isHovered, isSelected, isCorrect, showFeedback);

          return (
            <button
              key={choice.id}
              data-testid={`choice-${index}`}
              data-choice-id={choice.id}
              data-selected={isSelected ? "true" : undefined}
              data-correct={showFeedback && isCorrect ? "true" : undefined}
              data-incorrect={showFeedback && isSelected && !isCorrect ? "true" : undefined}
              type="button"
              className="choice-button w-full text-left p-3 sm:p-4 md:p-5 rounded-lg font-medium cursor-pointer disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
              style={
                {
                  ...choiceStyle,
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  minHeight: "48px",
                  "--tw-ring-color": colors.hauntedOrange,
                } as React.CSSProperties
              }
              onClick={() => handleChoiceClick(choice.id)}
              onMouseEnter={() => handleChoiceHover(choice.id)}
              onMouseLeave={() => handleChoiceHover(null)}
              onTouchStart={() => handleChoiceHover(choice.id)}
              onTouchEnd={() => handleChoiceHover(null)}
              disabled={showFeedback}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Choice ${String.fromCharCode(65 + index)}: ${choice.text}${showFeedback && isCorrect ? " - Correct answer" : ""}${showFeedback && isSelected && !isCorrect ? " - Incorrect answer" : ""}`}
              aria-disabled={showFeedback}
              tabIndex={showFeedback ? -1 : 0}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {/* Choice Letter */}
                <span
                  className="choice-letter shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-sm sm:text-base"
                  style={{
                    backgroundColor: colors.darkVoid,
                    color: colors.ghostWhite,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Choice Text */}
                <span className="choice-text flex-1 text-sm sm:text-base">{choice.text}</span>

                {/* Feedback Indicators */}
                {showCorrectIndicator && (
                  <span
                    data-testid="correct-indicator"
                    className="feedback-indicator shrink-0 text-xl sm:text-2xl"
                    aria-hidden="true"
                    role="img"
                  >
                    ✓
                  </span>
                )}
                {showIncorrectIndicator && (
                  <span
                    data-testid="incorrect-indicator"
                    className="feedback-indicator shrink-0 text-xl sm:text-2xl"
                    aria-hidden="true"
                    role="img"
                  >
                    ✗
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div
          data-testid="feedback-section"
          className="feedback-section mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg"
          style={{
            backgroundColor: colors.darkVoid,
            border: `1px solid ${isCorrectUserAnswer ? colors.correctGlow : colors.incorrectGlow}`,
            boxShadow: createGlow(
              isCorrectUserAnswer ? colors.correctGlow : colors.incorrectGlow,
              "low"
            ),
          }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Answer feedback: ${isCorrectUserAnswer ? "Correct" : "Incorrect"}`}
        >
          {/* Feedback Header */}
          <div className="feedback-header mb-2 sm:mb-3">
            <h3
              className="text-base sm:text-lg font-bold"
              style={{
                color: isCorrectUserAnswer ? colors.correctGlow : colors.incorrectGlow,
              }}
            >
              {isCorrectUserAnswer ? "🎉 Correct!" : "❌ Incorrect"}
            </h3>
          </div>

          {/* Correct Answer Display */}
          {isIncorrectUserAnswer && (
            <div
              data-testid="correct-answer-display"
              className="correct-answer-display mb-2 sm:mb-3 p-2 sm:p-3 rounded"
              style={{
                backgroundColor: `${colors.correctGlow}11`,
                border: `1px solid ${colors.correctGlow}`,
              }}
            >
              <p
                className="text-xs sm:text-sm font-semibold mb-1"
                style={{ color: colors.correctGlow }}
              >
                Correct Answer:
              </p>
              <p className="text-sm sm:text-base" style={{ color: colors.ghostWhite }}>
                {correctAnswerText}
              </p>
            </div>
          )}

          {/* Explanation */}
          <div data-testid="explanation-display" className="explanation-display">
            <p
              className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2"
              style={{ color: colors.hauntedOrange }}
            >
              Explanation:
            </p>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.ghostWhite }}>
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
