"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CafeCard from "@/components/cafe/CafeCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MeetingRoomCalendar from "@/components/cafe/MeetingRoomCalendar";

export default function CafePage() {
  const [showRentalInquiry, setShowRentalInquiry] = useState(false);
  const [rentalFormData, setRentalFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    date: "",
    time: "",
    message: "",
  });

  const handleRentalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRentalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isSubmittingRental, setIsSubmittingRental] = useState(false);
  const [rentalSubmitStatus, setRentalSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleRentalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingRental(true);
    setRentalSubmitStatus("idle");

    try {
      const response = await fetch("/api/rental-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rentalFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "문의 정보 저장에 실패했습니다.");
      }

      setRentalSubmitStatus("success");
      setRentalFormData({ name: "", email: "", phone: "", purpose: "", date: "", time: "", message: "" });
      setIsSubmittingRental(false);
      
      setTimeout(() => {
        setShowRentalInquiry(false);
        setRentalSubmitStatus("idle");
      }, 2000);
    } catch (error: any) {
      console.error("문의 정보 저장 오류:", error);
      setRentalSubmitStatus("error");
      setIsSubmittingRental(false);
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
                카공 & 만화 카페
              </span>
              {/* 텍스트 외곽선 효과로 가독성 향상 */}
              <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-orange-500 bg-clip-text text-transparent blur-sm opacity-20 -z-10">
                카페탱
              </span>
            </h1>
            <p 
              className="text-lg text-gray-700"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="600"
            >
              편하게 쉬고, 작업하고, 공부할 수 있는 공간
            </p>
          </section>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">

        {/* About Section */}
        <section className="mb-16">
          <div data-aos="fade-up" data-aos-duration="600">
            <CafeCard
            title="카페탱"
            description="탱자프 사무실 바깥 공간에 마련한 카페입니다. 편하게 쉬고, 작업하고, 공부할 수 있도록 만들어진 공간입니다. 적지 않은 종류의 만화책과 유익한 책들도 준비되어있습니다. 회의실은 무료이며 2시간 이내, 3인 이상(과외, 스터디 등) 모임에 한해 사용할 수 있습니다."
            address="서울 강동구 고덕로 97(암사동 447-24) 2층 카페탱"
            hours="매일 09:00 - 01:00"
            phone="010-4026-7291"
          />
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="mb-16">
          <div 
            className="flex flex-wrap items-center gap-3 mb-6"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            {["공부", "만화", "회의실", "무인카페", "하루종일", "자유롭게"].map((tag, index) => (
              <span
                key={index}
                className="text-gray-700 hover:text-brand-600 transition-all duration-300 font-bold text-base md:text-lg px-3 py-2 rounded-lg hover:bg-brand-50/50 relative group cursor-default"
              >
                #{tag}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card 
                key={i} 
                className="p-0 overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 50}
                data-aos-duration="600"
              >
                <div className="bg-gray-100 relative overflow-hidden" style={{ aspectRatio: '16 / 13.5' }}>
                  <Image
                    src={`/images/cafe/cafe-${i}.jpg`}
                    alt={`카페 사진 ${i}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Meeting Room Section */}
        <section className="mb-16">
          <div 
            className="text-center mb-8"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              회의실 사용 시간표
            </h2>
            <p className="text-gray-700 text-lg">
              무료로 회의실을 예약하고 사용할 수 있어요
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100" data-aos-duration="600">
            <MeetingRoomCalendar />
          </div>
        </section>

        {/* Rental Inquiry Section */}
        <section className="mb-16">
          <Card 
            className="p-8 bg-brand-50"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                대관 문의
              </h3>
              <p className="text-gray-700 mb-6">
                카페 공간을 대관하고 싶으시다면 문의해주세요
              </p>
              {!showRentalInquiry ? (
                <Button
                  onClick={() => setShowRentalInquiry(true)}
                  variant="primary"
                  size="lg"
                >
                  대관 문의하기
                </Button>
              ) : (
                <form onSubmit={handleRentalSubmit} className="max-w-2xl mx-auto space-y-4">
                  <div>
                    <label htmlFor="rental-name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="rental-name"
                      name="name"
                      value={rentalFormData.name}
                      onChange={handleRentalInputChange}
                      required
                      placeholder="이름을 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rental-email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="rental-email"
                      name="email"
                      value={rentalFormData.email}
                      onChange={handleRentalInputChange}
                      required
                      placeholder="이메일 주소를 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rental-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="rental-phone"
                      name="phone"
                      value={rentalFormData.phone}
                      onChange={handleRentalInputChange}
                      required
                      placeholder="연락 가능한 전화번호를 입력해주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="rental-purpose" className="block text-sm font-medium text-gray-700 mb-2">
                      대관 목적 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="rental-purpose"
                      name="purpose"
                      value={rentalFormData.purpose}
                      onChange={handleRentalInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">선택해주세요</option>
                      <option value="스터디">스터디</option>
                      <option value="모임">모임</option>
                      <option value="행사">행사</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rental-date" className="block text-sm font-medium text-gray-700 mb-2">
                        희망 날짜 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="rental-date"
                        name="date"
                        value={rentalFormData.date}
                        onChange={handleRentalInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="rental-time" className="block text-sm font-medium text-gray-700 mb-2">
                        희망 시간 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="rental-time"
                        name="time"
                        value={rentalFormData.time}
                        onChange={handleRentalInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="rental-message" className="block text-sm font-medium text-gray-700 mb-2">
                      문의 내용
                    </label>
                    <textarea
                      id="rental-message"
                      name="message"
                      value={rentalFormData.message}
                      onChange={handleRentalInputChange}
                      rows={4}
                      placeholder="대관에 대한 자세한 내용을 남겨주세요"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>
                  
                  {/* 성공/에러 메시지 */}
                  {rentalSubmitStatus === "success" && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
                      <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        문의가 성공적으로 접수되었습니다! 빠른 시일 내에 연락드리겠습니다.
                      </p>
                    </div>
                  )}
                  
                  {rentalSubmitStatus === "error" && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl shadow-sm">
                      <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        오류가 발생했습니다. 다시 시도해주세요.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowRentalInquiry(false);
                        setRentalFormData({ name: "", email: "", phone: "", purpose: "", date: "", time: "", message: "" });
                        setRentalSubmitStatus("idle");
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
                      disabled={isSubmittingRental}
                    >
                      {isSubmittingRental ? "전송 중..." : "문의하기"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </section>

        {/* 오시는 길 Section */}
        <section className="mb-16">
          <div 
            className="text-center mb-8"
            data-aos="fade-up"
            data-aos-duration="600"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              오시는 길
            </h2>
            <p className="text-gray-700 text-lg mb-6">
              서울 강동구 고덕로 97(암사동 447-24) 2층 카페탱
            </p>
          </div>
          <Card 
            className="p-0 overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="600"
          >
            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://naver.me/FhfREQzF"
                width="100%"
                height="500"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                className="w-full"
                title="네이버 지도"
              ></iframe>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

