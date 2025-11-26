"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import VideoCard from "@/components/video/VideoCard";
import Card from "@/components/ui/Card";

interface Video {
  slug: string;
  href: string;
  category: string;
  title: string;
  thumbnailUrl: string;
  views: number;
  duration: string;
  description?: string;
  publishedAt?: string;
  isShort?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  publishedAt: string;
}

interface VideoListClientProps {
  categories: string[];
  videos: Video[];
  playlists?: Playlist[];
}

type SortOption = "latest" | "popular" | "date";

export default function VideoListClient({
  categories,
  videos,
  playlists = [],
}: VideoListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("동영상");
  const [sortOption, setSortOption] = useState<SortOption>("popular");

  // 카테고리 필터링
  const filteredVideos = useMemo(() => {
    if (selectedCategory === "재생목록") {
      return []; // 재생목록은 별도로 표시
    }
    
    let result = videos.filter((video) => video.category === selectedCategory);

    // 정렬 적용
    switch (sortOption) {
      case "popular":
        // 조회수 높은 순
        result.sort((a, b) => b.views - a.views);
        break;
      case "latest":
        // 발행일 최신순 (발행일이 없으면 조회수 높은 순)
        result.sort((a, b) => {
          if (a.publishedAt && b.publishedAt) {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
          }
          return b.views - a.views;
        });
        break;
      case "date":
        // 발행일 오래된 순 (발행일이 없으면 조회수 낮은 순)
        result.sort((a, b) => {
          if (a.publishedAt && b.publishedAt) {
            return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          }
          return a.views - b.views;
        });
        break;
      default:
        break;
    }

    return result;
  }, [videos, selectedCategory, sortOption]);

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 그라데이션 섹션 */}
      <div className="relative py-12 overflow-hidden">
        {/* 장식 요소 - 큰 원형 글로우 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000" data-aos-delay="200"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-display font-bold leading-[1.2] relative mb-4"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                실전 투자 채널
              </span>
              {/* 텍스트 외곽선 효과로 가독성 향상 */}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                실전 투자 채널
              </span>
            </h1>
            <p 
              className="text-lg text-gray-700 mb-8"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              탱자프 대표의 투자 노하우와 최신 트렌드를 담은 재밌고 유익한 주식투자 영상
            </p>
            
            {/* 유튜브 구독 CTA 섹션 */}
            <div 
              className="max-w-2xl mx-auto bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="600"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">놓치지 마세요!</h2>
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                지금 바로 구독하고 <span className="font-bold text-brand-600">최신 주식 트렌드</span>와 <span className="font-bold text-brand-600">실전 투자 전략</span>을 가장 먼저 받아보세요
              </p>
              <a
                href="https://www.youtube.com/@tangzarf?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                지금 바로 구독하기
              </a>
              {videos.length > 0 && (
                <p className="text-sm text-gray-600 mt-4">
                  이미 {videos.length}개의 영상이 준비되어 있습니다
                </p>
              )}
            </div>
        </section>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Category Tabs */}
        <section className="mb-6">
          <div 
            className="flex gap-6 justify-center mb-6 border-b border-gray-200"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  selectedCategory === category
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                )}
              </button>
            ))}
          </div>

          {/* Sort Options - 재생목록일 때는 숨김 */}
          {selectedCategory !== "재생목록" && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSortOption("latest")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortOption === "latest"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortOption("popular")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortOption === "popular"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                인기순
              </button>
              <button
                onClick={() => setSortOption("date")}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  sortOption === "date"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                날짜순
              </button>
            </div>
          )}
        </section>

        {/* Video Grid or Playlist Grid */}
        <section className="mb-12">
          {selectedCategory === "재생목록" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist, index) => (
                <Link
                  key={playlist.id}
                  href={`/video/playlist/${playlist.id}`}
                  className="block group"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  data-aos-duration="600"
                >
                  <Card hover className="h-full overflow-hidden border-0 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-md">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 relative overflow-hidden">
                      {playlist.thumbnailUrl ? (
                        <img
                          src={playlist.thumbnailUrl}
                          alt={playlist.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-16 h-16"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-semibold flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        동영상 {playlist.itemCount}개
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {playlist.title}
                    </h3>
                    {playlist.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {playlist.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(playlist.publishedAt).toLocaleDateString("ko-KR")} 생성
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <div
                key={video.slug}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                data-aos-duration="600"
              >
                <VideoCard
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  views={video.views}
                  duration={video.duration}
                  href={video.href}
                  category={video.category}
                  publishedAt={video.publishedAt}
                />
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Top 10 Section - 재생목록일 때는 숨김 */}
        {selectedCategory !== "재생목록" && (
        <section>
          <h2 
            className="text-2xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            인기 영상 TOP 10
          </h2>
          <div className="space-y-4">
            {videos
              .sort((a, b) => b.views - a.views)
              .slice(0, 10)
              .map((video, index) => (
                <Card 
                  key={video.slug} 
                  hover 
                  className="p-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  data-aos-duration="600"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-brand-500 w-12 text-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{video.category}</span>
                        <span>조회수 {video.views.toLocaleString()}</span>
                        {video.duration && <span>{video.duration}</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </section>
        )}
      </div>
    </div>
  );
}

