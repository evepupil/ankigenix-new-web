import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ankigenix - AI驱动的科学闪卡生成器",
    template: "%s | Ankigenix"
  },
  description: "用最高质量的Anki卡片，加速你的学习效率。支持多种输入方式，AI智能生成高质量学习闪卡。",
  keywords: ["Anki", "闪卡", "学习卡片", "AI生成", "记忆卡", "高效学习", "间隔重复", "知识管理", "智能学习"],
  authors: [{ name: "Ankigenix Team" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://ankigenix.com",
    siteName: "Ankigenix",
    title: "Ankigenix - AI驱动的科学闪卡生成器",
    description: "用最高质量的Anki卡片，加速你的学习效率。支持多种输入方式，AI智能生成高质量学习闪卡。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ankigenix - AI驱动的科学闪卡生成器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankigenix - AI驱动的科学闪卡生成器",
    description: "用最高质量的Anki卡片，加速你的学习效率",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
