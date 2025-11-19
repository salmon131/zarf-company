"use client";

import { use, useMemo, useState } from "react";
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
      comingSoon?: boolean;
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
    chipinside: {
      title: "칩 인사이드",
      description: "제작 예정",
      author: "제작 예정",
      genre: ["제작 예정"],
      coverImage: "/images/comic/chipinside/cover.jpg",
      synopsis: "곧 만나볼 수 있는 새로운 만화 시리즈입니다. 조금만 기다려주세요!",
      comingSoon: true,
    },
  };

  const info = seriesInfo[seriesName];

  // 작가 구인 폼 상태 관리 (칩 인사이드 전용)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: 실제 API 엔드포인트로 변경 필요
      // 현재는 mailto 링크로 대체
      const seriesTitle = seriesName === "chipinside" ? "칩 인사이드" : "만화";
      const subject = encodeURIComponent(`[${seriesTitle} 작가 지원] ${formData.name}님의 지원서`);
      const body = encodeURIComponent(
        `이름: ${formData.name}\n이메일: ${formData.email}\n연락처: ${formData.phone}\n포트폴리오: ${formData.portfolio || "없음"}\n\n메시지:\n${formData.message}`
      );
      window.location.href = `mailto:qk006@naver.com?subject=${subject}&body=${body}`;
      
      // 성공 메시지 표시
      setTimeout(() => {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", portfolio: "", message: "" });
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  };

  // 제작 예정 시리즈인 경우
  if (info?.comingSoon) {
    return (
      <div className="min-h-screen bg-white">
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-b from-brand-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
              {/* 커버 이미지 영역 */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-lg overflow-hidden shadow-lg">
                  {info.coverImage ? (
                    <Image
                      src={info.coverImage}
                      alt={info.title}
                      fill
                      className="object-cover object-[center_100%]"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400 text-center px-4">
                        <div className="text-4xl mb-2">📖</div>
                        <div className="text-sm">이미지 준비 중</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 시리즈 정보 */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-[1.2] relative">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    {info.title}
                  </span>
                  {/* 텍스트 외곽선 효과로 가독성 향상 */}
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                    {info.title}
                  </span>
                </h1>

                {/* 작가 정보 */}
                <div className="mb-4">
                  <p className="text-gray-600">{info.author}</p>
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
              </div>
            </div>
          </div>
        </div>

        {/* 작가 구인 섹션 */}
        {seriesName === "chipinside" ? (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-brand-50">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎨</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    그림 작가를 모집합니다
                  </h2>
                  <p className="text-gray-700 mb-2 text-lg">
                    칩 인사이드 시리즈와 함께할 그림 작가를 찾고 있어요.
                  </p>
                  <p className="text-gray-600 text-base">
                    관심 있으신 분들의 많은 지원 부탁드립니다!
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="이름을 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="이메일 주소를 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="연락 가능한 전화번호를 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-2">
                      포트폴리오 링크 (선택)
                    </label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="포트폴리오 링크를 입력해주세요 (선택사항)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      간단한 자기소개 또는 메시지
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="간단한 자기소개나 궁금한 점을 남겨주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>
                  
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        지원서가 전송되었습니다! 이메일 앱이 열리면 전송 버튼을 눌러주세요.
                      </p>
                    </div>
                  )}
                  
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">
                        오류가 발생했습니다. 다시 시도해주세요.
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "전송 중..." : "지원하기"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-brand-50">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎨</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    그림 작가를 모집합니다
                  </h2>
                  <p className="text-gray-700 mb-2 text-lg">
                    만화 시리즈와 함께할 그림 작가를 찾고 있어요.
                  </p>
                  <p className="text-gray-600 text-base">
                    관심 있으신 분들의 많은 지원 부탁드립니다!
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                  <div>
                    <label htmlFor="name-other" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name-other"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="이름을 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email-other" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email-other"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="이메일 주소를 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone-other" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone-other"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="연락 가능한 전화번호를 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="portfolio-other" className="block text-sm font-medium text-gray-700 mb-2">
                      포트폴리오 링크 (선택)
                    </label>
                    <input
                      type="url"
                      id="portfolio-other"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="포트폴리오 링크를 입력해주세요 (선택사항)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message-other" className="block text-sm font-medium text-gray-700 mb-2">
                      간단한 자기소개 또는 메시지
                    </label>
                    <textarea
                      id="message-other"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="간단한 자기소개나 궁금한 점을 남겨주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>
                  
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        지원서가 전송되었습니다! 이메일 앱이 열리면 전송 버튼을 눌러주세요.
                      </p>
                    </div>
                  )}
                  
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">
                        오류가 발생했습니다. 다시 시도해주세요.
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "전송 중..." : "지원하기"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }

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
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-[1.2] relative">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    {info.title}
                  </span>
                  {/* 텍스트 외곽선 효과로 가독성 향상 */}
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                    {info.title}
                  </span>
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
