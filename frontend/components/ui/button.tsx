/**
 * Button Component
 *
 * Shared button component with haunted theme styling.
 * Supports multiple variants and sizes for consistent UI across the application.
 *
 * Requirements: 3.2, 3.4
 */

"use client";

import { colors } from "@/lib/theme-constants";
import { memo } from "react";

export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Test ID for testing */
  testId?: string;
  /** Button type */
  type?: "button" | "submit" | "reset";
}

/**
 * Get variant-specific styles
 */
function getVariantStyles(variant: ButtonProps["variant"] = "primary"): React.CSSProperties {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: colors.hauntedOrange,
        color: colors.darkVoid,
        border: `2px solid ${colors.hauntedOrange}`,
        boxShadow: `0 0 20px ${colors.hauntedOrange}66, inset 0 2px 4px rgba(255, 255, 255, 0.2)`,
      };
    case "secondary":
      return {
        backgroundColor: colors.midnightPurple,
        color: colors.ghostWhite,
        border: `2px solid ${colors.midnightPurple}`,
        boxShadow: `0 0 20px ${colors.midnightPurple}66`,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: colors.ghostWhite,
        border: `2px solid ${colors.ghostWhite}`,
        boxShadow: "none",
      };
  }
}

/**
 * Get size-specific classes
 */
function getSizeClasses(size: ButtonProps["size"] = "md"): string {
  switch (size) {
    case "sm":
      return "px-4 py-2 text-sm";
    case "md":
      return "px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg";
    case "lg":
      return "px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg";
  }
}

/**
 * Button component with haunted theme styling
 *
 * Features:
 * - Multiple variants (primary, secondary, ghost)
 * - Multiple sizes (sm, md, lg)
 * - Hover and active states
 * - Disabled state
 * - Accessible with ARIA labels
 * - Keyboard navigation support
 */
export const Button = memo(function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ariaLabel,
  testId,
  type = "button",
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <button
      data-testid={testId}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses}
        rounded-lg 
        font-bold 
        transition-all 
        duration-200 
        hover:scale-105 
        active:scale-95 
        focus:outline-none 
        focus:ring-4 
        focus:ring-offset-2 
        focus:ring-offset-gray-900
        disabled:opacity-50 
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      style={
        {
          ...variantStyles,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          minHeight: "48px",
          minWidth: size === "sm" ? "80px" : "120px",
          "--tw-ring-color": variant === "primary" ? colors.hauntedOrange : colors.midnightPurple,
        } as React.CSSProperties
      }
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
});
