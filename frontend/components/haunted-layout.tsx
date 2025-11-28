"use client";

/**
 * HauntedLayout Component
 *
 * A Halloween-themed layout component that provides:
 * - Dark, spooky background with haunted theme
 * - Particle effects (floating dust/sparkles)
 * - Cobweb SVG decorations in corners
 * - Responsive design for mobile and desktop
 * - Support for prefers-reduced-motion
 * - WCAG AA color contrast compliance
 *
 * Requirements: 5.1, 5.2, 5.5, 7.1, 7.2, 7.5
 *
 * Optimizations:
 * - Memoized particle generation for better performance
 * - CSS-only animations with GPU acceleration
 * - Improved accessibility with semantic HTML and ARIA labels
 * - Reduced re-renders with useMemo
 */

import { memo, type ReactNode, useEffect, useMemo, useState } from "react";
import { colors } from "@/lib/theme-constants";

interface HauntedLayoutProps {
  children: ReactNode;
  showGhosts?: boolean;
  animationIntensity?: "low" | "medium" | "high";
}

export function HauntedLayout({
  children,
  showGhosts = true,
  animationIntensity = "medium",
}: HauntedLayoutProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion media query
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      // Listen for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Memoize style object to prevent unnecessary re-renders
  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.darkVoid,
      color: colors.ghostWhite,
      animationDuration: prefersReducedMotion ? "0s" : undefined,
      animationPlayState: prefersReducedMotion ? "paused" : undefined,
      width: "100%",
      maxWidth: "100%",
    }),
    [prefersReducedMotion]
  );

  return (
    <div
      data-testid="haunted-layout"
      className={`haunted-layout dark-theme min-h-screen w-full relative overflow-x-hidden ${prefersReducedMotion ? "reduce-motion" : ""}`}
      style={containerStyle}
      data-animation-intensity={animationIntensity}
      data-reduce-motion={prefersReducedMotion ? "true" : undefined}
    >
      {/* Cobweb Decorations */}
      <CobwebDecoration />

      {/* Particle Effect Background */}
      {showGhosts && !prefersReducedMotion && <ParticleEffect intensity={animationIntensity} />}

      {/* Main Content - Optimized responsive padding */}
      <main
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8"
        aria-label="Quiz application content"
      >
        {children}
      </main>
    </div>
  );
}

/**
 * Cobweb SVG Decoration Component
 * Adds spooky cobweb decorations in the corners
 * Memoized to prevent unnecessary re-renders
 */
const CobwebDecoration = memo(function CobwebDecoration() {
  // Memoize cobweb path to avoid recalculation
  const cobwebPath =
    "M0 0 L50 50 M0 0 L30 20 M0 0 L20 30 M50 0 L50 50 M50 0 L40 20 M50 0 L30 30 M0 50 L50 50 M0 50 L20 40 M0 50 L30 30";

  return (
    <div
      data-testid="cobweb-decoration"
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
      role="presentation"
    >
      {/* Top Left Cobweb */}
      <svg
        className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 opacity-20"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <title>Decorative cobweb</title>
        <path d={cobwebPath} stroke={colors.mistGray} strokeWidth="1" />
        <circle cx="50" cy="50" r="3" fill={colors.mistGray} />
        <circle cx="30" cy="20" r="2" fill={colors.mistGray} />
        <circle cx="20" cy="30" r="2" fill={colors.mistGray} />
        <circle cx="40" cy="20" r="2" fill={colors.mistGray} />
        <circle cx="30" cy="30" r="2" fill={colors.mistGray} />
        <circle cx="20" cy="40" r="2" fill={colors.mistGray} />
      </svg>

      {/* Top Right Cobweb */}
      <svg
        className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 opacity-20 transform scale-x-[-1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <title>Decorative cobweb</title>
        <path d={cobwebPath} stroke={colors.mistGray} strokeWidth="1" />
        <circle cx="50" cy="50" r="3" fill={colors.mistGray} />
        <circle cx="30" cy="20" r="2" fill={colors.mistGray} />
        <circle cx="20" cy="30" r="2" fill={colors.mistGray} />
        <circle cx="40" cy="20" r="2" fill={colors.mistGray} />
        <circle cx="30" cy="30" r="2" fill={colors.mistGray} />
        <circle cx="20" cy="40" r="2" fill={colors.mistGray} />
      </svg>
    </div>
  );
});

/**
 * Particle Effect Component
 * Creates floating dust/sparkle particles for atmospheric effect
 * Optimized with memoization and GPU-accelerated animations
 */
const ParticleEffect = memo(function ParticleEffect({
  intensity,
}: {
  intensity: "low" | "medium" | "high";
}) {
  const particleCount = {
    low: 10,
    medium: 20,
    high: 30,
  }[intensity];

  // Memoize particle generation to prevent recalculation on every render
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 10}s`,
        size: Math.random() * 3 + 1,
        translateX: Math.random() * 100 - 50,
      })),
    [particleCount]
  );

  // Memoize keyframes to avoid recalculation
  const keyframesStyle = useMemo(
    () => `
			@keyframes float {
				0% {
					transform: translate3d(0, 0, 0);
					opacity: 0;
				}
				10% {
					opacity: 0.3;
				}
				90% {
					opacity: 0.3;
				}
				100% {
					transform: translate3d(var(--translate-x), 100vh, 0);
					opacity: 0;
				}
			}
		`,
    []
  );

  return (
    <div
      data-testid="particle-effect"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute rounded-full opacity-30"
          style={{
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: colors.ghostWhite,
            animation: `float ${particle.animationDuration} ease-in-out infinite`,
            animationDelay: particle.animationDelay,
            top: "-10px",
            // Use CSS custom property for GPU-accelerated transform
            // @ts-expect-error - CSS custom properties
            "--translate-x": `${particle.translateX}px`,
            // Enable GPU acceleration with will-change
            willChange: "transform, opacity",
          }}
        />
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: keyframesStyle,
        }}
      />
    </div>
  );
});
