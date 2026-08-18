import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FontLoader from "@/components/layout/FontLoader";
import AOSProvider from "@/components/layout/AOSProvider";
import StructuredData from "@/components/layout/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL('https://tangzarf.com'),
  title: {
    default: "CafeTang - 카공 & 만화 카페",
    template: "%s | CafeTang",
  },
  description: "편하게 쉬고, 작업하고, 공부할 수 있는 서울 강동구 카공 & 만화 카페 CafeTang. 스터디룸 대여 및 대관 문의 가능.",
  keywords: ["CafeTang", "카페탱", "카공카페", "만화카페", "스터디룸", "강동구 카페", "암사동 카페", "회의실 대여"],
  authors: [{ name: "CafeTang", url: "https://tangzarf.com" }],
  creator: "CafeTang",
  publisher: "CafeTang",
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
    siteName: "CafeTang - 카공 & 만화 카페",
    title: "CafeTang - 카공 & 만화 카페",
    description: "편하게 쉬고, 작업하고, 공부할 수 있는 서울 강동구 카공 & 만화 카페 CafeTang. 스터디룸 대여 및 대관 문의 가능.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "CafeTang - 카공 & 만화 카페",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CafeTang - 카공 & 만화 카페",
    description: "편하게 쉬고, 작업하고, 공부할 수 있는 서울 강동구 카공 & 만화 카페 CafeTang.",
    images: ["/twitter-image.jpg"],
    creator: "@cafetang",
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
    google: 'U5zxIV81KL7Xps6ckWZ2jxjASYZiJ7X4aOt-hX6v5VI',
    other: {
      'naver-site-verification': 'naver-site-verification-code', // 네이버 서치어드바이저에서 받은 코드로 교체
    },
  },
  alternates: {
    canonical: 'https://tangzarf.com',
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
        {/* Google Fonts - 빌드 시 fetch 없이 런타임 로드로 Vercel 빌드 안정화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
        />
        {/* Google Search Console 인증 */}
        <meta name="google-site-verification" content="U5zxIV81KL7Xps6ckWZ2jxjASYZiJ7X4aOt-hX6v5VI" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        {/* 네이버 검색 등록 메타 태그 */}
        <meta name="naver-site-verification" content="naver-site-verification-code" />
        {/* 네이버 검색 로봇 설정 */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        {/* 언어 및 지역 설정 */}
        <meta httpEquiv="content-language" content="ko-KR" />
        <meta name="geo.region" content="KR" />
        <StructuredData />
      </head>
      <body className="font-sans antialiased">
        <FontLoader />
        <AOSProvider />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
