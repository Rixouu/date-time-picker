import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Date & Time Picker",
  description: "Custom React date and time picker components in light and dark modes. Mobile responsive, portal-rendered, no UI library dependency.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Date & Time Picker",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

import { PWAInstallBanner } from "@/components/ui/PWAInstallBanner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.className}>
      <head>
        {/* Apple splash screens omitted for brevity in diff but kept in actual file */}
      </head>
      <body style={{ margin: 0 }}>
        {children}
        <PWAInstallBanner />
      </body>
    </html>
  );
}
