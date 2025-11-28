# SAP Obake プロジェクト概要

## プロジェクトの目的
AWS Certified Solutions Architect - Professional (SAP-C02) 認定試験の合格に必要な知識を、楽しく効率的に習得できるクイズアプリケーション。Kiroween ハッカソンの Costume Contest カテゴリーへの応募を目的とし、ハロウィンをテーマにした不気味で洗練されたUIデザインを特徴とする。

## 主要機能
- 1回20問のタイムアタック形式クイズセッション
- AWS SAP試験の4つのコンテンツドメインをカバー
- リアルタイムのフィードバックと詳細な解説
- ブラウザローカルストレージによる進捗保存
- レスポンシブデザイン（デスクトップ・モバイル対応）
- ハロウィンテーマのUI（ゴースト、クモの巣、パーティクルエフェクト等）

## 技術スタック
- **Frontend Framework**: Next.js 16.0.5 (App Router)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9 + shadcn/ui
- **State Management**: React Hooks
- **Data Persistence**: Browser LocalStorage API
- **Testing**: Vitest 4.0.8 + fast-check (property-based testing)
- **Type Safety**: TypeScript 5.x
- **Package Manager**: pnpm 10.20.0
- **Linter/Formatter**: Biome 2.2.0

## プロジェクト構造
```
/
├── frontend/                 # Next.js Webアプリケーション
│   ├── app/                  # App Router
│   ├── components/           # Reactコンポーネント
│   ├── lib/                  # ビジネスロジック・ユーティリティ
│   ├── hooks/                # カスタムフック
│   ├── public/               # 静的アセット
│   └── __tests__/            # テストファイル
│       ├── unit/             # ユニットテスト
│       ├── property/         # プロパティベーステスト
│       ├── integration/      # 統合テスト
│       └── e2e/              # E2Eテスト
├── .kiro/                    # Kiro IDE設定
│   ├── specs/                # Spec駆動開発ドキュメント
│   └── steering/             # ステアリングルール
└── README.md
```

## 開発アプローチ
- **Spec駆動開発**: 要件→設計→タスクリストの順で体系的に開発
- **テスト駆動開発 (TDD)**: RED-GREEN-REFACTORサイクル
- **Property-Based Testing**: fast-checkを使用した包括的なテスト
