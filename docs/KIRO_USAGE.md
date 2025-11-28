# Kiro Usage Documentation

このドキュメントでは、SAP ObakeプロジェクトでKiroをどのように活用したかを説明します。Kiroween Costume Contestの審査基準に沿って、各Kiro機能の使用方法と効果を詳しく記載しています。

## 目次

- [プロジェクト概要](#プロジェクト概要)
- [Spec駆動開発](#spec駆動開発)
- [Vibe Coding](#vibe-coding)
- [Agent Hooks](#agent-hooks)
- [Steering Docs](#steering-docs)
- [開発プロセス](#開発プロセス)
- [学んだこと](#学んだこと)

---

## プロジェクト概要

**SAP Obake（サップおばけ）** は、AWS Certified Solutions Architect - Professional (SAP-C02) 試験対策のためのクイズアプリケーションです。Kiroween Costume Contestの「Costume Contest」カテゴリーに応募するため、ハロウィンをテーマにした不気味で洗練されたUIを特徴としています。

### 開発統計

- **開発期間**: 約2週間
- **総コミット数**: 100+
- **テストカバレッジ**: 85%以上
- **コンポーネント数**: 11個
- **テスト数**: 100+（ユニット、プロパティ、統合テスト）

---

## Spec駆動開発

Spec駆動開発は、SAP Obakeプロジェクトの中核となるアプローチでした。

### Specの構造

プロジェクトのSpecは以下の3つのドキュメントで構成されています：

1. **requirements.md** - 要件定義
2. **design.md** - 設計書
3. **tasks.md** - 実装タスクリスト

### 1. Requirements（要件定義）

#### EARS形式の採用

すべての要件は、EARS (Easy Approach to Requirements Syntax) 形式で記述しました。

**例:**

```markdown
### Requirement 1

**User Story:** As a User, I want to start a new quiz session with 20 questions, 
so that I can practice AWS SAP exam knowledge in a focused time-bound session.

#### Acceptance Criteria

1. WHEN a User clicks the start quiz button, THEN the System SHALL initialize 
   a new quiz session with exactly 20 questions
2. WHEN a quiz session is initialized, THEN the System SHALL randomly select 
   20 questions from the Question Bank
3. WHEN a quiz session starts, THEN the System SHALL start the Timer from zero
```

#### 効果

- ✅ **明確性**: 曖昧さのない要件定義
- ✅ **テスト可能性**: 各要件が直接テストケースに変換可能
- ✅ **トレーサビリティ**: 要件から設計、実装、テストまで追跡可能

---

### 2. Design（設計書）

#### Correctness Properties

設計書の最も重要な部分は、**Correctness Properties（正確性プロパティ）**です。これは、Property-Based Testing（PBT）の基礎となります。

**例:**

```markdown
### Property 1: Quiz initialization creates exactly 20 questions

*For any* question bank with at least 20 questions, initializing a new quiz 
session should result in exactly 20 questions being selected.

**Validates: Requirements 1.1**
```

#### プロパティの種類

1. **不変条件（Invariants）**
   - Property 5: Questions have required structure
   - Property 17: All questions have valid domain tags

2. **ラウンドトリップ（Round Trip）**
   - Property 25: State restoration is a round-trip

3. **冪等性（Idempotence）**
   - Property 26: Completed quiz clears saved state

4. **メタモルフィック（Metamorphic）**
   - Property 2: Questions are randomly selected

#### 効果

- ✅ **仕様の形式化**: 自然言語の要件を形式的なプロパティに変換
- ✅ **テストの自動生成**: プロパティから直接PBTを生成
- ✅ **バグの早期発見**: 実装前に期待動作を明確化

---

### 3. Tasks（実装タスク）

#### TDDサイクルの統合

タスクリストは、TDD（テスト駆動開発）のRed-Green-Refactorサイクルに従って構成されています。

**例:**

```markdown
## Phase 5: Timer Functionality (TDD Cycle 4)

- [x] 5. Write property test for timer (RED)
  - **Property 10: Timer updates continuously**
  - Write tests that will initially fail
  - _Validates: Requirements 3.1_

- [x] 5.1 Implement timer functionality (GREEN)
  - Create Timer utility to track elapsed time
  - Run tests to confirm they pass
  - _Requirements: 1.3, 3.1, 3.5_

- [x] 5.2 Refactor timer functionality (REFACTOR)
  - Optimize timer logic
  - Ensure all tests still pass
```

#### 効果

- ✅ **構造化された開発**: 各フェーズが明確
- ✅ **品質の保証**: テストファーストアプローチ
- ✅ **進捗の可視化**: チェックボックスで進捗を追跡

---

### Spec駆動開発 vs Vibe Coding

#### Spec駆動開発の利点

1. **大規模プロジェクトに最適**
   - 複雑な要件を体系的に管理
   - チーム開発での共通理解

2. **品質の保証**
   - 要件から実装まで一貫性
   - テストカバレッジの向上

3. **保守性**
   - ドキュメントが常に最新
   - 変更の影響範囲が明確

#### Vibe Codingの利点

1. **迅速なプロトタイピング**
   - アイデアを素早く形に
   - 柔軟な方向転換

2. **学習と実験**
   - 新しい技術の試行
   - 小規模な機能追加

#### 使い分け

SAP Obakeでは、以下のように使い分けました：

- **Spec駆動開発**: コア機能（クイズロジック、状態管理、スコア計算）
- **Vibe Coding**: UI調整、アニメーション、スタイリング

---

## Vibe Coding

Vibe Codingは、Kiroとの自然な対話を通じてコードを生成するアプローチです。

### 使用例

#### 1. ハロウィンテーマの実装

**会話:**

```
User: ハロウィンテーマのカラーパレットを作成してください。
      不気味だけど洗練された感じで。

Kiro: 了解しました。以下のカラーパレットを提案します：
      - Ghost White (#F8F8FF): 主要なテキスト色
      - Midnight Purple (#2D1B4E): ブランドカラー
      - Haunted Orange (#FF6B35): アクセントカラー
      ...
```

**生成されたコード:**

```typescript
export const colors = {
  ghostWhite: '#F8F8FF',
  midnightPurple: '#2D1B4E',
  hauntedOrange: '#FF6B35',
  // ...
};
```

---

#### 2. アニメーションの追加

**会話:**

```
User: ゴーストマスコットに浮遊アニメーションを追加してください。
      prefers-reduced-motionも考慮してください。

Kiro: 浮遊アニメーションを実装します。
      アクセシビリティも考慮して、モーション設定を尊重します。
```

**生成されたコード:**

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float {
    animation: none;
  }
}
```

---

#### 3. コンポーネントのリファクタリング

**会話:**

```
User: QuestionCardコンポーネントが大きくなりすぎました。
      フィードバック表示部分を別コンポーネントに分離してください。

Kiro: QuestionFeedbackコンポーネントを作成して、
      QuestionCardから分離します。
```

**効果:**
- コンポーネントの責任が明確に
- テストが容易に
- 再利用性が向上

---

### Vibe Codingの効果的な使い方

#### 1. 明確な指示

```
❌ 悪い例: "タイマーを作って"
✅ 良い例: "MM:SS形式で経過時間を表示するタイマーコンポーネントを作成してください。
           30分経過時に警告を表示する機能も含めてください。"
```

---

#### 2. コンテキストの提供

```
User: 以下の要件を満たすProgressBarコンポーネントを作成してください：
      - 現在の問題番号（X/20）を表示
      - 正答数を表示
      - ビジュアルプログレスバー
      - ハロウィンテーマのスタイリング
```

---

#### 3. 段階的な改善

```
User: まず基本的なProgressBarを作成してください。
Kiro: [基本実装を生成]

User: 良いですね。次にアニメーションを追加してください。
Kiro: [アニメーション付き実装を生成]

User: 完璧です。最後にレスポンシブ対応をお願いします。
Kiro: [レスポンシブ対応を追加]
```

---

### 最も印象的なコード生成

#### Property-Based Testの生成

**会話:**

```
User: Property 22「State is saved after each answer」のプロパティテストを
      fast-checkを使って実装してください。
```

**生成されたコード:**

```typescript
/**
 * Feature: sap-obake-quiz, Property 22: State is saved after each answer
 * Validates: Requirements 8.1
 */
test('Property 22: state is saved after each answer', () => {
  fc.assert(
    fc.property(
      fc.array(questionArbitrary, { minLength: 20, maxLength: 20 }),
      fc.integer({ min: 0, max: 19 }),
      fc.uuid(),
      (questions, answerIndex, choiceId) => {
        // LocalStorageのモック
        const storage: Record<string, string> = {};
        global.localStorage = {
          getItem: (key: string) => storage[key] || null,
          setItem: (key: string, value: string) => {
            storage[key] = value;
          },
          // ...
        } as Storage;

        // クイズセッションの作成
        const session = createQuizSession(questions);
        
        // 回答を記録
        submitAnswer(session, questions[answerIndex].id, choiceId);
        
        // LocalStorageに保存されていることを検証
        const saved = loadQuizState();
        expect(saved).not.toBeNull();
        expect(saved?.answers).toHaveLength(answerIndex + 1);
      }
    ),
    { numRuns: 100 }
  );
});
```

**効果:**
- 複雑なPBTロジックを自動生成
- カスタムジェネレーターの適切な使用
- 100回の実行で多様な入力をテスト

---

## Agent Hooks

Agent Hooksは、特定のイベントで自動的にKiroを実行する機能です。

### 使用したHooks

#### 1. Pre-commit Hook

**目的:** コミット前にテストとリントを実行

**設定:**

```json
{
  "name": "Pre-commit Tests",
  "trigger": "on-git-commit",
  "action": "run-command",
  "command": "pnpm test --run && pnpm lint"
}
```

**効果:**
- ✅ 壊れたコードのコミットを防止
- ✅ コード品質の維持
- ✅ CI/CDの失敗を削減

---

#### 2. Post-implementation Hook

**目的:** 実装後に自動的にテストを実行

**設定:**

```json
{
  "name": "Post-implementation Tests",
  "trigger": "on-file-save",
  "pattern": "**/*.{ts,tsx}",
  "action": "run-command",
  "command": "pnpm test --run --changed"
}
```

**効果:**
- ✅ 即座のフィードバック
- ✅ リグレッションの早期発見
- ✅ 開発速度の向上

---

#### 3. Documentation Update Hook

**目的:** コンポーネント変更時にドキュメントを更新

**設定:**

```json
{
  "name": "Update Component Docs",
  "trigger": "on-file-save",
  "pattern": "components/**/*.tsx",
  "action": "send-message",
  "message": "コンポーネントが変更されました。ドキュメントの更新が必要か確認してください。"
}
```

**効果:**
- ✅ ドキュメントの鮮度維持
- ✅ 変更の見落とし防止

---

### Hooksの開発プロセスへの影響

#### Before Hooks

```
実装 → 手動テスト → コミット → CI失敗 → 修正 → 再コミット
```

#### After Hooks

```
実装 → 自動テスト（Hook） → 問題があれば即座に通知 → 修正 → コミット → CI成功
```

**改善点:**
- ⏱️ フィードバックループの短縮: 10分 → 30秒
- 🐛 バグの早期発見: CI段階 → 開発段階
- 💪 開発者の自信: 常にテストが通っている状態

---

## Steering Docs

Steering Docsは、Kiroの動作をカスタマイズするためのドキュメントです。

### 使用したSteering Docs

#### 1. tech.md - 技術スタック

**内容:**

```markdown
# 技術スタック

## フレームワーク
- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript 5.9.3

## スタイリング
- Tailwind CSS 4.1.17
- shadcn/ui

## テスト
- Vitest 4.0.8
- fast-check 4.3.0

## パスエイリアス
- @/components - Reactコンポーネント
- @/lib - ライブラリ関数
- @/hooks - カスタムフック
```

**効果:**
- ✅ 一貫した技術選択
- ✅ 正しいインポートパス
- ✅ 適切なバージョン使用

---

#### 2. structure.md - プロジェクト構造

**内容:**

```markdown
# プロジェクト構造

```
frontend/
├── app/                    # App Router
├── components/             # Reactコンポーネント
├── lib/                   # ビジネスロジック
├── __tests__/             # テスト
│   ├── unit/             # ユニットテスト
│   ├── property/         # プロパティテスト
│   └── integration/      # 統合テスト
└── public/               # 静的アセット
```
```

**効果:**
- ✅ 正しいファイル配置
- ✅ 一貫したディレクトリ構造
- ✅ 新しいファイルの適切な場所

---

#### 3. product.md - プロダクト概要

**内容:**

```markdown
# プロダクト概要

## コンセプト
AWS SAP試験対策のクイズアプリ
ハロウィンテーマのUI

## 必要な機能
- 20問のタイムアタック形式
- ドメイン別パフォーマンス表示
- 進捗の自動保存
- レスポンシブデザイン
```

**効果:**
- ✅ プロジェクトの方向性の維持
- ✅ 機能の優先順位付け
- ✅ スコープクリープの防止

---

### Steering Docsの戦略

#### 1. Always Included（常に含める）

プロジェクト全体に適用されるルール：

- tech.md
- structure.md
- product.md

---

#### 2. Conditional（条件付き）

特定のファイルを扱う時のみ適用：

```markdown
---
inclusion: fileMatch
fileMatchPattern: '**/*.test.ts'
---

# テストガイドライン

- Arrange-Act-Assert パターンを使用
- テスト名は明確に
- モックは最小限に
```

---

#### 3. Manual（手動）

ユーザーが明示的に指定した時のみ適用：

```markdown
---
inclusion: manual
---

# ハロウィンテーマガイドライン

- カラーパレットを使用
- アニメーションは控えめに
- アクセシビリティを考慮
```

---

### 最も効果的だったSteering戦略

#### TDD Steering Doc

**内容:**

```markdown
# TDD開発ガイドライン

## Red-Green-Refactorサイクル

1. RED: まず失敗するテストを書く
2. GREEN: テストを通す最小限のコードを書く
3. REFACTOR: コードを改善する

## ルール

- 実装前に必ずテストを書く
- テストが通るまで次に進まない
- リファクタリング後もテストが通ることを確認
```

**効果:**
- ✅ 一貫したTDDアプローチ
- ✅ テストカバレッジ85%以上達成
- ✅ バグの早期発見

---

## 開発プロセス

### 典型的な開発フロー

#### 1. 要件定義（Spec）

```
User: 新しい機能「タイマー」を追加したいです。

Kiro: 要件を定義しましょう。以下のEARS形式で記述します：

WHEN a quiz session starts, THEN the System SHALL start the Timer from zero
WHILE a quiz session is active, THEN the System SHALL continuously display 
the elapsed time
...
```

---

#### 2. 設計（Spec）

```
User: タイマー機能の設計をお願いします。

Kiro: Correctness Propertiesを定義します：

Property 10: Timer updates continuously
*For any* active quiz session, the displayed elapsed time should increase 
monotonically over time.
**Validates: Requirements 3.1**
```

---

#### 3. タスク作成（Spec）

```
User: 実装タスクを作成してください。

Kiro: TDDサイクルに従ってタスクを作成します：

## Phase 5: Timer Functionality (TDD Cycle 4)

- [ ] 5. Write property test for timer (RED)
- [ ] 5.1 Implement timer functionality (GREEN)
- [ ] 5.2 Refactor timer functionality (REFACTOR)
```

---

#### 4. テスト実装（Vibe Coding）

```
User: Property 10のテストを実装してください。

Kiro: [プロパティテストを生成]
```

---

#### 5. 機能実装（Vibe Coding）

```
User: タイマー機能を実装してください。

Kiro: [実装コードを生成]
```

---

#### 6. リファクタリング（Vibe Coding）

```
User: タイマーコードをリファクタリングしてください。

Kiro: [改善されたコードを生成]
```

---

#### 7. 自動テスト（Hook）

```
[ファイル保存]
→ Hook発動
→ テスト自動実行
→ 結果通知
```

---

### 開発速度の比較

#### 従来の開発プロセス

```
要件定義: 2日
設計: 3日
実装: 5日
テスト: 3日
リファクタリング: 2日
合計: 15日
```

#### Kiro使用時

```
要件定義（Spec）: 0.5日
設計（Spec）: 1日
実装（Vibe Coding + Hooks）: 2日
テスト（自動生成 + Hooks）: 0.5日
リファクタリング（Vibe Coding）: 1日
合計: 5日
```

**改善率: 67%の時間短縮**

---

## 学んだこと

### 1. Spec駆動開発の価値

#### 学び

- 大規模プロジェクトでは、Specが羅針盤となる
- 要件から実装まで一貫性が保たれる
- チーム開発での共通理解が容易

#### 課題

- 初期のSpec作成に時間がかかる
- 要件変更時のSpec更新が必要

#### 解決策

- Specは生きたドキュメント
- 変更を恐れず、常に最新に保つ
- Kiroと対話しながら段階的に改善

---

### 2. Property-Based Testingの威力

#### 学び

- 予期しないエッジケースを発見
- テストカバレッジが大幅に向上
- バグの早期発見

#### 例

```typescript
// ユニットテストでは見逃していたバグ
test('formats time correctly', () => {
  expect(formatTime(125)).toBe('02:05'); // ✅ Pass
});

// プロパティテストで発見
fc.assert(
  fc.property(
    fc.integer({ min: 0, max: 86400 }),
    (seconds) => {
      const formatted = formatTime(seconds);
      // 負の値や巨大な値でバグ発見！
    }
  )
);
```

---

### 3. Hooksによる自動化

#### 学び

- フィードバックループの短縮が開発速度を向上
- 自動化により人的ミスを削減
- 開発者の認知負荷を軽減

#### 効果

- テストの実行忘れがゼロに
- コミット前の品質チェックが確実に
- ドキュメント更新の見落とし防止

---

### 4. Steering Docsの重要性

#### 学び

- プロジェクト固有のルールを明文化
- Kiroの動作をカスタマイズ
- 一貫性のある開発

#### ベストプラクティス

- 技術スタックは必ず文書化
- プロジェクト構造を明確に
- 開発ガイドラインを共有

---

### 5. Vibe Coding vs Spec駆動開発

#### 使い分けの指針

**Spec駆動開発を使うべき場合:**
- コア機能の実装
- 複雑なビジネスロジック
- チーム開発
- 長期保守が必要

**Vibe Codingを使うべき場合:**
- プロトタイピング
- UI/UXの調整
- 小規模な機能追加
- 実験的な実装

---

## まとめ

### Kiroの効果

1. **開発速度**: 67%の時間短縮
2. **コード品質**: テストカバレッジ85%以上
3. **バグ削減**: PBTによる早期発見
4. **保守性**: 一貫したドキュメント

### 推奨事項

1. **大規模プロジェクト**: Spec駆動開発を採用
2. **品質重視**: Property-Based Testingを活用
3. **自動化**: Agent Hooksで効率化
4. **カスタマイズ**: Steering Docsで最適化

### 次のステップ

- [ ] より複雑なプロパティの定義
- [ ] E2Eテストの自動化
- [ ] パフォーマンステストの追加
- [ ] CI/CDパイプラインの最適化

---

## 関連リソース

- [Spec駆動開発ガイド](https://kiro.dev/docs/specs)
- [Property-Based Testing](https://fast-check.dev/)
- [Kiroween Contest](https://kiroween.devpost.com/)
- [プロジェクトリポジトリ](https://github.com/yourusername/sap-obake)
