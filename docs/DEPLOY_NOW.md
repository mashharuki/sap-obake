# 🚀 SAP Obake - 今すぐデプロイ！

## 最速デプロイガイド（5分）

### 前提条件
- [ ] プロダクションビルドが成功している
- [ ] 基本的なテストが完了している

---

## オプション1: Vercel（最も簡単）⭐

### 方法A: Vercel Dashboard（推奨）

1. **Vercelにアクセス**
   ```
   https://vercel.com/signup
   ```

2. **GitHubで登録**
   - "Continue with GitHub"をクリック

3. **プロジェクトをインポート**
   - "New Project"をクリック
   - リポジトリを選択
   - "Import"をクリック

4. **設定**
   - Root Directory: `frontend`
   - Framework Preset: Next.js（自動検出）
   - Build Command: `pnpm build`（自動設定）
   - Output Directory: `.next`（自動設定）

5. **環境変数（オプション）**
   ```
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

6. **デプロイ**
   - "Deploy"ボタンをクリック
   - 2-3分待つ
   - 完了！

### 方法B: Vercel CLI

```bash
# CLIをインストール
npm i -g vercel

# デプロイ
cd frontend
vercel

# プロンプトに従って設定
# - Set up and deploy? Yes
# - Which scope? (あなたのアカウント)
# - Link to existing project? No
# - What's your project's name? sap-obake
# - In which directory is your code located? ./
# - Want to override the settings? No

# 完了！URLが表示されます
```

---

## オプション2: Netlify

### Netlify Dashboard

1. **Netlifyにアクセス**
   ```
   https://app.netlify.com/signup
   ```

2. **GitHubで登録**

3. **新しいサイトを作成**
   - "New site from Git"をクリック
   - GitHubリポジトリを選択

4. **ビルド設定**
   - Base directory: `frontend`
   - Build command: `pnpm build`
   - Publish directory: `frontend/.next`

5. **デプロイ**
   - "Deploy site"をクリック
   - 完了！

---

## オプション3: GitHub Pages（静的エクスポート）

### 1. Next.jsの設定を変更

```typescript
// frontend/next.config.ts
const nextConfig = {
  output: 'export',
  // その他の設定...
}
```

### 2. ビルド

```bash
cd frontend
pnpm build
```

### 3. GitHub Pagesにデプロイ

```bash
# gh-pagesブランチを作成
git checkout -b gh-pages

# ビルド成果物をコピー
cp -r frontend/out/* .

# コミットしてプッシュ
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### 4. GitHub Pagesを有効化

1. GitHubリポジトリ > Settings > Pages
2. Source: `gh-pages` branch
3. Save

---

## デプロイ後の確認（1分）

### 1. URLにアクセス
```
https://your-app-url.vercel.app
```

### 2. 基本動作確認
- [ ] ホームページが表示される
- [ ] クイズが開始できる
- [ ] 問題に回答できる
- [ ] 結果が表示される

### 3. エラーチェック
- F12キーで開発者ツールを開く
- Consoleタブでエラーがないか確認

---

## トラブルシューティング

### ビルドエラー

**問題:** デプロイ時にビルドエラーが発生

**解決策:**
```bash
# ローカルでビルドを確認
cd frontend
rm -rf .next node_modules
pnpm install
pnpm build
```

### 環境変数が反映されない

**問題:** 環境変数の値が正しく読み込まれない

**解決策:**
1. Vercel/Netlify Dashboardで環境変数を確認
2. 変数名が`NEXT_PUBLIC_`で始まっているか確認
3. 再デプロイ

### ページが表示されない

**問題:** デプロイ後、ページが表示されない

**解決策:**
1. ビルドログを確認
2. ルートディレクトリが`frontend`に設定されているか確認
3. ビルドコマンドが正しいか確認

---

## 🎉 デプロイ完了！

おめでとうございます！SAP Obakeが本番環境で動作しています。

### 次のステップ

1. **URLを共有**
   - Kiroween ハッカソンに提出
   - SNSでシェア

2. **モニタリング**
   - Vercel/Netlify Dashboardでアクセス状況を確認
   - エラーログをチェック

3. **改善**
   - ユーザーフィードバックを収集
   - パフォーマンスを最適化
   - 新機能を追加

---

## 📚 詳細情報

より詳細な情報が必要な場合：

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 詳細なデプロイメントガイド
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 完全チェックリスト
- [QUICK_TEST_GUIDE.md](./QUICK_TEST_GUIDE.md) - テストガイド

---

**所要時間:** 約5分
**難易度:** ⭐☆☆☆☆（とても簡単）
**推奨方法:** Vercel Dashboard
