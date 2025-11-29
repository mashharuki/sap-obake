# Design Document - Code Refactoring

## Overview

このドキュメントは、SAP Obakeプロジェクトの段階的なリファクタリングの設計を定義します。主な目標は、コードの冗長性を排除し、保守性を向上させることです。既存の機能を完全に維持しながら、以下の改善を実施します：

1. Deprecated関数の削除
2. 重複バリデーションロジックの統合
3. 共通ボタンコンポーネントの作成
4. 不要なコメントとコードの削除

## Architecture

### Current Architecture

```
frontend/
├── lib/
│   ├── question-bank.ts (deprecated functions)
│   ├── question-loader.ts (validation logic)
│   ├── types.ts (type guards)
│   └── ...
├── components/
│   ├── quiz-session.tsx (button styles)
│   ├── results-summary.tsx (button styles)
│   └── ...
```

### Target Architecture

```
frontend/
├── lib/
│   ├── question-loader.ts (unified validation)
│   ├── types.ts (type guards)
│   └── ...
├── components/
│   ├── ui/
│   │   └── button.tsx (shared button component)
│   ├── quiz-session.tsx (uses shared button)
│   ├── results-summary.tsx (uses shared button)
│   └── ...
```

## Components and Interfaces

### 1. Validation Consolidation

**Before:**
- `question-bank.ts`: `validateQuestionBank(questions: Question[])`
- `question-loader.ts`: `isValidQuestion(question: Question)`
- `types.ts`: Type guard functions

**After:**
- `question-loader.ts`: Unified validation with both batch and single question validation
- Remove `question-bank.ts` entirely (deprecated)

**Interface:**
```typescript
// Unified validation in question-loader.ts
export function validateQuestion(question: Question): {
  isValid: boolean;
  errors: string[];
}

export function validateQuestions(questions: Question[]): {
  isValid: boolean;
  errors: string[];
}

// Keep existing type guard for runtime checks
export function isValidQuestion(question: Question): boolean
```

### 2. Shared Button Component

**Interface:**
```typescript
// components/ui/button.tsx
export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  testId?: string;
}

export const Button: React.FC<ButtonProps>
```

**Variants:**
- `primary`: Haunted orange button (main actions)
- `secondary`: Purple button (secondary actions)
- `ghost`: Transparent button (tertiary actions)

### 3. File Changes

**Files to Modify:**
1. `frontend/lib/question-bank.ts` - DELETE (deprecated)
2. `frontend/lib/question-loader.ts` - ADD unified validation
3. `frontend/components/ui/button.tsx` - CREATE new component
4. `frontend/components/quiz-session.tsx` - USE shared button
5. `frontend/components/results-summary.tsx` - USE shared button

**Files to Update (imports):**
- Any file importing from `question-bank.ts`

## Data Models

No changes to existing data models. All interfaces in `types.ts` remain unchanged.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Deprecated function removal completeness
*For any* codebase search, the deprecated function `getAllQuestions` should not appear in any source file after refactoring
**Validates: Requirements 1.1, 1.3**

### Property 2: Import resolution after refactoring
*For any* TypeScript compilation, all import statements should resolve successfully without errors after deprecated functions are removed
**Validates: Requirements 1.2**

### Property 3: Validation behavior equivalence
*For any* question object, the new unified validation function should produce the same validation result as the old validation functions for the same input
**Validates: Requirements 2.2**

### Property 4: Button component variant support
*For any* existing button usage in the codebase, the new shared Button component should be able to render an equivalent button with appropriate props
**Validates: Requirements 3.2**

### Property 5: Visual appearance preservation
*For any* button rendered with the new Button component, the visual appearance should match the original button styling (colors, sizes, hover effects)
**Validates: Requirements 3.3**

### Property 6: Button component prop acceptance
*For any* combination of valid button props (onClick, variant, size, disabled, etc.), the Button component should render without errors
**Validates: Requirements 3.4**

### Property 7: Functionality preservation
*For any* user interaction flow, the application behavior after refactoring should be identical to the behavior before refactoring
**Validates: Requirements 4.4**

### Property 8: Public API compatibility
*For any* exported function or component, the function signature and component props interface should remain unchanged after refactoring
**Validates: Requirements 5.1, 5.3, 5.4**

### Property 9: Application behavior equivalence
*For any* quiz session flow (start quiz, answer questions, view results), the application should behave identically before and after refactoring
**Validates: Requirements 5.5**

## Error Handling

### Validation Errors
- Unified validation functions will return detailed error messages
- Error format: `{ isValid: boolean, errors: string[] }`
- Maintain all existing error messages for backward compatibility

### Component Errors
- Button component will validate props and log warnings for invalid combinations
- Graceful degradation: invalid props will fall back to default values

### Migration Errors
- If deprecated function is still referenced, TypeScript compilation will fail
- Clear error messages pointing to the replacement function

## Testing Strategy

### Unit Testing

**Validation Tests:**
- Test unified validation function with valid questions
- Test unified validation function with invalid questions
- Test batch validation with mixed valid/invalid questions
- Verify error messages match expected format

**Button Component Tests:**
- Test each button variant renders correctly
- Test button sizes render correctly
- Test disabled state
- Test onClick handler is called
- Test custom className is applied
- Test aria-label is set correctly

**Integration Tests:**
- Test quiz-session uses Button component correctly
- Test results-summary uses Button component correctly
- Test all button interactions work as before

### Property-Based Testing

We will use **fast-check** (JavaScript/TypeScript property-based testing library) for property-based tests.

**Configuration:**
- Minimum 100 iterations per property test
- Each property test must reference its corresponding design property

**Property Tests:**

1. **Validation Equivalence Property**
   - Generate random question objects
   - Verify new validation produces same results as old validation
   - **Feature: code-refactoring, Property 3: Validation behavior equivalence**

2. **Button Rendering Property**
   - Generate random valid button prop combinations
   - Verify Button component renders without errors
   - **Feature: code-refactoring, Property 6: Button component prop acceptance**

3. **API Compatibility Property**
   - Verify all exported function signatures remain unchanged
   - Verify all component prop interfaces remain unchanged
   - **Feature: code-refactoring, Property 8: Public API compatibility**

### Regression Testing

- Run full test suite before refactoring (baseline)
- Run full test suite after each refactoring step
- All tests must pass without modification
- Visual regression testing for button components (snapshot tests)

### Manual Testing Checklist

- [ ] Start a new quiz session
- [ ] Answer all questions
- [ ] View results
- [ ] Restart quiz
- [ ] Verify all buttons work correctly
- [ ] Verify visual appearance matches original

## Implementation Plan

### Phase 1: Preparation
1. Run full test suite to establish baseline
2. Create feature branch for refactoring
3. Document current button styles and variants

### Phase 2: Validation Consolidation
1. Create unified validation functions in `question-loader.ts`
2. Update tests to use new validation functions
3. Remove `question-bank.ts`
4. Update all imports
5. Verify TypeScript compilation
6. Run test suite

### Phase 3: Button Component Creation
1. Create `components/ui/button.tsx`
2. Implement all button variants
3. Add unit tests for Button component
4. Create Storybook stories (optional)

### Phase 4: Button Component Integration
1. Update `quiz-session.tsx` to use Button component
2. Update `results-summary.tsx` to use Button component
3. Verify visual appearance with snapshot tests
4. Run full test suite

### Phase 5: Cleanup
1. Remove redundant comments
2. Run linter and formatter
3. Update documentation
4. Final test suite run

### Phase 6: Verification
1. Manual testing of all user flows
2. Visual regression testing
3. Performance testing (ensure no degradation)
4. Code review

## Rollback Plan

If any issues are discovered:
1. Revert to previous commit
2. Analyze failure
3. Fix issue in feature branch
4. Re-test before merging

## Success Criteria

- [ ] All deprecated functions removed
- [ ] Validation logic consolidated
- [ ] Shared Button component created and used
- [ ] All tests pass without modification
- [ ] TypeScript compiles without errors
- [ ] No visual regressions
- [ ] No performance degradation
- [ ] Code coverage maintained or improved

## Performance Considerations

- Button component should be memoized to prevent unnecessary re-renders
- Validation functions should be optimized for batch operations
- No impact on bundle size (removing deprecated code should reduce size)

## Security Considerations

No security implications for this refactoring. All changes are internal code organization improvements.

## Accessibility Considerations

- Button component must support aria-label
- Button component must support keyboard navigation
- Button component must have proper focus states
- All existing accessibility features must be maintained
