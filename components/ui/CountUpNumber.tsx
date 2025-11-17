"use client";

import { useState, useEffect, useRef } from "react";

interface CountUpNumberProps {
  target: number;
  duration?: number;
  className?: string;
}

export default function CountUpNumber({ 
  target, 
  duration = 2000,
  className = "" 
}: CountUpNumberProps) {
  const [count, setCount] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = 1;
    const endValue = target;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic 함수로 부드러운 애니메이션
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
        hasAnimated.current = true;
        // 애니메이션 완료 후 크기 원상복구
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    };

    // 지연 없이 즉시 시작
    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span 
      className={`${className} ${isAnimating ? 'animate-scale-bounce' : ''} inline-block transition-transform duration-300`}
    >
      {count}%
    </span>
  );
}

