import { LanguageSwitcher } from "@/components/language-switcher";
import { locales } from "@/i18n";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Creepster, Fira_Code, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

// Haunted theme fonts
const creepster = Creepster({
  weight: "400",
  variable: "--font-creepster",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("appName")} - ${t("appDescription")}`,
    description: t("appDescription"),
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: t("appName"),
    },
    icons: {
      icon: [
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2D1B4E",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ロケールが対応していない場合は404
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${creepster.variable} ${inter.variable} ${firaCode.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Skip to main content link for keyboard navigation */}
          <a href="#main-content" className="skip-to-main">
            {locale === "ja" ? "メインコンテンツへスキップ" : "Skip to main content"}
          </a>
          <div id="main-content">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
