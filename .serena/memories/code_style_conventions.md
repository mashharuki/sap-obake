# コードスタイルと規約

## TypeScript設定
- **Strictモード**: 有効
- **Target**: ES6以上
- **Module**: ESNext
- **Module Resolution**: bundler

## コーディング規約

### 命名規則
- **コンポーネント**: PascalCase (例: `QuestionCard`, `HauntedLayout`)
- **関数/変数**: camelCase (例: `calculateScore`, `questionBank`)
- **定数**: UPPER_SNAKE_CASE (例: `MAX_QUESTIONS`, `DEFAULT_TIMEOUT`)
- **型/インターフェース**: PascalCase (例: `Question`, `QuizSession`)
- **ファイル名**: kebab-case (例: `quiz-manager.ts`, `question-card.tsx`)

### インポート規則
- パスエイリアス `@/` を使用
  - `@/components` - Reactコンポーネント
  - `@/lib` - ビジネスロジック
  - `@/hooks` - カスタムフック
  - `@/app` - Next.js appディレクトリ

### Biome設定
- **インデント**: タブ
- **クォート**: ダブルクォート
- **Import整理**: 自動（organizeImports: "on"）
- **セミコロン**: 必須

## コンポーネント設計

### Reactコンポーネント
```typescript
// Props型定義
interface ComponentProps {
  prop1: string;
  prop2?: number; // オプショナル
  onAction: () => void; // イベントハンドラー
}

// 関数コンポーネント
export function Component({ prop1, prop2, onAction }: ComponentProps) {
  // 実装
}
```

### カスタムフック
```typescript
// use プレフィックス
export function useQuizState() {
  // 実装
}
```

## テスト規約

### テストファイル命名
- ユニットテスト: `*.test.ts` または `*.test.tsx`
- プロパティテスト: `*.property.test.ts`
- 統合テスト: `*.integration.test.ts`
- E2Eテスト: `*.e2e.test.ts`

### テスト構造
```typescript
describe("ComponentName", () => {
  it("should do something", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### プロパティベーステスト
```typescript
import fc from "fast-check";

it("property: description", () => {
  fc.assert(
    fc.property(
      fc.arbitrary(),
      (input) => {
        // テストロジック
      }
    ),
    { numRuns: 100 } // 最低100回実行
  );
});
```

## コメント規約

### JSDoc
```typescript
/**
 * 関数の説明
 * @param param1 - パラメータの説明
 * @returns 戻り値の説明
 */
export function functionName(param1: string): number {
  // 実装
}
```

### インラインコメント
- 「なぜ」を説明（「何を」はコードで表現）
- 複雑なロジックの意図を明確に
- TODOやFIXMEは明確な理由と共に記載

## エラーハンドリング
- 早期リターンパターンを使用
- 明確なエラーメッセージ
- try-catchで握りつぶさない
- エラーケースもテストでカバー

## パフォーマンス
- React.memoで不要な再レンダリングを防ぐ
- useCallbackでコールバックをメモ化
- useMemoで重い計算をメモ化
- 推測ではなく計測に基づいて最適化
