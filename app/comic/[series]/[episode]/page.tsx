"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ComicEpisode {
  filename: string;
  episode: number | null;
  type: "episode" | "intro" | "special";
  url: string;
  title?: string;
  date?: string;
}

export default function ComicEpisodePage({
  params,
}: {
  params: Promise<{ series: string; episode: string }>;
}) {
  const { series, episode } = use(params);
  const seriesName = decodeURIComponent(series);
  const episodeFilename = decodeURIComponent(episode);

  // 탱자프 시리즈 에피소드 목록
  const allEpisodes: ComicEpisode[] = [
    {
      filename: "최종탱인트로25.9.16.jpg",
      episode: null,
      type: "intro",
      url: "/images/comic/tangzarf/최종탱인트로25.9.16.jpg",
      title: "인트로",
      date: "2025.09.16",
    },
    {
      filename: "최종다모탱1화25.9.16훈민.jpg",
      episode: 1,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱1화25.9.16훈민.jpg",
      title: "1화",
      date: "2025.09.16",
    },
    {
      filename: "최종다모탱2화25.9.16훈민.jpg",
      episode: 2,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱2화25.9.16훈민.jpg",
      title: "2화",
      date: "2025.09.16",
    },
    {
      filename: "최종다모탱3화25.9.16훈민.jpg",
      episode: 3,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱3화25.9.16훈민.jpg",
      title: "3화",
      date: "2025.09.16",
    },
    {
      filename: "최종다모탱4화25.9.16훈민.jpg",
      episode: 4,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱4화25.9.16훈민.jpg",
      title: "4화",
      date: "2025.09.16",
    },
    {
      filename: "최종다모탱5화25.9.16_훈민.jpg",
      episode: 5,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱5화25.9.16_훈민.jpg",
      title: "5화",
      date: "2025.09.16",
    },
    {
      filename: "최종다모탱6화25.9.17훈민.jpg",
      episode: 6,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱6화25.9.17훈민.jpg",
      title: "6화",
      date: "2025.09.17",
    },
    {
      filename: "최종다모탱7화25.917훈민.jpg",
      episode: 7,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱7화25.917훈민.jpg",
      title: "7화",
      date: "2025.09.17",
    },
    {
      filename: "최종다모탱8화25.9.17훈민.jpg",
      episode: 8,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱8화25.9.17훈민.jpg",
      title: "8화",
      date: "2025.09.17",
    },
    {
      filename: "최종다모탱9화25.9.17훈민.jpg",
      episode: 9,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱9화25.9.17훈민.jpg",
      title: "9화",
      date: "2025.09.17",
    },
    {
      filename: "최종다모탱10화25.9.17.훈민.jpg",
      episode: 10,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱10화25.9.17.훈민.jpg",
      title: "10화",
      date: "2025.09.17",
    },
    {
      filename: "최종다모탱11화25.9.17훈민.jpg",
      episode: 11,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱11화25.9.17훈민.jpg",
      title: "11화",
      date: "2025.09.17",
    },
    {
      filename: "최종다모탱12화25.9.17훈민.jpg",
      episode: 12,
      type: "episode",
      url: "/images/comic/tangzarf/최종다모탱12화25.9.17훈민.jpg",
      title: "12화",
      date: "2025.09.17",
    },
    {
      filename: "탱etf0917훈민.jpg",
      episode: null,
      type: "special",
      url: "/images/comic/tangzarf/탱etf0917훈민.jpg",
      title: "특별편 - ETF",
      date: "2025.09.17",
    },
  ];

  // 현재 에피소드 찾기
  const currentEpisode = allEpisodes.find(
    (ep) => ep.filename === episodeFilename
  );

  if (!currentEpisode) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            에피소드를 찾을 수 없습니다
          </h1>
          <Link href={`/comic/${seriesName}`}>
            <Button variant="primary">시리즈 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 현재 인덱스 찾기
  const currentIndex = allEpisodes.findIndex(
    (ep) => ep.filename === episodeFilename
  );
  const prevEpisode =
    currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex < allEpisodes.length - 1
      ? allEpisodes[currentIndex + 1]
      : null;

  // 시리즈 제목
  const seriesTitle: Record<string, string> = {
    tangzarf: "이상한 녀석들의 주식투자 - 탱자프",
  };
  const title = seriesTitle[seriesName] || seriesName;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div>
              <Link
                href={`/comic/${seriesName}`}
                className="text-brand-500 hover:text-brand-600 font-medium text-sm"
              >
                ← {title}
              </Link>
              <h1 className="text-xl font-bold text-gray-900 mt-1">
                {currentEpisode.title || `${currentEpisode.episode}화`}
              </h1>
            </div>
            <div className="flex gap-2">
              {prevEpisode && (
                <Link href={`/comic/${seriesName}/${prevEpisode.filename}`}>
                  <Button variant="secondary" size="sm">
                    이전화
                  </Button>
                </Link>
              )}
              {nextEpisode && (
                <Link href={`/comic/${seriesName}/${nextEpisode.filename}`}>
                  <Button variant="primary" size="sm">
                    다음화
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 만화 이미지 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="relative w-full">
              {/* 에피소드 타입 배지 */}
              {currentEpisode.type === "intro" && (
                <div className="bg-brand-100 px-4 py-2 text-center">
                  <span className="text-brand-700 font-semibold">인트로</span>
                </div>
              )}
              {currentEpisode.type === "special" && (
                <div className="bg-orange-100 px-4 py-2 text-center">
                  <span className="text-orange-700 font-semibold">특별편</span>
                </div>
              )}
              {currentEpisode.type === "episode" && currentEpisode.episode && (
                <div className="bg-brand-100 px-4 py-2 text-center">
                  <span className="text-brand-700 font-semibold">
                    {currentEpisode.episode}화
                  </span>
                </div>
              )}

              {/* 만화 이미지 */}
              <div className="relative w-full bg-gray-50">
                <img
                  src={currentEpisode.url}
                  alt={currentEpisode.title || `${currentEpisode.episode}화`}
                  className="w-full h-auto object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </Card>

          {/* 네비게이션 버튼 (하단) */}
          <div className="flex justify-between items-center mt-8 gap-4">
            {prevEpisode ? (
              <Link
                href={`/comic/${seriesName}/${prevEpisode.filename}`}
                className="flex-1"
              >
                <Button variant="secondary" className="w-full">
                  ← {prevEpisode.title || `${prevEpisode.episode}화`}
                </Button>
              </Link>
            ) : (
              <div className="flex-1"></div>
            )}

            <Link href={`/comic/${seriesName}`}>
              <Button variant="secondary">목차</Button>
            </Link>

            {nextEpisode ? (
              <Link
                href={`/comic/${seriesName}/${nextEpisode.filename}`}
                className="flex-1"
              >
                <Button variant="primary" className="w-full">
                  {nextEpisode.title || `${nextEpisode.episode}화`} →
                </Button>
              </Link>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

