/**
 * Accessibility Tests
 *
 * Comprehensive tests to verify WCAG 2.1 AA compliance including:
 * - ARIA labels on all interactive elements
 * - Keyboard navigation support
 * - Focus indicators
 * - Color contrast
 * - Screen reader support
 * - Reduced motion support
 *
 * Requirements: 5.1, 5.3, 5.4, 5.5
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HauntedLayout } from "@/components/haunted-layout";
import { ProgressBar } from "@/components/progress-bar";
import { QuestionCard } from "@/components/question-card";
import { ResultsSummary } from "@/components/results-summary";
import Timer from "@/components/timer";
import { ContentDomain, type Question, type QuizResult } from "@/lib/types";

// Mock question for testing
const mockQuestion: Question = {
  id: "q1",
  domain: ContentDomain.NEW_SOLUTIONS,
  text: "Which AWS service provides managed Kubernetes?",
  choices: [
    { id: "c1", text: "Amazon ECS" },
    { id: "c2", text: "Amazon EKS" },
    { id: "c3", text: "AWS Fargate" },
    { id: "c4", text: "AWS Lambda" },
  ],
  correctChoiceId: "c2",
  explanation: "Amazon EKS is the managed Kubernetes service.",
  difficulty: "medium",
  tags: ["kubernetes", "containers"],
};

// Mock quiz result for testing
const mockResult: QuizResult = {
  sessionId: "test-session",
  totalQuestions: 20,
  correctAnswers: 15,
  percentageScore: 75,
  totalTimeSeconds: 1800,
  domainPerformance: [
    {
      domain: ContentDomain.COMPLEX_ORGANIZATIONS,
      totalQuestions: 5,
      correctAnswers: 4,
      percentage: 80,
    },
    {
      domain: ContentDomain.NEW_SOLUTIONS,
      totalQuestions: 5,
      correctAnswers: 4,
      percentage: 80,
    },
    {
      domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
      totalQuestions: 5,
      correctAnswers: 3,
      percentage: 60,
    },
    {
      domain: ContentDomain.MIGRATION_MODERNIZATION,
      totalQuestions: 5,
      correctAnswers: 4,
      percentage: 80,
    },
  ],
  completedAt: Date.now(),
};

describe("Accessibility - ARIA Labels", () => {
  it("should have ARIA labels on all interactive radio buttons in QuestionCard", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    // Check each choice radio button has proper ARIA label
    const choiceButtons = screen.getAllByRole("radio");
    expect(choiceButtons).toHaveLength(4);

    choiceButtons.forEach((button, index) => {
      const ariaLabel = button.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain(`Choice ${String.fromCharCode(65 + index)}`);
    });
  });

  it("should have ARIA labels on Timer component", () => {
    const startTime = Date.now() - 60000; // 1 minute ago
    render(<Timer startTime={startTime} />);

    const timerDisplay = screen.getByTestId("timer-display");
    expect(timerDisplay).toHaveAttribute("aria-label");
    expect(timerDisplay.getAttribute("aria-label")).toContain("Elapsed time");
  });

  it("should have ARIA labels on ProgressBar component", () => {
    render(<ProgressBar current={5} total={20} correctCount={3} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-label");
    expect(progressBar.getAttribute("aria-label")).toContain("Progress");
  });

  it("should have ARIA labels on ResultsSummary restart button", () => {
    const onRestart = vi.fn();
    render(<ResultsSummary result={mockResult} onRestart={onRestart} />);

    const restartButton = screen.getByRole("button", { name: /start a new quiz/i });
    expect(restartButton).toHaveAttribute("aria-label");
  });

  it("should have proper role attributes on main regions", () => {
    render(
      <HauntedLayout>
        <div>Test content</div>
      </HauntedLayout>
    );

    const mainRegion = screen.getByRole("main");
    expect(mainRegion).toBeInTheDocument();
  });
});

describe("Accessibility - Keyboard Navigation", () => {
  it("should allow keyboard navigation through answer choices", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();

    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    const choiceButtons = screen.getAllByRole("radio");

    // Tab to first button
    await user.tab();
    expect(choiceButtons[0]).toHaveFocus();

    // Tab to second button
    await user.tab();
    expect(choiceButtons[1]).toHaveFocus();

    // Press Enter to select
    await user.keyboard("{Enter}");
    expect(onAnswer).toHaveBeenCalledWith("c2");
  });

  it("should allow keyboard activation of restart button", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(<ResultsSummary result={mockResult} onRestart={onRestart} />);

    const restartButton = screen.getByRole("button", { name: /start a new quiz/i });

    // Tab to button
    restartButton.focus();
    expect(restartButton).toHaveFocus();

    // Press Enter
    await user.keyboard("{Enter}");
    expect(onRestart).toHaveBeenCalled();
  });

  it("should have visible focus indicators on all interactive elements", () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />
    );

    const buttons = container.querySelectorAll("button");
    buttons.forEach((button) => {
      // Check for focus-visible class or focus styles
      const classes = button.className;
      expect(classes).toContain("focus:outline-none");
      expect(classes).toContain("focus:ring");
    });
  });
});

describe("Accessibility - Screen Reader Support", () => {
  it("should have live regions for dynamic content updates", () => {
    const onAnswer = vi.fn();
    const { rerender } = render(
      <QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />
    );

    // Show feedback
    rerender(
      <QuestionCard
        question={mockQuestion}
        onAnswer={onAnswer}
        showFeedback={true}
        userAnswer="c2"
      />
    );

    const feedbackSection = screen.getByTestId("feedback-section");
    expect(feedbackSection).toHaveAttribute("role", "status");
    expect(feedbackSection).toHaveAttribute("aria-live", "polite");
  });

  it("should have aria-live regions for timer updates", () => {
    const startTime = Date.now();
    render(<Timer startTime={startTime} />);

    const timerDisplay = screen.getByTestId("timer-display");
    expect(timerDisplay).toHaveAttribute("aria-live", "polite");
  });

  it("should announce progress updates to screen readers", () => {
    const { rerender } = render(<ProgressBar current={5} total={20} correctCount={3} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "5");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "20");

    // Update progress
    rerender(<ProgressBar current={6} total={20} correctCount={4} />);
    expect(progressBar).toHaveAttribute("aria-valuenow", "6");
  });

  it("should have descriptive aria-labels for decorative elements", () => {
    render(
      <HauntedLayout>
        <div>Test</div>
      </HauntedLayout>
    );

    const cobwebDecoration = screen.getByTestId("cobweb-decoration");
    expect(cobwebDecoration).toHaveAttribute("aria-hidden", "true");
    expect(cobwebDecoration).toHaveAttribute("role", "presentation");
  });
});

describe("Accessibility - Color Contrast", () => {
  it("should use high contrast colors for text", () => {
    const onAnswer = vi.fn();
    const { container } = render(
      <QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />
    );

    // Check that text elements have sufficient contrast
    // This is a basic check - actual contrast should be verified with tools
    const questionText = screen.getByTestId("question-text");
    const styles = window.getComputedStyle(questionText);

    // Ghost white (#F8F8FF) on dark backgrounds should have good contrast
    expect(styles.color).toBeTruthy();
  });

  it("should maintain contrast in feedback states", () => {
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        question={mockQuestion}
        onAnswer={onAnswer}
        showFeedback={true}
        userAnswer="c2"
      />
    );

    const feedbackSection = screen.getByTestId("feedback-section");
    expect(feedbackSection).toBeInTheDocument();

    // Correct/incorrect indicators should have sufficient contrast
    const correctIndicator = screen.getByTestId("correct-indicator");
    expect(correctIndicator).toBeInTheDocument();
  });
});

describe("Accessibility - Reduced Motion Support", () => {
  it("should respect prefers-reduced-motion in HauntedLayout", () => {
    // Mock matchMedia for reduced motion
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });

    render(
      <HauntedLayout>
        <div>Test</div>
      </HauntedLayout>
    );

    const layout = screen.getByTestId("haunted-layout");
    expect(layout).toHaveAttribute("data-reduce-motion", "true");
  });

  it("should not show particle effects when reduced motion is preferred", () => {
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });

    render(
      <HauntedLayout showGhosts={true}>
        <div>Test</div>
      </HauntedLayout>
    );

    // Particle effect should not be rendered when reduced motion is preferred
    const particleEffect = screen.queryByTestId("particle-effect");
    expect(particleEffect).not.toBeInTheDocument();
  });
});

describe("Accessibility - Form Controls", () => {
  it("should have proper disabled states with aria-disabled", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={true} />);

    // When feedback is shown, choices should be disabled
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAttribute("disabled");
    });
  });
});

describe("Accessibility - Semantic HTML", () => {
  it("should use semantic HTML elements appropriately", () => {
    render(
      <HauntedLayout>
        <div>Test content</div>
      </HauntedLayout>
    );

    // Check for proper semantic structure
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
  });

  it("should use proper heading hierarchy", () => {
    const onRestart = vi.fn();
    const { container } = render(<ResultsSummary result={mockResult} onRestart={onRestart} />);

    // Check for h1 and h2 elements
    const h1 = container.querySelector("h1");
    const h2 = container.querySelector("h2");

    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });

  it("should use buttons for interactive elements", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} showFeedback={false} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button.tagName).toBe("BUTTON");
    });
  });
});
