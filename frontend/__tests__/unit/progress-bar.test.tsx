/**
 * Unit Tests for ProgressBar Component
 *
 * Tests the rendering and behavior of the ProgressBar component
 * Validates: Requirements 1.4, 3.2, 3.3
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "@/components/progress-bar";

describe("ProgressBar Component", () => {
  describe("Rendering", () => {
    it("should render question number in correct format", () => {
      render(<ProgressBar current={5} total={20} correctCount={3} />);

      expect(screen.getByText(/Question 5\/20/i)).toBeInTheDocument();
    });

    it("should render correct answer count", () => {
      render(<ProgressBar current={10} total={20} correctCount={7} />);

      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText(/Correct:/i)).toBeInTheDocument();
    });

    it("should render progress bar with correct ARIA attributes", () => {
      render(<ProgressBar current={8} total={20} correctCount={5} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute("aria-valuenow", "8");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "20");
    });

    it("should render progress percentage text", () => {
      render(<ProgressBar current={10} total={20} correctCount={6} />);

      // 10/20 = 50%
      expect(screen.getByText(/50% Complete/i)).toBeInTheDocument();
    });
  });

  describe("Progress Calculation", () => {
    it("should show 0% at start", () => {
      render(<ProgressBar current={0} total={20} correctCount={0} />);

      expect(screen.getByText(/0% Complete/i)).toBeInTheDocument();
    });

    it("should show 50% at halfway point", () => {
      render(<ProgressBar current={10} total={20} correctCount={5} />);

      expect(screen.getByText(/50% Complete/i)).toBeInTheDocument();
    });

    it("should show 100% at completion", () => {
      render(<ProgressBar current={20} total={20} correctCount={15} />);

      expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
    });

    it("should calculate percentage correctly for any progress", () => {
      const testCases = [
        { current: 1, total: 20, expected: "5" },
        { current: 5, total: 20, expected: "25" },
        { current: 15, total: 20, expected: "75" },
        { current: 19, total: 20, expected: "95" },
      ];

      for (const { current, total, expected } of testCases) {
        const { unmount } = render(
          <ProgressBar current={current} total={total} correctCount={0} />
        );

        expect(screen.getByText(new RegExp(`${expected}% Complete`, "i"))).toBeInTheDocument();

        unmount();
      }
    });
  });

  describe("Correct Answer Display", () => {
    it("should show 0 correct answers at start", () => {
      render(<ProgressBar current={1} total={20} correctCount={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should update correct count as answers are recorded", () => {
      const { rerender } = render(<ProgressBar current={1} total={20} correctCount={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();

      rerender(<ProgressBar current={2} total={20} correctCount={1} />);
      expect(screen.getByText("1")).toBeInTheDocument();

      rerender(<ProgressBar current={3} total={20} correctCount={2} />);
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should handle all correct answers", () => {
      render(<ProgressBar current={20} total={20} correctCount={20} />);

      expect(screen.getByText("20")).toBeInTheDocument();
    });

    it("should handle all incorrect answers", () => {
      render(<ProgressBar current={20} total={20} correctCount={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<ProgressBar current={5} total={20} correctCount={3} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute(
        "aria-label",
        "Progress: 5 of 20 questions answered, 3 correct"
      );
    });

    it("should have live region for question number", () => {
      render(<ProgressBar current={5} total={20} correctCount={3} />);

      const questionNumber = screen.getByText(/Question 5\/20/i).closest("div");
      expect(questionNumber).toHaveAttribute("aria-live", "polite");
      expect(questionNumber).toHaveAttribute("aria-atomic", "true");
    });

    it("should have live region for correct count", () => {
      render(<ProgressBar current={5} total={20} correctCount={3} />);

      const correctCount = screen.getByText("3").closest("div");
      expect(correctCount).toHaveAttribute("aria-live", "polite");
      expect(correctCount).toHaveAttribute("aria-atomic", "true");
    });

    it("should have region role for overall progress", () => {
      render(<ProgressBar current={5} total={20} correctCount={3} />);

      const region = screen.getByRole("region", { name: /quiz progress/i });
      expect(region).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle first question", () => {
      render(<ProgressBar current={1} total={20} correctCount={0} />);

      expect(screen.getByText(/Question 1\/20/i)).toBeInTheDocument();
      expect(screen.getByText(/5% Complete/i)).toBeInTheDocument();
    });

    it("should handle last question", () => {
      render(<ProgressBar current={20} total={20} correctCount={15} />);

      expect(screen.getByText(/Question 20\/20/i)).toBeInTheDocument();
      expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
    });

    it("should handle zero correct answers with full progress", () => {
      render(<ProgressBar current={20} total={20} correctCount={0} />);

      expect(screen.getByText(/Question 20\/20/i)).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
    });

    it("should handle perfect score", () => {
      render(<ProgressBar current={20} total={20} correctCount={20} />);

      expect(screen.getByText(/Question 20\/20/i)).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText(/100% Complete/i)).toBeInTheDocument();
    });
  });

  describe("Visual Elements", () => {
    it("should render energy meter segments", () => {
      const { container } = render(<ProgressBar current={10} total={20} correctCount={5} />);

      // Should have 20 segments (one for each question)
      const segments = container.querySelectorAll(".flex-1");
      expect(segments).toHaveLength(20);
    });

    it("should apply correct styling to progress bar", () => {
      render(<ProgressBar current={10} total={20} correctCount={5} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveClass("relative", "w-full", "rounded-lg", "overflow-hidden");
      // Height is responsive: h-5 sm:h-6
      expect(progressBar.className).toMatch(/h-5|sm:h-6/);
    });
  });
});
