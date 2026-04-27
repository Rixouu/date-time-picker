import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Date & Time Picker",
  description: "Custom React date and time picker components in light and dark modes — mobile responsive, no external UI library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
