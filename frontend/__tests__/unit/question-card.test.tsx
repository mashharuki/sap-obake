/**
 * Unit Tests for QuestionCard Component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuestionCard } from "@/components/question-card";
import { ContentDomain, type Question } from "@/lib/types";

const mockQuestion: Question = {
  id: "test-question-1",
  domain: ContentDomain.NEW_SOLUTIONS,
  text: "What is the best AWS service for serverless computing?",
  choices: [
    { id: "choice-1", text: "AWS Lambda" },
    { id: "choice-2", text: "Amazon EC2" },
    { id: "choice-3", text: "Amazon ECS" },
    { id: "choice-4", text: "AWS Fargate" },
  ],
  correctChoiceId: "choice-1",
  explanation: "AWS Lambda is the primary serverless compute service in AWS.",
  difficulty: "medium",
  tags: ["serverless", "compute"],
};

describe("QuestionCard Component", () => {
  it("should render question text", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    expect(screen.getByTestId("question-text")).toHaveTextContent(mockQuestion.text);
  });

  it("should render all 4 choices", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    expect(screen.getByTestId("choice-0")).toBeInTheDocument();
    expect(screen.getByTestId("choice-1")).toBeInTheDocument();
    expect(screen.getByTestId("choice-2")).toBeInTheDocument();
    expect(screen.getByTestId("choice-3")).toBeInTheDocument();
  });

  it("should display domain badge", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    expect(screen.getByTestId("domain-badge")).toBeInTheDocument();
  });

  it("should show feedback section when showFeedback is true", () => {
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        question={mockQuestion}
        onAnswer={onAnswer}
        showFeedback={true}
        userAnswer="choice-1"
      />
    );

    expect(screen.getByTestId("feedback-section")).toBeInTheDocument();
  });

  it("should not show feedback section when showFeedback is false", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    expect(screen.queryByTestId("feedback-section")).not.toBeInTheDocument();
  });
});
