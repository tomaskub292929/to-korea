import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Gateway to Korea | Education & Career Opportunities",
  description: "Discover top universities and job opportunities in South Korea. Connect with verified schools and start your journey today. For students from Europe, Russia, and Central Asia.",
  keywords: ["Korea", "education", "university", "career", "international students", "study abroad"],
  authors: [{ name: "Gateway to Korea" }],
  openGraph: {
    title: "Gateway to Korea | Education & Career Opportunities",
    description: "Discover top universities and job opportunities in South Korea.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
