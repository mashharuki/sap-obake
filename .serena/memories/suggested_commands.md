# 推奨コマンド

## 開発コマンド

### フロントエンド開発
```bash
cd frontend

# 開発サーバー起動（ポート3000）
pnpm dev

# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start
```

### テスト実行
```bash
cd frontend

# 全テスト実行（1回のみ）
pnpm test

# ウォッチモードでテスト実行
pnpm test:watch

# カバレッジ付きテスト実行
pnpm test:coverage
```

### コード品質
```bash
cd frontend

# リント実行
pnpm lint

# フォーマット実行
pnpm format
```

## システムコマンド（macOS）

### ファイル操作
```bash
# ファイル一覧表示
ls -la

# ファイル削除
rm file.txt

# ディレクトリ削除
rm -rf dir

# ファイルコピー
cp source.txt destination.txt

# ディレクトリコピー
cp -r source destination

# ディレクトリ作成
mkdir -p dir
```

### ファイル検索
```bash
# ファイル内容表示
cat file.txt

# ファイル内検索
grep -r "search" *.txt
```

### Git操作
```bash
# 変更確認
git status

# 変更をステージング
git add .

# コミット（コンベンショナルコミット形式）
git commit -m "feat: add new feature"
git commit -m "fix: fix bug"
git commit -m "test: add tests"
git commit -m "refactor: refactor code"
git commit -m "docs: update documentation"
git commit -m "chore: update dependencies"

# プッシュ
git push
```

## パッケージ管理
```bash
# 依存関係インストール
pnpm install

# パッケージ追加
pnpm add package-name

# 開発依存関係追加
pnpm add -D package-name

# パッケージ削除
pnpm remove package-name
```
