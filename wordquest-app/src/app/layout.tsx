import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WordQuest - 词汇大冒险",
  description: "把学习变成娱乐，让背单词像玩游戏一样上瘾！通过地下城闯关、PvP对战、农场养成等多元玩法，让你在玩中不知不觉掌握词汇。",
  keywords: ["背单词", "英语学习", "游戏化学习", "词汇", "四六级", "考研英语"],
  authors: [{ name: "WordQuest Team" }],
  openGraph: {
    title: "WordQuest - 词汇大冒险",
    description: "把学习变成娱乐，让背单词像玩游戏一样上瘾！",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
