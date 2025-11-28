# Implementation Plan - TDD Approach

## 🎯 TDD (Test-Driven Development) について

このタスクリストは、**テスト駆動開発（TDD）**の原則に従って構成されています。

### TDDの3つのステップ（Red-Green-Refactor）

1. **🔴 RED（テスト作成）**: まず失敗するテストを書く
   - 期待する動作を明確に定義
   - テストを実行して失敗を確認

2. **🟢 GREEN（実装）**: テストを通す最小限のコードを書く
   - テストが通る実装を追加
   - 過剰な実装は避ける

3. **🔵 REFACTOR（リファクタリング）**: コードを改善する
   - テストを保ちながらコードを最適化
   - 重複を削除し、可読性を向上

### このアプローチの利点

- ✅ **要件の明確化**: テストが仕様書になる
- ✅ **バグの早期発見**: 実装前に期待動作を定義
- ✅ **安全なリファクタリング**: テストが変更を保証
- ✅ **過剰実装の防止**: 必要最小限の実装に集中
- ✅ **高品質なコード**: テスト可能な設計になる

### 実装の進め方

各フェーズは **RED → GREEN → REFACTOR** のサイクルで進めます：

```
Phase N: 機能名 (TDD Cycle X)
├─ N. テスト作成 (RED) ← まずここから！
├─ N.1 実装 (GREEN)
└─ N.2 リファクタリング (REFACTOR)
```

**重要**: 必ず **RED（テスト）** から始めてください。実装を先に書かないでください。

---

## Phase 1: Foundation Setup

- [x] 1. Set up project structure and dependencies
  - Initialize Next.js 16 project with App Router in `frontend/` directory
  - Install dependencies: React 19, TypeScript 5.9, Tailwind CSS 4.1, shadcn/ui, Vitest 4.0, fast-check
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom haunted theme configuration
  - Configure Biome for linting and formatting
  - Configure Vitest and fast-check for testing
  - _Requirements: All requirements (foundational setup)_

## Phase 2: Data Models (TDD Cycle 1)

- [x] 2. Create data models and type definitions
  - Define TypeScript interfaces for Question, Choice, ContentDomain enum
  - Define QuizSession, UserAnswer, QuizResult, DomainPerformance interfaces
  - Define StoredQuizState interface for localStorage schema
  - Create type guards for runtime validation
  - _Requirements: 1.1, 1.2, 2.1, 6.1, 8.1_

- [x] 2.1 Write property tests for data model validation (RED)
  - **Property 5: Questions have required structure**
  - **Property 17: All questions have valid domain tags**
  - **Property 31: All questions have explanations**
  - Write tests that will initially fail
  - _Validates: Requirements 2.1, 6.1, 10.3_

- [x] 2.2 Create question bank sample data (GREEN)
  - Create JSON file with 40+ sample AWS SAP questions covering all 4 domains
  - Ensure questions are at Professional level difficulty
  - Include detailed explanations with AWS documentation references
  - Validate question data structure matches TypeScript interfaces
  - Run tests to confirm they pass
  - _Requirements: 1.2, 2.1, 6.1, 6.2, 10.1, 10.2, 10.3, 10.5_

- [x] 2.3 Refactor data models and question bank (REFACTOR)
  - Improve type definitions if needed
  - Optimize question data structure
  - Ensure all tests still pass

## Phase 3: Question Selection Logic (TDD Cycle 2)

- [x] 3. Write property tests for question selection (RED)
  - **Property 1: Quiz initialization creates exactly 20 questions**
  - **Property 2: Questions are randomly selected**
  - **Property 18: Quiz sessions represent all domains**
  - Write tests that will initially fail
  - _Validates: Requirements 1.1, 1.2, 6.2_

- [x] 3.1 Implement question selection logic (GREEN)
  - Implement function to randomly select 20 questions from question bank
  - Implement domain distribution algorithm to ensure all 4 domains are represented
  - Handle edge case when question bank has fewer than 20 questions
  - Handle edge case when question bank lacks questions for a domain
  - Run tests to confirm they pass
  - _Requirements: 1.1, 1.2, 1.5, 6.2, 6.5_

- [x] 3.2 Refactor question selection logic (REFACTOR)
  - Optimize selection algorithm
  - Improve error handling
  - Ensure all tests still pass

## Phase 4: Quiz Session State Management (TDD Cycle 3)

- [x] 4. Write property tests for state management (RED)
  - **Property 3: Timer starts at zero**
  - **Property 6: User answers are recorded**
  - **Property 12: Correct answer count increments properly**
  - Write tests that will initially fail
  - _Validates: Requirements 1.3, 2.2, 3.4_

- [x] 4.1 Implement quiz session state management (GREEN)
  - Create QuizManager class/module to manage quiz session state
  - Implement quiz initialization logic
  - Implement answer recording logic
  - Implement navigation between questions
  - Implement quiz completion detection
  - Run tests to confirm they pass
  - _Requirements: 1.1, 1.3, 1.4, 2.2, 3.2, 3.3, 3.4, 4.1_

- [x] 4.2 Refactor quiz session state management (REFACTOR)
  - Optimize state management logic
  - Improve code organization
  - Ensure all tests still pass

## Phase 5: Timer Functionality (TDD Cycle 4)

- [x] 5. Write property test for timer (RED)
  - **Property 10: Timer updates continuously**
  - Write tests that will initially fail
  - _Validates: Requirements 3.1_

- [x] 5.1 Implement timer functionality (GREEN)
  - Create Timer utility to track elapsed time
  - Implement time formatting (seconds to MM:SS)
  - Implement 30-minute warning threshold detection
  - Handle timer overflow edge case (>24 hours)
  - Run tests to confirm they pass
  - _Requirements: 1.3, 3.1, 3.5_

- [x] 5.2 Refactor timer functionality (REFACTOR)
  - Optimize timer logic
  - Improve time formatting
  - Ensure all tests still pass

## Phase 6: Score Calculation (TDD Cycle 5)

- [x] 6. Write property tests for score calculation (RED)
  - **Property 14: Results include all required metrics**
  - **Property 20: Results include domain breakdown**
  - Write tests that will initially fail
  - _Validates: Requirements 4.2, 4.3, 4.4, 6.4_

- [x] 6.1 Implement score calculation logic (GREEN)
  - Create ScoreCalculator module
  - Implement percentage score calculation
  - Implement domain-specific performance calculation
  - Handle edge cases (0%, 100%)
  - Run tests to confirm they pass
  - _Requirements: 4.2, 4.3, 4.4, 6.4_

- [x] 6.2 Refactor score calculation logic (REFACTOR)
  - Optimize calculation algorithms
  - Improve edge case handling
  - Ensure all tests still pass

## Phase 7: LocalStorage Persistence (TDD Cycle 6)

- [x] 7. Write property tests for persistence (RED)
  - **Property 22: State is saved after each answer**
  - **Property 23: Saved state is checked on load**
  - **Property 25: State restoration is a round-trip**
  - **Property 26: Completed quiz clears saved state**
  - Write tests that will initially fail
  - _Validates: Requirements 8.1, 8.2, 8.4, 8.5_

- [x] 7.1 Implement localStorage persistence (GREEN)
  - Create StorageManager module for localStorage operations
  - Implement save quiz state function
  - Implement load quiz state function
  - Implement clear completed quiz function
  - Handle localStorage quota exceeded error
  - Handle corrupted data error
  - Implement data validation for loaded state
  - Run tests to confirm they pass
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 7.2 Refactor localStorage persistence (REFACTOR)
  - Optimize storage operations
  - Improve error handling
  - Ensure all tests still pass

## Phase 8: Haunted Theme Design System

- [x] 8. Create haunted theme design system
  - Define color palette constants (ghostWhite, midnightPurple, hauntedOrange, etc.)
  - Create Tailwind CSS custom theme configuration
  - Define shadow and glow effect utilities
  - Create animation keyframes (float, pulse, flicker, fadeIn)
  - Set up Google Fonts (Creepster for headings, Inter for body)
  - _Requirements: 5.1, 5.2, 5.4_

## Phase 9: HauntedLayout Component (TDD Cycle 7)

- [x] 9. Write unit tests for HauntedLayout (RED)
  - Test component renders with dark background
  - Test responsive layout behavior
  - Test prefers-reduced-motion support
  - Write tests that will initially fail
  - _Requirements: 5.1, 5.2, 5.5, 7.1, 7.2, 7.5_

- [x] 9.1 Build HauntedLayout component (GREEN)
  - Create layout component with dark background
  - Add particle effect background (floating dust/sparkles)
  - Add cobweb SVG decorations in corners
  - Implement responsive layout for mobile and desktop
  - Add support for prefers-reduced-motion
  - Ensure WCAG AA color contrast compliance
  - Run tests to confirm they pass
  - _Requirements: 5.1, 5.2, 5.5, 7.1, 7.2, 7.5_

- [x] 9.2 Refactor HauntedLayout component (REFACTOR)
  - Optimize animations
  - Improve accessibility
  - Ensure all tests still pass

## Phase 10: QuestionCard Component (TDD Cycle 8)

- [x] 10. Write property tests for QuestionCard feedback (RED)
  - **Property 7: Immediate feedback is provided**
  - **Property 8: Feedback includes correct answer and explanation**
  - **Property 27: Selection triggers immediate visual feedback**
  - **Property 28: Correct answers show success indicator**
  - **Property 29: Incorrect answers show error indicator**
  - **Property 30: Correct answer is highlighted in feedback**
  - Write tests that will initially fail
  - _Validates: Requirements 2.3, 2.4, 9.2, 9.3, 9.4, 9.5_

- [ ] 10.1 Build QuestionCard component (GREEN)
  - Create component to display question text and 4 choices
  - Implement answer selection state
  - Add hover effects with glow
  - Implement feedback display (correct/incorrect indicators)
  - Display correct answer and explanation after submission
  - Show domain badge
  - Add ornate border styling
  - Run tests to confirm they pass
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.3, 6.3, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10.2 Refactor QuestionCard component (REFACTOR)
  - Optimize rendering
  - Improve state management
  - Ensure all tests still pass

## Phase 11: Timer Component (TDD Cycle 9)

- [x] 11. Write unit tests for Timer component (RED)
  - Test time display formatting
  - Test real-time updates
  - Test 30-minute warning
  - Write tests that will initially fail
  - _Requirements: 3.1, 3.5_

- [x] 11.1 Build Timer component (GREEN)
  - Create component to display elapsed time
  - Implement real-time time updates (every second)
  - Format time as MM:SS
  - Display warning when 30 minutes reached
  - Style as glowing pocket watch
  - Run tests to confirm they pass
  - _Requirements: 3.1, 3.5_

- [x] 11.2 Refactor Timer component (REFACTOR)
  - Optimize update logic
  - Improve styling
  - Ensure all tests still pass

## Phase 12: ProgressBar Component (TDD Cycle 10)

- [x] 12. Write property tests for progress display (RED)
  - **Property 4: Question number display is accurate**
  - **Property 11: Progress display is accurate**
  - Write tests that will initially fail
  - _Validates: Requirements 1.4, 3.2, 3.3_

- [x] 12.1 Build ProgressBar component (GREEN)
  - Create component to show question number (X/20)
  - Display correct answer count
  - Add visual progress bar styled as haunted energy meter
  - Ensure updates are accurate
  - Run tests to confirm they pass
  - _Requirements: 1.4, 3.2, 3.3_

- [x] 12.2 Refactor ProgressBar component (REFACTOR)
  - Optimize rendering
  - Improve visual design
  - Ensure all tests still pass

## Phase 13: ResultsSummary Component (TDD Cycle 11)

- [x] 13. Write property tests for results display (RED)
  - **Property 13: Results screen appears after completion**
  - **Property 15: Restart button is present on results**
  - Write tests that will initially fail
  - _Validates: Requirements 4.1, 4.5_

- [x] 13.1 Build ResultsSummary component (GREEN)
  - Create component to display final results
  - Show total correct answers out of 20
  - Show total time taken
  - Show percentage score
  - Display domain breakdown with haunted stat cards
  - Add dramatic reveal animation
  - Add ghost reactions based on score
  - Include restart button
  - Run tests to confirm they pass
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.4_

- [x] 13.2 Refactor ResultsSummary component (REFACTOR)
  - Optimize animations
  - Improve layout
  - Ensure all tests still pass

## Phase 14: QuizSession Component (TDD Cycle 12)

- [x] 14. Write property test for next button (RED)
  - **Property 9: Next button appears after feedback**
  - Write tests that will initially fail
  - _Validates: Requirements 2.5_
  - **NOTE**: Test file temporarily renamed to `next-button.property.test.ts.skip` to prevent build errors until QuizSession component is implemented. Rename back to `.ts` when implementing Task 14.1.

- [x] 14.1 Build QuizSession component (GREEN)
  - Create main component that orchestrates quiz flow
  - Integrate QuestionCard, Timer, ProgressBar components
  - Implement question navigation (next button after feedback)
  - Handle quiz completion and transition to results
  - Implement state persistence after each answer
  - **IMPORTANT**: Before starting, rename `next-button.property.test.ts.skip` back to `next-button.property.test.ts` to enable the property-based tests
  - Run tests to confirm they pass
  - _Requirements: 1.1, 1.3, 1.4, 2.5, 4.1, 8.1_

- [x] 14.2 Refactor QuizSession component (REFACTOR)
  - Optimize component integration
  - Improve state flow
  - Ensure all tests still pass

## Phase 15: Home Page (TDD Cycle 13)

- [x] 15. Write property test for resume option (RED)
  - **Property 24: Resume option is offered when state exists**
  - Write tests that will initially fail
  - _Validates: Requirements 8.3_

- [x] 15.1 Build Home page (GREEN)
  - Create landing page with haunted mansion background
  - Add floating ghost mascot with wave animation
  - Add glowing "Start Quiz" button with pulse animation
  - Add cobweb decorations
  - Display brief app description with spooky typography
  - Check for saved quiz state on load
  - Show resume/new quiz options if saved state exists
  - Run tests to confirm they pass
  - _Requirements: 1.1, 8.2, 8.3_

- [x] 15.2 Refactor Home page (REFACTOR)
  - Optimize animations
  - Improve layout
  - Ensure all tests still pass

## Phase 16: Quiz and Results Pages (TDD Cycle 14)

- [x] 16. Write integration tests for Quiz and Results pages (RED)
  - Test quiz page initialization
  - Test navigation to results
  - Test results page display
  - Test restart functionality
  - Write tests that will initially fail
  - _Requirements: 1.1, 1.3, 4.1, 4.2, 4.3, 4.4, 4.5, 8.5_

- [x] 16.1 Build Quiz page (GREEN)
  - Create page that renders QuizSession component
  - Wrap in HauntedLayout
  - Handle quiz initialization
  - Handle navigation to results page on completion
  - Run tests to confirm they pass
  - _Requirements: 1.1, 1.3, 4.1_

- [x] 16.2 Build Results page (GREEN)
  - Create page that renders ResultsSummary component
  - Wrap in HauntedLayout
  - Handle restart action (navigate to home)
  - Clear saved state when displaying results
  - Run tests to confirm they pass
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 8.5_

- [x] 16.3 Refactor Quiz and Results pages (REFACTOR)
  - Optimize page transitions
  - Improve navigation flow
  - Ensure all tests still pass

## Phase 17: Responsive Design (TDD Cycle 15)

- [x] 17. Write property test for viewport changes (RED)
  - **Property 21: Quiz state persists across viewport changes**
  - Write tests that will initially fail
  - _Validates: Requirements 7.3_

- [x] 17.1 Implement responsive design (GREEN)
  - Test layout on mobile (320px), tablet (768px), desktop (1024px)
  - Ensure quiz state persists across viewport changes
  - Adjust component layouts for different screen sizes
  - Test touch interactions on mobile
  - Ensure haunted theme is consistent across breakpoints
  - Run tests to confirm they pass
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 17.2 Refactor responsive design (REFACTOR)
  - Optimize media queries
  - Improve touch interactions
  - Ensure all tests still pass

## Phase 18: Accessibility Features (TDD Cycle 16)

- [x] 18. Write property test for hover states (RED)
  - **Property 16: Hover states trigger visual changes**
  - Write tests that will initially fail
  - _Validates: Requirements 5.3_

- [x] 18.1 Implement accessibility features (GREEN)
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works for all interactions
  - Add focus indicators to all focusable elements
  - Test with screen reader
  - Verify color contrast meets WCAG AA standards
  - Implement prefers-reduced-motion support
  - Run tests to confirm they pass
  - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [x] 18.2 Refactor accessibility features (REFACTOR)
  - Improve ARIA labels
  - Optimize keyboard navigation
  - Ensure all tests still pass

## Phase 19: Error Handling (TDD Cycle 17)

- [x] 19. Write unit tests for error handling (RED)
  - Test error boundary behavior
  - Test insufficient questions error
  - Test localStorage errors
  - Test invalid data errors
  - Write tests that will initially fail
  - _Requirements: 1.5, 6.5_

- [x] 19.1 Implement error handling (GREEN)
  - Add error boundary components
  - Handle insufficient questions error
  - Handle localStorage quota exceeded error
  - Handle corrupted localStorage data error
  - Handle invalid question data error
  - Add user-friendly error messages
  - Implement graceful degradation
  - Run tests to confirm they pass
  - _Requirements: 1.5, 6.5_

- [x] 19.2 Refactor error handling (REFACTOR)
  - Improve error messages
  - Optimize error recovery
  - Ensure all tests still pass

## Phase 20: Loading States and Transitions

- [x] 20. Add loading states and transitions
  - Add loading spinner for quiz initialization
  - Add fade-in animations for page transitions
  - Add smooth transitions between questions
  - Ensure animations respect prefers-reduced-motion
  - _Requirements: 5.3_

## Phase 21: Performance Optimization

- [x] 21. Optimize performance
  - Implement code splitting by route
  - Lazy load heavy components (animations, effects)
  - Memoize expensive components with React.memo
  - Optimize images with Next.js Image component
  - Ensure initial bundle is under 200KB gzipped
  - Test performance with Lighthouse
  - _Requirements: All requirements (performance optimization)_

## Phase 22: Testing Checkpoint

- [x] 22. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property-based tests (minimum 100 iterations each)
  - Run all integration tests
  - Fix any failing tests
  - Ensure code coverage is at least 80%
  - Review test quality and completeness
  - Ask the user if questions arise

## Phase 23: Documentation

- [x] 23. Create documentation
  - Write comprehensive README with setup instructions
  - Document component APIs
  - Add inline code comments for complex logic
  - Create user guide for the application
  - Document haunted theme design system
  - Document TDD approach and testing strategy
  - _Requirements: All requirements (documentation)_

## Phase 24: Deployment Preparation

- [x] 24. Prepare for deployment
  - Test production build locally
  - Verify all environment variables are configured
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test on multiple devices (desktop, tablet, mobile)
  - Verify PWA manifest and icons
  - Create deployment guide
  - _Requirements: All requirements (deployment preparation)_

## Phase 25: Final Testing and Polish

- [-] 25. Final testing and polish
  - Conduct end-to-end testing of complete user flows
  - Test edge cases and error scenarios
  - Verify all animations and effects work smoothly
  - Check accessibility with automated tools
  - Get user feedback and iterate
  - Fix any remaining bugs
  - Final code review and cleanup
  - _Requirements: All requirements (final polish)_
