/**
 * Button Component Snapshot Tests
 *
 * Snapshot tests for the shared Button component variants and sizes.
 * These tests ensure visual consistency across refactoring.
 *
 * Requirements: 3.3
 */

import { Button } from "@/components/ui/button";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Button Component Snapshots", () => {
  describe("Variant Snapshots", () => {
    it("should match snapshot for primary variant", () => {
      const { container } = render(
        <Button onClick={() => {}} variant="primary">
          Primary Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for secondary variant", () => {
      const { container } = render(
        <Button onClick={() => {}} variant="secondary">
          Secondary Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for ghost variant", () => {
      const { container } = render(
        <Button onClick={() => {}} variant="ghost">
          Ghost Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("Size Snapshots", () => {
    it("should match snapshot for small size", () => {
      const { container } = render(
        <Button onClick={() => {}} size="sm">
          Small Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for medium size", () => {
      const { container } = render(
        <Button onClick={() => {}} size="md">
          Medium Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for large size", () => {
      const { container } = render(
        <Button onClick={() => {}} size="lg">
          Large Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("Combined Variant and Size Snapshots", () => {
    it("should match snapshot for primary small button", () => {
      const { container } = render(
        <Button onClick={() => {}} variant="primary" size="sm">
          Primary Small
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for secondary medium button", () => {
      const { container } = render(
        <Button onClick={() => {}} variant="secondary" size="md">
          Secondary Medium
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for ghost large button", () => {
      const { container } = render(
        <Button onClick={() => {}} variant="ghost" size="lg">
          Ghost Large
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("State Snapshots", () => {
    it("should match snapshot for disabled button", () => {
      const { container } = render(
        <Button onClick={() => {}} disabled>
          Disabled Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for button with custom className", () => {
      const { container } = render(
        <Button onClick={() => {}} className="custom-class">
          Custom Class Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("should match snapshot for button with aria-label", () => {
      const { container } = render(
        <Button onClick={() => {}} ariaLabel="Custom Label">
          Aria Label Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
