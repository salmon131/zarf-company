"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface CafeImageSliderProps {
  images: string[];
  autoSlideInterval?: number;
}

export default function CafeImageSlider({
  images,
  autoSlideInterval = 3000,
}: CafeImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4); // 한 번에 보이는 이미지 개수

  useEffect(() => {
    // 반응형으로 보이는 이미지 개수 조정
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2); // 모바일: 2개
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3); // 태블릿: 3개
      } else {
        setVisibleCount(4); // 데스크톱: 4개
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    if (images.length <= visibleCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = images.length - visibleCount;
        return (prev + 1) % (maxIndex + 1);
      });
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, visibleCount, autoSlideInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const maxIndex = images.length - visibleCount;
      return prev === 0 ? maxIndex : prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = images.length - visibleCount;
      return prev === maxIndex ? 0 : prev + 1;
    });
  };

  if (images.length === 0) {
    return null;
  }

  const slideWidth = 100 / visibleCount; // 각 이미지의 너비 (%)

  return (
    <div className="relative w-full overflow-hidden mb-8" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
      {/* 슬라이더 컨테이너 */}
      <div className="relative w-full px-12">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * slideWidth}%)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 relative group"
                style={{ width: `${slideWidth}%`, padding: '0 8px' }}
              >
                <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105" style={{ aspectRatio: '4 / 3' }}>
                  <Image
                    src={image}
                    alt={`카페 사진 ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index < visibleCount}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      {images.length > visibleCount && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-brand-500/90 hover:bg-brand-500 text-white rounded-full p-2 transition-all duration-200 z-20 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="이전 이미지"
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
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-brand-500/90 hover:bg-brand-500 text-white rounded-full p-2 transition-all duration-200 z-20 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="다음 이미지"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

