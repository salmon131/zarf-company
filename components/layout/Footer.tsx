export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-paper text-ink">
      <div className="pointer-events-none absolute inset-0 grain-soft opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p className="eyebrow text-ink-mute">Book Café · Seoul</p>
            <h2
              className="mt-4 font-display text-5xl leading-[0.95] text-ink md:text-7xl"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "-0.03em" }}
            >
              CafeTang<span className="text-[color:var(--seal)]">.</span>
            </h2>
            <p className="mt-6 max-w-md font-hangul-serif text-base leading-relaxed text-ink-soft">
              책과 커피, 그리고 조용한 오후. 서울 강동구에서 편하게 쉬고, 작업하고, 공부할 수 있는 북카페입니다.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-ink-mute">Address</p>
            <p className="mt-4 font-hangul-serif text-sm leading-relaxed text-ink">
              서울 강동구 고덕로 97<br />
              (암사동 447-24) 2층 카페탱
            </p>
            <a
              href="https://naver.me/FhfREQzF"
              target="_blank"
              rel="noopener noreferrer"
              className="link-swipe mt-3 inline-block text-xs text-ink-soft"
            >
              네이버 지도 열기 ↗
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-ink-mute">Contact</p>
            <p className="mt-4 font-hangul-serif text-sm leading-relaxed text-ink">
              매일 09:00 – 22:00
            </p>
            <a
              href="tel:0507-1304-7291"
              className="num link-swipe mt-1 inline-block text-sm text-ink"
            >
              0507&nbsp;–&nbsp;1304&nbsp;–&nbsp;7291
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-ink-mute md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} CafeTang. All rights reserved.</p>
          <p className="eyebrow">Made with slow coffee in Seoul</p>
        </div>
      </div>
    </footer>
  );
}
