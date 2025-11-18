"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ComicEpisode {
  filename: string;
  episode: number | null; // null이면 인트로나 특별편
  type: "episode" | "intro" | "special";
  url: string;
  thumbnailUrl: string;
  title?: string;
  date?: string;
}

export default function ComicSeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series } = use(params);
  const seriesName = decodeURIComponent(series);

  // 탱자프 시리즈 에피소드 목록
  const tangzarfEpisodes: ComicEpisode[] = useMemo(() => {
    const episodes: ComicEpisode[] = [
      {
        filename: "최종탱인트로25.9.16.jpg",
        episode: null,
        type: "intro",
        url: "/images/comic/tangzarf/최종탱인트로25.9.16.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종탱인트로25.9.16.jpg",
        title: "인트로",
        date: "2025.09.16",
      },
      {
        filename: "최종다모탱1화25.9.16훈민.jpg",
        episode: 1,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱1화25.9.16훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱1화25.9.16훈민.jpg",
        title: "1화",
        date: "2025.09.16",
      },
      {
        filename: "최종다모탱2화25.9.16훈민.jpg",
        episode: 2,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱2화25.9.16훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱2화25.9.16훈민.jpg",
        title: "2화",
        date: "2025.09.16",
      },
      {
        filename: "최종다모탱3화25.9.16훈민.jpg",
        episode: 3,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱3화25.9.16훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱3화25.9.16훈민.jpg",
        title: "3화",
        date: "2025.09.16",
      },
      {
        filename: "최종다모탱4화25.9.16훈민.jpg",
        episode: 4,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱4화25.9.16훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱4화25.9.16훈민.jpg",
        title: "4화",
        date: "2025.09.16",
      },
      {
        filename: "최종다모탱5화25.9.16_훈민.jpg",
        episode: 5,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱5화25.9.16_훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱5화25.9.16_훈민.jpg",
        title: "5화",
        date: "2025.09.16",
      },
      {
        filename: "최종다모탱6화25.9.17훈민.jpg",
        episode: 6,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱6화25.9.17훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱6화25.9.17훈민.jpg",
        title: "6화",
        date: "2025.09.17",
      },
      {
        filename: "최종다모탱7화25.917훈민.jpg",
        episode: 7,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱7화25.917훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱7화25.917훈민.jpg",
        title: "7화",
        date: "2025.09.17",
      },
      {
        filename: "최종다모탱8화25.9.17훈민.jpg",
        episode: 8,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱8화25.9.17훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱8화25.9.17훈민.jpg",
        title: "8화",
        date: "2025.09.17",
      },
      {
        filename: "최종다모탱9화25.9.17훈민.jpg",
        episode: 9,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱9화25.9.17훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱9화25.9.17훈민.jpg",
        title: "9화",
        date: "2025.09.17",
      },
      {
        filename: "최종다모탱10화25.9.17.훈민.jpg",
        episode: 10,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱10화25.9.17.훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱10화25.9.17.훈민.jpg",
        title: "10화",
        date: "2025.09.17",
      },
      {
        filename: "최종다모탱11화25.9.17훈민.jpg",
        episode: 11,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱11화25.9.17훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱11화25.9.17훈민.jpg",
        title: "11화",
        date: "2025.09.17",
      },
      {
        filename: "최종다모탱12화25.9.17훈민.jpg",
        episode: 12,
        type: "episode",
        url: "/images/comic/tangzarf/최종다모탱12화25.9.17훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/최종다모탱12화25.9.17훈민.jpg",
        title: "12화",
        date: "2025.09.17",
      },
      {
        filename: "탱etf0917훈민.jpg",
        episode: null,
        type: "special",
        url: "/images/comic/tangzarf/탱etf0917훈민.jpg",
        thumbnailUrl: "/images/comic/tangzarf/탱etf0917훈민.jpg",
        title: "특별편 - ETF",
        date: "2025.09.17",
      },
    ];

    // 정렬: 인트로 → 에피소드 순서대로 → 특별편
    return episodes.sort((a, b) => {
      if (a.type === "intro") return -1;
      if (b.type === "intro") return 1;
      if (a.type === "special") return 1;
      if (b.type === "special") return -1;
      if (a.episode === null) return 1;
      if (b.episode === null) return -1;
      return a.episode - b.episode;
    });
  }, []);

  // 시리즈별 정보
  const seriesInfo: Record<
    string,
    {
      title: string;
      description: string;
      author: string;
      genre: string[];
      coverImage: string;
      synopsis: string;
    }
  > = {
    tangzarf: {
      title: "이상한 녀석들의 주식투자 - 탱자프",
      description: "만화로 쉽고 재미있게 배우는 주식 투자 이야기",
      author: "글: 자프 / 그림: 다모",
      genre: ["투자", "만화", "실전", "교육"],
      coverImage: "/images/comic/tangzarf/cover.jpg",
      synopsis:
        "주식 투자를 처음 시작하는 사람들을 위한 실전 투자 만화입니다. 복잡한 투자 이론을 만화로 쉽고 재미있게 풀어낸 이야기로, 실제 투자 경험과 노하우를 공유합니다. 투자 심리부터 실전 전략까지, 만화를 통해 배우는 주식 투자의 모든 것.",
    },
  };

  const info = seriesInfo[seriesName];

  // 탱자프 시리즈인 경우
  if (seriesName === "tangzarf" && info) {
    const regularEpisodes = tangzarfEpisodes.filter((ep) => ep.type === "episode");
    const introEpisode = tangzarfEpisodes.find((ep) => ep.type === "intro");
    const specialEpisodes = tangzarfEpisodes.filter((ep) => ep.type === "special");

    return (
      <div className="min-h-screen bg-white">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-b from-brand-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
              {/* 커버 이미지 */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={info.coverImage}
                    alt={info.title}
                    fill
                    className="object-cover object-[center_100%]"
                    priority
                  />
                </div>
              </div>

              {/* 시리즈 정보 */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                  {info.title}
                </h1>

                {/* 작가 정보 */}
                <div className="mb-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">글</span>: 탱자프 / <span className="font-semibold">그림</span>: 다모
                  </p>
                </div>

                {/* 장르 태그 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {info.genre.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-brand-100 text-brand-700 text-sm rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 시놉시스 */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{info.synopsis}</p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-wrap gap-2">
                  {introEpisode && (
                    <Link href={`/comic/${seriesName}/${introEpisode.filename}`}>
                      <button className="px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-medium rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-sm hover:shadow-md">
                        인트로 보기
                      </button>
                    </Link>
                  )}
                  {regularEpisodes.length > 0 && (
                    <Link href={`/comic/${seriesName}/${regularEpisodes[0].filename}`}>
                      <button className="px-4 py-2 bg-white text-brand-600 text-sm font-medium rounded-lg border border-brand-300 hover:bg-brand-50 hover:border-brand-400 transition-all duration-200 shadow-sm hover:shadow-md">
                        첫화 보기 ({regularEpisodes[0].title})
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 에피소드 목록 섹션 */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* 섹션 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  목차
                </h2>
                <p className="text-gray-600">
                  총 {tangzarfEpisodes.length}화
                </p>
              </div>
            </div>

            {/* 에피소드 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tangzarfEpisodes.map((episode, index) => (
                <Link
                  key={index}
                  href={`/comic/${seriesName}/${episode.filename}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    {/* 썸네일 */}
                    <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                      <Image
                        src={episode.thumbnailUrl}
                        alt={episode.title || `${episode.episode}화`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      />
                      {/* 에피소드 타입 배지 */}
                      {episode.type === "intro" && (
                        <div className="absolute top-2 left-2 bg-brand-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          인트로
                        </div>
                      )}
                      {episode.type === "special" && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          특별편
                        </div>
                      )}
                    </div>

                    {/* 에피소드 정보 */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {episode.title || `${episode.episode}화`}
                      </h3>
                      {episode.date && (
                        <p className="text-xs text-gray-500">{episode.date}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 다른 시리즈인 경우 기본 레이아웃
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-brand-500 mb-8">
          만화 시리즈: {seriesName}
        </h1>
        <p className="text-gray-700">시리즈 상세 내용이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}
