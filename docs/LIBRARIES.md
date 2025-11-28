# Library API Documentation

このドキュメントでは、SAP Obakeアプリケーションで使用されるすべてのライブラリ関数とユーティリティのAPIを説明します。

## 目次

- [Question Bank](#question-bank)
- [Quiz Manager](#quiz-manager)
- [Score Calculator](#score-calculator)
- [Storage Manager](#storage-manager)
- [Timer](#timer)
- [Theme Constants](#theme-constants)
- [Types](#types)
- [Utils](#utils)

---

## Question Bank

問題バンクの管理と問題選択を行うモジュール。

### ファイル: `lib/question-bank.ts`

### 関数

#### `loadQuestions()`

問題バンクから全問題を読み込みます。

```typescript
async function loadQuestions(): Promise<Question[]>
```

**戻り値:**
- `Promise<Question[]>`: 全問題の配列

**使用例:**

```typescript
import { loadQuestions } from '@/lib/question-bank';

const questions = await loadQuestions();
console.log(`Loaded ${questions.length} questions`);
```

**エラー:**
- 問題ファイルの読み込みに失敗した場合、エラーをスロー

---

#### `selectRandomQuestions()`

問題バンクからランダムに指定数の問題を選択します。

```typescript
function selectRandomQuestions(
  questions: Question[],
  count: number
): Question[]
```

**パラメータ:**
- `questions`: 選択元の問題配列
- `count`: 選択する問題数

**戻り値:**
- `Question[]`: ランダムに選択された問題の配列

**使用例:**

```typescript
import { selectRandomQuestions, loadQuestions } from '@/lib/question-bank';

const allQuestions = await loadQuestions();
const quizQuestions = selectRandomQuestions(allQuestions, 20);
```

**注意:**
- 問題数が不足している場合、利用可能な全問題を返します
- Fisher-Yatesシャッフルアルゴリズムを使用

---

#### `ensureDomainDistribution()`

全4つのコンテンツドメインが含まれるように問題を選択します。

```typescript
function ensureDomainDistribution(
  questions: Question[],
  count: number
): Question[]
```

**パラメータ:**
- `questions`: 選択元の問題配列
- `count`: 選択する問題数

**戻り値:**
- `Question[]`: ドメイン分散を考慮した問題の配列

**使用例:**

```typescript
import { ensureDomainDistribution, loadQuestions } from '@/lib/question-bank';

const allQuestions = await loadQuestions();
const balancedQuestions = ensureDomainDistribution(allQuestions, 20);
```

**ドメイン分散ロジック:**
1. 各ドメインから最低1問を選択
2. 残りの問題をランダムに選択
3. 合計が指定数になるまで繰り返し

---

#### `validateQuestion()`

問題オブジェクトの妥当性を検証します。

```typescript
function validateQuestion(question: Question): boolean
```

**パラメータ:**
- `question`: 検証する問題オブジェクト

**戻り値:**
- `boolean`: 妥当な場合true

**検証項目:**
- IDが存在するか
- ドメインが有効な値か
- 問題文が空でないか
- 選択肢が4つあるか
- 正解IDが有効か
- 解説が存在するか

**使用例:**

```typescript
import { validateQuestion } from '@/lib/question-bank';

if (validateQuestion(question)) {
  console.log('Valid question');
} else {
  console.error('Invalid question');
}
```

---

## Quiz Manager

クイズセッションの状態管理を行うモジュール。

### ファイル: `lib/quiz-manager.ts`

### クラス: `QuizManager`

#### コンストラクタ

```typescript
constructor(questions: Question[])
```

**パラメータ:**
- `questions`: クイズで使用する問題の配列

**使用例:**

```typescript
import { QuizManager } from '@/lib/quiz-manager';

const manager = new QuizManager(questions);
```

---

#### `getCurrentQuestion()`

現在の問題を取得します。

```typescript
getCurrentQuestion(): Question | null
```

**戻り値:**
- `Question | null`: 現在の問題、または完了時はnull

**使用例:**

```typescript
const currentQuestion = manager.getCurrentQuestion();
if (currentQuestion) {
  console.log(currentQuestion.text);
}
```

---

#### `submitAnswer()`

ユーザーの回答を記録します。

```typescript
submitAnswer(choiceId: string): boolean
```

**パラメータ:**
- `choiceId`: 選択された回答のID

**戻り値:**
- `boolean`: 正解の場合true

**使用例:**

```typescript
const isCorrect = manager.submitAnswer('choice-1');
if (isCorrect) {
  console.log('Correct!');
}
```

---

#### `nextQuestion()`

次の問題に進みます。

```typescript
nextQuestion(): void
```

**使用例:**

```typescript
manager.nextQuestion();
```

---

#### `isComplete()`

クイズが完了したかチェックします。

```typescript
isComplete(): boolean
```

**戻り値:**
- `boolean`: 全問題に回答済みの場合true

**使用例:**

```typescript
if (manager.isComplete()) {
  const result = manager.getResult();
  // 結果を表示
}
```

---

#### `getResult()`

クイズ結果を取得します。

```typescript
getResult(): QuizResult
```

**戻り値:**
- `QuizResult`: クイズ結果オブジェクト

**使用例:**

```typescript
const result = manager.getResult();
console.log(`Score: ${result.correctAnswers}/${result.totalQuestions}`);
```

---

#### `getProgress()`

現在の進捗状況を取得します。

```typescript
getProgress(): {
  current: number;
  total: number;
  correctCount: number;
}
```

**戻り値:**
- オブジェクト:
  - `current`: 現在の問題番号（1から開始）
  - `total`: 総問題数
  - `correctCount`: 正答数

**使用例:**

```typescript
const progress = manager.getProgress();
console.log(`Question ${progress.current}/${progress.total}`);
```

---

## Score Calculator

スコア計算を行うモジュール。

### ファイル: `lib/score-calculator.ts`

### 関数

#### `calculateScore()`

クイズ結果からスコアを計算します。

```typescript
function calculateScore(
  answers: UserAnswer[],
  questions: Question[],
  startTime: number,
  endTime: number
): QuizResult
```

**パラメータ:**
- `answers`: ユーザーの回答配列
- `questions`: 問題配列
- `startTime`: 開始時刻（Unix timestamp）
- `endTime`: 終了時刻（Unix timestamp）

**戻り値:**
- `QuizResult`: 計算されたクイズ結果

**使用例:**

```typescript
import { calculateScore } from '@/lib/score-calculator';

const result = calculateScore(
  userAnswers,
  questions,
  startTime,
  Date.now()
);
```

---

#### `calculatePercentage()`

パーセンテージスコアを計算します。

```typescript
function calculatePercentage(
  correct: number,
  total: number
): number
```

**パラメータ:**
- `correct`: 正答数
- `total`: 総問題数

**戻り値:**
- `number`: パーセンテージ（0-100）

**使用例:**

```typescript
import { calculatePercentage } from '@/lib/score-calculator';

const percentage = calculatePercentage(15, 20); // 75
```

---

#### `calculateDomainPerformance()`

ドメイン別のパフォーマンスを計算します。

```typescript
function calculateDomainPerformance(
  answers: UserAnswer[],
  questions: Question[]
): DomainPerformance[]
```

**パラメータ:**
- `answers`: ユーザーの回答配列
- `questions`: 問題配列

**戻り値:**
- `DomainPerformance[]`: ドメイン別パフォーマンスの配列

**使用例:**

```typescript
import { calculateDomainPerformance } from '@/lib/score-calculator';

const domainStats = calculateDomainPerformance(answers, questions);
domainStats.forEach(stat => {
  console.log(`${stat.domain}: ${stat.percentage}%`);
});
```

---

## Storage Manager

LocalStorageの管理を行うモジュール。

### ファイル: `lib/storage-manager.ts`

### 定数

```typescript
const STORAGE_KEY = 'sap-obake-quiz-state';
const STORAGE_VERSION = '1.0';
```

---

### 関数

#### `saveQuizState()`

クイズ状態をLocalStorageに保存します。

```typescript
function saveQuizState(state: QuizSession): void
```

**パラメータ:**
- `state`: 保存するクイズセッション状態

**使用例:**

```typescript
import { saveQuizState } from '@/lib/storage-manager';

saveQuizState(currentSession);
```

**エラーハンドリング:**
- Quota exceeded: 古い完了セッションを削除して再試行
- その他のエラー: コンソールにログ出力

---

#### `loadQuizState()`

LocalStorageからクイズ状態を読み込みます。

```typescript
function loadQuizState(): QuizSession | null
```

**戻り値:**
- `QuizSession | null`: 保存された状態、または存在しない場合null

**使用例:**

```typescript
import { loadQuizState } from '@/lib/storage-manager';

const savedState = loadQuizState();
if (savedState) {
  // 状態を復元
}
```

**エラーハンドリング:**
- データが破損している場合、nullを返す
- パースエラーの場合、nullを返す

---

#### `clearQuizState()`

LocalStorageからクイズ状態を削除します。

```typescript
function clearQuizState(): void
```

**使用例:**

```typescript
import { clearQuizState } from '@/lib/storage-manager';

clearQuizState();
```

---

#### `validateStoredState()`

保存された状態の妥当性を検証します。

```typescript
function validateStoredState(state: any): boolean
```

**パラメータ:**
- `state`: 検証する状態オブジェクト

**戻り値:**
- `boolean`: 妥当な場合true

**検証項目:**
- バージョンの一致
- 必須フィールドの存在
- データ型の正確性

**使用例:**

```typescript
import { validateStoredState } from '@/lib/storage-manager';

if (validateStoredState(data)) {
  // 状態を使用
}
```

---

## Timer

タイマー機能を提供するモジュール。

### ファイル: `lib/timer.ts`

### 関数

#### `formatTime()`

秒数をMM:SS形式にフォーマットします。

```typescript
function formatTime(seconds: number): string
```

**パラメータ:**
- `seconds`: 秒数

**戻り値:**
- `string`: フォーマットされた時間文字列（MM:SS）

**使用例:**

```typescript
import { formatTime } from '@/lib/timer';

console.log(formatTime(125)); // "02:05"
console.log(formatTime(3661)); // "61:01"
```

---

#### `calculateElapsedTime()`

経過時間を計算します。

```typescript
function calculateElapsedTime(startTime: number): number
```

**パラメータ:**
- `startTime`: 開始時刻（Unix timestamp）

**戻り値:**
- `number`: 経過秒数

**使用例:**

```typescript
import { calculateElapsedTime } from '@/lib/timer';

const elapsed = calculateElapsedTime(startTime);
console.log(`Elapsed: ${elapsed} seconds`);
```

---

#### `isWarningThreshold()`

警告閾値に達したかチェックします。

```typescript
function isWarningThreshold(
  elapsedSeconds: number,
  threshold: number = 1800
): boolean
```

**パラメータ:**
- `elapsedSeconds`: 経過秒数
- `threshold`: 警告閾値（デフォルト: 1800秒 = 30分）

**戻り値:**
- `boolean`: 閾値に達した場合true

**使用例:**

```typescript
import { isWarningThreshold } from '@/lib/timer';

if (isWarningThreshold(elapsed)) {
  console.log('30 minutes reached!');
}
```

---

## Theme Constants

ハロウィンテーマの定数を提供するモジュール。

### ファイル: `lib/theme-constants.ts`

### 定数

#### `colors`

カラーパレット定義。

```typescript
export const colors = {
  ghostWhite: '#F8F8FF',
  midnightPurple: '#2D1B4E',
  hauntedOrange: '#FF6B35',
  witchGreen: '#4A7C59',
  darkVoid: '#0A0A0A',
  shadowGray: '#1A1A1A',
  mistGray: '#2A2A2A',
  bloodRed: '#8B0000',
  ghostlyBlue: '#4A5F7F',
  poisonGreen: '#39FF14',
  correctGlow: '#4ADE80',
  incorrectGlow: '#F87171',
  warningGlow: '#FBBF24',
};
```

---

#### `shadows`

シャドウエフェクト定義。

```typescript
export const shadows = {
  ghostly: '0 0 20px rgba(138, 43, 226, 0.5)',
  eerie: '0 4px 20px rgba(0, 0, 0, 0.8)',
  haunted: '0 0 30px rgba(255, 107, 53, 0.3)',
};
```

---

#### `animations`

アニメーション定義。

```typescript
export const animations = {
  float: 'float 3s ease-in-out infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  flicker: 'flicker 4s linear infinite',
  fadeIn: 'fadeIn 0.5s ease-in',
};
```

---

### 関数

#### `getDomainColor()`

コンテンツドメインに対応する色を取得します。

```typescript
function getDomainColor(domain: ContentDomain): string
```

**パラメータ:**
- `domain`: コンテンツドメイン

**戻り値:**
- `string`: 16進数カラーコード

**使用例:**

```typescript
import { getDomainColor } from '@/lib/theme-constants';

const color = getDomainColor('complex-organizations');
// '#2D1B4E'
```

---

#### `createGlow()`

グローエフェクトのCSSを生成します。

```typescript
function createGlow(color: string, intensity: number = 20): string
```

**パラメータ:**
- `color`: 16進数カラーコード
- `intensity`: グローの強度（デフォルト: 20）

**戻り値:**
- `string`: CSS box-shadow値

**使用例:**

```typescript
import { createGlow } from '@/lib/theme-constants';

const glow = createGlow('#FF6B35', 30);
// '0 0 30px rgba(255, 107, 53, 0.5)'
```

---

## Types

型定義を提供するモジュール。

### ファイル: `lib/types.ts`

### 主要な型

#### `Question`

```typescript
interface Question {
  id: string;
  domain: ContentDomain;
  text: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  difficulty: 'medium' | 'hard';
  tags: string[];
}
```

---

#### `Choice`

```typescript
interface Choice {
  id: string;
  text: string;
}
```

---

#### `ContentDomain`

```typescript
enum ContentDomain {
  COMPLEX_ORGANIZATIONS = 'complex-organizations',
  NEW_SOLUTIONS = 'new-solutions',
  CONTINUOUS_IMPROVEMENT = 'continuous-improvement',
  MIGRATION_MODERNIZATION = 'migration-modernization'
}
```

---

#### `QuizSession`

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
```

---

#### `UserAnswer`

```typescript
interface UserAnswer {
  questionId: string;
  selectedChoiceId: string;
  isCorrect: boolean;
  answeredAt: number;
}
```

---

#### `QuizResult`

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
```

---

#### `DomainPerformance`

```typescript
interface DomainPerformance {
  domain: ContentDomain;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}
```

---

## Utils

汎用ユーティリティ関数を提供するモジュール。

### ファイル: `lib/utils.ts`

### 関数

#### `cn()`

Tailwind CSSクラス名を結合します（clsxとtailwind-mergeを使用）。

```typescript
function cn(...inputs: ClassValue[]): string
```

**パラメータ:**
- `inputs`: クラス名の配列

**戻り値:**
- `string`: 結合されたクラス名

**使用例:**

```typescript
import { cn } from '@/lib/utils';

const className = cn(
  'base-class',
  isActive && 'active-class',
  { 'conditional-class': condition }
);
```

---

## エラーハンドリング

すべてのライブラリ関数は適切なエラーハンドリングを実装しています：

### 例: Storage Manager

```typescript
try {
  saveQuizState(state);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // 古いデータを削除して再試行
  } else {
    console.error('Failed to save state:', error);
  }
}
```

---

## パフォーマンス考慮事項

### メモ化

頻繁に呼び出される関数は結果をキャッシュ：

```typescript
const memoizedResult = useMemo(
  () => calculateDomainPerformance(answers, questions),
  [answers, questions]
);
```

### 遅延読み込み

大きなデータは必要になるまで読み込まない：

```typescript
const questions = await loadQuestions(); // 必要時のみ
```

---

## テスト

各ライブラリには対応するテストファイルがあります：

- Unit Tests: `__tests__/unit/[library-name].test.ts`
- Property Tests: `__tests__/property/[feature].property.test.ts`

### テスト例

```typescript
import { formatTime } from '@/lib/timer';

test('formats time correctly', () => {
  expect(formatTime(125)).toBe('02:05');
  expect(formatTime(3661)).toBe('61:01');
});
```

---

## 関連ドキュメント

- [コンポーネントAPI](./COMPONENTS.md) - Reactコンポーネントの詳細
- [テスト戦略](./TESTING.md) - テストアプローチと実行方法
- [ハロウィンテーマ](../frontend/THEME.md) - デザインシステムの詳細
