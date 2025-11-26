"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import EventCard from "@/components/community/EventCard";
import StudyCard from "@/components/community/StudyCard";
import StudyPromoSlider from "@/components/community/StudyPromoSlider";
import SeminarCard from "@/components/cafe/SeminarCard";
import Card from "@/components/ui/Card";

export default function CommunityPage() {
  const [showStudyForm, setShowStudyForm] = useState(false);
  const [studyFormData, setStudyFormData] = useState({
    studyType: "",
    phone: "",
    preferredTime: "",
    ageRange: "",
    desiredContent: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleStudyInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudyFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/send-study-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyType: studyFormData.studyType,
          phone: studyFormData.phone,
          preferredTime: studyFormData.preferredTime,
          ageRange: studyFormData.ageRange,
          desiredContent: studyFormData.desiredContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "신청 정보 저장에 실패했습니다.");
      }

      setSubmitStatus("success");
      setStudyFormData({ studyType: "", phone: "", preferredTime: "", ageRange: "", desiredContent: "" });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setShowStudyForm(false);
        setSubmitStatus("idle");
      }, 2000);
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
                투자 스터디 & 세미나
              </span>
              {/* 텍스트 외곽선 효과로 가독성 향상 */}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                투자 스터디 & 세미나
              </span>
            </h1>
            <p 
              className="text-lg text-gray-700"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              자프에게 전수받는 실전 투자 노하우
            </p>
          </section>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">

        {/* Study Recruitment Section */}
        <section className="mb-16">
          <div 
            className="flex items-center justify-between mb-6" 
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">오프라인 스터디</h2>
              <p className="text-gray-600">카페탱에서 함께 공부하고 성장하는 오프라인 스터디</p>
            </div>
          </div>
          
          {/* 주식 스터디 홍보 슬라이더 */}
          <div 
            className="mb-8 w-full" 
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="600"
          >
            <StudyPromoSlider
              studyId="stock-study-2025"
              images={[
                "/images/community/studies/stock-study-2025/1.jpg",
                "/images/community/studies/stock-study-2025/2.jpg",
                "/images/community/studies/stock-study-2025/3.jpg",
                "/images/community/studies/stock-study-2025/4.jpg",
                "/images/community/studies/stock-study-2025/5.jpg",
                "/images/community/studies/stock-study-2025/6.jpg",
              ]}
              autoSlideInterval={3000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div 
              data-aos="fade-up"
              data-aos-delay="150"
              data-aos-duration="600"
            >
              <StudyCard
                title="커피와 함께 듣는 주식 이야기"
                topic="기초 투자"
                deadline="2025.12.30"
                capacity="최소 3명"
                description="퀀트(계량)&모멘텀 기반으로 주식을 공부해요. 편안한 카페에서 함께 배워요"
                status="recruiting"
              />
            </div>
            <div 
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="600"
            >
              <StudyCard
                title="주린이 탈출 프로젝트"
                topic="기초 투자"
                capacity="3명"
                description="사회초년생을 위한 투자 기초부터 실전까지 함께 배우는 스터디입니다"
                status="ongoing"
              />
            </div>
          </div>
        </section>

        {/* Seminar Section */}
        <section className="mb-16">
          <div 
            className="flex items-center justify-between mb-6"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">세미나 일정</h2>
              <p className="text-gray-600">다양한 투자 주제의 세미나를 만나보세요</p>
            </div>
            <Link
              href="/community/seminar"
              className="text-brand-500 hover:text-brand-600 font-medium"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              <SeminarCard
                title="✨ 퀀트로 마무리하는 한 해"
                date="2024.12.26 (저녁 7시~10시)"
                description="25년 정리 및 내년 주식전망과 대응, 26년 투자 이슈를 다루는 퀀트 투자자의 송년 모임입니다. 자유로운 다과의 시간도 함께 즐겨요"
                href="/community/seminar/quant-year-end"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card 
            className="p-8 bg-brand-50"
            data-aos="zoom-in"
            data-aos-duration="800"
            data-aos-easing="ease-out"
            data-aos-offset="200"
          >
            <div 
              className="mb-6"
              data-aos="fade-down"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h3 
              className="text-2xl font-bold text-gray-900 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="600"
            >
              혼자서 어렵게 헤매던 주식 공부는 이제 그만!
            </h3>
            <div className="text-gray-700 mb-6 space-y-3">
              <p 
                className="text-lg"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="600"
              >
                따뜻한 커피 한 잔처럼 편안하게,<br />
                내 것으로 만드는 확실한 실력을 경험하세요
              </p>
              <p 
                className="font-semibold text-brand-600"
                data-aos="fade-up"
                data-aos-delay="400"
                data-aos-duration="600"
              >
                2026 새해엔 함께 성장하는 투자자로 시작해요
              </p>
              <p 
                className="text-brand-600 font-bold"
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-duration="600"
              >
                망설이지 마시고 지금 바로 문의하세요
              </p>
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="600"
              data-aos-duration="600"
            >
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => setShowStudyForm(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                스터디 신청하기
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* 스터디 신청 모달 */}
      {showStudyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative bg-gradient-to-br from-[#FFF8F0] to-white border-brand-200 shadow-2xl">
            <button
              onClick={() => {
                setShowStudyForm(false);
                setStudyFormData({ studyType: "", phone: "", preferredTime: "", ageRange: "", desiredContent: "" });
                setSubmitStatus("idle");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-brand-600 transition-colors hover:bg-brand-50 rounded-full p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent mb-2">
                스터디 신청
              </h2>
              <p className="text-gray-600 text-sm">함께 성장할 스터디에 참여해보세요</p>
            </div>
            
            <form onSubmit={handleStudySubmit} className="space-y-6">
              {/* 스터디 유형 선택 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  스터디 유형 <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all shadow-sm ${
                    studyFormData.studyType === "주중반" 
                      ? "border-brand-500 bg-gradient-to-br from-brand-50 to-brand-100/50 shadow-md ring-2 ring-brand-200" 
                      : "border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-md"
                  }`}>
                    <input
                      type="radio"
                      name="studyType"
                      value="주중반"
                      checked={studyFormData.studyType === "주중반"}
                      onChange={handleStudyInputChange}
                      required
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${
                        studyFormData.studyType === "주중반" ? "text-brand-700" : "text-gray-900"
                      }`}>주중반</div>
                      <div className={`text-sm ${
                        studyFormData.studyType === "주중반" ? "text-brand-600" : "text-gray-600"
                      }`}>평일 오후/저녁</div>
                    </div>
                    {studyFormData.studyType === "주중반" && (
                      <div className="absolute top-3 right-3 bg-brand-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                  <label className={`relative flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all shadow-sm ${
                    studyFormData.studyType === "주말반" 
                      ? "border-brand-500 bg-gradient-to-br from-brand-50 to-brand-100/50 shadow-md ring-2 ring-brand-200" 
                      : "border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-md"
                  }`}>
                    <input
                      type="radio"
                      name="studyType"
                      value="주말반"
                      checked={studyFormData.studyType === "주말반"}
                      onChange={handleStudyInputChange}
                      required
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`text-lg font-bold mb-1 ${
                        studyFormData.studyType === "주말반" ? "text-brand-700" : "text-gray-900"
                      }`}>주말반</div>
                      <div className={`text-sm ${
                        studyFormData.studyType === "주말반" ? "text-brand-600" : "text-gray-600"
                      }`}>토요일/일요일</div>
                    </div>
                    {studyFormData.studyType === "주말반" && (
                      <div className="absolute top-3 right-3 bg-brand-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label htmlFor="study-phone" className="block text-sm font-semibold text-gray-800 mb-2">
                  전화번호 <span className="text-brand-600">*</span>
                </label>
                <input
                  type="tel"
                  id="study-phone"
                  name="phone"
                  value={studyFormData.phone}
                  onChange={handleStudyInputChange}
                  required
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* 희망 시간 */}
              <div>
                <label htmlFor="study-time" className="block text-sm font-semibold text-gray-800 mb-2">
                  희망 시간 <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  id="study-time"
                  name="preferredTime"
                  value={studyFormData.preferredTime}
                  onChange={handleStudyInputChange}
                  required
                  placeholder="예: 평일 저녁 7시, 주말 오후 2시 등"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* 나이대 */}
              <div>
                <label htmlFor="study-age" className="block text-sm font-semibold text-gray-800 mb-2">
                  나이대 <span className="text-brand-600">*</span>
                </label>
                <select
                  id="study-age"
                  name="ageRange"
                  value={studyFormData.ageRange}
                  onChange={handleStudyInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all text-gray-900"
                >
                  <option value="" className="text-gray-400">선택해주세요</option>
                  <option value="20대 초반">20대 초반</option>
                  <option value="20대 중반">20대 중반</option>
                  <option value="20대 후반">20대 후반</option>
                  <option value="30대 초반">30대 초반</option>
                  <option value="30대 중반">30대 중반</option>
                  <option value="30대 후반">30대 후반</option>
                  <option value="40대 이상">40대 이상</option>
                </select>
              </div>

              {/* 원하는 수업 내용 */}
              <div>
                <label htmlFor="study-content" className="block text-sm font-semibold text-gray-800 mb-2">
                  원하는 수업 내용
                </label>
                <textarea
                  id="study-content"
                  name="desiredContent"
                  value={studyFormData.desiredContent}
                  onChange={handleStudyInputChange}
                  rows={4}
                  placeholder="어떤 내용을 배우고 싶으신지 자유롭게 작성해주세요"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all resize-none placeholder:text-gray-400"
                />
              </div>

              {/* 성공/에러 메시지 */}
              {submitStatus === "success" && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
                  <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    신청서가 성공적으로 전송되었습니다! 빠른 시일 내에 연락드리겠습니다.
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

              {/* 버튼 */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowStudyForm(false);
                    setStudyFormData({ studyType: "", phone: "", preferredTime: "", ageRange: "", desiredContent: "" });
                    setSubmitStatus("idle");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "전송 중..." : "신청하기"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

