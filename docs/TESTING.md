# Testing Strategy and Guide

このドキュメントでは、SAP Obakeアプリケーションのテスト戦略、TDD（テスト駆動開発）アプローチ、およびテストの実行方法について説明します。

## 目次

- [テスト哲学](#テスト哲学)
- [TDDアプローチ](#tddアプローチ)
- [テストの種類](#テストの種類)
- [テストツール](#テストツール)
- [テスト実行](#テスト実行)
- [テストの書き方](#テストの書き方)
- [カバレッジ](#カバレッジ)
- [ベストプラクティス](#ベストプラクティス)

---

## テスト哲学

SAP Obakeは、**テスト駆動開発（TDD）**と**Spec駆動開発**の原則に基づいて開発されています。

### 基本原則

1. **テストファースト**: 実装前にテストを書く
2. **正確性の保証**: 仕様に対する正確性をテストで検証
3. **リファクタリングの安全性**: テストがあることで安心してコードを改善できる
4. **ドキュメントとしてのテスト**: テストコードが仕様書の役割を果たす
5. **継続的な品質**: すべてのコミットでテストを実行

### テストの価値

- ✅ **バグの早期発見**: 実装前に期待動作を定義
- ✅ **リグレッション防止**: 既存機能の破壊を検出
- ✅ **設計の改善**: テスト可能な設計を促進
- ✅ **ドキュメント**: 使用例と期待動作を示す
- ✅ **自信**: 変更に対する安心感

---

## TDDアプローチ

### Red-Green-Refactorサイクル

SAP Obakeの開発は、TDDの3つのステップに従います：

#### 🔴 RED（テスト作成）

まず失敗するテストを書きます。

```typescript
// 例: Timer機能のテスト
test('formats time as MM:SS', () => {
  expect(formatTime(125)).toBe('02:05'); // まだ実装されていないので失敗
});
```

**ポイント:**
- 期待する動作を明確に定義
- テストを実行して失敗を確認
- 失敗の理由が正しいことを確認

---

#### 🟢 GREEN（実装）

テストを通す最小限のコードを書きます。

```typescript
// 例: Timer機能の実装
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
```

**ポイント:**
- テストが通る最小限の実装
- 過剰な実装は避ける
- テストを実行して成功を確認

---

#### 🔵 REFACTOR（リファクタリング）

コードを改善します。

```typescript
// 例: より読みやすく改善
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return [minutes, remainingSeconds]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}
```

**ポイント:**
- テストを保ちながらコードを最適化
- 重複を削除
- 可読性を向上
- テストが引き続き通ることを確認

---

### TDDの実践例

#### Phase 5: Timer機能の開発

```markdown
## Phase 5: Timer Functionality (TDD Cycle 4)

- [x] 5. Write property test for timer (RED)
  - **Property 10: Timer updates continuously**
  - Write tests that will initially fail
  
- [x] 5.1 Implement timer functionality (GREEN)
  - Create Timer utility to track elapsed time
  - Run tests to confirm they pass
  
- [x] 5.2 Refactor timer functionality (REFACTOR)
  - Optimize timer logic
  - Ensure all tests still pass
```

このように、各機能は必ず **RED → GREEN → REFACTOR** のサイクルで開発されます。

---

## テストの種類

SAP Obakeでは、4種類のテストを使用しています。

### 1. Unit Tests（ユニットテスト）

個別の関数やコンポーネントをテストします。

**場所:** `__tests__/unit/`

**例:**

```typescript
// __tests__/unit/timer.test.tsx
import { formatTime } from '@/lib/timer';

describe('Timer', () => {
  test('formats time correctly', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(125)).toBe('02:05');
  });

  test('handles large values', () => {
    expect(formatTime(3661)).toBe('61:01');
  });
});
```

**目的:**
- 特定の入力に対する正確な出力を検証
- エッジケースのテスト
- 基本的な機能の確認

---

### 2. Property-Based Tests（プロパティベーステスト）

fast-checkを使用して、汎用的なプロパティを多数の入力でテストします。

**場所:** `__tests__/property/`

**例:**

```typescript
// __tests__/property/timer.property.test.ts
import { test } from 'vitest';
import * as fc from 'fast-check';
import { formatTime } from '@/lib/timer';

/**
 * Feature: sap-obake-quiz, Property 10: Timer updates continuously
 * Validates: Requirements 3.1
 */
test('Property 10: formatted time always has MM:SS format', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 86400 }), // 0-24時間
      (seconds) => {
        const formatted = formatTime(seconds);
        // MM:SS形式であることを検証
        expect(formatted).toMatch(/^\d{2}:\d{2}$/);
        
        // 分と秒を抽出
        const [minutes, secs] = formatted.split(':').map(Number);
        
        // 秒は0-59の範囲
        expect(secs).toBeGreaterThanOrEqual(0);
        expect(secs).toBeLessThan(60);
        
        // 元の秒数と一致することを検証
        expect(minutes * 60 + secs).toBe(seconds);
      }
    ),
    { numRuns: 100 } // 最低100回実行
  );
});
```

**目的:**
- 汎用的なプロパティの検証
- 多数の入力パターンでのテスト
- 予期しないエッジケースの発見

**重要:**
- 各プロパティテストは最低100回実行
- 仕様書のプロパティ番号をコメントで明記
- 要件番号を明記

---

### 3. Integration Tests（統合テスト）

複数のコンポーネントやモジュールの統合をテストします。

**場所:** `__tests__/integration/`

**例:**

```typescript
// __tests__/integration/quiz-flow.integration.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizSession } from '@/components/quiz-session';

test('complete quiz flow', async () => {
  render(<QuizSession />);
  
  // 問題が表示される
  expect(screen.getByText(/Question 1\/20/)).toBeInTheDocument();
  
  // 回答を選択
  const choice = screen.getByText(/Option A/);
  fireEvent.click(choice);
  
  // フィードバックが表示される
  expect(screen.getByText(/Correct|Incorrect/)).toBeInTheDocument();
  
  // 次の問題へ
  const nextButton = screen.getByText(/Next/);
  fireEvent.click(nextButton);
  
  // 問題番号が更新される
  expect(screen.getByText(/Question 2\/20/)).toBeInTheDocument();
});
```

**目的:**
- コンポーネント間の連携を検証
- ユーザーフローのテスト
- データフローの確認

---

### 4. E2E Tests（エンドツーエンドテスト）

実際のユーザー操作をシミュレートします。

**場所:** `__tests__/e2e/`

**例:**

```typescript
// __tests__/e2e/complete-quiz.e2e.test.ts
test('user can complete entire quiz', async () => {
  // ホームページにアクセス
  await page.goto('http://localhost:3000');
  
  // クイズを開始
  await page.click('text=Start Quiz');
  
  // 20問すべてに回答
  for (let i = 0; i < 20; i++) {
    await page.click('[data-testid="choice-0"]');
    await page.click('text=Next');
  }
  
  // 結果ページが表示される
  await expect(page.locator('text=Results')).toBeVisible();
  await expect(page.locator('text=/\\d+\/20/')).toBeVisible();
});
```

**目的:**
- 実際のユーザー体験の検証
- ブラウザ環境でのテスト
- パフォーマンスの確認

---

## テストツール

### Vitest

高速なユニットテストフレームワーク。

**設定:** `vitest.config.ts`

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '*.config.*',
      ],
    },
  },
});
```

---

### fast-check

プロパティベーステストライブラリ。

**使用例:**

```typescript
import * as fc from 'fast-check';

fc.assert(
  fc.property(
    fc.array(fc.integer(), { minLength: 20, maxLength: 20 }),
    (questions) => {
      // プロパティのテスト
    }
  ),
  { numRuns: 100 }
);
```

---

### React Testing Library

Reactコンポーネントのテストライブラリ。

**使用例:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click', () => {
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalled();
});
```

---

## テスト実行

### 基本コマンド

```bash
# すべてのテストを実行
pnpm test

# ウォッチモードで実行
pnpm test:watch

# カバレッジ付きで実行
pnpm test:coverage

# 特定のテストファイルを実行
pnpm test __tests__/unit/timer.test.ts

# 特定のテストパターンを実行
pnpm test --grep "Timer"
```

---

### CI/CD環境

```bash
# CI環境での実行（ウォッチモードなし）
pnpm test --run

# カバレッジレポート生成
pnpm test:coverage --run
```

---

### デバッグ

```bash
# デバッグモードで実行
pnpm test --inspect-brk

# 詳細なログ出力
pnpm test --reporter=verbose
```

---

## テストの書き方

### ユニットテストの書き方

#### 1. テストファイルの作成

```typescript
// __tests__/unit/example.test.ts
import { describe, test, expect } from 'vitest';
import { functionToTest } from '@/lib/example';

describe('Example Function', () => {
  test('should do something', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });
});
```

---

#### 2. テストの構造

```typescript
describe('Component/Function Name', () => {
  // セットアップ
  beforeEach(() => {
    // 各テスト前の準備
  });

  // 正常系のテスト
  test('handles valid input', () => {
    // Arrange（準備）
    const input = 'valid';
    
    // Act（実行）
    const result = functionToTest(input);
    
    // Assert（検証）
    expect(result).toBe('expected');
  });

  // エッジケースのテスト
  test('handles edge case', () => {
    expect(functionToTest(edgeCase)).toBe(expected);
  });

  // エラーケースのテスト
  test('throws error for invalid input', () => {
    expect(() => functionToTest(invalid)).toThrow();
  });
});
```

---

### プロパティベーステストの書き方

#### 1. プロパティの定義

```typescript
/**
 * Feature: sap-obake-quiz, Property X: Description
 * Validates: Requirements X.Y
 */
test('Property X: description', () => {
  fc.assert(
    fc.property(
      // ジェネレーターの定義
      fc.integer({ min: 0, max: 100 }),
      (input) => {
        // プロパティの検証
        const result = functionToTest(input);
        expect(result).toSatisfy(condition);
      }
    ),
    { numRuns: 100 }
  );
});
```

---

#### 2. カスタムジェネレーター

```typescript
// 問題オブジェクトのジェネレーター
const questionArbitrary = fc.record({
  id: fc.uuid(),
  domain: fc.constantFrom(
    'complex-organizations',
    'new-solutions',
    'continuous-improvement',
    'migration-modernization'
  ),
  text: fc.string({ minLength: 10 }),
  choices: fc.array(
    fc.record({
      id: fc.uuid(),
      text: fc.string({ minLength: 5 }),
    }),
    { minLength: 4, maxLength: 4 }
  ),
  correctChoiceId: fc.uuid(),
  explanation: fc.string({ minLength: 20 }),
  difficulty: fc.constantFrom('medium', 'hard'),
  tags: fc.array(fc.string()),
});
```

---

### コンポーネントテストの書き方

#### 1. 基本的なレンダリングテスト

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from '@/components/component';

test('renders correctly', () => {
  render(<Component prop="value" />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

---

#### 2. ユーザーインタラクションのテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('handles user interaction', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  
  fireEvent.click(screen.getByText('Click'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

#### 3. 非同期処理のテスト

```typescript
import { render, screen, waitFor } from '@testing-library/react';

test('loads data asynchronously', async () => {
  render(<AsyncComponent />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data Loaded')).toBeInTheDocument();
  });
});
```

---

## カバレッジ

### カバレッジ目標

- **全体**: 80%以上
- **重要なビジネスロジック**: 90%以上
- **ユーティリティ関数**: 100%

### カバレッジレポート

```bash
# カバレッジレポート生成
pnpm test:coverage

# HTMLレポートを開く
open coverage/index.html
```

### カバレッジの確認

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.23 |    78.45 |   90.12 |   84.67 |
 lib/                 |   92.34 |    85.67 |   95.45 |   91.23 |
  quiz-manager.ts     |   95.67 |    89.23 |   100   |   94.56 |
  score-calculator.ts |   98.45 |    92.34 |   100   |   97.89 |
  timer.ts            |   100   |    100   |   100   |   100   |
 components/          |   78.90 |    71.23 |   85.34 |   77.45 |
  quiz-session.tsx    |   82.34 |    75.67 |   88.90 |   81.23 |
  question-card.tsx   |   75.45 |    67.89 |   82.34 |   74.56 |
----------------------|---------|----------|---------|---------|
```

---

## ベストプラクティス

### 1. テストの命名

```typescript
// ❌ 悪い例
test('test1', () => { ... });

// ✅ 良い例
test('formats time as MM:SS for valid input', () => { ... });
```

---

### 2. テストの独立性

```typescript
// ❌ 悪い例（テスト間で状態を共有）
let sharedState;
test('test1', () => {
  sharedState = 'value';
});
test('test2', () => {
  expect(sharedState).toBe('value'); // test1に依存
});

// ✅ 良い例（各テストが独立）
test('test1', () => {
  const state = 'value';
  expect(state).toBe('value');
});
test('test2', () => {
  const state = 'value';
  expect(state).toBe('value');
});
```

---

### 3. Arrange-Act-Assert パターン

```typescript
test('calculates score correctly', () => {
  // Arrange（準備）
  const answers = [
    { questionId: '1', selectedChoiceId: 'a', isCorrect: true },
    { questionId: '2', selectedChoiceId: 'b', isCorrect: false },
  ];
  
  // Act（実行）
  const result = calculateScore(answers, questions, startTime, endTime);
  
  // Assert（検証）
  expect(result.correctAnswers).toBe(1);
  expect(result.percentageScore).toBe(50);
});
```

---

### 4. モックの使用

```typescript
import { vi } from 'vitest';

test('calls API correctly', async () => {
  // モックの作成
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ data: 'test' }),
  });
  global.fetch = mockFetch;
  
  // テスト実行
  await fetchData();
  
  // モックの検証
  expect(mockFetch).toHaveBeenCalledWith('/api/data');
});
```

---

### 5. エラーケースのテスト

```typescript
test('throws error for invalid input', () => {
  expect(() => {
    validateQuestion(invalidQuestion);
  }).toThrow('Invalid question format');
});

test('handles async errors', async () => {
  await expect(async () => {
    await loadQuestions();
  }).rejects.toThrow('Failed to load questions');
});
```

---

### 6. プロパティテストのベストプラクティス

```typescript
// ✅ 良い例：入力ドメインを適切に制限
fc.assert(
  fc.property(
    fc.integer({ min: 0, max: 86400 }), // 0-24時間に制限
    (seconds) => {
      const formatted = formatTime(seconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    }
  )
);

// ❌ 悪い例：無制限の入力
fc.assert(
  fc.property(
    fc.integer(), // 負の値や巨大な値も含まれる
    (seconds) => {
      const formatted = formatTime(seconds);
      expect(formatted).toMatch(/^\d{2}:\d{2}$/);
    }
  )
);
```

---

## トラブルシューティング

### テストが失敗する場合

1. **エラーメッセージを確認**
   ```bash
   pnpm test --reporter=verbose
   ```

2. **単一のテストを実行**
   ```bash
   pnpm test __tests__/unit/specific.test.ts
   ```

3. **デバッグモードで実行**
   ```bash
   pnpm test --inspect-brk
   ```

---

### プロパティテストが失敗する場合

1. **失敗した入力を確認**
   - fast-checkは失敗した入力を表示します
   
2. **その入力で単体テストを作成**
   ```typescript
   test('handles specific failing case', () => {
     const failingInput = /* fast-checkが見つけた入力 */;
     expect(functionToTest(failingInput)).toBe(expected);
   });
   ```

3. **入力ドメインを見直す**
   - ジェネレーターが適切な範囲を生成しているか確認

---

## 継続的インテグレーション

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test --run
      - run: pnpm test:coverage --run
```

---

## 関連ドキュメント

- [コンポーネントAPI](./COMPONENTS.md) - コンポーネントの詳細
- [ライブラリAPI](./LIBRARIES.md) - ライブラリ関数の詳細
- [Vitest Documentation](https://vitest.dev/)
- [fast-check Documentation](https://fast-check.dev/)
- [React Testing Library](https://testing-library.com/react)
