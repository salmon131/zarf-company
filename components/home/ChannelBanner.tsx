"use client";

import Image from "next/image";
import { useState } from "react";

export default function ChannelBanner() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return null;
  }

  return (
    <div className="w-full h-48 md:h-64 lg:h-80 relative">
      <Image
        src="/images/channel-banner.jpg"
        alt="탱자프 채널 배너"
        fill
        className="object-cover"
        priority
        unoptimized
        onError={() => setImageError(true)}
      />
      {/* 하단 그라데이션 오버레이 - 아래 섹션과 자연스럽게 블렌드 */}
      <div className="absolute bottom-0 left-0 right-0 h-10 md:h-10 bg-gradient-to-b from-transparent to-[#FFF8F0] pointer-events-none"></div>
    </div>
  );
}

