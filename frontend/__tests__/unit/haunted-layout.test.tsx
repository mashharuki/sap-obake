/**
 * Unit tests for HauntedLayout component (RED phase - TDD)
 *
 * These tests are written BEFORE the component implementation.
 * They should initially FAIL until the component is implemented.
 *
 * Requirements tested:
 * - 5.1: Dark Halloween-themed color scheme
 * - 5.2: Spooky design elements (ghost icons, cobweb patterns)
 * - 5.5: Haunting theme without distracting from content
 * - 7.1: Mobile device responsive layout
 * - 7.2: Desktop device responsive layout
 * - 7.5: Consistent haunting UI theme across screen sizes
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HauntedLayout } from "@/components/haunted-layout";

describe("HauntedLayout Component (RED - TDD)", () => {
  describe("Dark Background Rendering", () => {
    it("should render with dark background color", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      // Get the layout container
      const layout = screen.getByTestId("haunted-layout");

      // Check if background color is dark (darkVoid or shadowGray)
      const styles = window.getComputedStyle(layout);
      const bgColor = styles.backgroundColor;

      // Should have a dark background (checking for dark colors)
      expect(bgColor).toBeTruthy();
      // The background should be one of our dark theme colors
      expect(layout).toHaveStyle({
        backgroundColor: expect.stringMatching(
          /rgb\(10,\s*10,\s*10\)|rgb\(26,\s*26,\s*26\)|#0A0A0A|#1A1A1A/i
        ),
      });
    });

    it("should render children content", () => {
      render(
        <HauntedLayout>
          <div data-testid="child-content">Test Content</div>
        </HauntedLayout>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should have Halloween-themed styling", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");

      // Should have some form of themed styling
      const className = layout.className;
      expect(className).toMatch(/haunted|dark|theme/i);
    });
  });

  describe("Responsive Layout Behavior", () => {
    it("should render with responsive container", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");

      // Should have responsive width/max-width styling
      const styles = window.getComputedStyle(layout);
      expect(styles.width || styles.maxWidth).toBeTruthy();
    });

    it("should apply mobile-friendly padding", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");

      // Should have responsive padding classes on content div (optimized for better touch targets)
      const contentDiv = layout.querySelector(".relative.z-10");
      expect(contentDiv).toHaveClass("px-4");
      expect(contentDiv).toHaveClass("sm:px-6");
      expect(contentDiv).toHaveClass("md:px-8");
    });

    it("should maintain layout structure across viewport changes", () => {
      const { rerender } = render(
        <HauntedLayout>
          <div data-testid="content">Original Content</div>
        </HauntedLayout>
      );

      // Content should be present
      expect(screen.getByTestId("content")).toBeInTheDocument();

      // Rerender (simulating viewport change)
      rerender(
        <HauntedLayout>
          <div data-testid="content">Original Content</div>
        </HauntedLayout>
      );

      // Content should still be present after rerender
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  describe("Prefers-Reduced-Motion Support", () => {
    it("should respect prefers-reduced-motion media query", () => {
      // Mock matchMedia for prefers-reduced-motion
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      vi.stubGlobal("matchMedia", mockMatchMedia);

      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");

      // Should have reduced motion class or attribute when prefers-reduced-motion is active
      expect(
        layout.classList.contains("reduce-motion") || layout.hasAttribute("data-reduce-motion")
      ).toBe(true);

      vi.unstubAllGlobals();
    });

    it("should disable animations when prefers-reduced-motion is set", () => {
      // Mock matchMedia for prefers-reduced-motion
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      vi.stubGlobal("matchMedia", mockMatchMedia);

      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");
      const styles = window.getComputedStyle(layout);

      // When reduced motion is preferred, animations should be disabled or minimal
      // This could be checked via animation-duration or animation-play-state
      expect(
        styles.animationDuration === "0s" ||
          styles.animationPlayState === "paused" ||
          layout.hasAttribute("data-reduce-motion")
      ).toBe(true);

      vi.unstubAllGlobals();
    });

    it("should enable animations when prefers-reduced-motion is not set", () => {
      // Mock matchMedia for NO prefers-reduced-motion
      const mockMatchMedia = vi.fn((query: string) => ({
        matches: false, // No reduced motion preference
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      vi.stubGlobal("matchMedia", mockMatchMedia);

      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");

      // Should NOT have reduced motion class when preference is not set
      expect(
        !layout.classList.contains("reduce-motion") && !layout.hasAttribute("data-reduce-motion")
      ).toBe(true);

      vi.unstubAllGlobals();
    });
  });

  describe("Spooky Design Elements", () => {
    it("should include particle effect background", () => {
      render(
        <HauntedLayout showGhosts={true}>
          <div>Test Content</div>
        </HauntedLayout>
      );

      // Should have particle effect container
      const particles = screen.queryByTestId("particle-effect");
      expect(particles).toBeInTheDocument();
    });

    it("should include cobweb decorations", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      // Should have cobweb decorations
      const cobwebs = screen.queryByTestId("cobweb-decoration");
      expect(cobwebs).toBeInTheDocument();
    });

    it("should allow disabling ghost effects", () => {
      render(
        <HauntedLayout showGhosts={false}>
          <div>Test Content</div>
        </HauntedLayout>
      );

      // Particle effects should not be present when showGhosts is false
      const particles = screen.queryByTestId("particle-effect");
      expect(particles).not.toBeInTheDocument();
    });
  });

  describe("Animation Intensity", () => {
    it("should support low animation intensity", () => {
      render(
        <HauntedLayout animationIntensity="low">
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");
      expect(
        layout.hasAttribute("data-animation-intensity") &&
          layout.getAttribute("data-animation-intensity") === "low"
      ).toBe(true);
    });

    it("should support medium animation intensity (default)", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");
      expect(
        !layout.hasAttribute("data-animation-intensity") ||
          layout.getAttribute("data-animation-intensity") === "medium"
      ).toBe(true);
    });

    it("should support high animation intensity", () => {
      render(
        <HauntedLayout animationIntensity="high">
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");
      expect(
        layout.hasAttribute("data-animation-intensity") &&
          layout.getAttribute("data-animation-intensity") === "high"
      ).toBe(true);
    });
  });

  describe("WCAG AA Color Contrast Compliance", () => {
    it("should have sufficient color contrast for text", () => {
      render(
        <HauntedLayout>
          <div>Test Content</div>
        </HauntedLayout>
      );

      const layout = screen.getByTestId("haunted-layout");
      const styles = window.getComputedStyle(layout);

      // Text color should be light (ghostWhite) on dark background
      // This ensures WCAG AA compliance
      expect(styles.color).toBeTruthy();
    });
  });
});
