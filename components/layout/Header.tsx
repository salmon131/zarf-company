"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function isOpenNow(d: Date) {
  const m = d.getHours() * 60 + d.getMinutes();
  return m >= 9 * 60 && m < 22 * 60;
}

export default function Header() {
  const now = useNow();
  const open = now ? isOpenNow(now) : true;
  const time =
    now?.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) ?? "";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-[1400px] grid-cols-3 items-center px-5 md:h-16 md:px-10">
        {/* Left — Open Now indicator */}
        <div className="flex items-center justify-start">
          <span
            className={`hidden items-center gap-2 text-xs sm:inline-flex ${
              open ? "text-[color:var(--seal)]" : "text-ink-mute"
            }`}
          >
            <span
              className={`relative inline-block h-1.5 w-1.5 rounded-full ${
                open ? "bg-[color:var(--seal)]" : "bg-ink-mute"
              }`}
            >
              {open && (
                <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-[color:var(--seal)]/40" />
              )}
            </span>
            <span className="eyebrow">{open ? "Open Now" : "Closed"}</span>
            {time && <span className="num text-ink-mute">· {time}</span>}
          </span>
        </div>

        {/* Center — Logo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="group flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/60 text-[10px] tracking-[0.2em] text-ink transition-transform duration-500 group-hover:rotate-[360deg]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              C
            </span>
            <span
              className="text-xl md:text-2xl font-display font-medium leading-none text-ink"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              CafeTang
            </span>
          </Link>
        </div>

        {/* Right — CTA */}
        <div className="flex items-center justify-end">
          <a
            href="#reserve"
            className="group inline-flex items-center gap-1 rounded-full border border-ink/80 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-paper md:px-4 md:py-2 md:text-sm"
          >
            <span>대관 문의</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
