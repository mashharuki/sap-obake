# Refactoring Baseline

## Test Status Before Refactoring

**Date:** 2025-11-29
**Branch:** refactoring/code-cleanup

### Test Results
- **Test Files:** 13 failed | 12 passed (25 total)
- **Tests:** 97 failed | 220 passed (317 total)
- **Errors:** 263 errors
- **Duration:** 35.19s

### Known Issues
- Property tests failing due to locale undefined in test environment
- Error: `Failed to parse URL from /data/questions-undefined.json`
- This is a pre-existing issue, not caused by refactoring

### Button Styles Documentation

#### NextButton (quiz-session.tsx)
```typescript
style={{
  backgroundColor: colors.hauntedOrange,
  color: colors.darkVoid,
  border: `2px solid ${colors.hauntedOrange}`,
  boxShadow: `0 0 20px ${colors.hauntedOrange}66`,
  touchAction: "manipulation",
  WebkitTapHighlightColor: "transparent",
  minHeight: "48px",
  minWidth: "120px",
  "--tw-ring-color": colors.hauntedOrange,
}}
className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
```

#### Restart Button (results-summary.tsx)
```typescript
style={{
  backgroundColor: colors.hauntedOrange,
  color: colors.darkVoid,
  border: `2px solid ${colors.hauntedOrange}`,
  boxShadow: `${createGlow(colors.hauntedOrange, "medium")}, inset 0 2px 4px rgba(255, 255, 255, 0.2)`,
  "--focus-ring-color": colors.hauntedOrange,
  minHeight: "48px",
}}
className="px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900"
```

### Files Using question-bank.ts
None found - the deprecated function is not currently being used.

## Next Steps
1. Consolidate validation logic
2. Create shared Button component
3. Remove deprecated code
4. Run tests again to verify no regressions
