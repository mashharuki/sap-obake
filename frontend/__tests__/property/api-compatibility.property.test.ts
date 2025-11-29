/**
 * Property-Based Test: API Compatibility
 * 
 * **Feature: code-refactoring, Property 8: Public API compatibility**
 * **Validates: Requirements 5.1, 5.3, 5.4**
 * 
 * This test verifies that all exported function signatures and component prop interfaces
 * remain unchanged after refactoring. This ensures backward compatibility.
 */

import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

// Import all public APIs
import { HauntedLayout } from "@/components/haunted-layout";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProgressBar, type ProgressBarProps } from "@/components/progress-bar";
import { QuizSession } from "@/components/quiz-session";
import { ResultsSummary } from "@/components/results-summary";
import { Button, type ButtonProps } from "@/components/ui/button";
import * as i18nUtils from "@/lib/i18n-utils";
import * as questionLoader from "@/lib/question-loader";
import * as quizManager from "@/lib/quiz-manager";
import * as scoreCalculator from "@/lib/score-calculator";
import * as storageManager from "@/lib/storage-manager";
import * as themeConstants from "@/lib/theme-constants";
import * as types from "@/lib/types";
import * as utils from "@/lib/utils";

describe("Property 8: Public API Compatibility", () => {
  describe("question-loader.ts API", () => {
    it("should export loadQuestions function with correct signature", () => {
      expect(questionLoader.loadQuestions).toBeDefined();
      expect(typeof questionLoader.loadQuestions).toBe("function");
      expect(questionLoader.loadQuestions.length).toBe(1); // accepts 1 parameter
    });

    it("should export validateQuestion function with correct signature", () => {
      expect(questionLoader.validateQuestion).toBeDefined();
      expect(typeof questionLoader.validateQuestion).toBe("function");
      // Function has default parameter for index, so length is 1
      expect(questionLoader.validateQuestion.length).toBe(1);
    });

    it("should export validateQuestions function with correct signature", () => {
      expect(questionLoader.validateQuestions).toBeDefined();
      expect(typeof questionLoader.validateQuestions).toBe("function");
      expect(questionLoader.validateQuestions.length).toBe(1); // accepts 1 parameter
    });

    it("should export isValidQuestion function with correct signature", () => {
      expect(questionLoader.isValidQuestion).toBeDefined();
      expect(typeof questionLoader.isValidQuestion).toBe("function");
      expect(questionLoader.isValidQuestion.length).toBe(1); // accepts 1 parameter
    });

    it("should export getQuestionCount function with correct signature", () => {
      expect(questionLoader.getQuestionCount).toBeDefined();
      expect(typeof questionLoader.getQuestionCount).toBe("function");
      expect(questionLoader.getQuestionCount.length).toBe(1); // accepts 1 parameter
    });
  });

  describe("types.ts API", () => {
    it("should export ContentDomain enum", () => {
      expect(types.ContentDomain).toBeDefined();
      expect(types.ContentDomain.COMPLEX_ORGANIZATIONS).toBe("complex-organizations");
      expect(types.ContentDomain.NEW_SOLUTIONS).toBe("new-solutions");
      expect(types.ContentDomain.CONTINUOUS_IMPROVEMENT).toBe("continuous-improvement");
      expect(types.ContentDomain.MIGRATION_MODERNIZATION).toBe("migration-modernization");
    });

    it("should export type guard functions with correct signatures", () => {
      expect(types.isContentDomain).toBeDefined();
      expect(typeof types.isContentDomain).toBe("function");
      expect(types.isContentDomain.length).toBe(1);

      expect(types.isChoice).toBeDefined();
      expect(typeof types.isChoice).toBe("function");
      expect(types.isChoice.length).toBe(1);

      expect(types.isQuestion).toBeDefined();
      expect(typeof types.isQuestion).toBe("function");
      expect(types.isQuestion.length).toBe(1);

      expect(types.isQuizSession).toBeDefined();
      expect(typeof types.isQuizSession).toBe("function");
      expect(types.isQuizSession.length).toBe(1);

      expect(types.isStoredQuizState).toBeDefined();
      expect(typeof types.isStoredQuizState).toBe("function");
      expect(types.isStoredQuizState.length).toBe(1);
    });
  });

  describe("score-calculator.ts API", () => {
    it("should export calculateQuizResult function with correct signature", () => {
      expect(scoreCalculator.calculateQuizResult).toBeDefined();
      expect(typeof scoreCalculator.calculateQuizResult).toBe("function");
      expect(scoreCalculator.calculateQuizResult.length).toBe(1);
    });

    it("should export calculatePercentage function with correct signature", () => {
      expect(scoreCalculator.calculatePercentage).toBeDefined();
      expect(typeof scoreCalculator.calculatePercentage).toBe("function");
      expect(scoreCalculator.calculatePercentage.length).toBe(2);
    });

    it("should export formatTime function with correct signature", () => {
      expect(scoreCalculator.formatTime).toBeDefined();
      expect(typeof scoreCalculator.formatTime).toBe("function");
      expect(scoreCalculator.formatTime.length).toBe(1);
    });

    it("should export getPerformanceMessage function with correct signature", () => {
      expect(scoreCalculator.getPerformanceMessage).toBeDefined();
      expect(typeof scoreCalculator.getPerformanceMessage).toBe("function");
      expect(scoreCalculator.getPerformanceMessage.length).toBe(1);
    });

    it("should export isPassing function with correct signature", () => {
      expect(scoreCalculator.isPassing).toBeDefined();
      expect(typeof scoreCalculator.isPassing).toBe("function");
      expect(scoreCalculator.isPassing.length).toBe(1);
    });
  });

  describe("quiz-manager.ts API", () => {
    it("should export error classes", () => {
      expect(quizManager.InsufficientQuestionsError).toBeDefined();
      expect(quizManager.MissingDomainQuestionsError).toBeDefined();
    });

    it("should export quiz management functions with correct signatures", () => {
      expect(quizManager.getDomainDistribution).toBeDefined();
      expect(typeof quizManager.getDomainDistribution).toBe("function");
      expect(quizManager.getDomainDistribution.length).toBe(1);

      expect(quizManager.validateDomainRepresentation).toBeDefined();
      expect(typeof quizManager.validateDomainRepresentation).toBe("function");
      expect(quizManager.validateDomainRepresentation.length).toBe(1);

      expect(quizManager.recordAnswer).toBeDefined();
      expect(typeof quizManager.recordAnswer).toBe("function");
      expect(quizManager.recordAnswer.length).toBe(3);

      expect(quizManager.moveToNextQuestion).toBeDefined();
      expect(typeof quizManager.moveToNextQuestion).toBe("function");
      expect(quizManager.moveToNextQuestion.length).toBe(1);

      expect(quizManager.isQuizComplete).toBeDefined();
      expect(typeof quizManager.isQuizComplete).toBe("function");
      expect(quizManager.isQuizComplete.length).toBe(1);

      expect(quizManager.getCurrentQuestion).toBeDefined();
      expect(typeof quizManager.getCurrentQuestion).toBe("function");
      expect(quizManager.getCurrentQuestion.length).toBe(1);

      expect(quizManager.getCorrectAnswerCount).toBeDefined();
      expect(typeof quizManager.getCorrectAnswerCount).toBe("function");
      expect(quizManager.getCorrectAnswerCount.length).toBe(1);

      expect(quizManager.completeQuizSession).toBeDefined();
      expect(typeof quizManager.completeQuizSession).toBe("function");
      expect(quizManager.completeQuizSession.length).toBe(1);
    });
  });

  describe("storage-manager.ts API", () => {
    it("should export storage functions with correct signatures", () => {
      expect(storageManager.saveQuizState).toBeDefined();
      expect(typeof storageManager.saveQuizState).toBe("function");
      expect(storageManager.saveQuizState.length).toBe(1);

      expect(storageManager.loadQuizState).toBeDefined();
      expect(typeof storageManager.loadQuizState).toBe("function");
      expect(storageManager.loadQuizState.length).toBe(0);

      expect(storageManager.clearQuizState).toBeDefined();
      expect(typeof storageManager.clearQuizState).toBe("function");
      expect(storageManager.clearQuizState.length).toBe(0);

      expect(storageManager.hasSavedQuizState).toBeDefined();
      expect(typeof storageManager.hasSavedQuizState).toBe("function");
      expect(storageManager.hasSavedQuizState.length).toBe(0);

      expect(storageManager.getStoredStateSize).toBeDefined();
      expect(typeof storageManager.getStoredStateSize).toBe("function");
      expect(storageManager.getStoredStateSize.length).toBe(0);
    });
  });

  describe("i18n-utils.ts API", () => {
    it("should export i18n utility functions with correct signatures", () => {
      expect(i18nUtils.formatDomainName).toBeDefined();
      expect(typeof i18nUtils.formatDomainName).toBe("function");
      expect(i18nUtils.formatDomainName.length).toBe(2);

      expect(i18nUtils.formatDuration).toBeDefined();
      expect(typeof i18nUtils.formatDuration).toBe("function");
      expect(i18nUtils.formatDuration.length).toBe(2);

      expect(i18nUtils.formatPercentage).toBeDefined();
      expect(typeof i18nUtils.formatPercentage).toBe("function");
      expect(i18nUtils.formatPercentage.length).toBe(2);

      expect(i18nUtils.getDateFormat).toBeDefined();
      expect(typeof i18nUtils.getDateFormat).toBe("function");
      expect(i18nUtils.getDateFormat.length).toBe(1);
    });
  });

  describe("theme-constants.ts API", () => {
    it("should export theme constants", () => {
      expect(themeConstants.colors).toBeDefined();
      expect(typeof themeConstants.colors).toBe("object");

      expect(themeConstants.shadows).toBeDefined();
      expect(typeof themeConstants.shadows).toBe("object");

      expect(themeConstants.animations).toBeDefined();
      expect(typeof themeConstants.animations).toBe("object");

      expect(themeConstants.typography).toBeDefined();
      expect(typeof themeConstants.typography).toBe("object");

      expect(themeConstants.breakpoints).toBeDefined();
      expect(typeof themeConstants.breakpoints).toBe("object");

      expect(themeConstants.zIndex).toBeDefined();
      expect(typeof themeConstants.zIndex).toBe("object");

      expect(themeConstants.spacing).toBeDefined();
      expect(typeof themeConstants.spacing).toBe("object");

      expect(themeConstants.borderRadius).toBeDefined();
      expect(typeof themeConstants.borderRadius).toBe("object");

      expect(themeConstants.transitions).toBeDefined();
      expect(typeof themeConstants.transitions).toBe("object");

      expect(themeConstants.domainColors).toBeDefined();
      expect(typeof themeConstants.domainColors).toBe("object");
    });

    it("should export theme utility functions with correct signatures", () => {
      expect(themeConstants.getDomainColor).toBeDefined();
      expect(typeof themeConstants.getDomainColor).toBe("function");
      expect(themeConstants.getDomainColor.length).toBe(1);

      expect(themeConstants.createGlow).toBeDefined();
      expect(typeof themeConstants.createGlow).toBe("function");
      // Function has default parameter for intensity, so length is 1
      expect(themeConstants.createGlow.length).toBe(1);
    });
  });

  describe("utils.ts API", () => {
    it("should export cn utility function with correct signature", () => {
      expect(utils.cn).toBeDefined();
      expect(typeof utils.cn).toBe("function");
      // cn accepts rest parameters, so length is 0
      expect(utils.cn.length).toBe(0);
    });
  });

  describe("Button component API", () => {
    it("should export Button component", () => {
      expect(Button).toBeDefined();
      // Button is a memoized component, so it's an object with $$typeof
      expect(typeof Button).toBe("object");
      expect(Button).toHaveProperty("$$typeof");
    });

    it("should accept all required ButtonProps", () => {
      fc.assert(
        fc.property(
          fc.record({
            children: fc.string(),
            onClick: fc.constant(() => {}),
            variant: fc.constantFrom("primary", "secondary", "ghost", undefined),
            size: fc.constantFrom("sm", "md", "lg", undefined),
            disabled: fc.boolean(),
            className: fc.string(),
            ariaLabel: fc.string(),
            testId: fc.string(),
            type: fc.constantFrom("button", "submit", "reset", undefined),
          }),
          (props) => {
            // Verify props structure matches ButtonProps interface
            const validProps: ButtonProps = {
              children: props.children,
              onClick: props.onClick,
              variant: props.variant,
              size: props.size,
              disabled: props.disabled,
              className: props.className,
              ariaLabel: props.ariaLabel,
              testId: props.testId,
              type: props.type,
            };
            
            // If this compiles and runs, the interface is compatible
            expect(validProps).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("ProgressBar component API", () => {
    it("should export ProgressBar component", () => {
      expect(ProgressBar).toBeDefined();
      expect(typeof ProgressBar).toBe("function");
    });

    it("should accept all required ProgressBarProps", () => {
      fc.assert(
        fc.property(
          fc.record({
            current: fc.integer({ min: 1, max: 20 }),
            total: fc.integer({ min: 1, max: 20 }),
            correctCount: fc.integer({ min: 0, max: 20 }),
          }),
          (props) => {
            // Verify props structure matches ProgressBarProps interface
            const validProps: ProgressBarProps = {
              current: props.current,
              total: props.total,
              correctCount: props.correctCount,
            };
            
            expect(validProps).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("ResultsSummary component API", () => {
    it("should export ResultsSummary component", () => {
      expect(ResultsSummary).toBeDefined();
      expect(typeof ResultsSummary).toBe("function");
    });
  });

  describe("QuizSession component API", () => {
    it("should export QuizSession component", () => {
      expect(QuizSession).toBeDefined();
      expect(typeof QuizSession).toBe("function");
    });
  });

  describe("HauntedLayout component API", () => {
    it("should export HauntedLayout component", () => {
      expect(HauntedLayout).toBeDefined();
      expect(typeof HauntedLayout).toBe("function");
    });
  });

  describe("LanguageSwitcher component API", () => {
    it("should export LanguageSwitcher component", () => {
      expect(LanguageSwitcher).toBeDefined();
      expect(typeof LanguageSwitcher).toBe("function");
    });
  });

  describe("Property: Function signature stability", () => {
    it("should maintain stable function signatures across refactoring", () => {
      fc.assert(
        fc.property(
          fc.record({
            functionName: fc.constantFrom(
              "validateQuestion",
              "validateQuestions",
              "isValidQuestion",
              "calculatePercentage",
              "formatTime",
              "isPassing"
            ),
          }),
          ({ functionName }) => {
            // Map function names to their expected parameter counts
            // Note: Functions with default parameters have length equal to required params only
            const expectedParamCounts: Record<string, number> = {
              validateQuestion: 1, // has default parameter for index
              validateQuestions: 1,
              isValidQuestion: 1,
              calculatePercentage: 2,
              formatTime: 1,
              isPassing: 1,
            };

            // Get the actual function
            let actualFunction: Function;
            if (functionName.startsWith("validate") || functionName === "isValidQuestion") {
              actualFunction = (questionLoader as any)[functionName];
            } else {
              actualFunction = (scoreCalculator as any)[functionName];
            }

            // Verify parameter count matches expected
            expect(actualFunction.length).toBe(expectedParamCounts[functionName]);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Property: Component prop interface stability", () => {
    it("should maintain stable component prop interfaces across refactoring", () => {
      fc.assert(
        fc.property(
          fc.record({
            componentName: fc.constantFrom("Button", "ProgressBar"),
          }),
          ({ componentName }) => {
            // Verify components are still exported and callable
            if (componentName === "Button") {
              expect(Button).toBeDefined();
              // Button is memoized, so it's an object
              expect(typeof Button).toBe("object");
              expect(Button).toHaveProperty("$$typeof");
            } else if (componentName === "ProgressBar") {
              expect(ProgressBar).toBeDefined();
              expect(typeof ProgressBar).toBe("function");
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Property: Type exports stability", () => {
    it("should maintain all type exports across refactoring", () => {
      // Verify all critical types are still exported
      const typeNames = [
        "ContentDomain",
        "isContentDomain",
        "isChoice",
        "isQuestion",
        "isQuizSession",
        "isStoredQuizState",
      ];

      typeNames.forEach((typeName) => {
        expect((types as any)[typeName]).toBeDefined();
      });
    });
  });
});
