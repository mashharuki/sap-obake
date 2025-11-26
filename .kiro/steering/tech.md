# NextMed 技術スタック

## プロジェクト構成

### モノレポ管理
- **パッケージマネージャー**: pnpm 10.20.0
- **ワークスペース**: pnpm workspace（`pkgs/*`）
- **パッケージ構成**:
  - `app`: Next.js + Web アプリケーション

### 開発ツール
- **TypeScript**: 5.9.3
- **テストフレームワーク**: Vitest 4.0.8
- **formatter&linter**: biome

### フレームワーク & ランタイム
- **Next.js**: 16.0.0（App Router）
- **React**: 19.2.0
- **React DOM**: 19.2.0
- **TypeScript**: 5.x
- **PWA**

### ビルドシステム
- **バンドラー**: Next.js内蔵（Turbopack/Webpack）
- **CSS**: Tailwind CSS 4.1.9 + PostCSS 8.5 + Shadcn/ui
- **PostCSS**: @tailwindcss/postcss 4.1.9

### パスエイリアス
すべてのインポートで`@/`プレフィックスを使用:
- `@/components` - Reactコンポーネント
- `@/lib` - ライブラリとしてのメソッドを格納するフォルダ
- `@/hooks` - カスタムReactフック
- `@/helper` - ヘルパーメソッドを格納するフォルダ
- `@/utils` - パラメーターなどの変数群を格納したユーティリティ関数を格納するフォルダ
- `@/app` - Next.js appディレクトリ

### 主要コマンド

```bash

# 開発サーバー起動（ポート3000）
pnpm dev

# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# リント
pnpm lint
```

### 設定ノート
- TypeScript strictモード有効
- next.config.mjsでビルドエラーを無視（typescript.ignoreBuildErrors: true）
- 画像最適化無効（unoptimized: true）
- テーマ用CSS変数有効
- RSC（React Server Components）有効

## ルートレベルツール

### コードフォーマッター
- **Biome**: 2.3.2
  - インデントスタイル: タブ
  - クォートスタイル: ダブル
  - Import整理: 自動（organizeImports: "on"）
  - VCS統合: Git

### 共通コマンド
```bash
# ルートディレクトリで実行

# 全体のフォーマット
pnpm format
```

### エディタ設定
- **推奨エディタ**: Kiro
- **推奨拡張機能**:
  - Biome（コードフォーマット）
  - TypeScript（型チェック）
  - Tailwind CSS IntelliSense
  - ESLint

## TypeScript設定

### 共通設定
- **target**: ES6以上
- **module**: ESNext
- **moduleResolution**: bundler
- **strict**: true
- **esModuleInterop**: true
- **skipLibCheck**: true
- **resolveJsonModule**: true
- **isolatedModules**: true

### パッケージ固有設定
各パッケージに`tsconfig.json`と`tsconfig.build.json`が存在

## テスト環境

### テストフレームワーク
- **Vitest**: 4.0.8（全パッケージ共通）
- **Testcontainers**: 11.7.2（Docker環境テスト）

### テスト実行

```bash
pnpm test
```

## セキュリティ

### 環境変数管理
- `.env`ファイルで管理
- `.gitignore`に追加済み
- 機密情報のハードコード禁止

### 依存関係管理
- `pnpm-lock.yaml`でバージョン固定
- 定期的なセキュリティアップデート
- 不要な依存関係の削除

## パフォーマンス最適化

### Frontend
- Next.js App Routerによる自動最適化
- React Server Componentsの活用
- 画像最適化（設定により無効化可能）
- コード分割とレイジーローディング

### Contract
- Compactコンパイラによる最適化
- ゼロ知識証明の効率的な生成
- 状態遷移の最小化

## CI/CD（将来的な実装）

### 推奨ツール
- GitHub Actions
- Vercel
- Supabase

### パイプライン
1. リント・フォーマットチェック
2. 型チェック
3. テスト実行
4. ビルド
5. デプロイ

## 参考リソース

### 公式ドキュメント
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Docs**: https://ui.shadcn.com/
- **This is Kiroween**: https://kiro.dev/blog/kiroween-2025/
- **Devpost Kiroween**: https://kiroween.devpost.com/

### コミュニティ
- AWS Builder Community
