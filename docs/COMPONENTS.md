# Component API Documentation

このドキュメントでは、SAP Obakeアプリケーションで使用されるすべてのReactコンポーネントのAPIと使用方法を説明します。

## 目次

- [Core Components](#core-components)
  - [QuizSession](#quizsession)
  - [QuestionCard](#questioncard)
  - [Timer](#timer)
  - [ProgressBar](#progressbar)
  - [ResultsSummary](#resultssummary)
- [Layout Components](#layout-components)
  - [HauntedLayout](#hauntedlayout)
- [Error Components](#error-components)
  - [ErrorBoundary](#errorboundary)
  - [ErrorMessage](#errormessage)
  - [InsufficientQuestionsError](#insufficientquestionserror)
  - [QuotaWarning](#quotawarning)
  - [RestorationError](#restorationerror)

---

## Core Components

### QuizSession

クイズセッション全体を管理するメインコンポーネント。問題の表示、回答の記録、タイマーの管理、進捗の保存を行います。

#### Props

```typescript
interface QuizSessionProps {
  initialQuestions?: Question[];
  onComplete?: (result: QuizResult) => void;
}
```

- `initialQuestions` (optional): 初期化時に使用する問題のリスト。指定しない場合は自動的に問題バンクから選択されます。
- `onComplete` (optional): クイズ完了時に呼び出されるコールバック関数。結果オブジェクトを受け取ります。

#### 使用例

```tsx
import { QuizSession } from '@/components/quiz-session';

export default function QuizPage() {
  const handleComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result);
    // 結果ページへ遷移
  };

  return <QuizSession onComplete={handleComplete} />;
}
```

#### 内部状態

- 現在の問題インデックス
- ユーザーの回答リスト
- タイマーの開始時刻
- フィードバック表示状態

#### 機能

- 問題の順次表示
- 回答の記録とフィードバック表示
- 経過時間の追跡
- LocalStorageへの自動保存
- クイズ完了時の結果計算

---

### QuestionCard

個別の問題を表示し、ユーザーの回答を受け付けるコンポーネント。

#### Props

```typescript
interface QuestionCardProps {
  question: Question;
  onAnswer: (choiceId: string) => void;
  showFeedback: boolean;
  userAnswer?: string;
  questionNumber: number;
  totalQuestions: number;
}
```

- `question`: 表示する問題オブジェクト
- `onAnswer`: 回答選択時に呼び出されるコールバック関数
- `showFeedback`: フィードバックを表示するかどうか
- `userAnswer` (optional): ユーザーが選択した回答のID
- `questionNumber`: 現在の問題番号（1から開始）
- `totalQuestions`: 総問題数

#### 使用例

```tsx
import { QuestionCard } from '@/components/question-card';

<QuestionCard
  question={currentQuestion}
  onAnswer={handleAnswer}
  showFeedback={showFeedback}
  userAnswer={selectedAnswer}
  questionNumber={5}
  totalQuestions={20}
/>
```

#### 機能

- 問題文と4つの選択肢の表示
- 選択肢のホバーエフェクト
- 回答選択時の即時フィードバック
- 正解/不正解のビジュアル表示
- 詳細な解説の表示
- コンテンツドメインバッジの表示

#### アクセシビリティ

- キーボードナビゲーション対応（矢印キー、Enter）
- ARIA labels完備
- フォーカスインジケーター
- スクリーンリーダー対応

---

### Timer

経過時間を表示するコンポーネント。

#### Props

```typescript
interface TimerProps {
  startTime: number;
  onWarning?: () => void;
  warningThreshold?: number;
}
```

- `startTime`: タイマー開始時刻（Unix timestamp）
- `onWarning` (optional): 警告閾値到達時のコールバック
- `warningThreshold` (optional): 警告を表示する時間（秒）。デフォルト: 1800（30分）

#### 使用例

```tsx
import { Timer } from '@/components/timer';

<Timer
  startTime={Date.now()}
  onWarning={() => console.log('30 minutes reached!')}
  warningThreshold={1800}
/>
```

#### 機能

- リアルタイムの経過時間表示（MM:SS形式）
- 30分到達時の警告表示
- グローイングポケットウォッチスタイル
- 自動更新（1秒ごと）

#### スタイリング

- ハロウィンテーマのグローエフェクト
- 警告時の色変更（オレンジ）
- アニメーション効果

---

### ProgressBar

クイズの進捗状況を表示するコンポーネント。

#### Props

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
}
```

- `current`: 現在の問題番号（1から開始）
- `total`: 総問題数
- `correctCount`: 現在の正答数

#### 使用例

```tsx
import { ProgressBar } from '@/components/progress-bar';

<ProgressBar
  current={5}
  total={20}
  correctCount={3}
/>
```

#### 機能

- 現在の問題番号表示（例: "Question 5/20"）
- 正答数の表示
- ビジュアルプログレスバー
- ハロウィンテーマのエネルギーメータースタイル

#### スタイリング

- グラデーション効果
- アニメーション付きプログレスバー
- レスポンシブデザイン

---

### ResultsSummary

クイズ完了後の結果を表示するコンポーネント。

#### Props

```typescript
interface ResultsSummaryProps {
  result: QuizResult;
  onRestart: () => void;
}
```

- `result`: クイズ結果オブジェクト
- `onRestart`: 再スタートボタンクリック時のコールバック

#### 使用例

```tsx
import { ResultsSummary } from '@/components/results-summary';

<ResultsSummary
  result={quizResult}
  onRestart={() => router.push('/')}
/>
```

#### 機能

- 総合スコアの表示（正答数/20）
- パーセンテージスコアの表示
- 所要時間の表示
- ドメイン別パフォーマンスの表示
- スコアに応じたゴーストリアクション
- 再スタートボタン

#### ドメイン別パフォーマンス

各AWS SAPコンテンツドメインごとに以下を表示：
- ドメイン名
- 正答数/総問題数
- パーセンテージ
- ドメイン固有のカラー

#### アニメーション

- ドラマティックな登場アニメーション
- スコアのカウントアップエフェクト
- ゴーストの反応アニメーション

---

## Layout Components

### HauntedLayout

ハロウィンテーマのレイアウトを提供するコンポーネント。

#### Props

```typescript
interface HauntedLayoutProps {
  children: React.ReactNode;
  showGhosts?: boolean;
  animationIntensity?: 'low' | 'medium' | 'high';
}
```

- `children`: レイアウト内に表示するコンテンツ
- `showGhosts` (optional): ゴーストマスコットを表示するか。デフォルト: true
- `animationIntensity` (optional): アニメーションの強度。デフォルト: 'medium'

#### 使用例

```tsx
import { HauntedLayout } from '@/components/haunted-layout';

<HauntedLayout showGhosts={true} animationIntensity="medium">
  <YourContent />
</HauntedLayout>
```

#### 機能

- ダークテーマの背景
- パーティクルエフェクト（浮遊する塵/スパークル）
- コーナーのクモの巣装飾
- 浮遊するゴーストマスコット
- レスポンシブレイアウト
- `prefers-reduced-motion`対応

#### スタイリング

- ハロウィンカラーパレット
- グローエフェクト
- アニメーション（float, pulse, flicker）
- レスポンシブブレークポイント

---

## Error Components

### ErrorBoundary

Reactエラーバウンダリーコンポーネント。子コンポーネントでエラーが発生した場合にキャッチして表示します。

#### Props

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

- `children`: 監視する子コンポーネント
- `fallback` (optional): エラー時に表示するカスタムUI

#### 使用例

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

#### 機能

- エラーのキャッチと表示
- エラー情報のログ記録
- ユーザーフレンドリーなエラーメッセージ
- リロードボタン

---

### ErrorMessage

汎用エラーメッセージコンポーネント。

#### Props

```typescript
interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}
```

- `title`: エラータイトル
- `message`: エラーメッセージ
- `onRetry` (optional): リトライボタンのコールバック

#### 使用例

```tsx
import { ErrorMessage } from '@/components/error-message';

<ErrorMessage
  title="読み込みエラー"
  message="問題の読み込みに失敗しました。"
  onRetry={handleRetry}
/>
```

---

### InsufficientQuestionsError

問題数不足エラーを表示するコンポーネント。

#### Props

```typescript
interface InsufficientQuestionsErrorProps {
  availableCount: number;
  requiredCount: number;
}
```

- `availableCount`: 利用可能な問題数
- `requiredCount`: 必要な問題数

#### 使用例

```tsx
import { InsufficientQuestionsError } from '@/components/insufficient-questions-error';

<InsufficientQuestionsError
  availableCount={15}
  requiredCount={20}
/>
```

---

### QuotaWarning

LocalStorage容量警告コンポーネント。

#### Props

```typescript
interface QuotaWarningProps {
  onDismiss: () => void;
}
```

- `onDismiss`: 閉じるボタンのコールバック

#### 使用例

```tsx
import { QuotaWarning } from '@/components/quota-warning';

<QuotaWarning onDismiss={() => setShowWarning(false)} />
```

---

### RestorationError

状態復元エラーコンポーネント。

#### Props

```typescript
interface RestorationErrorProps {
  onStartNew: () => void;
}
```

- `onStartNew`: 新規開始ボタンのコールバック

#### 使用例

```tsx
import { RestorationError } from '@/components/restoration-error';

<RestorationError onStartNew={handleStartNew} />
```

---

## 共通パターン

### イベントハンドリング

すべてのコンポーネントは、適切な型付けされたイベントハンドラーを使用します：

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // ハンドラーロジック
};
```

### 条件付きレンダリング

```typescript
{showFeedback && (
  <div className="feedback">
    {/* フィードバックコンテンツ */}
  </div>
)}
```

### スタイリング

すべてのコンポーネントは、Tailwind CSSとハロウィンテーマを使用：

```typescript
<div className="bg-shadow-gray border-midnight-purple shadow-eerie">
  {/* コンテンツ */}
</div>
```

---

## テスト

各コンポーネントには対応するテストファイルがあります：

- Unit Tests: `__tests__/unit/[component-name].test.tsx`
- Property Tests: `__tests__/property/[feature].property.test.ts`
- Integration Tests: `__tests__/integration/[feature].integration.test.tsx`

### テスト例

```typescript
import { render, screen } from '@testing-library/react';
import { QuestionCard } from '@/components/question-card';

test('displays question text', () => {
  render(<QuestionCard question={mockQuestion} {...props} />);
  expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
});
```

---

## パフォーマンス最適化

### React.memo

頻繁に再レンダリングされるコンポーネントは`React.memo`でメモ化：

```typescript
export const QuestionCard = React.memo(({ question, ...props }) => {
  // コンポーネントロジック
});
```

### useCallback

コールバック関数は`useCallback`でメモ化：

```typescript
const handleAnswer = useCallback((choiceId: string) => {
  // ハンドラーロジック
}, [dependencies]);
```

---

## アクセシビリティ

すべてのコンポーネントは以下のアクセシビリティ基準を満たします：

- WCAG AA準拠のカラーコントラスト
- キーボードナビゲーション対応
- ARIA labels完備
- フォーカスインジケーター
- スクリーンリーダー対応
- `prefers-reduced-motion`対応

---

## 関連ドキュメント

- [ライブラリAPI](./LIBRARIES.md) - ビジネスロジックとユーティリティ関数
- [テスト戦略](./TESTING.md) - テストアプローチと実行方法
- [ハロウィンテーマ](../frontend/THEME.md) - デザインシステムの詳細
