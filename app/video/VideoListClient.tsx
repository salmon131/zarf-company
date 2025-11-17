"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
}

interface VideoListClientProps {
  categories: string[];
  videos: Video[];
}

export default function VideoListClient({
  categories,
  videos,
}: VideoListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredVideos =
    selectedCategory === "전체"
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-500">
              투자 영상
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="새로고침"
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          <p className="text-lg text-gray-700">
            영상으로 배우는 실전 투자 노하우
          </p>
          {videos.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              총 {videos.length}개의 영상
            </p>
          )}
        </section>

        {/* Category Tabs */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Video Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.slug}
                title={video.title}
                thumbnailUrl={video.thumbnailUrl}
                views={video.views}
                duration={video.duration}
                href={video.href}
                category={video.category}
              />
            ))}
          </div>
        </section>

        {/* Top 10 Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">인기 영상 TOP 10</h2>
          <div className="space-y-4">
            {videos
              .sort((a, b) => b.views - a.views)
              .slice(0, 10)
              .map((video, index) => (
                <Card key={video.slug} hover className="p-4">
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
      </div>
    </div>
  );
}

