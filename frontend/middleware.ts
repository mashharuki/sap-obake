import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n";

export default createMiddleware({
  // 対応言語のリスト
  locales,

  // デフォルト言語
  defaultLocale,

  // ロケールプレフィックスの設定
  localePrefix: "as-needed", // デフォルト言語の場合はプレフィックスなし
});

export const config = {
  // i18nルーティングを適用するパス
  matcher: [
    // すべてのパスにマッチ（API、静的ファイル、画像を除く）
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // ルートパス
    "/",
  ],
};
