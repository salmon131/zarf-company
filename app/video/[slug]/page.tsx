import { notFound } from "next/navigation";
import Link from "next/link";
import YouTubePlayer from "@/components/video/YouTubePlayer";
import { videoData, videoConfigs } from "@/lib/video-data";
import { getYouTubeVideoInfo } from "@/lib/youtube-api";

interface VideoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VideoDetailPage({
  params,
}: VideoDetailPageProps) {
  const { slug } = await params;
  
  // slug가 videoData에 있는지 확인 (수동 설정된 영상)
  let youtubeId = videoData[slug];
  const config = videoConfigs.find((c) => c.slug === slug);

  // slug가 videoData에 없으면 slug 자체가 YouTube ID일 수 있음 (채널에서 가져온 영상)
  if (!youtubeId) {
    // YouTube 영상 ID 형식인지 확인 (11자리 영숫자)
    if (/^[a-zA-Z0-9_-]{11}$/.test(slug)) {
      youtubeId = slug;
    } else {
      notFound();
    }
  }

  // YouTube API에서 영상 정보 가져오기
  const videoInfo = await getYouTubeVideoInfo(youtubeId);

  if (!videoInfo) {
    notFound();
  }

  // API에서 가져온 데이터 사용
  const title = videoInfo.title;
  const viewCount = videoInfo.viewCount;
  const duration = videoInfo.duration || "";
  const description = videoInfo.description;
  const category = config?.category || "전체";

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/video"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-500 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          영상 목록으로
        </Link>

        {/* 영상 제목 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        {/* 영상 정보 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full">
            {category}
          </span>
          {viewCount > 0 && <span>조회수 {viewCount.toLocaleString()}</span>}
          {duration && <span>{duration}</span>}
        </div>

        {/* 유튜브 플레이어 */}
        <div className="mb-8">
          <YouTubePlayer videoId={youtubeId} title={title} />
        </div>

        {/* 설명 섹션 */}
        {description && (
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">영상 설명</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {description}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

