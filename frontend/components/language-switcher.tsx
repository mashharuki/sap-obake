"use client";

import { colors, createGlow } from "@/lib/theme-constants";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: string) => {
    startTransition(() => {
      // 現在のパスからロケールを除去
      const pathWithoutLocale = pathname.replace(`/${locale}`, "");
      // 新しいロケールでパスを構築
      const newPath = `/${newLocale}${pathWithoutLocale}`;
      router.replace(newPath);
    });
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex gap-2"
      style={{
        opacity: isPending ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <button
        type="button"
        onClick={() => switchLanguage("ja")}
        disabled={locale === "ja" || isPending}
        className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all disabled:cursor-not-allowed"
        style={{
          backgroundColor: locale === "ja" ? colors.midnightPurple : colors.shadowGray,
          color: locale === "ja" ? colors.hauntedOrange : colors.ghostWhite,
          border: `2px solid ${locale === "ja" ? colors.hauntedOrange : colors.midnightPurple}`,
          boxShadow: locale === "ja" ? createGlow(colors.hauntedOrange, "medium") : "none",
        }}
        aria-label="日本語に切り替え"
        aria-pressed={locale === "ja"}
      >
        🇯🇵 日本語
      </button>
      <button
        type="button"
        onClick={() => switchLanguage("en")}
        disabled={locale === "en" || isPending}
        className="px-3 py-1.5 rounded-lg font-medium text-sm transition-all disabled:cursor-not-allowed"
        style={{
          backgroundColor: locale === "en" ? colors.midnightPurple : colors.shadowGray,
          color: locale === "en" ? colors.hauntedOrange : colors.ghostWhite,
          border: `2px solid ${locale === "en" ? colors.hauntedOrange : colors.midnightPurple}`,
          boxShadow: locale === "en" ? createGlow(colors.hauntedOrange, "medium") : "none",
        }}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        🇺🇸 English
      </button>
    </div>
  );
}
