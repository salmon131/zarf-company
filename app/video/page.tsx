import { Metadata } from "next";
import { videoConfigs, CHANNEL_HANDLE } from "@/lib/video-data";
import { getMultipleYouTubeVideos, getChannelVideos, getChannelPlaylists } from "@/lib/youtube-api";
import VideoListClient from "./VideoListClient";

const categories = [
  "동영상",
  "Shorts",
  "재생목록",
];

export const metadata: Metadata = {
  title: "투자 영상",
  description: "탱자프 대표의 실전 투자 노하우와 최신 트렌드를 담은 투자 교육 영상. 주식투자, ETF, 투자 심리 등 다양한 주제의 영상을 만나보세요.",
  keywords: ["주식투자", "투자영상", "투자교육", "탱자프", "ETF", "투자심리"],
  openGraph: {
    title: "투자 영상 | 탱자프",
    description: "탱자프 대표의 실전 투자 노하우와 최신 트렌드를 담은 투자 교육 영상",
    url: "https://tangzarf.com/video",
    type: "website",
  },
  alternates: {
    canonical: "https://tangzarf.com/video",
  },
};

export default async function VideoPage() {
  let allVideos: Array<{
    slug: string;
    href: string;
    category: string;
    title: string;
    thumbnailUrl: string;
    views: number;
    duration: string;
    description: string;
    youtubeId: string;
    publishedAt?: string;
    isShort?: boolean;
  }> = [];

  // 1. 채널에서 모든 영상 가져오기 (자동)
  if (CHANNEL_HANDLE) {
    try {
      const channelVideos = await getChannelVideos(CHANNEL_HANDLE, 50);
      
      // 채널 영상을 slug 형식으로 변환 (영상 ID를 slug로 사용)
      const channelVideosWithSlug = channelVideos.map((video) => ({
        slug: video.id, // 영상 ID를 slug로 사용
        href: `/video/${video.id}`, // 동적 라우팅
        category: video.isShort ? "Shorts" : "동영상", // Shorts 여부에 따라 카테고리 설정
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        views: video.viewCount,
        duration: video.duration || "",
        description: video.description,
        youtubeId: video.id,
        publishedAt: video.publishedAt,
        isShort: video.isShort,
      }));

      allVideos = [...channelVideosWithSlug];
    } catch (error) {
      console.error("채널 영상 가져오기 실패:", error);
    }
  }

  // 2. 수동으로 추가한 영상들도 포함 (선택사항)
  if (videoConfigs.length > 0) {
    const videoIds = videoConfigs.map((config) => config.youtubeId);
    const youtubeVideos = await getMultipleYouTubeVideos(videoIds);

    const manualVideos = videoConfigs.map((config) => {
      const youtubeData = youtubeVideos.find((v) => v.id === config.youtubeId);

      return {
        slug: config.slug,
        href: `/video/${config.slug}`,
        category: youtubeData?.isShort ? "Shorts" : "동영상", // Shorts 여부에 따라 카테고리 설정
        title: youtubeData?.title || config.slug,
        thumbnailUrl: youtubeData?.thumbnailUrl || `https://img.youtube.com/vi/${config.youtubeId}/hqdefault.jpg`,
        views: youtubeData?.viewCount || 0,
        duration: youtubeData?.duration || "",
        description: youtubeData?.description || "",
        youtubeId: config.youtubeId,
        publishedAt: youtubeData?.publishedAt,
        isShort: youtubeData?.isShort,
      };
    });

    // 중복 제거 (같은 영상 ID가 있으면 수동 설정 우선)
    const existingIds = new Set(allVideos.map((v) => v.youtubeId));
    const newManualVideos = manualVideos.filter((v) => !existingIds.has(v.youtubeId));
    allVideos = [...allVideos, ...newManualVideos];
  }

  // 최신순으로 정렬 (발행일 기준)
  allVideos.sort((a, b) => {
    // 발행일 정보가 없으면 조회수로 정렬
    return b.views - a.views;
  });

  // 재생목록 정보 가져오기
  let playlists: Array<{
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    itemCount: number;
    publishedAt: string;
  }> = [];

  if (CHANNEL_HANDLE) {
    try {
      playlists = await getChannelPlaylists(CHANNEL_HANDLE, 50);
    } catch (error) {
      console.error("재생목록 가져오기 실패:", error);
    }
  }

  return <VideoListClient categories={categories} videos={allVideos} playlists={playlists} />;
}
