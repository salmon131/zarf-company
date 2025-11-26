"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface StudyPromoSliderProps {
  images: string[];
  studyId: string;
  autoSlideInterval?: number;
}

export default function StudyPromoSlider({
  images,
  studyId,
  autoSlideInterval = 3000,
}: StudyPromoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  // 중앙 이미지가 전체 너비의 90%를 차지하고, 좌우 이미지가 각각 5%씩 보이도록
  const slideWidth = 90; // 중앙 이미지 너비 (%)

  return (
    <div className="relative w-full overflow-hidden" data-aos="fade-up">
      {/* 슬라이더 컨테이너 */}
      <div className="relative" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentIndex * slideWidth}%))`,
          }}
        >
          {images.map((image, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={`${studyId}-${index}`}
                className="flex-shrink-0 relative transition-all duration-500"
                style={{
                  width: `${slideWidth}%`,
                  transform: isActive ? 'scale(1)' : 'scale(0.9)',
                  opacity: isActive ? 1 : 0.5,
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div className="relative w-full flex items-center justify-center">
                  <div className="relative w-full" style={{ maxWidth: '100%' }}>
                    <Image
                      src={image}
                      alt={`${studyId} 홍보 이미지 ${index + 1}`}
                      width={1200}
                      height={800}
                      className="object-contain w-full h-auto"
                      priority={index === 0}
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 90vw"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-brand-500/90 hover:bg-brand-500 text-white rounded-full p-2 transition-all duration-200 z-20 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="이전 이미지"
          >
            <svg
              className="w-6 h-6"
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
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-500/90 hover:bg-brand-500 text-white rounded-full p-2 transition-all duration-200 z-20 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="다음 이미지"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white shadow-lg"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

