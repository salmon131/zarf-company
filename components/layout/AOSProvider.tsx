"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider() {
  useEffect(() => {
    // 브라우저에서만 실행되도록 확인
    if (typeof window === "undefined") return;

    // AOS 초기화
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
      disable: false,
      startEvent: "DOMContentLoaded",
      delay: 0,
    });

    // 약간의 지연 후 refresh하여 모든 요소가 렌더링된 후 적용
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);

    // 페이지 로드 후 refresh
    const handleLoad = () => {
      AOS.refresh();
    };

    if (document.readyState === "complete") {
      AOS.refresh();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // 라우트 변경 시 refresh
    const handleRouteChange = () => {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return null;
}

