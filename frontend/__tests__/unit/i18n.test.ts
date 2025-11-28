/**
 * i18n Unit Tests
 *
 * Tests for internationalization functionality including:
 * - Translation file structure
 * - Locale switching
 * - Utility functions
 * - Message formatting
 */

import { formatDuration, formatPercentage, getDateFormat } from "@/lib/i18n-utils";
import enMessages from "@/messages/en.json";
import jaMessages from "@/messages/ja.json";
import { describe, expect, it } from "vitest";

describe("i18n - Translation Files", () => {
  describe("Translation file structure", () => {
    it("should have matching keys in both language files", () => {
      const enKeys = Object.keys(enMessages);
      const jaKeys = Object.keys(jaMessages);

      expect(enKeys.sort()).toEqual(jaKeys.sort());
    });

    it("should have all required top-level keys", () => {
      const requiredKeys = ["common", "home", "quiz", "results", "domains", "errors"];

      for (const key of requiredKeys) {
        expect(enMessages).toHaveProperty(key);
        expect(jaMessages).toHaveProperty(key);
      }
    });

    it("should have matching nested keys in common section", () => {
      const enCommonKeys = Object.keys(enMessages.common);
      const jaCommonKeys = Object.keys(jaMessages.common);

      expect(enCommonKeys.sort()).toEqual(jaCommonKeys.sort());
    });

    it("should have matching nested keys in home section", () => {
      const enHomeKeys = Object.keys(enMessages.home);
      const jaHomeKeys = Object.keys(jaMessages.home);

      expect(enHomeKeys.sort()).toEqual(jaHomeKeys.sort());
    });

    it("should have matching nested keys in quiz section", () => {
      const enQuizKeys = Object.keys(enMessages.quiz);
      const jaQuizKeys = Object.keys(jaMessages.quiz);

      expect(enQuizKeys.sort()).toEqual(jaQuizKeys.sort());
    });

    it("should have matching nested keys in results section", () => {
      const enResultsKeys = Object.keys(enMessages.results);
      const jaResultsKeys = Object.keys(jaMessages.results);

      expect(enResultsKeys.sort()).toEqual(jaResultsKeys.sort());
    });

    it("should have matching nested keys in domains section", () => {
      const enDomainsKeys = Object.keys(enMessages.domains);
      const jaDomainsKeys = Object.keys(jaMessages.domains);

      expect(enDomainsKeys.sort()).toEqual(jaDomainsKeys.sort());
    });

    it("should have all 4 domain translations", () => {
      const expectedDomains = [
        "complex-organizations",
        "new-solutions",
        "continuous-improvement",
        "migration-modernization",
      ];

      for (const domain of expectedDomains) {
        expect(enMessages.domains).toHaveProperty(domain);
        expect(jaMessages.domains).toHaveProperty(domain);
      }
    });
  });

  describe("Translation content validation", () => {
    it("should have non-empty translations for all keys", () => {
      const checkNonEmpty = (obj: any, path = ""): void => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;

          if (typeof value === "string") {
            expect(value.trim().length).toBeGreaterThan(0);
          } else if (typeof value === "object" && value !== null) {
            checkNonEmpty(value, currentPath);
          }
        }
      };

      checkNonEmpty(enMessages);
      checkNonEmpty(jaMessages);
    });

    it("should have app name in both languages", () => {
      expect(enMessages.common.appName).toBe("SAP Obake");
      expect(jaMessages.common.appName).toBe("SAP Obake");
    });

    it("should have different descriptions in each language", () => {
      expect(enMessages.common.appDescription).not.toBe(jaMessages.common.appDescription);
      expect(enMessages.home.description).not.toBe(jaMessages.home.description);
    });
  });

  describe("Error message structure", () => {
    it("should have all error types", () => {
      const errorTypes = ["insufficientQuestions", "corruptedData", "quotaExceeded", "generic"];

      for (const errorType of errorTypes) {
        expect(enMessages.errors).toHaveProperty(errorType);
        expect(jaMessages.errors).toHaveProperty(errorType);
      }
    });

    it("should have title and message for each error type", () => {
      const errorTypes = Object.keys(enMessages.errors);

      for (const errorType of errorTypes) {
        const enError = enMessages.errors[errorType as keyof typeof enMessages.errors];
        const jaError = jaMessages.errors[errorType as keyof typeof jaMessages.errors];

        expect(enError).toHaveProperty("title");
        expect(enError).toHaveProperty("message");
        expect(jaError).toHaveProperty("title");
        expect(jaError).toHaveProperty("message");
      }
    });
  });
});

describe("i18n - Utility Functions", () => {
  describe("formatDuration", () => {
    it("should format duration in Japanese", () => {
      expect(formatDuration(0, "ja")).toBe("0分0秒");
      expect(formatDuration(30, "ja")).toBe("0分30秒");
      expect(formatDuration(60, "ja")).toBe("1分0秒");
      expect(formatDuration(90, "ja")).toBe("1分30秒");
      expect(formatDuration(3661, "ja")).toBe("61分1秒");
    });

    it("should format duration in English", () => {
      expect(formatDuration(0, "en")).toBe("0m 0s");
      expect(formatDuration(30, "en")).toBe("0m 30s");
      expect(formatDuration(60, "en")).toBe("1m 0s");
      expect(formatDuration(90, "en")).toBe("1m 30s");
      expect(formatDuration(3661, "en")).toBe("61m 1s");
    });

    it("should handle large durations", () => {
      expect(formatDuration(86400, "ja")).toBe("1440分0秒"); // 24 hours
      expect(formatDuration(86400, "en")).toBe("1440m 0s");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentage with one decimal place", () => {
      expect(formatPercentage(0, "ja")).toBe("0.0%");
      expect(formatPercentage(50, "ja")).toBe("50.0%");
      expect(formatPercentage(100, "ja")).toBe("100.0%");
      expect(formatPercentage(75.5, "ja")).toBe("75.5%");
      expect(formatPercentage(33.333, "ja")).toBe("33.3%");

      expect(formatPercentage(0, "en")).toBe("0.0%");
      expect(formatPercentage(50, "en")).toBe("50.0%");
      expect(formatPercentage(100, "en")).toBe("100.0%");
      expect(formatPercentage(75.5, "en")).toBe("75.5%");
      expect(formatPercentage(33.333, "en")).toBe("33.3%");
    });
  });

  describe("getDateFormat", () => {
    it("should return Japanese date format options", () => {
      const format = getDateFormat("ja");

      expect(format).toHaveProperty("year", "numeric");
      expect(format).toHaveProperty("month", "long");
      expect(format).toHaveProperty("day", "numeric");
      expect(format).toHaveProperty("hour", "2-digit");
      expect(format).toHaveProperty("minute", "2-digit");
      expect(format).not.toHaveProperty("hour12");
    });

    it("should return English date format options with 12-hour format", () => {
      const format = getDateFormat("en");

      expect(format).toHaveProperty("year", "numeric");
      expect(format).toHaveProperty("month", "long");
      expect(format).toHaveProperty("day", "numeric");
      expect(format).toHaveProperty("hour", "2-digit");
      expect(format).toHaveProperty("minute", "2-digit");
      expect(format).toHaveProperty("hour12", true);
    });
  });
});

describe("i18n - Domain Translations", () => {
  it("should have translations for all AWS SAP domains", () => {
    const domains = [
      "complex-organizations",
      "new-solutions",
      "continuous-improvement",
      "migration-modernization",
    ];

    for (const domain of domains) {
      expect(enMessages.domains[domain as keyof typeof enMessages.domains]).toBeTruthy();
      expect(jaMessages.domains[domain as keyof typeof jaMessages.domains]).toBeTruthy();
    }
  });

  it("should have different translations for each domain", () => {
    const domains = Object.keys(enMessages.domains);

    for (const domain of domains) {
      const enTranslation = enMessages.domains[domain as keyof typeof enMessages.domains];
      const jaTranslation = jaMessages.domains[domain as keyof typeof jaMessages.domains];

      expect(enTranslation).not.toBe(jaTranslation);
    }
  });
});

describe("i18n - Quiz Interface Translations", () => {
  it("should have all quiz interface elements translated", () => {
    const quizKeys = [
      "question",
      "of",
      "correctCount",
      "timer",
      "timeWarning",
      "next",
      "submit",
      "correct",
      "incorrect",
      "correctAnswer",
      "explanation",
      "choiceLabel",
    ];

    for (const key of quizKeys) {
      expect(enMessages.quiz).toHaveProperty(key);
      expect(jaMessages.quiz).toHaveProperty(key);
    }
  });

  it("should have different feedback messages in each language", () => {
    expect(enMessages.quiz.correct).not.toBe(jaMessages.quiz.correct);
    expect(enMessages.quiz.incorrect).not.toBe(jaMessages.quiz.incorrect);
  });
});

describe("i18n - Results Page Translations", () => {
  it("should have all results page elements translated", () => {
    const resultsKeys = [
      "title",
      "score",
      "totalTime",
      "correctAnswers",
      "percentage",
      "domainPerformance",
      "restart",
      "excellent",
      "good",
      "needsImprovement",
    ];

    for (const key of resultsKeys) {
      expect(enMessages.results).toHaveProperty(key);
      expect(jaMessages.results).toHaveProperty(key);
    }
  });

  it("should have different performance feedback in each language", () => {
    expect(enMessages.results.excellent).not.toBe(jaMessages.results.excellent);
    expect(enMessages.results.good).not.toBe(jaMessages.results.good);
    expect(enMessages.results.needsImprovement).not.toBe(jaMessages.results.needsImprovement);
  });
});
