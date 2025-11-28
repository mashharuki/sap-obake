import * as fc from "fast-check";
import { describe, it } from "vitest";

describe("Fast-check Setup Verification", () => {
  it("should run property-based tests with fast-check", () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 100 }
    );
  });

  it("should generate random strings", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        return typeof s === "string";
      }),
      { numRuns: 100 }
    );
  });
});
