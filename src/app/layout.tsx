import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InBeam Test | 한국 유학 플랫폼",
  description: "한국 최고의 대학교를 찾고, 입학 지원까지 한 번에 해결하세요. 유럽, 러시아, 중앙아시아 학생들을 위한 교육 플랫폼입니다.",
  keywords: ["Korea", "education", "university", "career", "international students", "study abroad", "한국 유학", "대학교"],
  authors: [{ name: "InBeam Test" }],
  openGraph: {
    title: "InBeam Test | 한국 유학 플랫폼",
    description: "한국 최고의 대학교를 찾고, 입학 지원까지 한 번에 해결하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
