/**
 * Property-Based Tests for Hover States
 * Feature: sap-obake-quiz
 *
 * These tests validate the correctness property for interactive UI elements:
 * - Property 16: Hover states trigger visual changes
 *
 * This test validates that hovering over interactive elements (answer choices, buttons)
 * triggers CSS class changes or style updates, providing visual feedback to users.
 */

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { QuestionCard } from "@/components/question-card";

/**
 * Arbitrary generator for Question objects
 * Creates valid questions with 4 choices
 */
const questionArbitrary = fc
  .record({
    id: fc.uuid(),
    domain: fc.constantFrom(
      "complex-organizations",
      "new-solutions",
      "continuous-improvement",
      "migration-modernization"
    ),
    text: fc.string({ minLength: 20, maxLength: 200 }),
    choices: fc
      .tuple(
        fc.record({ id: fc.uuid(), text: fc.string({ minLength: 10, maxLength: 100 }) }),
        fc.record({ id: fc.uuid(), text: fc.string({ minLength: 10, maxLength: 100 }) }),
        fc.record({ id: fc.uuid(), text: fc.string({ minLength: 10, maxLength: 100 }) }),
        fc.record({ id: fc.uuid(), text: fc.string({ minLength: 10, maxLength: 100 }) })
      )
      .map((choices) => choices),
    correctChoiceId: fc.string(),
    explanation: fc.string({ minLength: 30, maxLength: 300 }),
    difficulty: fc.constantFrom("medium" as const, "hard" as const),
    tags: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
  })
  .chain((q) => {
    // Ensure correctChoiceId is one of the choice IDs
    return fc.constant({
      ...q,
      correctChoiceId: q.choices[0].id,
    });
  });

/**
 * Helper function to get computed styles of an element
 */
function getComputedStyleProperties(element: HTMLElement): {
  backgroundColor: string;
  border: string;
  boxShadow: string;
  transform: string;
} {
  const styles = window.getComputedStyle(element);
  return {
    backgroundColor: styles.backgroundColor,
    border: styles.border,
    boxShadow: styles.boxShadow,
    transform: styles.transform,
  };
}

/**
 * Helper function to check if two style objects are different
 */
function stylesAreDifferent(
  style1: ReturnType<typeof getComputedStyleProperties>,
  style2: ReturnType<typeof getComputedStyleProperties>
): boolean {
  return (
    style1.backgroundColor !== style2.backgroundColor ||
    style1.border !== style2.border ||
    style1.boxShadow !== style2.boxShadow ||
    style1.transform !== style2.transform
  );
}

describe("Hover States - Property-Based Tests", () => {
  afterEach(() => {
    // Clean up after each test to prevent DOM pollution
    cleanup();
  });

  describe("Property 16: Hover states trigger visual changes", () => {
    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should change styles when hovering over answer choices", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          async (question, choiceIndex) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};

            render(
              <QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />
            );

            // Get the choice button
            const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

            // Get initial styles (not hovered)
            const initialStyles = getComputedStyleProperties(choiceButton);

            // Hover over the choice
            await user.hover(choiceButton);

            // Get styles after hover
            const hoveredStyles = getComputedStyleProperties(choiceButton);

            // Verify that styles changed
            expect(stylesAreDifferent(initialStyles, hoveredStyles)).toBe(true);

            // Unhover
            await user.unhover(choiceButton);

            // Get styles after unhover
            const unhoveredStyles = getComputedStyleProperties(choiceButton);

            // Verify that styles returned to initial state (or similar)
            // Note: Due to timing, we just verify they're different from hovered state
            expect(stylesAreDifferent(hoveredStyles, unhoveredStyles)).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should apply hover glow effect to answer choices", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          async (question, choiceIndex) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};

            render(
              <QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />
            );

            const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

            // Get initial box shadow
            const initialStyles = getComputedStyleProperties(choiceButton);
            const initialBoxShadow = initialStyles.boxShadow;

            // Hover over the choice
            await user.hover(choiceButton);

            // Get box shadow after hover
            const hoveredStyles = getComputedStyleProperties(choiceButton);
            const hoveredBoxShadow = hoveredStyles.boxShadow;

            // Verify that box shadow changed (glow effect applied)
            expect(hoveredBoxShadow).not.toBe(initialBoxShadow);

            // Verify that the hovered box shadow is not "none"
            expect(hoveredBoxShadow).not.toBe("none");

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should not apply hover effects when feedback is shown", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          async (question, choiceIndex) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};
            const userAnswer = question.choices[0].id;

            render(
              <QuestionCard
                question={question}
                onAnswer={mockOnAnswer}
                showFeedback={true}
                userAnswer={userAnswer}
              />
            );

            const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

            // Get initial styles (with feedback shown)
            const initialStyles = getComputedStyleProperties(choiceButton);

            // Try to hover over the choice
            await user.hover(choiceButton);

            // Get styles after hover attempt
            const hoveredStyles = getComputedStyleProperties(choiceButton);

            // Verify that styles did NOT change (hover disabled when feedback shown)
            // We check that the key visual properties remain the same
            expect(hoveredStyles.backgroundColor).toBe(initialStyles.backgroundColor);
            expect(hoveredStyles.border).toBe(initialStyles.border);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should change border color on hover", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          async (question, choiceIndex) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};

            render(
              <QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />
            );

            const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

            // Get initial border
            const initialStyles = getComputedStyleProperties(choiceButton);
            const initialBorder = initialStyles.border;

            // Hover over the choice
            await user.hover(choiceButton);

            // Get border after hover
            const hoveredStyles = getComputedStyleProperties(choiceButton);
            const hoveredBorder = hoveredStyles.border;

            // Verify that border changed
            expect(hoveredBorder).not.toBe(initialBorder);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should apply transform on hover", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          async (question, choiceIndex) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};

            render(
              <QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />
            );

            const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

            // Get initial transform
            const initialStyles = getComputedStyleProperties(choiceButton);
            const initialTransform = initialStyles.transform;

            // Hover over the choice
            await user.hover(choiceButton);

            // Get transform after hover
            const hoveredStyles = getComputedStyleProperties(choiceButton);
            const hoveredTransform = hoveredStyles.transform;

            // Verify that transform changed (translateX applied)
            expect(hoveredTransform).not.toBe(initialTransform);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should handle multiple sequential hovers correctly", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 2, maxLength: 4 }),
          async (question, choiceIndices) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};

            render(
              <QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />
            );

            // Hover over each choice in sequence
            for (const choiceIndex of choiceIndices) {
              const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

              const beforeHoverStyles = getComputedStyleProperties(choiceButton);

              await user.hover(choiceButton);

              const afterHoverStyles = getComputedStyleProperties(choiceButton);

              // Verify that each hover triggers visual changes
              expect(stylesAreDifferent(beforeHoverStyles, afterHoverStyles)).toBe(true);

              await user.unhover(choiceButton);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should maintain hover state consistency across all choices", async () => {
      await fc.assert(
        fc.asyncProperty(questionArbitrary, async (question) => {
          // Validates: Requirements 5.3

          const user = userEvent.setup();
          const mockOnAnswer = () => {};

          render(<QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />);

          // Test that all 4 choices respond to hover
          for (let i = 0; i < 4; i++) {
            const choiceButton = screen.getByTestId(`choice-${i}`);

            const initialStyles = getComputedStyleProperties(choiceButton);

            await user.hover(choiceButton);

            const hoveredStyles = getComputedStyleProperties(choiceButton);

            // Each choice should have different styles when hovered
            expect(stylesAreDifferent(initialStyles, hoveredStyles)).toBe(true);

            await user.unhover(choiceButton);
          }

          // Clean up after each property test iteration
          cleanup();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("**Feature: sap-obake-quiz, Property 16: Hover states trigger visual changes** - should change background color on hover", async () => {
      await fc.assert(
        fc.asyncProperty(
          questionArbitrary,
          fc.integer({ min: 0, max: 3 }),
          async (question, choiceIndex) => {
            // Validates: Requirements 5.3

            const user = userEvent.setup();
            const mockOnAnswer = () => {};

            render(
              <QuestionCard question={question} onAnswer={mockOnAnswer} showFeedback={false} />
            );

            const choiceButton = screen.getByTestId(`choice-${choiceIndex}`);

            // Get initial background color
            const initialStyles = getComputedStyleProperties(choiceButton);
            const initialBgColor = initialStyles.backgroundColor;

            // Hover over the choice
            await user.hover(choiceButton);

            // Get background color after hover
            const hoveredStyles = getComputedStyleProperties(choiceButton);
            const hoveredBgColor = hoveredStyles.backgroundColor;

            // Verify that background color changed
            expect(hoveredBgColor).not.toBe(initialBgColor);

            // Clean up after each property test iteration
            cleanup();

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
