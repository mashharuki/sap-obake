import { getRequestConfig } from "next-intl/server";

// 対応言語
export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];

// デフォルト言語
export const defaultLocale: Locale = "ja";

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;

  // 対応していない言語の場合はデフォルト言語を使用
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
