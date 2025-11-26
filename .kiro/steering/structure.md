# sap obake プロジェクト構造

## ディレクトリ構成

```
/
├── .kiro/                    # Kiro IDE設定
│   ├── steering/             # ステアリングルール
│   │   ├── product.md        # プロダクト概要
│   │   ├── tech.md           # 技術スタック
│   │   └── structure.md      # プロジェクト構造（このファイル）
│   └── settings/             # IDE設定
├── .serena/                  # Serenaエージェント設定
├── frontend/                 # Next.js Webアプリケーション
│   ├── app/                    # App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Reactコンポーネント
│   │   ├── ui/                # shadcn/uiコンポーネント
│   ├── lib/                   # ユーティリティ
│   │   └── utils.ts
│   ├── hooks/                 # カスタムフック
│   ├── public/                # 静的アセット
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── components.json
├── AGENTS.md                  # AI開発ガイドライン
├── README.md                  # プロジェクトREADME
├── package.json               # ルートpackage.json
├── pnpm-lock.yaml             # 依存関係ロックファイル
├── biome.json                 # Biome設定
└── .gitignore                 # Git無視ファイル
```
