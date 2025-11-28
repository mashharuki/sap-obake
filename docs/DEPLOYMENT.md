# SAP Obake デプロイメントガイド

## 📋 目次

1. [デプロイ前チェックリスト](#デプロイ前チェックリスト)
2. [環境変数の設定](#環境変数の設定)
3. [プロダクションビルド](#プロダクションビルド)
4. [デプロイ先の選択](#デプロイ先の選択)
5. [ブラウザテスト](#ブラウザテスト)
6. [デバイステスト](#デバイステスト)
7. [PWA設定](#pwa設定)
8. [パフォーマンス最適化](#パフォーマンス最適化)
9. [トラブルシューティング](#トラブルシューティング)

---

## デプロイ前チェックリスト

デプロイ前に以下の項目を確認してください：

- [ ] すべてのテストが通過している
- [ ] プロダクションビルドがエラーなく完了する
- [ ] 環境変数が正しく設定されている
- [ ] PWAマニフェストとアイコンが配置されている
- [ ] 複数のブラウザでテスト済み
- [ ] 複数のデバイスでテスト済み
- [ ] Lighthouseスコアが基準を満たしている
- [ ] セキュリティヘッダーが設定されている

---

## 環境変数の設定

### 1. 環境変数ファイルの作成

```bash
cd frontend
cp .env.example .env.local
```

### 2. 環境変数の編集

`.env.local`ファイルを編集して、必要な値を設定します：

```env
# アプリケーションバージョン
NEXT_PUBLIC_APP_VERSION=1.0.0

# アナリティクス（オプション）
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# 問題バンクのURL
NEXT_PUBLIC_QUESTION_BANK_URL=/data/questions.json
```

### 3. 本番環境での環境変数

デプロイ先のプラットフォームで以下の環境変数を設定してください：

- `NODE_ENV=production` (通常は自動設定)
- `NEXT_PUBLIC_APP_VERSION` (任意)
- その他、必要に応じて追加

---

## プロダクションビルド

### 1. ローカルでのビルドテスト

```bash
cd frontend

# 依存関係のインストール
pnpm install

# プロダクションビルド
pnpm build

# ビルド結果の確認
# .next/ディレクトリが生成されていることを確認
```

### 2. ビルドサイズの確認

```bash
# バンドルアナライザーを使用してビルドサイズを確認
ANALYZE=true pnpm build
```

ブラウザで自動的に開かれるレポートで、以下を確認：
- 初期バンドルサイズが200KB以下（gzip圧縮後）
- 不要な依存関係が含まれていないか
- コード分割が適切に行われているか

### 3. ローカルでのプロダクションサーバー起動

```bash
# プロダクションモードで起動
pnpm start
```

ブラウザで `http://localhost:3000` にアクセスして動作確認。

---

## デプロイ先の選択

### オプション1: Vercel（推奨）

**特徴:**
- Next.jsの開発元が提供
- ゼロコンフィグでデプロイ可能
- 自動的にCDNで配信
- プレビューデプロイメント機能

**デプロイ手順:**

1. Vercelアカウントを作成: https://vercel.com/signup

2. GitHubリポジトリと連携:
   ```bash
   # Vercel CLIをインストール（オプション）
   npm i -g vercel
   
   # プロジェクトをデプロイ
   vercel
   ```

3. または、Vercel Dashboardから:
   - "New Project"をクリック
   - GitHubリポジトリを選択
   - `frontend`ディレクトリをルートディレクトリとして指定
   - 環境変数を設定
   - "Deploy"をクリック

4. 環境変数の設定:
   - Vercel Dashboard > Settings > Environment Variables
   - 必要な環境変数を追加

### オプション2: Netlify

**特徴:**
- 無料プランが充実
- フォーム処理やサーバーレス関数のサポート
- 簡単なデプロイ設定

**デプロイ手順:**

1. `netlify.toml`を作成:
   ```toml
   [build]
     base = "frontend"
     command = "pnpm build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Netlify Dashboardから:
   - "New site from Git"をクリック
   - GitHubリポジトリを選択
   - ビルド設定を確認
   - "Deploy site"をクリック

### オプション3: AWS S3 + CloudFront

**特徴:**
- AWSのインフラを活用
- 高いカスタマイズ性
- コスト効率が良い

**デプロイ手順:**

1. Next.jsの静的エクスポート設定:
   ```typescript
   // next.config.ts
   const nextConfig = {
     output: 'export',
     // その他の設定...
   }
   ```

2. ビルドとエクスポート:
   ```bash
   pnpm build
   ```

3. S3バケットの作成とアップロード:
   ```bash
   aws s3 mb s3://sap-obake-app
   aws s3 sync out/ s3://sap-obake-app --delete
   ```

4. CloudFrontディストリビューションの設定:
   - S3バケットをオリジンとして設定
   - HTTPSを有効化
   - カスタムドメインを設定（オプション）

---

## ブラウザテスト

### テスト対象ブラウザ

以下のブラウザで動作確認を行ってください：

#### デスクトップ
- [ ] Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Safari（最新版）
- [ ] Edge（最新版）

#### モバイル
- [ ] Chrome Mobile（Android）
- [ ] Safari（iOS）
- [ ] Samsung Internet（Android）

### テスト項目

各ブラウザで以下の機能をテスト：

1. **ホームページ**
   - [ ] ページが正しく表示される
   - [ ] アニメーションが動作する
   - [ ] "Start Quiz"ボタンが機能する

2. **クイズページ**
   - [ ] 問題が正しく表示される
   - [ ] 選択肢をクリックできる
   - [ ] フィードバックが表示される
   - [ ] タイマーが動作する
   - [ ] プログレスバーが更新される

3. **結果ページ**
   - [ ] スコアが正しく表示される
   - [ ] ドメイン別パフォーマンスが表示される
   - [ ] "Restart"ボタンが機能する

4. **LocalStorage**
   - [ ] 進捗が保存される
   - [ ] ページをリロードしても状態が保持される
   - [ ] 完了後に状態がクリアされる

5. **レスポンシブデザイン**
   - [ ] ウィンドウサイズを変更しても正しく表示される
   - [ ] モバイルビューで使いやすい

### ブラウザ開発者ツールでの確認

各ブラウザで開発者ツールを開き、以下を確認：

```javascript
// コンソールでエラーがないか確認
// Network タブでリソースの読み込みを確認
// Application タブで LocalStorage を確認
```

---

## デバイステスト

### テスト対象デバイス

#### デスクトップ
- [ ] Windows PC（1920x1080）
- [ ] Mac（2560x1440）
- [ ] 4K ディスプレイ（3840x2160）

#### タブレット
- [ ] iPad（768x1024）
- [ ] Android タブレット（800x1280）

#### モバイル
- [ ] iPhone（375x667 - iPhone SE）
- [ ] iPhone（390x844 - iPhone 12/13）
- [ ] iPhone（430x932 - iPhone 14 Pro Max）
- [ ] Android（360x640）
- [ ] Android（412x915）

### デバイステスト手順

1. **実機テスト**
   ```bash
   # ローカルネットワークでアクセス可能にする
   pnpm dev -- -H 0.0.0.0
   
   # 表示されるURLにモバイルデバイスからアクセス
   # 例: http://192.168.1.100:3000
   ```

2. **ブラウザの開発者ツールでエミュレート**
   - Chrome DevTools > Device Toolbar (Ctrl+Shift+M)
   - 各デバイスプリセットで表示確認

3. **タッチ操作のテスト**
   - [ ] タップが正確に反応する
   - [ ] スワイプジェスチャーが動作する
   - [ ] ピンチズームが適切に制限されている

4. **パフォーマンステスト**
   - [ ] ページの読み込みが3秒以内
   - [ ] アニメーションが滑らか（60fps）
   - [ ] スクロールが滑らか

---

## PWA設定

### 1. マニフェストファイルの確認

`frontend/public/manifest.json`が存在し、正しく設定されていることを確認：

```json
{
  "name": "SAP Obake - AWS SAP試験対策クイズ",
  "short_name": "SAP Obake",
  "description": "AWS Certified Solutions Architect - Professional (SAP-C02) 試験対策クイズアプリケーション",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0A0A",
  "theme_color": "#2D1B4E"
}
```

### 2. アイコンの準備

以下のサイズのアイコンを`frontend/public/icons/`に配置：

- [ ] 72x72
- [ ] 96x96
- [ ] 128x128
- [ ] 144x144
- [ ] 152x152
- [ ] 192x192
- [ ] 384x384
- [ ] 512x512

**アイコン生成ツール:**
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

### 3. HTMLヘッダーへのリンク追加

`frontend/app/layout.tsx`に以下を追加（既に追加済みの場合はスキップ）：

```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#2D1B4E" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

### 4. PWAのテスト

1. **Chrome DevTools**
   - Application タブ > Manifest
   - マニフェストが正しく読み込まれているか確認

2. **Lighthouse**
   ```bash
   # Lighthouseでスコアを確認
   npx lighthouse http://localhost:3000 --view
   ```
   
   PWAスコアが80以上であることを確認。

3. **インストールテスト**
   - Chrome: アドレスバーの「インストール」ボタンをクリック
   - iOS Safari: 共有 > ホーム画面に追加
   - Android Chrome: メニュー > アプリをインストール

---

## パフォーマンス最適化

### 1. Lighthouseスコアの確認

```bash
# Lighthouseを実行
npx lighthouse http://localhost:3000 --view
```

**目標スコア:**
- Performance: 90以上
- Accessibility: 95以上
- Best Practices: 95以上
- SEO: 90以上
- PWA: 80以上

### 2. バンドルサイズの最適化

```bash
# バンドルアナライザーで確認
ANALYZE=true pnpm build
```

**最適化のポイント:**
- 初期バンドルサイズ: 200KB以下（gzip圧縮後）
- 不要な依存関係の削除
- 動的インポートの活用
- Tree-shakingの確認

### 3. 画像の最適化

- Next.js Imageコンポーネントを使用
- WebP/AVIF形式を優先
- 適切なサイズとフォーマットを選択

### 4. キャッシュ戦略

Next.jsが自動的に最適なキャッシュヘッダーを設定しますが、以下を確認：

```typescript
// next.config.ts
const nextConfig = {
  compress: true, // Gzip圧縮を有効化
  // その他の設定...
}
```

---

## トラブルシューティング

### ビルドエラー

**問題:** `pnpm build`がエラーで失敗する

**解決策:**
```bash
# キャッシュをクリア
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

### 環境変数が反映されない

**問題:** 環境変数の値が正しく読み込まれない

**解決策:**
1. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
2. サーバーを再起動
3. ビルドをやり直す

### LocalStorageが動作しない

**問題:** プライベートブラウジングモードでLocalStorageが使えない

**解決策:**
- エラーハンドリングを追加
- 代替手段（メモリ内保存）を実装

### PWAがインストールできない

**問題:** ブラウザにインストールボタンが表示されない

**解決策:**
1. HTTPSで配信されているか確認
2. マニフェストファイルが正しく読み込まれているか確認
3. Service Workerが登録されているか確認（必要な場合）

### パフォーマンスが悪い

**問題:** Lighthouseスコアが低い

**解決策:**
1. 画像を最適化
2. 不要なJavaScriptを削除
3. コード分割を実装
4. キャッシュ戦略を見直す

---

## セキュリティチェックリスト

デプロイ前に以下のセキュリティ項目を確認：

- [ ] HTTPSが有効化されている
- [ ] Content Security Policy (CSP)が設定されている
- [ ] X-Frame-Optionsヘッダーが設定されている
- [ ] X-Content-Type-Optionsヘッダーが設定されている
- [ ] 機密情報がコードに含まれていない
- [ ] 依存関係に既知の脆弱性がない

```bash
# 依存関係の脆弱性チェック
pnpm audit
```

---

## デプロイ後の確認

デプロイが完了したら、以下を確認：

1. **本番URLでの動作確認**
   - [ ] すべてのページが正しく表示される
   - [ ] すべての機能が動作する

2. **パフォーマンス確認**
   ```bash
   npx lighthouse https://your-production-url.com --view
   ```

3. **エラーモニタリング**
   - ブラウザのコンソールでエラーがないか確認
   - 必要に応じてエラートラッキングツール（Sentry等）を設定

4. **アナリティクス**
   - Google Analytics等を設定（オプション）
   - ユーザー行動を追跡

---

## 継続的デプロイメント（CI/CD）

### GitHub Actionsの設定例

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
        working-directory: ./frontend
      
      - name: Run tests
        run: pnpm test
        working-directory: ./frontend
      
      - name: Build
        run: pnpm build
        working-directory: ./frontend
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## まとめ

このガイドに従ってデプロイを行うことで、SAP Obakeアプリケーションを安全かつ効率的に本番環境にデプロイできます。

**重要なポイント:**
1. すべてのテストが通過していることを確認
2. 複数のブラウザとデバイスでテスト
3. Lighthouseスコアが基準を満たしている
4. セキュリティ設定が適切に行われている
5. デプロイ後も継続的にモニタリング

問題が発生した場合は、トラブルシューティングセクションを参照してください。

---

**最終更新日:** 2025-11-29
