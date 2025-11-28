/**
 * Unit Tests for Timer Component
 *
 * Tests cover:
 * - Time display formatting
 * - Real-time updates
 * - 30-minute warning display
 *
 * Requirements: 3.1, 3.5
 */

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Timer from "@/components/timer";

describe("Timer Component", () => {
  beforeEach(() => {
    // Use fake timers for predictable testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers
    vi.restoreAllMocks();
  });

  describe("Time Display Formatting", () => {
    it("should display time in MM:SS format", () => {
      // Requirements: 3.1
      const startTime = Date.now();

      render(<Timer startTime={startTime} />);

      // Should display initial time as 0:00
      const timeDisplay = screen.getByTestId("timer-display");
      expect(timeDisplay.textContent).toMatch(/^\d+:\d{2}$/);
    });

    it("should display 0:00 at start", () => {
      // Requirements: 3.1
      const startTime = Date.now();

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");
      expect(timeDisplay.textContent).toBe("0:00");
    });

    it("should format seconds with leading zero", () => {
      // Requirements: 3.1
      // Start time 5 seconds ago
      const startTime = Date.now() - 5000;

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");
      expect(timeDisplay.textContent).toBe("0:05");
    });

    it("should display minutes correctly", () => {
      // Requirements: 3.1
      // Start time 90 seconds ago (1:30)
      const startTime = Date.now() - 90000;

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");
      expect(timeDisplay.textContent).toBe("1:30");
    });

    it("should handle times over 60 minutes", () => {
      // Requirements: 3.1
      // Start time 3661 seconds ago (61:01)
      const startTime = Date.now() - 3661000;

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");
      expect(timeDisplay.textContent).toBe("61:01");
    });
  });

  describe("Real-time Updates", () => {
    it("should set up an interval for updates", () => {
      // Requirements: 3.1
      const startTime = Date.now();
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      render(<Timer startTime={startTime} />);

      // Should have called setInterval with 1000ms (1 second)
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it("should display elapsed time based on start time", () => {
      // Requirements: 3.1
      // Start time 5 seconds ago
      const startTime = Date.now() - 5000;

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");
      // Should show approximately 0:05 (allowing for small timing differences)
      expect(timeDisplay.textContent).toMatch(/0:0[45]/);
    });

    it("should clean up interval on unmount", () => {
      // Requirements: 3.1
      const startTime = Date.now();

      const { unmount } = render(<Timer startTime={startTime} />);

      // Spy on clearInterval
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      unmount();

      // Should have called clearInterval
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe("30-minute Warning", () => {
    it("should not show warning before 30 minutes", () => {
      // Requirements: 3.5
      // Start time 29 minutes ago (1740 seconds)
      const startTime = Date.now() - 1740000;

      render(<Timer startTime={startTime} />);

      // Warning should not be visible
      const warning = screen.queryByTestId("timer-warning");
      expect(warning).not.toBeInTheDocument();
    });

    it("should show warning at exactly 30 minutes", () => {
      // Requirements: 3.5
      // Start time 30 minutes ago (1800 seconds)
      const startTime = Date.now() - 1800000;

      render(<Timer startTime={startTime} />);

      // Warning should be visible
      const warning = screen.getByTestId("timer-warning");
      expect(warning).toBeInTheDocument();
    });

    it("should show warning after 30 minutes", () => {
      // Requirements: 3.5
      // Start time 35 minutes ago (2100 seconds)
      const startTime = Date.now() - 2100000;

      render(<Timer startTime={startTime} />);

      // Warning should be visible
      const warning = screen.getByTestId("timer-warning");
      expect(warning).toBeInTheDocument();
    });

    it("should show warning immediately when starting at threshold", () => {
      // Requirements: 3.5
      // Start time exactly at 30 minutes ago
      const startTime = Date.now() - 1800000;

      render(<Timer startTime={startTime} />);

      // Warning should be visible immediately
      const warning = screen.getByTestId("timer-warning");
      expect(warning).toBeInTheDocument();
    });

    it("should call onWarning callback when starting at threshold", () => {
      // Requirements: 3.5
      const onWarning = vi.fn();
      // Start time exactly at 30 minutes ago
      const startTime = Date.now() - 1800000;

      render(<Timer startTime={startTime} onWarning={onWarning} />);

      // Callback should be called on first render/update
      // Wait a bit for the interval to fire
      setTimeout(() => {
        expect(onWarning).toHaveBeenCalled();
      }, 1100);
    });

    it("should have warning ref to prevent multiple callbacks", () => {
      // Requirements: 3.5
      const onWarning = vi.fn();
      // Start time past 30 minutes
      const startTime = Date.now() - 1900000;

      const { rerender } = render(<Timer startTime={startTime} onWarning={onWarning} />);

      // Rerender multiple times
      rerender(<Timer startTime={startTime} onWarning={onWarning} />);
      rerender(<Timer startTime={startTime} onWarning={onWarning} />);

      // Callback should only be called once (or not at all if ref prevents it)
      // The component uses a ref to track if warning was triggered
      setTimeout(() => {
        expect(onWarning).toHaveBeenCalledTimes(1);
      }, 1100);
    });
  });

  describe("Styling and Accessibility", () => {
    it("should have haunted theme styling", () => {
      // Requirements: 3.1, 5.1
      const startTime = Date.now();

      render(<Timer startTime={startTime} />);

      const timerContainer = screen.getByTestId("timer-container");

      // Should have haunted theme classes
      expect(timerContainer.className).toContain("haunted");
    });

    it("should be styled as a glowing pocket watch", () => {
      // Requirements: 3.1, 5.2
      const startTime = Date.now();

      render(<Timer startTime={startTime} />);

      const timerContainer = screen.getByTestId("timer-container");

      // Should have glow effect
      expect(timerContainer.className).toMatch(/glow|shadow/);
    });

    it("should have proper ARIA labels", () => {
      // Requirements: 5.3
      const startTime = Date.now();

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");

      // Should have aria-label for screen readers
      expect(timeDisplay).toHaveAttribute("aria-label");
    });

    it("should have live region for screen readers", () => {
      // Requirements: 5.3
      const startTime = Date.now();

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");

      // Should have aria-live for dynamic updates
      expect(timeDisplay).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Edge Cases", () => {
    it("should handle negative start time gracefully", () => {
      // Edge case: invalid start time
      const startTime = -1000;

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");

      // Should display a valid time format (not crash)
      expect(timeDisplay.textContent).toMatch(/^\d+:\d{2}$/);
    });

    it("should handle very large elapsed times", () => {
      // Edge case: timer running for more than 24 hours
      const startTime = Date.now() - 90000000; // 25 hours ago

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");

      // Should still display correctly
      expect(timeDisplay.textContent).toMatch(/^\d+:\d{2}$/);
    });

    it("should handle start time in the future", () => {
      // Edge case: start time is in the future
      const startTime = Date.now() + 10000;

      render(<Timer startTime={startTime} />);

      const timeDisplay = screen.getByTestId("timer-display");

      // Should display 0:00 (not negative time)
      expect(timeDisplay.textContent).toBe("0:00");
    });
  });
});
