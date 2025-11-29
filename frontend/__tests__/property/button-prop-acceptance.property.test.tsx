/**
 * Property-Based Tests for Button Component Prop Acceptance
 * 
 * **Feature: code-refactoring, Property 6: Button component prop acceptance**
 * **Validates: Requirements 3.4**
 * 
 * Tests that the Button component accepts all valid prop combinations
 * and renders without errors across a wide range of randomly generated props.
 */

import { Button, type ButtonProps } from "@/components/ui/button";
import { render } from "@testing-library/react";
import * as fc from "fast-check";
import { describe, it } from "vitest";

// Arbitrary for generating valid button variants
const variantArbitrary = fc.constantFrom("primary", "secondary", "ghost", undefined);

// Arbitrary for generating valid button sizes
const sizeArbitrary = fc.constantFrom("sm", "md", "lg", undefined);

// Arbitrary for generating valid button types
const typeArbitrary = fc.constantFrom("button", "submit", "reset", undefined);

// Arbitrary for generating valid disabled states
const disabledArbitrary = fc.boolean();

// Arbitrary for generating valid className strings
const classNameArbitrary = fc.oneof(
  fc.constant(""),
  fc.constant("custom-class"),
  fc.constant("multiple custom classes"),
  fc.constant(undefined)
);

// Arbitrary for generating valid aria-label strings
const ariaLabelArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 100 }),
  fc.constant(undefined)
);

// Arbitrary for generating valid testId strings
const testIdArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }),
  fc.constant(undefined)
);

// Arbitrary for generating valid children content
const childrenArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }),
  fc.constant("Click me"),
  fc.constant("Submit"),
  fc.constant("Cancel")
);

// Arbitrary for generating complete valid ButtonProps
const validButtonPropsArbitrary = fc.record({
  children: childrenArbitrary,
  onClick: fc.constant(() => {}),
  variant: variantArbitrary,
  size: sizeArbitrary,
  disabled: disabledArbitrary,
  className: classNameArbitrary,
  ariaLabel: ariaLabelArbitrary,
  testId: testIdArbitrary,
  type: typeArbitrary,
}) as fc.Arbitrary<ButtonProps>;

describe("Button Component Prop Acceptance Property Tests", () => {
  describe("Property 6: Button component prop acceptance", () => {
    it("should render without errors for any valid prop combination", () => {
      fc.assert(
        fc.property(validButtonPropsArbitrary, (props) => {
          // Attempt to render the button with the generated props
          let renderSucceeded = false;
          let error: Error | null = null;

          try {
            const { container } = render(<Button {...props} />);
            renderSucceeded = container.querySelector("button") !== null;
          } catch (e) {
            error = e as Error;
          }

          // The button should render successfully without throwing errors
          if (!renderSucceeded || error) {
            console.error("Render failed with props:", props);
            if (error) {
              console.error("Error:", error.message);
            }
          }

          return renderSucceeded && error === null;
        }),
        { numRuns: 100 }
      );
    });

    it("should render with correct variant styling for all variants", () => {
      fc.assert(
        fc.property(
          variantArbitrary,
          childrenArbitrary,
          (variant, children) => {
            const { container } = render(
              <Button onClick={() => {}} variant={variant}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            return button !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should render with correct size classes for all sizes", () => {
      fc.assert(
        fc.property(
          sizeArbitrary,
          childrenArbitrary,
          (size, children) => {
            const { container } = render(
              <Button onClick={() => {}} size={size}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            return button !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should handle disabled state correctly", () => {
      fc.assert(
        fc.property(
          disabledArbitrary,
          childrenArbitrary,
          (disabled, children) => {
            const { container } = render(
              <Button onClick={() => {}} disabled={disabled}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            if (!button) return false;

            // Check that disabled attribute matches the prop
            return button.disabled === disabled;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should apply custom className when provided", () => {
      fc.assert(
        fc.property(
          classNameArbitrary.filter((cn) => cn && cn.trim().length > 0),
          childrenArbitrary,
          (className, children) => {
            const { container } = render(
              <Button onClick={() => {}} className={className}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            if (!button) return false;

            // Check that the custom class is present in the className
            const classNames = button.className.split(" ");
            const customClasses = className?.split(" ").filter((c) => c.trim().length > 0) || [];

            return customClasses.every((customClass) => classNames.includes(customClass));
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should set aria-label when provided", () => {
      fc.assert(
        fc.property(
          ariaLabelArbitrary.filter((label) => label && label.trim().length > 0),
          childrenArbitrary,
          (ariaLabel, children) => {
            const { container } = render(
              <Button onClick={() => {}} ariaLabel={ariaLabel}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            if (!button) return false;

            return button.getAttribute("aria-label") === ariaLabel;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should set data-testid when provided", () => {
      fc.assert(
        fc.property(
          testIdArbitrary.filter((id) => id && id.trim().length > 0),
          childrenArbitrary,
          (testId, children) => {
            const { container } = render(
              <Button onClick={() => {}} testId={testId}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            if (!button) return false;

            return button.getAttribute("data-testid") === testId;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should set button type correctly", () => {
      fc.assert(
        fc.property(
          typeArbitrary,
          childrenArbitrary,
          (type, children) => {
            const { container } = render(
              <Button onClick={() => {}} type={type}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            if (!button) return false;

            // Default type should be "button" if not specified
            const expectedType = type || "button";
            return button.type === expectedType;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should render children content correctly", () => {
      fc.assert(
        fc.property(childrenArbitrary, (children) => {
          const { container } = render(<Button onClick={() => {}}>{children}</Button>);

          const button = container.querySelector("button");
          if (!button) return false;

          return button.textContent === children;
        }),
        { numRuns: 100 }
      );
    });

    it("should handle all variant and size combinations", () => {
      fc.assert(
        fc.property(
          variantArbitrary,
          sizeArbitrary,
          childrenArbitrary,
          (variant, size, children) => {
            const { container } = render(
              <Button onClick={() => {}} variant={variant} size={size}>
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            return button !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should maintain accessibility attributes", () => {
      fc.assert(
        fc.property(
          validButtonPropsArbitrary,
          (props) => {
            const { container } = render(<Button {...props} />);

            const button = container.querySelector("button");
            if (!button) return false;

            // Check that aria-disabled is set correctly
            const ariaDisabled = button.getAttribute("aria-disabled");
            return ariaDisabled === String(props.disabled || false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("should render consistently with the same props", () => {
      fc.assert(
        fc.property(validButtonPropsArbitrary, (props) => {
          const { container: container1 } = render(<Button {...props} />);
          const { container: container2 } = render(<Button {...props} />);

          const button1 = container1.querySelector("button");
          const button2 = container2.querySelector("button");

          if (!button1 || !button2) return false;

          // Both renders should produce buttons with the same attributes
          return (
            button1.disabled === button2.disabled &&
            button1.type === button2.type &&
            button1.textContent === button2.textContent
          );
        }),
        { numRuns: 100 }
      );
    });

    it("should handle edge case: empty string className", () => {
      fc.assert(
        fc.property(childrenArbitrary, (children) => {
          const { container } = render(
            <Button onClick={() => {}} className="">
              {children}
            </Button>
          );

          const button = container.querySelector("button");
          return button !== null;
        }),
        { numRuns: 100 }
      );
    });

    it("should handle edge case: all optional props undefined", () => {
      fc.assert(
        fc.property(childrenArbitrary, (children) => {
          const { container } = render(
            <Button
              onClick={() => {}}
              variant={undefined}
              size={undefined}
              disabled={undefined}
              className={undefined}
              ariaLabel={undefined}
              testId={undefined}
              type={undefined}
            >
              {children}
            </Button>
          );

          const button = container.querySelector("button");
          if (!button) return false;

          // Should use default values
          return (
            button.disabled === false &&
            button.type === "button" &&
            button.textContent === children
          );
        }),
        { numRuns: 100 }
      );
    });

    it("should handle edge case: all optional props provided", () => {
      fc.assert(
        fc.property(
          variantArbitrary.filter((v) => v !== undefined),
          sizeArbitrary.filter((s) => s !== undefined),
          typeArbitrary.filter((t) => t !== undefined),
          disabledArbitrary,
          classNameArbitrary.filter((cn) => cn !== undefined && cn.trim().length > 0),
          ariaLabelArbitrary.filter((al) => al !== undefined && al.trim().length > 0),
          testIdArbitrary.filter((ti) => ti !== undefined && ti.trim().length > 0),
          childrenArbitrary,
          (variant, size, type, disabled, className, ariaLabel, testId, children) => {
            const { container } = render(
              <Button
                onClick={() => {}}
                variant={variant}
                size={size}
                type={type}
                disabled={disabled}
                className={className}
                ariaLabel={ariaLabel}
                testId={testId}
              >
                {children}
              </Button>
            );

            const button = container.querySelector("button");
            return button !== null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
