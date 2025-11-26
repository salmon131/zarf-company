"use client";

import { useState } from "react";
import ComicCard from "@/components/comic/ComicCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

// Note: Client components에서 metadata export는 지원되지 않으므로,
// 이 페이지는 layout.tsx의 기본 메타데이터를 사용합니다.
// 필요시 별도의 서버 컴포넌트로 래핑하거나, 동적 메타데이터는 다른 방식으로 처리해야 합니다.

export default function ComicPage() {
  // 작가 구인 폼 상태 관리
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
      const response = await fetch("/api/artist-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "신청 정보 저장에 실패했습니다.");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", portfolio: "", message: "" });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error: any) {
      console.error("신청 정보 저장 오류:", error);
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* 헤더 그라데이션 섹션 */}
      <div className="relative py-12 overflow-hidden">
        {/* 장식 요소 - 큰 원형 글로우 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60" data-aos="fade-in" data-aos-duration="2000" data-aos-delay="200"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 
              className="text-4xl md:text-5xl font-display font-bold mb-4 leading-[1.2] relative"
              data-aos="fade-up"
              data-aos-duration="600"
            >
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                만화 시리즈
              </span>
              {/* 텍스트 외곽선 효과로 가독성 향상 */}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                만화 시리즈
              </span>
            </h1>
            <p 
              className="text-lg text-gray-700"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              연재 및 기획 중인 만화 시리즈를 만나보세요
            </p>
          </section>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">

        {/* Series Section */}
        <section className="mb-16">
          <h2 
            className="text-2xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            시리즈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="600">
              <ComicCard
                title="이상한 녀석들의 주식투자 - 탱자프"
                description="만화로 쉽고 재미있게 배우는 주식 투자 이야기"
                href="/comic/tangzarf"
                tags={["실전", "만화"]}
                imageUrl="/images/comic/tangzarf/cover.jpg"
              />
            </div>
            <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="600">
              <ComicCard
                title="칩 인사이드"
                description="제작 예정"
                href="/comic/chipinside"
                tags={["제작 예정"]}
                imageUrl="/images/comic/chipinside/cover.jpg"
              />
            </div>
          </div>
        </section>

        {/* 작가 구인 Section */}
        <section>
          <Card 
            className="p-8 bg-brand-50"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                그림 작가를 모집합니다
              </h3>
              <p className="text-gray-700 mb-2 text-lg">
                만화 시리즈와 함께할 그림 작가를 찾고 있어요.
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
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
                  <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    지원서가 성공적으로 접수되었습니다! 빠른 시일 내에 연락드리겠습니다.
                  </p>
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl shadow-sm">
                  <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
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
        </section>
      </div>
    </div>
  );
}

