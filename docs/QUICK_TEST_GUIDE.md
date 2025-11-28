# SAP Obake クイックテストガイド

## 🚀 5分でできる基本テスト

このガイドは、デプロイ前に最低限確認すべき項目をまとめたものです。

---

## ステップ1: ローカルでプロダクションビルドをテスト（2分）

```bash
cd frontend

# ビルド
pnpm build

# プロダクションサーバー起動
pnpm start
```

ブラウザで `http://localhost:3000` にアクセス。

---

## ステップ2: 基本機能テスト（2分）

### ホームページ
- [ ] ページが表示される
- [ ] ゴーストアニメーションが動く
- [ ] "Start Quiz"ボタンをクリックできる

### クイズページ
- [ ] 問題が表示される
- [ ] 選択肢をクリックできる
- [ ] 回答後、フィードバックが表示される
- [ ] "Next"ボタンで次の問題に進める
- [ ] タイマーが動作する

### 結果ページ
- [ ] スコアが表示される
- [ ] "Restart"ボタンで最初に戻る

---

## ステップ3: レスポンシブテスト（1分）

### Chrome DevToolsを使用

1. F12キーで開発者ツールを開く
2. Ctrl+Shift+M（Mac: Cmd+Shift+M）でデバイスツールバーを表示
3. 以下のデバイスで表示確認：
   - [ ] iPhone SE（375x667）
   - [ ] iPad（768x1024）
   - [ ] Desktop（1920x1080）

---

## 📱 モバイルデバイスでのテスト

### ローカルネットワークでアクセス

```bash
# ローカルネットワークでアクセス可能にする
pnpm dev -- -H 0.0.0.0
```

表示されるURLにモバイルデバイスからアクセス：
```
例: http://192.168.1.100:3000
```

### 確認項目
- [ ] タッチ操作が正確に反応する
- [ ] スクロールが滑らか
- [ ] テキストが読みやすい

---

## 🔍 Lighthouseクイックチェック

```bash
# Lighthouseを実行
npx lighthouse http://localhost:3000 --view
```

### 最低基準
- Performance: 85以上
- Accessibility: 90以上
- Best Practices: 90以上
- SEO: 85以上

---

## ✅ 合格基準

すべての項目にチェックが入れば、デプロイ可能です！

---

## 🐛 問題が見つかった場合

1. **ビルドエラー**
   ```bash
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

2. **表示が崩れている**
   - ブラウザのキャッシュをクリア
   - ハードリロード（Ctrl+Shift+R）

3. **機能が動作しない**
   - ブラウザのコンソールでエラーを確認
   - LocalStorageをクリア

---

## 📊 詳細なテストが必要な場合

- [BROWSER_TESTING_CHECKLIST.md](./BROWSER_TESTING_CHECKLIST.md) - 詳細なブラウザテスト
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - デプロイ前の完全チェックリスト
- [DEPLOYMENT.md](./DEPLOYMENT.md) - デプロイメントガイド

---

**所要時間:** 約5分
**推奨頻度:** デプロイ前、大きな変更後
