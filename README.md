# SAP Obake（サップおばけ）👻

AWS Certified Solutions Architect - Professional (SAP-C02) 試験対策クイズアプリケーション

[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎃 概要

SAP Obake（サップおばけ）は、AWS SAP試験の合格に必要な知識を、ハロウィンをテーマにした不気味で洗練されたUIで楽しく学習できるクイズアプリケーションです。Kiroween ハッカソンの Costume Contest カテゴリーへの応募作品として開発されました。

### 主な特徴

- 🎯 **20問のタイムアタック形式**: AWS SAP試験レベルの問題で実践的な学習
- 📊 **ドメイン別パフォーマンス**: 4つのコンテンツドメインごとの成績表示
- 💾 **自動進捗保存**: ブラウザを閉じても安心のlocalStorage保存
- 🎨 **ハロウィンテーマUI**: 不気味で洗練されたデザイン
- ♿ **アクセシビリティ対応**: WCAG AA準拠、キーボードナビゲーション完全対応
- 📱 **レスポンシブデザイン**: デスクトップ・タブレット・モバイル対応
- ✅ **TDD開発**: テスト駆動開発とSpec駆動開発の実践

## 📸 スクリーンショット

[スクリーンショットを追加予定]

## 🚀 クイックスタート

### 前提条件

- Node.js 20.x 以上
- pnpm 10.20.0

### インストールと起動

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/sap-obake.git
cd sap-obake

# 依存関係のインストール
cd frontend
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで http://localhost:3000 を開いてください。

## 📚 ドキュメント

### 開発者向けドキュメント

- [セットアップガイド](frontend/README.md) - 詳細なセットアップ手順と開発環境構築
- [コンポーネントAPI](docs/COMPONENTS.md) - 全Reactコンポーネントの詳細なAPI仕様
- [ライブラリAPI](docs/LIBRARIES.md) - ビジネスロジックとユーティリティ関数のAPI
- [テスト戦略](docs/TESTING.md) - TDD/PBTアプローチと実行方法
- [ハロウィンテーマデザインシステム](frontend/THEME.md) - カラーパレット、アニメーション、スタイリングガイド

### デプロイメントドキュメント

- [デプロイメントガイド](DEPLOYMENT.md) - 詳細なデプロイ手順と設定方法
- [デプロイメントチェックリスト](DEPLOYMENT_CHECKLIST.md) - デプロイ前の完全チェックリスト
- [ブラウザテストチェックリスト](BROWSER_TESTING_CHECKLIST.md) - 複数ブラウザ・デバイスでのテスト項目
- [クイックテストガイド](QUICK_TEST_GUIDE.md) - 5分でできる基本テスト

### ユーザー向けドキュメント

- [ユーザーガイド](docs/USER_GUIDE.md) - アプリケーションの使い方と機能説明

### Kiroween Contest向けドキュメント

- [Kiro使用方法](docs/KIRO_USAGE.md) - Spec駆動開発、Vibe Coding、Hooks、Steeringの活用事例

## 🛠️ 技術スタック

- **Framework**: Next.js 16.0.0 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17 + shadcn/ui
- **Testing**: Vitest 4.0.8 + fast-check 4.3.0
- **Linting/Formatting**: Biome 2.2.0
- **Package Manager**: pnpm 10.20.0

## 🎯 AWS SAP試験について

このアプリケーションは、AWS Certified Solutions Architect - Professional (SAP-C02) 試験の4つのコンテンツドメインをカバーしています：

1. **複雑な組織に対応するソリューションの設計** (26%)
2. **新しいソリューションのための設計** (29%)
3. **既存のソリューションの継続的な改善** (25%)
4. **ワークロードの移行とモダナイゼーションの加速** (20%)

## 🧪 テスト

```bash
# すべてのテストを実行
pnpm test

# ウォッチモードでテスト
pnpm test:watch

# カバレッジレポート生成
pnpm test:coverage
```

### テスト戦略

- **Unit Tests**: 個別の関数やコンポーネントのテスト
- **Property-Based Tests**: fast-checkを使用した汎用的なプロパティのテスト（最低100回実行）
- **Integration Tests**: コンポーネント間の統合テスト
- **E2E Tests**: エンドツーエンドのユーザーフローテスト

詳細は [テスト戦略ドキュメント](docs/TESTING.md) を参照してください。

## 🚀 デプロイメント

### クイックデプロイ（Vercel推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
cd frontend
vercel
```

### デプロイ前チェック

```bash
# プロダクションビルドテストを実行
cd frontend
./scripts/test-production.sh
```

このスクリプトは以下を自動的にチェックします：
- ✅ 依存関係のインストール
- ✅ リント
- ✅ テスト
- ✅ プロダクションビルド
- ✅ バンドルサイズ
- ✅ PWAファイル
- ✅ セキュリティ監査

### デプロイ先の選択

- **Vercel**（推奨）: ゼロコンフィグでデプロイ可能、自動CDN配信
- **Netlify**: 無料プランが充実、簡単なデプロイ設定
- **AWS S3 + CloudFront**: AWSインフラを活用、高いカスタマイズ性

詳細な手順は [デプロイメントガイド](DEPLOYMENT.md) を参照してください。

### ブラウザ・デバイステスト

デプロイ前に以下のブラウザとデバイスでテストしてください：

**ブラウザ:**
- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

**デバイス:**
- デスクトップ（1920x1080以上）
- タブレット（768x1024）
- モバイル（375x667以上）

詳細なテスト項目は [ブラウザテストチェックリスト](BROWSER_TESTING_CHECKLIST.md) を参照してください。

## 🎨 ハロウィンテーマ

SAP Obakeは、ハロウィンをテーマにした不気味で洗練されたUIを特徴としています：

- 👻 浮遊するゴーストマスコット
- 🕸️ コーナーに配置されたクモの巣装飾
- 🎃 ハロウィンカラーパレット（紫、オレンジ、緑）
- ✨ グローエフェクトとアニメーション
- 🌙 ダークテーマベースのデザイン

詳細は [ハロウィンテーマデザインシステム](frontend/THEME.md) を参照してください。

## 📁 プロジェクト構造

```
sap-obake/
├── .kiro/                    # Kiro IDE設定とSpec
│   ├── specs/               # Spec駆動開発のドキュメント
│   └── steering/            # ステアリングルール
├── frontend/                # Next.js Webアプリケーション
│   ├── app/                # App Router
│   ├── components/         # Reactコンポーネント
│   ├── lib/               # ユーティリティとビジネスロジック
│   ├── __tests__/         # テストファイル
│   └── public/            # 静的アセット
├── docs/                   # プロジェクトドキュメント
└── README.md              # このファイル
```

## 🤝 コントリビューション

このプロジェクトはKiroween ハッカソンの一環として開発されています。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- AWS Solutions Architect Professional試験の学習者コミュニティ
- Kiroween ハッカソン主催者
- オープンソースコミュニティ

## 📞 サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。

---

Made with 👻 for Kiroween 2025
