"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-gradient-to-b from-[#FFF8F0] to-[#FFF4E6] relative overflow-hidden mt-auto pb-16 md:pb-8">
      {/* 장식 요소 */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-brand-500 mb-4">
              Zarf Company
            </h3>
            <p className="text-gray-600 text-sm">
              만화로 배우는 투자 감각
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/comic"
                  className="text-gray-600 hover:text-brand-500 transition-colors"
                >
                  만화
                </Link>
              </li>
              <li>
                <Link
                  href="/video"
                  className="text-gray-600 hover:text-brand-500 transition-colors"
                >
                  영상
                </Link>
              </li>
              <li>
                <Link
                  href="/cafe"
                  className="text-gray-600 hover:text-brand-500 transition-colors"
                >
                  카페
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">커뮤니티</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-gray-600 hover:text-brand-500 transition-colors"
                >
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link
                  href="/community/gallery"
                  className="text-gray-600 hover:text-brand-500 transition-colors"
                >
                  갤러리
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">회사</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-brand-500 transition-colors"
                >
                  회사 소개
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200/30 text-center text-sm text-gray-600">
          <p>&copy; 2024 Zarf Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

