# Design Document

## Overview

SAP Obake（サップおばけ）は、AWS Certified Solutions Architect - Professional (SAP-C02) 認定試験の学習を支援するWebアプリケーションです。本アプリケーションは、Next.js 16（App Router）とReact 19を使用したモダンなフロントエンドアーキテクチャで構築され、ハロウィンをテーマにした不気味で洗練されたUIを特徴とします。

### Key Features

- 20問のタイムアタック形式クイズセッション
- AWS SAP試験の4つのコンテンツドメインをカバー
- リアルタイムのフィードバックと詳細な解説
- ブラウザローカルストレージによる進捗保存
- レスポンシブデザイン（デスクトップ・モバイル対応）
- Kiroween Costume Contest向けのハロウィンテーマUI

### Technology Stack

- **Frontend Framework**: Next.js 16.0.0 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9 + shadcn/ui
- **State Management**: React Hooks (useState, useEffect, useReducer)
- **Data Persistence**: Browser LocalStorage API
- **Testing**: Vitest 4.0.8
- **Type Safety**: TypeScript 5.9.3
- **Package Manager**: pnpm 10.20.0

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Next.js App Router Pages                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │    │
│  │  │  Home    │  │  Quiz    │  │   Results    │     │    │
│  │  │  Page    │  │  Page    │  │   Page       │     │    │
│  │  └──────────┘  └──────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Components                       │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ QuizSession  │  │ QuestionCard │               │    │
│  │  │ Component    │  │ Component    │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │   Timer      │  │   Progress   │               │    │
│  │  │ Component    │  │   Bar        │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Business Logic Layer                      │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Quiz Manager │  │ Question     │               │    │
│  │  │              │  │ Selector     │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Score        │  │ State        │               │    │
│  │  │ Calculator   │  │ Persistence  │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Data Layer                             │    │
│  │  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Question     │  │ LocalStorage │               │    │
│  │  │ Bank (JSON)  │  │ Manager      │               │    │
│  │  └──────────────┘  └──────────────┘               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Client-Side Only**: 完全にクライアントサイドで動作し、バックエンドサーバーを必要としない
2. **Component-Based**: 再利用可能なReactコンポーネントによる構成
3. **Type Safety**: TypeScriptによる型安全性の確保
4. **Responsive Design**: モバイルファーストのレスポンシブデザイン
5. **Progressive Enhancement**: 基本機能を優先し、段階的に機能を追加

## Components and Interfaces

### Core Components

#### 1. QuizSession Component

クイズセッション全体を管理するメインコンポーネント。

```typescript
interface QuizSessionProps {
  onComplete: (result: QuizResult) => void;
}

interface QuizSessionState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: number;
  isComplete: boolean;
}
```

**Responsibilities:**
- クイズセッションの初期化
- 問題の順次表示
- ユーザー回答の記録
- タイマーの管理
- セッション完了時の結果計算

#### 2. QuestionCard Component

個別の問題を表示し、ユーザーの回答を受け付けるコンポーネント。

```typescript
interface QuestionCardProps {
  question: Question;
  onAnswer: (answerId: string) => void;
  showFeedback: boolean;
  userAnswer?: string;
}
```

**Responsibilities:**
- 問題文と選択肢の表示
- ユーザーの選択状態の管理
- 正誤フィードバックの表示
- 解説の表示

#### 3. Timer Component

経過時間を表示するコンポーネント。

```typescript
interface TimerProps {
  startTime: number;
  onWarning?: () => void;
  warningThreshold?: number; // デフォルト: 30分
}
```

**Responsibilities:**
- 経過時間のリアルタイム表示
- 警告閾値到達時の通知
- 時間のフォーマット表示

#### 4. ProgressBar Component

クイズの進捗状況を表示するコンポーネント。

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
}
```

**Responsibilities:**
- 現在の問題番号の表示
- 正答数の表示
- 進捗バーの視覚的表示

#### 5. ResultsSummary Component

クイズ完了後の結果を表示するコンポーネント。

```typescript
interface ResultsSummaryProps {
  result: QuizResult;
  onRestart: () => void;
}
```

**Responsibilities:**
- 総合スコアの表示
- 所要時間の表示
- コンテンツドメイン別のパフォーマンス表示
- 新しいクイズの開始

#### 6. HauntedLayout Component

ハロウィンテーマのレイアウトを提供するコンポーネント。

```typescript
interface HauntedLayoutProps {
  children: React.ReactNode;
  showGhosts?: boolean;
  animationIntensity?: 'low' | 'medium' | 'high';
}
```

**Responsibilities:**
- ハロウィンテーマのスタイリング
- 背景アニメーション
- テーマカラーの適用
- アクセシビリティの確保

## Data Models

### Question Model

```typescript
interface Question {
  id: string;
  domain: ContentDomain;
  text: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  difficulty: 'medium' | 'hard'; // SAP試験レベル
  tags: string[]; // AWS サービス名など
}

interface Choice {
  id: string;
  text: string;
}

enum ContentDomain {
  COMPLEX_ORGANIZATIONS = 'complex-organizations',
  NEW_SOLUTIONS = 'new-solutions',
  CONTINUOUS_IMPROVEMENT = 'continuous-improvement',
  MIGRATION_MODERNIZATION = 'migration-modernization'
}
```

### Quiz Session Model

```typescript
interface QuizSession {
  id: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: number;
  endTime?: number;
  isComplete: boolean;
}

interface UserAnswer {
  questionId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  answeredAt: number;
}
```

### Quiz Result Model

```typescript
interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  percentageScore: number;
  totalTimeSeconds: number;
  domainPerformance: DomainPerformance[];
  completedAt: number;
}

interface DomainPerformance {
  domain: ContentDomain;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}
```

### LocalStorage Schema

```typescript
interface StoredQuizState {
  version: string; // スキーマバージョン
  currentSession?: QuizSession;
  completedSessions: QuizResult[];
  lastUpdated: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Quiz initialization creates exactly 20 questions

*For any* question bank with at least 20 questions, initializing a new quiz session should result in exactly 20 questions being selected.

**Validates: Requirements 1.1**

### Property 2: Questions are randomly selected

*For any* question bank with more than 20 questions, multiple quiz initializations should produce different question sets with high probability (at least 95% of the time when the bank has 30+ questions).

**Validates: Requirements 1.2**

### Property 3: Timer starts at zero

*For any* newly initialized quiz session, the timer should start at exactly 0 seconds.

**Validates: Requirements 1.3**

### Property 4: Question number display is accurate

*For any* question index in a quiz session, the displayed question number should equal the index + 1 and be formatted as "Question X/20".

**Validates: Requirements 1.4**

### Property 5: Questions have required structure

*For any* question displayed in the quiz, it should have exactly 4 answer choices, a non-empty question text, and a valid correct choice ID.

**Validates: Requirements 2.1**

### Property 6: User answers are recorded

*For any* answer selection, the system state should contain a record of that selection with the question ID and selected choice ID.

**Validates: Requirements 2.2**

### Property 7: Immediate feedback is provided

*For any* answer submission, the system should immediately transition to a feedback state showing correctness.

**Validates: Requirements 2.3**

### Property 8: Feedback includes correct answer and explanation

*For any* submitted answer, the feedback should display both the correct answer choice and a non-empty explanation.

**Validates: Requirements 2.4**

### Property 9: Next button appears after feedback

*For any* question with feedback displayed, a "Next" or "Continue" button should be present and enabled.

**Validates: Requirements 2.5**

### Property 10: Timer updates continuously

*For any* active quiz session, the displayed elapsed time should increase monotonically over time.

**Validates: Requirements 3.1**

### Property 11: Progress display is accurate

*For any* active quiz session, the displayed progress should show the current question number, total questions (20), and current correct answer count.

**Validates: Requirements 3.2, 3.3**

### Property 12: Correct answer count increments properly

*For any* correct answer submission, the correct answer count should increase by exactly 1.

**Validates: Requirements 3.4**

### Property 13: Results screen appears after completion

*For any* quiz session where all 20 questions have been answered, the results screen should be displayed.

**Validates: Requirements 4.1**

### Property 14: Results include all required metrics

*For any* completed quiz session, the results should include: total correct answers, total time, and percentage score calculated as (correct / 20) * 100.

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 15: Restart button is present on results

*For any* results screen, a button to start a new quiz session should be present and functional.

**Validates: Requirements 4.5**

### Property 16: Hover states trigger visual changes

*For any* interactive element (answer choice, button), hovering should trigger a CSS class change or style update.

**Validates: Requirements 5.3**

### Property 17: All questions have valid domain tags

*For any* question in the question bank, it should have a domain tag that is one of the four valid Content Domains.

**Validates: Requirements 6.1**

### Property 18: Quiz sessions represent all domains

*For any* quiz session initialized from a complete question bank (with questions in all 4 domains), the selected 20 questions should include at least one question from each of the four Content Domains.

**Validates: Requirements 6.2**

### Property 19: Domain is displayed with question

*For any* displayed question, the UI should show which Content Domain the question belongs to.

**Validates: Requirements 6.3**

### Property 20: Results include domain breakdown

*For any* completed quiz session, the results should include performance statistics for each of the four Content Domains.

**Validates: Requirements 6.4**

### Property 21: Quiz state persists across viewport changes

*For any* quiz session in progress, changing the viewport size should not alter the quiz state (current question, answers, timer).

**Validates: Requirements 7.3**

### Property 22: State is saved after each answer

*For any* answer submission during a quiz session, the current quiz state should be saved to localStorage immediately after.

**Validates: Requirements 8.1**

### Property 23: Saved state is checked on load

*For any* application load, the system should check localStorage for a saved quiz state.

**Validates: Requirements 8.2**

### Property 24: Resume option is offered when state exists

*For any* application load where a saved quiz state exists in localStorage, the UI should offer options to resume or start new.

**Validates: Requirements 8.3**

### Property 25: State restoration is a round-trip

*For any* quiz session state saved to localStorage, restoring that state should produce an identical quiz session (same questions, same current index, same answers).

**Validates: Requirements 8.4**

### Property 26: Completed quiz clears saved state

*For any* quiz session that is completed, the saved state should be removed from localStorage.

**Validates: Requirements 8.5**

### Property 27: Selection triggers immediate visual feedback

*For any* answer choice click, the UI should immediately show a selected state (CSS class change or style update).

**Validates: Requirements 9.2**

### Property 28: Correct answers show success indicator

*For any* submitted answer that is correct, the UI should display a success indicator (e.g., green styling, checkmark).

**Validates: Requirements 9.3**

### Property 29: Incorrect answers show error indicator

*For any* submitted answer that is incorrect, the UI should display an error indicator (e.g., red styling, X mark).

**Validates: Requirements 9.4**

### Property 30: Correct answer is highlighted in feedback

*For any* feedback display, the correct answer choice should be visually highlighted with a distinct style.

**Validates: Requirements 9.5**

### Property 31: All questions have explanations

*For any* question in the question bank, it should have a non-empty explanation field.

**Validates: Requirements 10.3**

## Error Handling

### Client-Side Error Scenarios

1. **Insufficient Questions in Bank**
   - **Scenario**: Question bank contains fewer than 20 questions
   - **Handling**: Display error message, prevent quiz initialization, log warning
   - **User Experience**: Show friendly error with suggestion to add more questions

2. **LocalStorage Quota Exceeded**
   - **Scenario**: Browser localStorage is full
   - **Handling**: Catch quota exceeded exception, clear old completed sessions, retry save
   - **User Experience**: Show warning that old results were cleared to save progress

3. **Corrupted LocalStorage Data**
   - **Scenario**: Saved quiz state is malformed or invalid
   - **Handling**: Catch parse errors, clear corrupted data, start fresh session
   - **User Experience**: Show message that previous session couldn't be restored

4. **Invalid Question Data**
   - **Scenario**: Question is missing required fields or has invalid structure
   - **Handling**: Skip invalid question, log error, continue with valid questions
   - **User Experience**: Transparent to user, logged for debugging

5. **Timer Overflow**
   - **Scenario**: Quiz session runs for an extremely long time (>24 hours)
   - **Handling**: Cap displayed time at reasonable maximum, continue tracking
   - **User Experience**: Display "24+ hours" instead of overflowing

### Error Recovery Strategies

1. **Graceful Degradation**: If localStorage fails, continue with in-memory state only
2. **Data Validation**: Validate all data from localStorage before using
3. **Fallback UI**: If theme assets fail to load, fall back to basic styling
4. **Error Boundaries**: React error boundaries to catch and display component errors
5. **Retry Logic**: Retry localStorage operations with exponential backoff

## Testing Strategy

### Unit Testing

Unit tests will verify individual functions and components in isolation:

1. **Question Selection Logic**
   - Test random selection produces 20 questions
   - Test domain distribution algorithm
   - Test handling of insufficient questions

2. **Score Calculation**
   - Test percentage calculation
   - Test domain-specific score calculation
   - Test edge cases (0%, 100%)

3. **Timer Utilities**
   - Test time formatting (seconds to MM:SS)
   - Test elapsed time calculation
   - Test warning threshold detection

4. **LocalStorage Manager**
   - Test save/load operations
   - Test data serialization/deserialization
   - Test error handling for quota exceeded

5. **Component Rendering**
   - Test QuestionCard renders with correct data
   - Test Timer displays formatted time
   - Test ProgressBar shows correct values
   - Test ResultsSummary calculates and displays correctly

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using **fast-check** (JavaScript/TypeScript property testing library). Each test will run a minimum of 100 iterations.

1. **Quiz Initialization Properties**
   - Property 1: Quiz initialization creates exactly 20 questions
   - Property 2: Questions are randomly selected
   - Property 3: Timer starts at zero

2. **Question Structure Properties**
   - Property 5: Questions have required structure
   - Property 17: All questions have valid domain tags
   - Property 31: All questions have explanations

3. **State Management Properties**
   - Property 6: User answers are recorded
   - Property 12: Correct answer count increments properly
   - Property 21: Quiz state persists across viewport changes

4. **Persistence Properties**
   - Property 22: State is saved after each answer
   - Property 25: State restoration is a round-trip
   - Property 26: Completed quiz clears saved state

5. **Results Calculation Properties**
   - Property 14: Results include all required metrics
   - Property 20: Results include domain breakdown

6. **UI Feedback Properties**
   - Property 7: Immediate feedback is provided
   - Property 8: Feedback includes correct answer and explanation
   - Property 27: Selection triggers immediate visual feedback

### Integration Testing

Integration tests will verify that components work together correctly:

1. **Complete Quiz Flow**
   - Start quiz → Answer all questions → View results → Restart
   - Verify state transitions at each step
   - Verify data flows correctly between components

2. **Persistence Flow**
   - Start quiz → Answer some questions → Close app → Reopen → Resume
   - Verify state is correctly saved and restored

3. **Domain Distribution**
   - Initialize multiple quizzes
   - Verify all domains are represented across sessions

### End-to-End Testing

E2E tests will verify the complete user experience:

1. **Happy Path**
   - User starts quiz, answers all questions correctly, views results
   - Verify all UI elements appear and function correctly

2. **Mixed Performance Path**
   - User answers some correctly, some incorrectly
   - Verify feedback is accurate for both cases
   - Verify final score is calculated correctly

3. **Resume Path**
   - User starts quiz, answers some questions, closes browser
   - User reopens, chooses to resume
   - User completes quiz from where they left off

4. **Mobile Responsive Path**
   - Test on various viewport sizes
   - Verify layout adapts appropriately
   - Verify all functionality works on touch devices

### Testing Tools and Configuration

- **Unit & Integration Tests**: Vitest 4.0.8
- **Property-Based Tests**: fast-check (latest stable version)
- **E2E Tests**: Playwright (if needed for complex interactions)
- **Coverage Target**: 80% code coverage minimum
- **Test Execution**: Run on every commit via Git hooks
- **CI/CD**: Automated test runs on pull requests

### Test Organization

```
frontend/
├── __tests__/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── quiz-manager.test.ts
│   │   │   ├── question-selector.test.ts
│   │   │   ├── score-calculator.test.ts
│   │   │   └── storage-manager.test.ts
│   │   └── components/
│   │       ├── QuizSession.test.tsx
│   │       ├── QuestionCard.test.tsx
│   │       ├── Timer.test.tsx
│   │       └── ResultsSummary.test.tsx
│   ├── property/
│   │   ├── quiz-initialization.property.test.ts
│   │   ├── question-structure.property.test.ts
│   │   ├── state-management.property.test.ts
│   │   ├── persistence.property.test.ts
│   │   └── results-calculation.property.test.ts
│   ├── integration/
│   │   ├── quiz-flow.integration.test.ts
│   │   ├── persistence-flow.integration.test.ts
│   │   └── domain-distribution.integration.test.ts
│   └── e2e/
│       ├── happy-path.e2e.test.ts
│       ├── mixed-performance.e2e.test.ts
│       └── resume-path.e2e.test.ts
```

## UI/UX Design

### Haunting Theme Design System

#### Color Palette

```typescript
const hauntedTheme = {
  colors: {
    // Primary colors
    ghostWhite: '#F8F8FF',
    midnightPurple: '#2D1B4E',
    hauntedOrange: '#FF6B35',
    witchGreen: '#4A7C59',
    
    // Background colors
    darkVoid: '#0A0A0A',
    shadowGray: '#1A1A1A',
    mistGray: '#2A2A2A',
    
    // Accent colors
    bloodRed: '#8B0000',
    ghostlyBlue: '#4A5F7F',
    poisonGreen: '#39FF14',
    
    // Feedback colors
    correctGlow: '#4ADE80', // Green with glow
    incorrectGlow: '#F87171', // Red with glow
    warningGlow: '#FBBF24', // Amber with glow
  },
  
  shadows: {
    ghostly: '0 0 20px rgba(138, 43, 226, 0.5)',
    eerie: '0 4px 20px rgba(0, 0, 0, 0.8)',
    haunted: '0 0 30px rgba(255, 107, 53, 0.3)',
  },
  
  animations: {
    float: 'float 3s ease-in-out infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    flicker: 'flicker 4s linear infinite',
    fadeIn: 'fadeIn 0.5s ease-in',
  }
};
```

#### Typography

- **Headings**: "Creepster" or "Nosifer" (Google Fonts) for spooky titles
- **Body Text**: "Inter" or "Roboto" for readability
- **Code/Technical**: "Fira Code" for AWS service names and technical terms

#### Visual Elements

1. **Ghost Icons**: Floating ghost mascots that react to user actions
2. **Cobweb Patterns**: Subtle cobweb SVGs in corners and borders
3. **Particle Effects**: Floating particles (dust, sparkles) in background
4. **Glow Effects**: Neon-like glows on interactive elements
5. **Haunted Mansion Aesthetic**: Dark backgrounds with ornate borders

#### Animation Guidelines

- **Subtle**: Animations should enhance, not distract
- **Performance**: Use CSS transforms and opacity for smooth 60fps
- **Accessibility**: Respect `prefers-reduced-motion` media query
- **Purposeful**: Each animation should serve a functional purpose

### Component-Specific Design

#### Home Page

- Large haunted mansion silhouette in background
- Floating ghost mascot that waves
- Glowing "Start Quiz" button with pulse animation
- Cobweb decorations in corners
- Brief description with spooky typography

#### Quiz Page

- Dark background with subtle particle effects
- Question card with ornate border and shadow
- Answer choices with hover glow effects
- Timer displayed as a glowing pocket watch
- Progress bar styled as a haunted energy meter
- Domain badge with themed icon

#### Results Page

- Dramatic reveal animation
- Score displayed in large glowing numbers
- Domain breakdown as haunted stat cards
- Congratulatory or encouraging message with ghost reactions
- Restart button with haunting animation

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};
```

### Accessibility Considerations

1. **Color Contrast**: Ensure WCAG AA compliance (4.5:1 for normal text)
2. **Keyboard Navigation**: Full keyboard support for all interactions
3. **Screen Readers**: Proper ARIA labels and semantic HTML
4. **Focus Indicators**: Clear focus states for all interactive elements
5. **Motion Preferences**: Disable animations for users who prefer reduced motion
6. **Font Sizing**: Support browser font size adjustments

## Performance Optimization

### Loading Performance

1. **Code Splitting**: Split by route (Home, Quiz, Results)
2. **Lazy Loading**: Lazy load heavy components (animations, effects)
3. **Image Optimization**: Use Next.js Image component for theme assets
4. **Font Loading**: Use `font-display: swap` for custom fonts
5. **Bundle Size**: Keep initial bundle under 200KB gzipped

### Runtime Performance

1. **Memoization**: Use React.memo for expensive components
2. **Virtual Scrolling**: If question bank grows large, virtualize lists
3. **Debouncing**: Debounce localStorage writes
4. **RequestAnimationFrame**: Use RAF for smooth animations
5. **Web Workers**: Consider for heavy computations (if needed)

### Caching Strategy

1. **Static Assets**: Cache theme assets with long TTL
2. **Question Bank**: Cache in memory after first load
3. **Service Worker**: Consider PWA for offline support (future enhancement)

## Deployment Strategy

### Build Process

1. **Development**: `pnpm dev` - Hot reload with Turbopack
2. **Production Build**: `pnpm build` - Optimized static export
3. **Preview**: `pnpm start` - Test production build locally

### Hosting Options

1. **Vercel** (Recommended): Automatic deployments, edge network, zero config
2. **Netlify**: Alternative with similar features
3. **GitHub Pages**: Free static hosting option
4. **AWS S3 + CloudFront**: For AWS-themed deployment

### Environment Configuration

```typescript
// .env.local
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_QUESTION_BANK_URL=/data/questions.json
```

### Monitoring and Analytics

1. **Error Tracking**: Sentry or similar for production errors
2. **Performance Monitoring**: Web Vitals tracking
3. **User Analytics**: Optional, privacy-respecting analytics
4. **A/B Testing**: For UI/UX improvements (future)

## Future Enhancements

### Phase 2 Features

1. **User Accounts**: Save progress across devices
2. **Leaderboard**: Compare scores with other learners
3. **Study Mode**: Review questions without time pressure
4. **Bookmarks**: Save difficult questions for later review
5. **Custom Quizzes**: Select specific domains or difficulty

### Phase 3 Features

1. **Multiplayer**: Compete with friends in real-time
2. **Achievements**: Gamification with badges and rewards
3. **Study Plans**: Personalized learning paths
4. **Question Contributions**: Community-submitted questions
5. **Mobile App**: Native iOS/Android apps

### Technical Debt Considerations

1. **Question Bank Management**: Move to database for scalability
2. **Authentication**: Implement secure user authentication
3. **API Layer**: Build backend API for advanced features
4. **Testing Coverage**: Increase to 90%+ coverage
5. **Internationalization**: Support multiple languages

## Security Considerations

### Client-Side Security

1. **XSS Prevention**: Sanitize all user inputs (though minimal in this app)
2. **Content Security Policy**: Implement strict CSP headers
3. **HTTPS Only**: Enforce HTTPS in production
4. **Dependency Audits**: Regular `pnpm audit` checks
5. **No Sensitive Data**: Never store sensitive data in localStorage

### Data Privacy

1. **No PII Collection**: Don't collect personally identifiable information
2. **Local Storage Only**: All data stays on user's device
3. **Clear Privacy Policy**: Transparent about data handling
4. **GDPR Compliance**: Respect user privacy rights
5. **Analytics Opt-In**: Make analytics optional

## Maintenance and Support

### Code Quality

1. **Linting**: Biome for consistent code style
2. **Type Checking**: Strict TypeScript configuration
3. **Code Reviews**: All changes reviewed before merge
4. **Documentation**: Inline comments for complex logic
5. **Changelog**: Maintain detailed changelog

### Version Control

1. **Git Flow**: Feature branches, pull requests, protected main
2. **Semantic Versioning**: Follow semver for releases
3. **Commit Messages**: Conventional commits format
4. **Branch Protection**: Require tests to pass before merge

### Support Channels

1. **GitHub Issues**: Bug reports and feature requests
2. **Documentation**: Comprehensive README and wiki
3. **FAQ**: Common questions and answers
4. **Community**: Discord or Slack for discussions (future)

## Conclusion

This design document provides a comprehensive blueprint for building SAP Obake, a Halloween-themed AWS SAP exam preparation quiz application. The architecture emphasizes simplicity, testability, and user experience while maintaining the spooky aesthetic required for the Kiroween Costume Contest.

Key design decisions:
- **Client-side only**: Simplifies deployment and reduces costs
- **Component-based**: Promotes reusability and maintainability
- **Type-safe**: TypeScript ensures reliability
- **Test-driven**: Comprehensive testing strategy ensures correctness
- **Accessible**: WCAG compliant and keyboard navigable
- **Performant**: Optimized for fast loading and smooth interactions

The haunting UI theme is carefully balanced to be memorable and engaging without compromising usability or accessibility. All design elements serve both aesthetic and functional purposes.
