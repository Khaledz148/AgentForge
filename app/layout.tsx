import type { Metadata } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-arabic",
});
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
export const metadata: Metadata = {
  title: "AgentForge — من الموجز إلى التنفيذ",
  description:
    "منصة عربية متعددة الوكلاء لتحويل موجز الفعالية إلى مقترح تنفيذي متكامل.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${space.variable}`}>{children}</body>
    </html>
  );
}
