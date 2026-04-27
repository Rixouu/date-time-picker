import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Date & Time Picker",
  description: "Custom React date and time picker components in light and dark modes. Mobile responsive, portal-rendered, no UI library dependency.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
