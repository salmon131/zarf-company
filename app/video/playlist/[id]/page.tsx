import { notFound } from "next/navigation";
import Link from "next/link";
import VideoCard from "@/components/video/VideoCard";
import { getPlaylistInfo, getPlaylistVideos } from "@/lib/youtube-api";

interface PlaylistDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaylistDetailPage({
  params,
}: PlaylistDetailPageProps) {
  const { id } = await params;

  // 재생목록 정보 가져오기
  const playlistInfo = await getPlaylistInfo(id);

  if (!playlistInfo) {
    notFound();
  }

  // 재생목록의 영상 목록 가져오기
  const videos = await getPlaylistVideos(id, 50);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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

        {/* 재생목록 헤더 */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-96 aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {playlistInfo.thumbnailUrl ? (
                <img
                  src={playlistInfo.thumbnailUrl}
                  alt={playlistInfo.title}
                  className="w-full h-full object-cover"
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
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                {playlistInfo.title}
              </h1>
              {playlistInfo.description && (
                <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                  {playlistInfo.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  동영상 {playlistInfo.itemCount}개
                </span>
                <span>
                  {new Date(playlistInfo.publishedAt).toLocaleDateString("ko-KR")} 생성
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 영상 목록 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            재생목록 영상
          </h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  views={video.viewCount}
                  duration={video.duration}
                  href={`/video/${video.id}`}
                  category={video.isShort ? "Shorts" : "동영상"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>재생목록에 영상이 없습니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

