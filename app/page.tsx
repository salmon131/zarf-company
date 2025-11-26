import Link from "next/link";
import Button from "@/components/ui/Button";
import ComicCard from "@/components/comic/ComicCard";
import VideoCard from "@/components/video/VideoCard";
import SeminarCard from "@/components/cafe/SeminarCard";
import Card from "@/components/ui/Card";
import ChannelBanner from "@/components/home/ChannelBanner";
import CountUpNumber from "@/components/ui/CountUpNumber";
import { CHANNEL_HANDLE, videoConfigs } from "@/lib/video-data";
import { getChannelVideos, getMultipleYouTubeVideos } from "@/lib/youtube-api";

export default async function HomePage() {
  // 인기 영상 가져오기 (조회수 기준 상위 3개)
  let popularVideos: Array<{
    title: string;
    views: number;
    duration: string;
    href: string;
    category: string;
    thumbnailUrl?: string;
  }> = [];

  try {
    let allVideos: Array<{
      slug: string;
      youtubeId: string;
      title: string;
      views: number;
      duration: string;
      category: string;
      thumbnailUrl: string;
    }> = [];

    // 1. 채널에서 영상 가져오기
    if (CHANNEL_HANDLE) {
      const channelVideos = await getChannelVideos(CHANNEL_HANDLE, 50);
      const channelVideosWithData = channelVideos.map((video) => ({
        slug: video.id,
        youtubeId: video.id,
        title: video.title,
        views: video.viewCount,
        duration: video.duration || "",
        category: "전체",
        thumbnailUrl: video.thumbnailUrl,
      }));
      allVideos = [...channelVideosWithData];
    }

    // 2. 수동 추가 영상도 포함
    if (videoConfigs.length > 0) {
      const videoIds = videoConfigs.map((config) => config.youtubeId);
      const youtubeVideos = await getMultipleYouTubeVideos(videoIds);

      const manualVideos = videoConfigs.map((config) => {
        const youtubeData = youtubeVideos.find((v) => v.id === config.youtubeId);
        return {
          slug: config.slug,
          youtubeId: config.youtubeId,
          title: youtubeData?.title || config.slug,
          views: youtubeData?.viewCount || 0,
          duration: youtubeData?.duration || "",
          category: config.category,
          thumbnailUrl: youtubeData?.thumbnailUrl || `https://img.youtube.com/vi/${config.youtubeId}/hqdefault.jpg`,
        };
      });

      // 중복 제거
      const existingIds = new Set(allVideos.map((v) => v.youtubeId));
      const newManualVideos = manualVideos.filter((v) => !existingIds.has(v.youtubeId));
      allVideos = [...allVideos, ...newManualVideos];
    }

    // 조회수 기준으로 정렬하고 상위 3개 선택
    const sortedVideos = allVideos.sort((a, b) => b.views - a.views).slice(0, 3);

    popularVideos = sortedVideos.map((video) => ({
      title: video.title,
      views: video.views,
      duration: video.duration,
      href: `/video/${video.slug}`,
      category: video.category,
      thumbnailUrl: video.thumbnailUrl,
    }));
  } catch (error) {
    console.error("인기 영상 가져오기 실패:", error);
    // 에러 발생 시 기본값 사용
    popularVideos = [
      {
        title: "투자 입문자를 위한 첫걸음",
        views: 12500,
        duration: "10:30",
        href: "/video/investment-basics",
        category: "투자 입문",
      },
      {
        title: "ETF 투자 완벽 가이드",
        views: 8900,
        duration: "15:20",
        href: "/video/etf-guide",
        category: "ETF",
      },
      {
        title: "투자 심리 마스터하기",
        views: 15200,
        duration: "12:45",
        href: "/video/investment-psychology",
        category: "투자 심리",
      },
    ];
  }
  return (
    <main className="bg-[#FFF8F0] min-h-screen">
      {/* 배너 이미지 (헤더 바로 아래, 전체 너비) */}
      <div data-aos="fade-down">
        <ChannelBanner />
      </div>
      
      {/* Hero Section - 크림/베이지 톤 */}
      <section className="relative min-h-screen flex flex-col pt-16 md:pt-12 pb-32 md:pb-40 text-center overflow-hidden bg-[#FFF8F0]">
        {/* 장식 요소 - 큰 원형 글로우 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000" data-aos-delay="200"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col">
          <div className="max-w-7xl mx-auto flex-1 flex flex-col">
            {/* 브랜드 카피라이트 - 현대적인 웹 UI 스타일 */}
            <div className="mt-8 md:mt-12 mb-16 md:mb-20 relative" data-aos="fade-up">
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-[1.2] relative max-w-7xl mx-auto">
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                주식, 만화로 배우는 실전 투자전략
                </span>
                {/* 텍스트 외곽선 효과로 가독성 향상 */}
                <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                주식, 만화로 배우는 실전 투자전략
                </span>
        </h1>
        </div>

            {/* 설명 섹션 - 현대적인 간격과 레이아웃 */}
            <div className="max-w-3xl mx-auto mb-16 md:mb-20" data-aos="fade-up" data-aos-delay="100">
              <p className="text-lg md:text-xl text-gray-700 font-bold leading-relaxed">
                <span className="text-orange-600 animate-shimmer-glow">
                  <CountUpNumber target={218} duration={2000} className="inline text-orange-600" /> 이상의 수익률
                </span> 경험을 바탕으로,<br />
                어려운 경제와 주식 이야기를<br />
                <span className="text-brand-600 animate-shimmer-glow">만화와 스토리텔링</span>으로 풀어내는 재미있는 지식 채널
              </p>
            </div>
            {/* CTA 버튼 섹션 */}
            <div className="mt-12 md:mt-16 mb-8 md:mb-12 flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
              <Button 
                href="/comic"
                variant="primary" 
                size="lg" 
                className="!bg-gradient-to-r !from-brand-400 !to-brand-500 !rounded-2xl !px-8 !py-4 !shadow-xl hover:!shadow-2xl hover:!scale-105 transform transition-all duration-300 font-bold text-base tracking-wide border-0 overflow-hidden relative group"
              >
                <span className="relative z-10 flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  <span className="text-xl">📚</span>
                  <span>만화 보러가기</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                href="/video" 
                variant="primary" 
                size="lg" 
                className="!bg-gradient-to-r !from-brand-400 !to-brand-500 !rounded-2xl !px-8 !py-4 !shadow-xl hover:!shadow-2xl hover:!scale-105 transform transition-all duration-300 font-bold text-base tracking-wide border-0 overflow-hidden relative group"
              >
                <span className="relative z-10 flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  <span className="text-xl">🎬</span>
                  <span>영상 보러가기</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                href="/community/seminar" 
                variant="outline" 
                size="lg" 
                className="!bg-white/90 !backdrop-blur-sm !border-2 !border-brand-500 !text-brand-600 hover:!bg-brand-50 hover:!border-brand-600 !rounded-2xl !px-8 !py-4 !shadow-lg hover:!shadow-xl hover:!scale-105 transform transition-all duration-300 font-bold text-base tracking-wide"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">☕</span>
                  <span>세미나 보기</span>
                </span>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 투자철학 섹션 */}
      <section className="pt-20 md:pt-24 pb-20 md:pb-24 bg-[#FFF8F0] relative overflow-hidden">
        {/* 장식 요소 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000" data-aos-delay="200"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12" data-aos="fade-up">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
                탱자프의 투자철학
              </h2>
              <p className="text-sm md:text-base text-gray-700 font-semibold">데이터 기반 분석과 실전 경험이 만나 만들어낸 검증된 투자 전략</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 실적 카드 */}
            <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="800" data-aos-easing="ease-in-out">
              <Card className="bg-white/70 backdrop-blur-sm p-6 border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-600">25%</h3>
                    <p className="text-gray-700 font-semibold text-sm">연평균 수익률</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">최근 5년간의 검증된 실적</p>
              </Card>
            </div>

            {/* 분석 방식 카드 */}
            <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="800" data-aos-easing="ease-in-out">
              <Card className="bg-white/70 backdrop-blur-sm p-6 border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">퀀트 분석</h3>
                    <p className="text-gray-700 font-semibold text-sm">AI 기반</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Fwd EPS & RSI 모멘텀</p>
              </Card>
            </div>

            {/* 투자 스타일 카드 */}
            <div data-aos="fade-up" data-aos-delay="300" data-aos-duration="800" data-aos-easing="ease-in-out">
              <Card className="bg-white/70 backdrop-blur-sm p-6 border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">유연한 전략</h3>
                    <p className="text-gray-700 font-semibold text-sm">장기+단기</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">모멘텀 대응 매매</p>
              </Card>
            </div>
          </div>

          {/* 상세 설명 */}
          <Card className="bg-white/70 backdrop-blur-sm p-8 border-0 shadow-md hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="400">
              <div className="space-y-6">
                <div className="flex gap-4" data-aos="fade-right" data-aos-delay="500" data-aos-anchor-placement="top-bottom">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg" data-aos="zoom-in" data-aos-delay="550">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">AI 기반 데이터 분석</h4>
                    <p className="text-gray-800 leading-relaxed font-semibold">
                      구글, 나스닥, 인공지능, Seeking Alpha를 활용한 퀀트 분석으로 객관적이고 정확한 기업 평가
                    </p>
                  </div>
                </div>

                <div className="flex gap-4" data-aos="fade-right" data-aos-delay="600" data-aos-anchor-placement="top-bottom">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg" data-aos="zoom-in" data-aos-delay="650">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">핵심 지표 중심 판단</h4>
                    <p className="text-gray-800 leading-relaxed font-semibold">
                      <span className="font-bold text-brand-600">Fwd EPS(미래 주당순이익)</span>를 가장 중시하며, <span className="font-bold text-brand-600">RSI 모멘텀</span>으로 매매 타이밍 포착
                    </p>
                  </div>
                </div>

                <div className="flex gap-4" data-aos="fade-right" data-aos-delay="700" data-aos-anchor-placement="top-bottom">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg" data-aos="zoom-in" data-aos-delay="750">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">장기투자와 유연성의 조화</h4>
                    <p className="text-gray-800 leading-relaxed font-semibold">
                      장기투자를 기본으로 하되, 시장 모멘텀에 따라 <span className="font-bold">분할 매수/매도</span>로 리스크를 관리하고 수익을 극대화
                    </p>
                  </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200" data-aos="fade-up" data-aos-delay="800" data-aos-anchor-placement="top-bottom">
              <div className="bg-gradient-to-r from-brand-50 to-orange-50 border-l-4 border-brand-500 rounded-lg p-6" data-aos="fade-in" data-aos-delay="850">
                <svg className="w-10 h-10 text-brand-400 mb-3" fill="currentColor" viewBox="0 0 24 24" data-aos="zoom-in" data-aos-delay="900">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed font-semibold mb-4">
                  같은 주식을 사도 <span className="font-bold text-brand-600">알고(공부) 사는 것</span>과 <span className="font-bold text-brand-600">모르고 사는 것</span>은 주식의 등락시 <span className="font-bold text-brand-600">'대응'</span>에서 차이가 난다
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Video Highlight Section - 크림/베이지 톤 */}
      <section className="pt-12 md:pt-16 pb-20 md:pb-24 bg-[#FFF8F0] relative overflow-hidden">
        {/* 장식 요소 */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50" data-aos="fade-in" data-aos-duration="2000" data-aos-delay="200"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12" data-aos="fade-up">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
              인기 영상
            </h2>
              <p className="text-sm md:text-base text-gray-700 font-semibold">지금 가장 많이 본 영상들</p>
            </div>
            <Link
              href="/video"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              data-aos="fade-left"
            >
              전체 영상 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularVideos.map((video, index) => (
              <div key={index} className="group" data-aos="fade-up" data-aos-delay={index * 100}>
            <VideoCard
                  title={video.title}
                  views={video.views}
                  duration={video.duration}
                  href={video.href}
                  category={video.category}
                  thumbnailUrl={video.thumbnailUrl}
            />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Café & Community Combined Section - 크림/베이지 톤 */}
      <section className="pt-20 md:pt-24 pb-20 md:pb-24 bg-[#FFF8F0] relative overflow-hidden">
        {/* 장식 요소 - 통합된 글로우 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000" data-aos-delay="200"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* 카페 & 세미나 섹션 */}
          <div className="mb-28 md:mb-32">
            <div className="flex items-center justify-between mb-12" data-aos="fade-up">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
              카페 & 세미나
            </h2>
                <p className="text-sm md:text-base text-gray-700 font-semibold">오프라인에서 만나는 투자 커뮤니티</p>
              </div>
            <Link
            href="/community/seminar"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                data-aos="fade-left"
            >
                세미나 일정 보기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-aos="fade-right" data-aos-delay="100" data-aos-duration="800" data-aos-easing="ease-in-out">
                <Card className="p-8 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-2xl transition-all duration-300">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-orange-400 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        🏠
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        투자자들의 아지트
                      </h3>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-base md:text-lg font-semibold">
                      '카페탱'에서 만나는 투자 커뮤니티. 오프라인 세미나와
                      스터디를 통해 실전 투자 감각을 키워보세요.
                    </p>
                    <Button href="/cafe" variant="primary" className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                      카페 소개 보기
                    </Button>
                  </div>
                </Card>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="transform hover:-translate-y-2 transition-all duration-300" data-aos="fade-left" data-aos-delay="100">
              <SeminarCard
                title="주식 투자 입문 세미나"
                date="2024.12.15"
                instructor="김투자"
                description="처음 시작하는 주식 투자자를 위한 기초 강의"
                href="/community/seminar/stock-basics"
                price="무료"
              />
                </div>
                <div className="transform hover:-translate-y-2 transition-all duration-300" data-aos="fade-left" data-aos-delay="200">
              <SeminarCard
                title="ETF 투자 전략"
                date="2024.12.22"
                instructor="이ETF"
                description="ETF를 활용한 안정적인 투자 전략"
                href="/community/seminar/etf-strategy"
                price="30,000원"
              />
            </div>
          </div>
        </div>
          </div>

      {/* Community Section */}
          <div className="mt-28 md:mt-32">
            <div className="flex items-center justify-between mb-12" data-aos="fade-up">
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
            투자 스터디 & 커뮤니티
          </h2>
                <p className="text-sm md:text-base text-gray-700 font-semibold">함께 배우고 성장하는 투자 커뮤니티</p>
              </div>
              <Link
                href="/community"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                data-aos="fade-left"
              >
                커뮤니티 보기
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <p className="text-base md:text-lg text-gray-800 mb-8 max-w-3xl leading-relaxed font-semibold" data-aos="fade-up" data-aos-delay="100">
            함께 배우고 성장하는 투자 커뮤니티에 참여해보세요. 온라인과
            오프라인에서 만나는 다양한 스터디와 이벤트를 만나보실 수 있습니다.
          </p>
            <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="200">
              <Button 
                href="/community" 
                variant="primary" 
                size="lg"
                className="shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-brand-500 to-orange-500"
              >
              커뮤니티 참여하기
            </Button>
              <Button 
                href="/community/gallery" 
                variant="outline" 
                size="lg"
                className="shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-2"
              >
              갤러리 보기
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comic Highlight Section - 크림/베이지 톤 */}
      <section className="pt-20 md:pt-24 pb-20 md:pb-24 bg-[#FFF8F0] relative overflow-hidden">
        {/* 장식 요소 */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12" data-aos="fade-up">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
                만화 세계관
              </h2>
              <p className="text-sm md:text-base text-gray-700 font-semibold">재미있고 유익한 만화 콘텐츠로 만나는 새로운 경험</p>
            </div>
            <Link
              href="/comic"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              data-aos="fade-left"
            >
              만화 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Card className="p-8 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300" data-aos="zoom-in" data-aos-delay="150">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" data-aos="fade-up" data-aos-delay="120">
                만화 시리즈
              </h3>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed font-semibold" data-aos="fade-up" data-aos-delay="140">
                탱자프 컴퍼니의 다양한 만화 시리즈를 만나보세요. 
              </p>
              <Link
                href="/comic"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm group-hover:gap-3 transition-all"
                data-aos="fade-up" data-aos-delay="160"
              >
                시리즈 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Card>
            <Card className="p-8 group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300" data-aos="zoom-in" data-aos-delay="250">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" data-aos="fade-up" data-aos-delay="220">
                작가 모집
              </h3>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed font-semibold" data-aos="fade-up" data-aos-delay="240">
                탱자프 컴퍼니와 함께 성장할 만화 작가를 모집하고 있습니다. 
              </p>
              <Link
                href="/comic"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold text-sm group-hover:gap-3 transition-all"
                data-aos="fade-up" data-aos-delay="260"
              >
                지원하기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
