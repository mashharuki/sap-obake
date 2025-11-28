import type { Metadata } from "next";
import { Creepster, Fira_Code, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "SAP Obake - AWS SAP Quiz",
  description:
    "Master AWS Solutions Architect Professional certification with our haunted quiz experience",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SAP Obake",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2D1B4E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${creepster.variable} ${inter.variable} ${firaCode.variable} font-sans antialiased`}
      >
        {/* Skip to main content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-main">
          メインコンテンツへスキップ
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
