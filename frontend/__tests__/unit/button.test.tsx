/**
 * Button Component Unit Tests
 *
 * Tests for the shared Button component with haunted theme styling.
 * Requirements: 3.2, 3.3, 3.4
 */

import { Button } from "@/components/ui/button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(<Button onClick={() => {}}>Click me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("should render with custom testId", () => {
      render(
        <Button onClick={() => {}} testId="custom-button">
          Test
        </Button>
      );
      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    });

    it("should render with aria-label", () => {
      render(
        <Button onClick={() => {}} ariaLabel="Custom label">
          Button
        </Button>
      );
      expect(screen.getByRole("button", { name: "Custom label" })).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <Button onClick={() => {}} className="custom-class">
          Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });

  describe("Variants", () => {
    it("should render primary variant with correct styles", () => {
      render(
        <Button onClick={() => {}} variant="primary">
          Primary
        </Button>
      );
      const button = screen.getByRole("button");
      // Colors are converted to RGB format by the browser
      expect(button.style.backgroundColor).toBe("rgb(255, 107, 53)");
      expect(button.style.color).toBe("rgb(10, 10, 10)");
    });

    it("should render secondary variant with correct styles", () => {
      render(
        <Button onClick={() => {}} variant="secondary">
          Secondary
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.backgroundColor).toBe("rgb(45, 27, 78)");
      expect(button.style.color).toBe("rgb(248, 248, 255)");
    });

    it("should render ghost variant with correct styles", () => {
      render(
        <Button onClick={() => {}} variant="ghost">
          Ghost
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.backgroundColor).toBe("transparent");
      expect(button.style.color).toBe("rgb(248, 248, 255)");
    });

    it("should default to primary variant when not specified", () => {
      render(<Button onClick={() => {}}>Default</Button>);
      const button = screen.getByRole("button");
      expect(button.style.backgroundColor).toBe("rgb(255, 107, 53)");
    });
  });

  describe("Sizes", () => {
    it("should render small size with correct classes", () => {
      render(
        <Button onClick={() => {}} size="sm">
          Small
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("px-4");
      expect(button.className).toContain("py-2");
      expect(button.className).toContain("text-sm");
    });

    it("should render medium size with correct classes", () => {
      render(
        <Button onClick={() => {}} size="md">
          Medium
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("px-6");
      expect(button.className).toContain("py-3");
    });

    it("should render large size with correct classes", () => {
      render(
        <Button onClick={() => {}} size="lg">
          Large
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("px-8");
      expect(button.className).toContain("py-4");
    });

    it("should default to medium size when not specified", () => {
      render(<Button onClick={() => {}}>Default</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("px-6");
      expect(button.className).toContain("py-3");
    });
  });

  describe("Disabled State", () => {
    it("should render disabled button", () => {
      render(
        <Button onClick={() => {}} disabled>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should apply disabled styles", () => {
      render(
        <Button onClick={() => {}} disabled>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("disabled:opacity-50");
      expect(button.className).toContain("disabled:cursor-not-allowed");
    });

    it("should set aria-disabled attribute", () => {
      render(
        <Button onClick={() => {}} disabled>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("should not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Click Handler", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick multiple times", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Button Type", () => {
    it("should default to button type", () => {
      render(<Button onClick={() => {}}>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("should support submit type", () => {
      render(
        <Button onClick={() => {}} type="submit">
          Submit
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should support reset type", () => {
      render(
        <Button onClick={() => {}} type="reset">
          Reset
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Accessibility", () => {
    it("should have focus styles", () => {
      render(<Button onClick={() => {}}>Focus me</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("focus:outline-none");
      expect(button.className).toContain("focus:ring-4");
    });

    it("should have minimum touch target size", () => {
      render(<Button onClick={() => {}}>Touch</Button>);
      const button = screen.getByRole("button");
      expect(button.style.minHeight).toBe("48px");
    });

    it("should have minimum width for small buttons", () => {
      render(
        <Button onClick={() => {}} size="sm">
          Small
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.minWidth).toBe("80px");
    });

    it("should have minimum width for medium and large buttons", () => {
      render(
        <Button onClick={() => {}} size="md">
          Medium
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.minWidth).toBe("120px");
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should support space key activation", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Space</Button>);

      const button = screen.getByRole("button");
      button.focus();

      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling", () => {
    it("should have transition classes", () => {
      render(<Button onClick={() => {}}>Transition</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("transition-all");
      expect(button.className).toContain("duration-200");
    });

    it("should have hover scale class", () => {
      render(<Button onClick={() => {}}>Hover</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("hover:scale-105");
    });

    it("should have active scale class", () => {
      render(<Button onClick={() => {}}>Active</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("active:scale-95");
    });

    it("should have rounded corners", () => {
      render(<Button onClick={() => {}}>Rounded</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("rounded-lg");
    });

    it("should have bold font", () => {
      render(<Button onClick={() => {}}>Bold</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("font-bold");
    });
  });

  describe("Combination Tests", () => {
    it("should render primary small button", () => {
      render(
        <Button onClick={() => {}} variant="primary" size="sm">
          Primary Small
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.backgroundColor).toBe("rgb(255, 107, 53)");
      expect(button.className).toContain("px-4");
    });

    it("should render secondary large disabled button", () => {
      render(
        <Button onClick={() => {}} variant="secondary" size="lg" disabled>
          Secondary Large Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.backgroundColor).toBe("rgb(45, 27, 78)");
      expect(button.className).toContain("px-8");
      expect(button).toBeDisabled();
    });

    it("should render ghost medium button with custom class", () => {
      render(
        <Button onClick={() => {}} variant="ghost" size="md" className="custom">
          Ghost Medium Custom
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button.style.backgroundColor).toBe("transparent");
      expect(button.className).toContain("px-6");
      expect(button.className).toContain("custom");
    });
  });
});
