# SAP Obake Frontend

AWS Certified Solutions Architect - Professional (SAP-C02) 試験対策クイズアプリケーション

## 🎃 概要

SAP Obake（サップおばけ）は、AWS SAP試験の合格に必要な知識を、ハロウィンをテーマにした不気味で洗練されたUIで楽しく学習できるクイズアプリケーションです。

## 🛠️ 技術スタック

- **Framework**: Next.js 16.0.5 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17 + shadcn/ui
- **Testing**: Vitest 4.0.8 + fast-check 4.3.0
- **Linting/Formatting**: Biome 2.2.0
- **Package Manager**: pnpm 10.20.0

## 📦 セットアップ

### 前提条件

- Node.js 20.x 以上
- pnpm 10.20.0

### インストール

```bash
# 依存関係のインストール
pnpm install
```

## 🚀 開発

```bash
# 開発サーバーの起動 (http://localhost:3000)
pnpm dev

# プロダクションビルド
pnpm build

# プロダクションサーバーの起動
pnpm start

# リント
pnpm lint

# フォーマット
pnpm format

# テスト実行
pnpm test

# テスト（ウォッチモード）
pnpm test:watch

# カバレッジ付きテスト
pnpm test:coverage

# バンドルサイズ分析
ANALYZE=true pnpm build
```

## 📦 デプロイ

### デプロイ前チェック

```bash
# プロダクションビルドテストスクリプトを実行
./scripts/test-production.sh
```

このスクリプトは以下を自動的にチェックします：
- 依存関係のインストール
- リント
- テスト
- プロダクションビルド
- バンドルサイズ
- PWAファイル
- セキュリティ監査

### デプロイ手順

詳細なデプロイ手順については、[DEPLOYMENT.md](../DEPLOYMENT.md)を参照してください。

#### Vercel（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

または、Vercel Dashboardから：
1. GitHubリポジトリを連携
2. `frontend`ディレクトリをルートに指定
3. 環境変数を設定
4. デプロイ

#### その他のプラットフォーム

- **Netlify**: `netlify.toml`を使用
- **AWS S3 + CloudFront**: 静的エクスポートを使用
- **その他**: Next.jsをサポートする任意のプラットフォーム

### 環境変数

デプロイ前に`.env.example`を`.env.local`にコピーして設定：

```bash
cp .env.example .env.local
```

必要な環境変数：
- `NEXT_PUBLIC_APP_VERSION`: アプリケーションバージョン
- `NEXT_PUBLIC_QUESTION_BANK_URL`: 問題バンクのURL（デフォルト: `/data/questions.json`）

## 🎨 ハロウィンテーマ

### カラーパレット

- **Primary Colors**
  - Ghost White: `#F8F8FF`
  - Midnight Purple: `#2D1B4E`
  - Haunted Orange: `#FF6B35`
  - Witch Green: `#4A7C59`

- **Background Colors**
  - Dark Void: `#0A0A0A`
  - Shadow Gray: `#1A1A1A`
  - Mist Gray: `#2A2A2A`

- **Feedback Colors**
  - Correct Glow: `#4ADE80`
  - Incorrect Glow: `#F87171`
  - Warning Glow: `#FBBF24`

### アニメーション

- `float`: 浮遊アニメーション
- `pulse`: パルスアニメーション
- `flicker`: 点滅アニメーション
- `fade-in`: フェードインアニメーション

## 📁 プロジェクト構造

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル（ハロウィンテーマ）
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   └── ui/               # shadcn/uiコンポーネント
├── lib/                  # ユーティリティ関数
│   └── utils.ts          # cn()などのヘルパー
├── hooks/                # カスタムReactフック
├── __tests__/            # テストファイル
│   ├── unit/            # ユニットテスト
│   ├── property/        # プロパティベーステスト
│   ├── integration/     # 統合テスト
│   └── e2e/             # E2Eテスト
├── public/               # 静的アセット
├── biome.json           # Biome設定
├── components.json      # shadcn/ui設定
├── next.config.ts       # Next.js設定
├── tailwind.config.ts   # Tailwind CSS設定
├── tsconfig.json        # TypeScript設定
├── vitest.config.ts     # Vitest設定
└── vitest.setup.ts      # Vitestセットアップ
```

## 🧪 テスト

### テスト戦略

- **Unit Tests**: 個別の関数やコンポーネントのテスト
- **Property-Based Tests**: fast-checkを使用した汎用的なプロパティのテスト（最低100回実行）
- **Integration Tests**: コンポーネント間の統合テスト
- **E2E Tests**: エンドツーエンドのユーザーフローテスト

### テスト実行

```bash
# すべてのテストを実行
pnpm test

# 特定のテストファイルを実行
pnpm test __tests__/unit/example.test.ts

# カバレッジレポート生成
pnpm test:coverage
```

## 🎯 主要機能

1. **20問のクイズセッション**: AWS SAP試験レベルの問題
2. **タイムアタック形式**: 経過時間の計測と表示
3. **即時フィードバック**: 正誤判定と詳細な解説
4. **ドメイン別パフォーマンス**: 4つのコンテンツドメインごとの成績表示
5. **進捗保存**: ブラウザのlocalStorageによる自動保存
6. **レスポンシブデザイン**: デスクトップ・モバイル対応
7. **アクセシビリティ**: WCAG AA準拠、キーボードナビゲーション対応

## 🌐 ブラウザサポート

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📝 コーディング規約

- TypeScript strict mode有効
- Biomeによる自動フォーマット（インデント: 2スペース）
- インポートの自動整理
- コンベンショナルコミット形式の使用

## 🔒 セキュリティ

- 環境変数による機密情報管理
- XSS対策
- Content Security Policy (CSP)
- HTTPS必須（本番環境）

## 📄 ライセンス

このプロジェクトはKiroween ハッカソンの一環として開発されています。

## 🤝 コントリビューション

Kiroween Costume Contestへの応募プロジェクトです。

## 📞 サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。
