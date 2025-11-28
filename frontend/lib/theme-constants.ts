/**
 * SAP Obake Haunted Theme Design System
 *
 * This file contains all the theme constants for the haunted Halloween-themed UI.
 * These values are used throughout the application for consistent styling.
 */

/**
 * Color Palette
 * All colors follow the haunted Halloween theme
 */
export const colors = {
  // Primary colors
  ghostWhite: "#F8F8FF",
  midnightPurple: "#2D1B4E",
  hauntedOrange: "#FF6B35",
  witchGreen: "#4A7C59",

  // Background colors
  darkVoid: "#0A0A0A",
  shadowGray: "#1A1A1A",
  mistGray: "#2A2A2A",

  // Accent colors
  bloodRed: "#8B0000",
  ghostlyBlue: "#4A5F7F",
  poisonGreen: "#39FF14",

  // Feedback colors
  correctGlow: "#4ADE80",
  incorrectGlow: "#F87171",
  warningGlow: "#FBBF24",
} as const;

/**
 * Shadow Effects
 * Glow and shadow effects for the haunted theme
 */
export const shadows = {
  ghostly: "0 0 20px rgba(138, 43, 226, 0.5)",
  eerie: "0 4px 20px rgba(0, 0, 0, 0.8)",
  haunted: "0 0 30px rgba(255, 107, 53, 0.3)",
} as const;

/**
 * Animation Durations
 * Standard durations for consistent animations
 */
export const animations = {
  float: {
    duration: "3s",
    timing: "ease-in-out",
    iteration: "infinite",
  },
  pulse: {
    duration: "2s",
    timing: "cubic-bezier(0.4, 0, 0.6, 1)",
    iteration: "infinite",
  },
  flicker: {
    duration: "4s",
    timing: "linear",
    iteration: "infinite",
  },
  fadeIn: {
    duration: "0.5s",
    timing: "ease-in",
    iteration: "1",
  },
} as const;

/**
 * Typography
 * Font families for different text types
 */
export const typography = {
  heading: "var(--font-creepster), Creepster, cursive",
  body: "var(--font-inter), Inter, sans-serif",
  code: "var(--font-fira-code), Fira Code, monospace",
} as const;

/**
 * Breakpoints
 * Responsive design breakpoints
 */
export const breakpoints = {
  mobile: "320px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1440px",
} as const;

/**
 * Z-Index Layers
 * Consistent z-index values for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

/**
 * Spacing Scale
 * Consistent spacing values
 */
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

/**
 * Border Radius
 * Consistent border radius values
 */
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
} as const;

/**
 * Transition Durations
 * Standard transition durations
 */
export const transitions = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const;

/**
 * Content Domain Colors
 * Colors for each AWS SAP exam content domain
 */
export const domainColors = {
  "complex-organizations": colors.midnightPurple,
  "new-solutions": colors.hauntedOrange,
  "continuous-improvement": colors.witchGreen,
  "migration-modernization": colors.ghostlyBlue,
} as const;

/**
 * Utility function to get domain color
 */
export function getDomainColor(domain: keyof typeof domainColors): string {
  return domainColors[domain] || colors.ghostlyBlue;
}

/**
 * Utility function to create glow effect
 */
export function createGlow(color: string, intensity: "low" | "medium" | "high" = "medium"): string {
  const intensityMap = {
    low: "10px",
    medium: "20px",
    high: "30px",
  };
  return `0 0 ${intensityMap[intensity]} ${color}`;
}
