/**
 * i18n Utility Functions
 *
 * Helper functions for internationalization
 */

import type { Locale } from "@/i18n";

/**
 * Format domain name for display based on locale
 */
export function formatDomainName(domain: string, locale: Locale): string {
  // Domain translations are handled by the translation files
  // This function can be extended for more complex formatting
  return domain;
}

/**
 * Format time duration based on locale
 */
export function formatDuration(seconds: number, locale: Locale): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (locale === "ja") {
    return `${minutes}分${remainingSeconds}秒`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Format percentage based on locale
 */
export function formatPercentage(value: number, locale: Locale): string {
  if (locale === "ja") {
    return `${value.toFixed(1)}%`;
  }

  return `${value.toFixed(1)}%`;
}

/**
 * Get locale-specific date format
 */
export function getDateFormat(locale: Locale): Intl.DateTimeFormatOptions {
  if (locale === "ja") {
    return {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
  }

  return {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
}
