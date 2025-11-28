# SAP Obake デプロイメントチェックリスト

## ✅ デプロイ前の最終確認

### 1. コードの品質
- [ ] すべてのテストが通過している (`pnpm test`)
- [ ] リントエラーがない、または許容範囲内 (`pnpm lint`)
- [ ] コードがフォーマットされている (`pnpm format`)
- [ ] TypeScriptのコンパイルエラーがない
- [ ] 未使用のコードやコメントアウトされたコードを削除済み

### 2. ビルドの確認
- [ ] プロダクションビルドが成功する (`pnpm build`)
- [ ] ビルドサイズが適切（初期バンドル200KB以下、gzip圧縮後）
- [ ] バンドルアナライザーで不要な依存関係がないことを確認 (`ANALYZE=true pnpm build`)
- [ ] ローカルでプロダクションサーバーが起動する (`pnpm start`)

### 3. 環境変数
- [ ] `.env.example`が最新の状態
- [ ] 本番環境の環境変数が設定されている
- [ ] 機密情報がコードにハードコードされていない
- [ ] 環境変数名が`NEXT_PUBLIC_`プレフィックスで始まっている（クライアント側で使用する場合）

### 4. PWA設定
- [ ] `public/manifest.json`が存在し、正しく設定されている
- [ ] PWAアイコンが`public/icons/`に配置されている（8サイズ）
- [ ] `layout.tsx`にマニフェストとアイコンのリンクが追加されている
- [ ] テーマカラーが設定されている

### 5. ブラウザテスト
- [ ] Chrome（最新版）でテスト済み
- [ ] Firefox（最新版）でテスト済み
- [ ] Safari（最新版）でテスト済み
- [ ] Edge（最新版）でテスト済み
- [ ] モバイルブラウザ（Chrome Mobile、Safari iOS）でテスト済み

### 6. デバイステスト
- [ ] デスクトップ（1920x1080以上）でテスト済み
- [ ] タブレット（768x1024）でテスト済み
- [ ] モバイル（375x667以上）でテスト済み
- [ ] 縦向き・横向きの両方でテスト済み

### 7. 機能テスト
- [ ] ホームページが正しく表示される
- [ ] クイズが正常に動作する
- [ ] 結果ページが正しく表示される
- [ ] LocalStorageによる進捗保存が動作する
- [ ] Resume機能が動作する
- [ ] すべてのアニメーションが滑らか

### 8. パフォーマンス
- [ ] Lighthouseスコア（デスクトップ）：Performance 90+、Accessibility 95+、Best Practices 95+、SEO 90+、PWA 80+
- [ ] Lighthouseスコア（モバイル）：Performance 85+、Accessibility 95+、Best Practices 95+、SEO 90+、PWA 80+
- [ ] ページ読み込み時間が3秒以内
- [ ] アニメーションが60fpsで動作

### 9. アクセシビリティ
- [ ] キーボードナビゲーションが動作する
- [ ] フォーカスインジケーターが表示される
- [ ] スクリーンリーダーで読み上げ可能
- [ ] カラーコントラストがWCAG AA準拠
- [ ] `prefers-reduced-motion`が尊重される

### 10. セキュリティ
- [ ] HTTPSで配信される（本番環境）
- [ ] Content Security Policyが設定されている
- [ ] セキュリティヘッダーが適切に設定されている
- [ ] 依存関係に既知の脆弱性がない (`pnpm audit`)
- [ ] XSS対策が実装されている

### 11. ドキュメント
- [ ] README.mdが最新の状態
- [ ] DEPLOYMENT.mdが作成されている
- [ ] コードにコメントが適切に記載されている
- [ ] 変更履歴が記録されている

### 12. Git
- [ ] すべての変更がコミットされている
- [ ] コミットメッセージが明確
- [ ] mainブランチが最新の状態
- [ ] タグが付けられている（バージョン管理）

---

## 🚀 デプロイ手順

### Vercel（推奨）

1. **Vercelアカウントの作成**
   - https://vercel.com/signup にアクセス
   - GitHubアカウントで登録

2. **プロジェクトのインポート**
   - Vercel Dashboard > "New Project"
   - GitHubリポジトリを選択
   - `frontend`ディレクトリをルートディレクトリとして指定

3. **環境変数の設定**
   - Settings > Environment Variables
   - 必要な環境変数を追加：
     - `NEXT_PUBLIC_APP_VERSION=1.0.0`
     - その他、必要に応じて追加

4. **デプロイ**
   - "Deploy"ボタンをクリック
   - デプロイが完了するまで待機（通常2-3分）

5. **デプロイ後の確認**
   - 本番URLにアクセス
   - すべての機能が動作することを確認
   - Lighthouseでスコアを確認

### Netlify

1. **Netlifyアカウントの作成**
   - https://app.netlify.com/signup にアクセス

2. **netlify.tomlの作成**（既に作成済みの場合はスキップ）
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

3. **プロジェクトのインポート**
   - "New site from Git"をクリック
   - GitHubリポジトリを選択
   - ビルド設定を確認

4. **環境変数の設定**
   - Site settings > Build & deploy > Environment
   - 必要な環境変数を追加

5. **デプロイ**
   - "Deploy site"をクリック

### AWS S3 + CloudFront

1. **Next.jsの静的エクスポート設定**
   ```typescript
   // next.config.ts
   const nextConfig = {
     output: 'export',
     // その他の設定...
   }
   ```

2. **ビルドとエクスポート**
   ```bash
   cd frontend
   pnpm build
   ```

3. **S3バケットの作成**
   ```bash
   aws s3 mb s3://sap-obake-app
   ```

4. **ファイルのアップロード**
   ```bash
   aws s3 sync out/ s3://sap-obake-app --delete
   ```

5. **CloudFrontディストリビューションの設定**
   - S3バケットをオリジンとして設定
   - HTTPSを有効化
   - カスタムドメインを設定（オプション）

---

## 📊 デプロイ後の確認

### 1. 動作確認
- [ ] 本番URLにアクセスできる
- [ ] すべてのページが正しく表示される
- [ ] すべての機能が動作する
- [ ] エラーがコンソールに表示されない

### 2. パフォーマンス確認
```bash
# Lighthouseで本番環境をテスト
npx lighthouse https://your-production-url.com --view
```

### 3. PWA確認
- [ ] マニフェストが正しく読み込まれる
- [ ] アイコンが表示される
- [ ] インストールボタンが表示される（対応ブラウザ）
- [ ] インストール後、スタンドアロンモードで動作する

### 4. モニタリング設定
- [ ] エラートラッキング（Sentry等）を設定（オプション）
- [ ] アナリティクス（Google Analytics等）を設定（オプション）
- [ ] アップタイムモニタリングを設定（オプション）

---

## 🔄 継続的デプロイメント（CI/CD）

### GitHub Actionsの設定（オプション）

`.github/workflows/deploy.yml`を作成：

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

## 🐛 トラブルシューティング

### ビルドエラー
**問題:** `pnpm build`がエラーで失敗する

**解決策:**
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

### 環境変数が反映されない
**問題:** 環境変数の値が正しく読み込まれない

**解決策:**
1. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
2. サーバーを再起動
3. ビルドをやり直す

### PWAがインストールできない
**問題:** ブラウザにインストールボタンが表示されない

**解決策:**
1. HTTPSで配信されているか確認
2. マニフェストファイルが正しく読み込まれているか確認
3. アイコンが存在するか確認

---

## 📝 デプロイ記録

### デプロイ履歴

| 日付 | バージョン | デプロイ先 | 担当者 | 備考 |
|------|-----------|-----------|--------|------|
| 2025-11-29 | 1.0.0 | Vercel | - | 初回デプロイ |
|  |  |  |  |  |
|  |  |  |  |  |

---

**最終更新日:** 2025-11-29
**次回レビュー日:** _________
