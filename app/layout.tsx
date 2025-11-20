import type { Metadata } from "next";
import { Gowun_Batang } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FontLoader from "@/components/layout/FontLoader";
import StructuredData from "@/components/layout/StructuredData";

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tangzarf.com'),
  title: {
    default: "탱자프 - 만화로 배우는 투자",
    template: "%s | 탱자프",
  },
  description: "탱자프 대표의 투자 노하우와 최신 트렌드를 담은 재밌고 유익한 주식투자 만화와 영상. 데이터 기반 퀀트 분석으로 실전 투자 전략을 배워보세요.",
  keywords: ["주식투자", "투자만화", "탱자프", "퀀트분석", "투자교육", "ETF", "실전투자", "주식교육", "투자공부"],
  authors: [{ name: "탱자프", url: "https://tangzarf.com" }],
  creator: "탱자프",
  publisher: "탱자프",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: ["/icon.png"],
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://tangzarf.com",
    siteName: "탱자프 - 만화로 배우는 투자",
    title: "탱자프 - 만화로 배우는 투자",
    description: "유머, 공감, 인사이트를 담은 최초의 주식투자 만화 탱자프! 탱자프 대표의 실전 투자 노하우와 최신 트렌드를 재밌고 유익한 만화와 영상으로 만나보세요.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "탱자프 - 만화로 배우는 투자",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "탱자프 - 만화로 배우는 투자",
    description: "유머, 공감, 인사이트를 담은 최초의 주식투자 만화 탱자프! 탱자프 대표의 실전 투자 노하우와 최신 트렌드를 재밌고 유익한 만화와 영상으로 만나보세요.",
    images: ["/twitter-image.jpg"],
    creator: "@tangzarf",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console에서 받은 코드로 교체
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <StructuredData />
      </head>
      <body className={`${gowunBatang.variable} font-sans antialiased`}>
        <FontLoader />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
