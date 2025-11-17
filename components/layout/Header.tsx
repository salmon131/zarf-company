"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className={`${isHomePage ? "bg-[#FFF8F0]/95" : "bg-white/95"} backdrop-blur-md border-b ${isHomePage ? "border-brand-200/30" : "border-gray-200/50"} sticky top-0 z-50 shadow-sm`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Link 
            href="/" 
            className="flex items-center gap-1 text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            <Image
              src="/images/logo.png"
              alt="Zarf Company 로고"
              width={32}
              height={32}
              className="w-8 h-8 md:w-10 md:h-10"
              priority
              unoptimized
            />
            <span>Zarf Company</span>
          </Link>
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link
              href="/comic"
              className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group"
            >
              만화
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/video"
              className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group"
            >
              영상
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/cafe"
              className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group"
            >
              카페
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/community"
              className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group"
            >
              커뮤니티
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/b2b"
              className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group hidden md:block"
            >
              B2B
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group hidden md:block"
            >
              회사 소개
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Button
              href="/cafe/seminar"
              variant="primary"
              size="sm"
              className="ml-2 md:ml-4 !bg-gradient-to-r !from-brand-400 !to-brand-500 !text-white !font-bold !rounded-full !px-5 !py-2.5 !text-base hover:!scale-105 hover:!shadow-lg transition-all duration-300"
            >
              알림 신청
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

