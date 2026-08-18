"use client";

import { useState } from "react";
import Image from "next/image";

/* ---------- helpers ---------- */

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-ink-mute">
      <span className="num eyebrow">{index}</span>
      <span aria-hidden className="h-px w-10 bg-ink-mute/40" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}

function Seal() {
  return (
    <div className="relative h-28 w-28 md:h-36 md:w-36">
      <div className="seal-rotate absolute inset-0">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <path
              id="seal-path"
              d="M 100, 100 m -78, 0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
            />
          </defs>
          <text className="fill-[color:var(--seal)]" style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.32em" }}>
            <textPath href="#seal-path" startOffset="0">
              · SLOW READING · QUIET WORK · GOOD COFFEE · SINCE 2024 ·
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--seal)]/60 text-[color:var(--seal)] md:h-16 md:w-16">
          <span className="font-display text-base md:text-xl" style={{ fontVariationSettings: '"opsz" 144' }}>
            CT
          </span>
        </div>
      </div>
    </div>
  );
}

function Steam() {
  return (
    <div className="pointer-events-none absolute -top-10 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-60" aria-hidden>
      <span className="steam block h-6 w-[3px] rounded-full bg-ink-mute/40" style={{ animationDelay: "0s" }} />
      <span className="steam block h-8 w-[3px] rounded-full bg-ink-mute/40" style={{ animationDelay: "0.6s" }} />
      <span className="steam block h-5 w-[3px] rounded-full bg-ink-mute/40" style={{ animationDelay: "1.2s" }} />
    </div>
  );
}

/* ---------- page ---------- */

export default function HomePage() {
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
  const [isSubmittingRental, setIsSubmittingRental] = useState(false);
  const [rentalSubmitStatus, setRentalSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleRentalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRentalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRentalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingRental(true);
    setRentalSubmitStatus("idle");
    try {
      const response = await fetch("/api/rental-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rentalFormData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "문의 정보 저장에 실패했습니다.");
      setRentalSubmitStatus("success");
      setRentalFormData({ name: "", email: "", phone: "", purpose: "", date: "", time: "", message: "" });
      setIsSubmittingRental(false);
      setTimeout(() => {
        setShowRentalInquiry(false);
        setRentalSubmitStatus("idle");
      }, 2200);
    } catch (error: any) {
      console.error("문의 정보 저장 오류:", error);
      setRentalSubmitStatus("error");
      setIsSubmittingRental(false);
    }
  };

  return (
    <div className="relative bg-paper text-ink">
      {/* subtle grain over the whole page */}
      <div className="pointer-events-none fixed inset-0 z-0 grain-soft opacity-40" aria-hidden />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1400px] px-5 pt-14 pb-16 md:px-10 md:pt-20 md:pb-24">
          <div className="grid grid-cols-12 gap-x-4 gap-y-10">
            {/* left column — eyebrow + tiny meta */}
            <div className="col-span-12 md:col-span-3">
              <SectionLabel index="00" label="A Neighborhood Book Café" />
              <p className="mt-6 max-w-[16rem] font-hangul-serif text-sm leading-relaxed text-ink-soft">
                책이 놓인 창가 자리, 밑줄 그은 문장, 식지 않는 두 번째 잔.
                조용한 하루가 필요할 때 들르는 곳.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <a
                  href="#reserve"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-[color:var(--seal)]"
                >
                  <span>대관 문의하기</span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
                <a
                  href="#visit"
                  className="link-swipe text-sm text-ink"
                >
                  오시는 길 →
                </a>
              </div>
            </div>

            {/* center — the big display headline */}
            <div className="relative col-span-12 md:col-span-6">
              <Steam />
              <h1
                className="font-display text-[16vw] leading-[0.86] tracking-[-0.04em] text-ink md:text-[10.5rem]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                Cafe<br />
                <span className="italic text-[color:var(--seal)]" style={{ fontFamily: "var(--font-serif)" }}>
                  Tang
                </span>
                <span className="text-ink">.</span>
              </h1>
              <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <p className="font-hangul-serif text-lg leading-snug text-ink-soft md:max-w-md">
                  “읽고, 쓰고, 머무는 사람들을 위한 조용한 북카페.”
                </p>
                <p className="eyebrow text-ink-mute">Vol. 01 · Slow Hours</p>
              </div>
            </div>

            {/* right — seal + open hours ticker */}
            <div className="col-span-12 flex items-start justify-between md:col-span-3 md:flex-col md:items-end md:gap-8">
              <Seal />
              <div className="text-right">
                <p className="eyebrow text-ink-mute">Open Every Day</p>
                <p className="num mt-2 font-display text-3xl text-ink md:text-4xl">09:00 → 22:00</p>
                <p className="mt-2 text-xs text-ink-mute">무인 카페 · 예약 없이 방문</p>
              </div>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="border-y border-ink/10 bg-paper-deep/60 py-3">
          <div className="flex overflow-hidden">
            <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap px-6 text-ink-soft">
              {Array.from({ length: 2 }).map((_, r) => (
                <div key={r} className="flex items-center gap-10">
                  {["느린 독서", "따뜻한 커피", "조용한 작업", "책이 있는 오후", "혼자 오기 좋은 곳", "6인 스터디룸", "예약 대관", "매년 신간 30권"].map((w, i) => (
                    <span key={`${r}-${i}`} className="flex items-center gap-10">
                      <span className="eyebrow">{w}</span>
                      <span aria-hidden className="text-[color:var(--seal)]">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ INTRO / ABOUT ============ */}
      <section className="relative">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid grid-cols-12 gap-x-4 gap-y-16">
            <div className="col-span-12 md:col-span-4">
              <SectionLabel index="01" label="About the Café" />
              <h2
                className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-6xl"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "-0.02em" }}
              >
                책과 커피,<br />
                <span className="italic text-[color:var(--seal)]" style={{ fontFamily: "var(--font-serif)" }}>
                  그리고 오후
                </span>
              </h2>
            </div>

            <div className="col-span-12 md:col-span-5 md:col-start-6">
              <p className="font-hangul-serif text-xl leading-[1.7] text-ink">
                편하게 쉬고, 작업하고, 공부할 수 있도록 만들어진 <span className="text-[color:var(--seal)]">북카페</span>입니다.
              </p>
              <p className="mt-5 font-hangul-serif text-base leading-[1.9] text-ink-soft">
                매년 새로 들여오는 신간과, 오래 두고 다시 읽고 싶은 유익한 책들이 벽 한쪽을 채우고 있어요. 종이가 넘어가는 소리와 조용한 대화, 커피의 온도만이 흐르는 오후를 만나보세요.
              </p>

              {/* Signature ticket */}
              <div className="mt-10 grid grid-cols-3 divide-x divide-dashed divide-ink/20 border-y border-dashed border-ink/20 py-6 text-ink">
                <div className="pr-4">
                  <p className="eyebrow text-ink-mute">Entry</p>
                  <p className="num mt-2 font-display text-3xl leading-none">₩3,000</p>
                  <p className="mt-2 text-xs text-ink-mute">음료 1병 포함</p>
                </div>
                <div className="px-4">
                  <p className="eyebrow text-ink-mute">Refill</p>
                  <p className="num mt-2 font-display text-3xl leading-none">₩1,700</p>
                  <p className="mt-2 text-xs text-ink-mute">추가 음료 1병</p>
                </div>
                <div className="pl-4">
                  <p className="eyebrow text-ink-mute">New Books</p>
                  <p className="num mt-2 font-display text-3xl leading-none">30 vol.</p>
                  <p className="mt-2 text-xs text-ink-mute">매년 신간 구비</p>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-2 md:col-start-11">
              <div className="rounded-sm border border-ink/15 bg-paper-deep/40 p-5">
                <p className="eyebrow text-ink-mute">Today</p>
                <p className="mt-3 font-hangul-serif text-sm leading-relaxed text-ink">
                  창가 자리 4석,<br />
                  잔잔한 재즈,<br />
                  향 좋은 에티오피아.
                </p>
                <p className="mt-4 text-xs italic text-ink-mute" style={{ fontFamily: "var(--font-serif)" }}>
                  — 오늘의 큐레이션
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="relative border-t border-ink/10 bg-paper-deep/50">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="02" label="Inside the Café" />
              <h2
                className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-6xl"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "-0.02em" }}
              >
                하루가 오래
                <br />
                머무는 공간
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-mute">
              {["#조용함", "#창가", "#만화", "#독서", "#느린오후", "#혼자오기좋은"].map((tag) => (
                <span key={tag} className="text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Structured grid — mirrors Section 03 (Study Room) pattern:
              top hero image with a fixed aspect container, second row uses
              another aspect-ratio wrapper so all cells share exact heights. */}
          <div className="space-y-3 md:space-y-4">
            {/* Hero image */}
            <figure className="aspect-[16/9] overflow-hidden rounded-sm">
              <Image
                src="/images/cafe/cafe-1.jpg"
                alt="카페 내부"
                width={1600}
                height={900}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 90vw"
                priority
              />
            </figure>

            {/* Second row: 1 wide + 3 stacked column, all heights equal.
                Desktop grid: 6 cols total.
                - cafe-2 spans 3 cols
                - cafe-3, cafe-4, cafe-5 stack into remaining 3 cols... but we want a horizontal row.
                Actual layout: cafe-2 (2/5) + cafe-3 (1/5) + cafe-4 (1/5) + cafe-5 (1/5) */}
            <div className="md:aspect-[16/6]">
              <div className="grid h-full grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                <figure className="col-span-2 aspect-[16/9] overflow-hidden rounded-sm md:col-span-2 md:aspect-auto md:h-full">
                  <Image
                    src="/images/cafe/cafe-2.jpg"
                    alt="카페 디테일"
                    width={1200}
                    height={675}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </figure>
                <figure className="aspect-[4/3] overflow-hidden rounded-sm md:aspect-auto md:h-full">
                  <Image
                    src="/images/cafe/cafe-3.jpg"
                    alt="책장"
                    width={600}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </figure>
                <figure className="aspect-[4/3] overflow-hidden rounded-sm md:aspect-auto md:h-full">
                  <Image
                    src="/images/cafe/cafe-4.jpg"
                    alt="테이블"
                    width={600}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </figure>
                <figure className="col-span-2 aspect-[16/9] overflow-hidden rounded-sm md:col-span-1 md:aspect-auto md:h-full">
                  <Image
                    src="/images/cafe/cafe-5.jpg"
                    alt="자리"
                    width={600}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                </figure>
              </div>
            </div>

            {/* Sixth image full-width strip */}
            <figure className="aspect-[21/9] overflow-hidden rounded-sm">
              <Image
                src="/images/cafe/cafe-6.jpg"
                alt="창가"
                width={1600}
                height={686}
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 90vw"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ============ STUDY ROOM ============ */}
      <section className="relative border-t border-ink/10">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid grid-cols-12 gap-x-4 gap-y-14">
            <div className="col-span-12 md:col-span-4">
              <SectionLabel index="03" label="Study Room · 6 seats" />
              <h2
                className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-6xl"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "-0.02em" }}
              >
                여섯 명의<br />
                <span className="italic text-[color:var(--seal)]" style={{ fontFamily: "var(--font-serif)" }}>
                  작은 회의
                </span>
              </h2>

              <div className="mt-8 space-y-4 border-y border-dashed border-ink/20 py-6">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="eyebrow text-ink-mute">오전 · ~12:00</p>
                    <p className="mt-1 text-xs text-ink-soft">평일 · 주말 동일</p>
                  </div>
                  <div className="text-right">
                    <p className="num font-display text-3xl text-ink md:text-4xl">₩4,000</p>
                    <p className="text-xs text-ink-mute">/ 1시간</p>
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-ink/15 pt-4">
                  <div>
                    <p className="eyebrow text-ink-mute">오후 · 12:00~</p>
                    <p className="mt-1 text-xs text-ink-soft">평일 · 주말 동일</p>
                  </div>
                  <div className="text-right">
                    <p className="num font-display text-3xl text-ink md:text-4xl">₩5,000</p>
                    <p className="text-xs text-ink-mute">/ 1시간</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-mute">
                음료는 <span className="num text-ink">₩1,700</span> · 오후 이용 시 인당 1잔 주문
              </p>

              <a
                href="#reserve"
                className="group mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm text-ink"
              >
                <span>단체·행사 대관 문의</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>

            <div className="col-span-12 space-y-4 md:col-span-8">
              {/* Hero meeting shot */}
              <figure className="aspect-[16/9] overflow-hidden rounded-sm">
                <Image
                  src="/images/cafe/meeting-1.jpg"
                  alt="스터디룸 전경"
                  width={1400}
                  height={788}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </figure>

              {/* Second row: image + info card, forced equal height via aspect container */}
              <div className="md:aspect-[16/7]">
                <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
                  <figure className="aspect-[16/10] overflow-hidden rounded-sm md:aspect-auto md:h-full">
                    <Image
                      src="/images/cafe/meeting-2.jpg"
                      alt="스터디룸 내부"
                      width={800}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </figure>
                  <div className="flex flex-col justify-between rounded-sm border border-ink/15 bg-paper-deep/50 p-6 md:h-full">
                    <div>
                      <p className="eyebrow text-ink-mute">Capacity</p>
                      <p className="mt-2 font-display text-4xl text-ink">최대 6인</p>
                    </div>
                    <p className="mt-6 font-hangul-serif text-sm leading-relaxed text-ink-soft">
                      작은 모임, 조용한 스터디, 팀 미팅에 알맞은 방입니다. 창밖 소리만 들릴 만큼의 안락함.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities index */}
            <div className="col-span-12 mt-4 grid grid-cols-1 gap-8 border-t border-ink/10 pt-10 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-3">
                  <span className="num eyebrow text-ink-mute">A.</span>
                  <p className="eyebrow text-ink">Room Amenities</p>
                </div>
                <ul className="mt-5 divide-y divide-dashed divide-ink/15">
                  {[
                    ["01", "Wi-Fi"],
                    ["02", "칠판 · 보드마카 · 지우개"],
                    ["03", "모니터 · 노트북 연결 가능"],
                    ["04", "콘센트 · 난방"],
                  ].map(([n, t]) => (
                    <li key={n} className="flex items-baseline gap-4 py-3">
                      <span className="num w-8 text-xs text-ink-mute">{n}</span>
                      <span className="flex-1 font-hangul-serif text-base text-ink">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="num eyebrow text-ink-mute">B.</span>
                  <p className="eyebrow text-ink">Café Amenities</p>
                </div>
                <ul className="mt-5 divide-y divide-dashed divide-ink/15">
                  {[
                    ["01", "프린터기 · 인쇄/복사"],
                    ["02", "커피자판기 · 외부 카페 공간"],
                    ["03", "전자레인지 · 간편식 섭취 가능"],
                    ["04", "냉장고 · 개인 음료/음식 보관"],
                    ["05", "여자·남자 화장실 구분"],
                  ].map(([n, t]) => (
                    <li key={n} className="flex items-baseline gap-4 py-3">
                      <span className="num w-8 text-xs text-ink-mute">{n}</span>
                      <span className="flex-1 font-hangul-serif text-base text-ink">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Long-term booking */}
            <div className="col-span-12 mt-4 rounded-sm border border-ink/15 bg-paper-deep/40 p-6 md:p-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <p className="eyebrow text-ink-mute">Long-term Use</p>
                  <h3
                    className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl"
                    style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
                  >
                    회의실<br />
                    고정 사용 문의
                  </h3>
                  <p className="mt-4 font-hangul-serif text-sm leading-relaxed text-ink-soft">
                    매주 정해진 시간에 회의실을 고정으로 사용하고 싶으신 팀·모임을 위한 안내입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:col-span-7 sm:grid-cols-2">
                  <div className="rounded-sm border border-ink/15 bg-paper p-5">
                    <p className="eyebrow text-ink-mute">오전 · ~12:00</p>
                    <p className="num mt-2 font-display text-2xl text-ink">₩4,000<span className="ml-1 text-sm text-ink-mute">/ 1시간</span></p>
                    <p className="mt-3 text-xs text-ink-soft">평일 · 주말 동일</p>
                    <p className="mt-2 text-xs text-ink-mute">음료 <span className="num text-ink">₩1,700</span></p>
                  </div>
                  <div className="rounded-sm border border-ink/15 bg-paper p-5">
                    <p className="eyebrow text-ink-mute">오후 · 12:00~</p>
                    <p className="num mt-2 font-display text-2xl text-ink">₩5,000<span className="ml-1 text-sm text-ink-mute">/ 1시간</span></p>
                    <p className="mt-3 text-xs text-ink-soft">평일 · 주말 동일</p>
                    <p className="mt-2 text-xs text-ink-mute">인당 <span className="num text-ink">₩1,700</span> 1잔씩 주문</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <MeetingSchedule />
          </div>
        </div>
      </section>

      {/* ============ VISIT / MAP ============ */}
      <section id="visit" className="relative border-t border-ink/10 bg-paper-deep/50">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid grid-cols-12 gap-x-4 gap-y-10">
            <div className="col-span-12 md:col-span-5">
              <SectionLabel index="04" label="How to Visit" />
              <h2
                className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-6xl"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "-0.02em" }}
              >
                오시는 길
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7">
              <dl className="divide-y divide-dashed divide-ink/20 border-y border-dashed border-ink/20">
                <div className="grid grid-cols-4 gap-4 py-5">
                  <dt className="eyebrow col-span-1 self-center text-ink-mute">Address</dt>
                  <dd className="col-span-3 font-hangul-serif text-base leading-relaxed text-ink">
                    서울 강동구 고덕로 97<br />
                    (암사동 447-24) 2층 카페탱
                  </dd>
                </div>
                <div className="grid grid-cols-4 gap-4 py-5">
                  <dt className="eyebrow col-span-1 self-center text-ink-mute">Hours</dt>
                  <dd className="num col-span-3 text-base text-ink">매일 09:00 – 22:00</dd>
                </div>
                <div className="grid grid-cols-4 gap-4 py-5">
                  <dt className="eyebrow col-span-1 self-center text-ink-mute">Phone</dt>
                  <dd className="col-span-3">
                    <a href="tel:0507-1304-7291" className="num link-swipe text-base text-ink">
                      0507&nbsp;–&nbsp;1304&nbsp;–&nbsp;7291
                    </a>
                  </dd>
                </div>
              </dl>

              <a
                href="https://naver.me/FhfREQzF"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-[color:var(--seal)]"
              >
                <span>네이버 지도에서 열기</span>
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RESERVE (rental inquiry) ============ */}
      <section id="reserve" className="relative border-t border-ink/10">
        <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
          <div className="grid grid-cols-12 gap-x-4 gap-y-12">
            <div className="col-span-12 md:col-span-5">
              <SectionLabel index="05" label="Rent the Space" />
              <h2
                className="mt-6 font-display text-5xl leading-[0.95] text-ink md:text-6xl"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100', letterSpacing: "-0.02em" }}
              >
                하루를<br />
                <span className="italic text-[color:var(--seal)]" style={{ fontFamily: "var(--font-serif)" }}>
                  빌려드립니다
                </span>
              </h2>
              <p className="mt-6 max-w-md font-hangul-serif text-base leading-[1.9] text-ink-soft">
                작은 모임, 강연, 클럽, 촬영, 워크숍. 카페 공간을 통째로 빌리고 싶으시다면 아래로 문의를 남겨주세요. 하루 안에 회신드립니다.
              </p>

              <ul className="mt-10 space-y-4 text-sm text-ink">
                {[
                  ["회신", "1일 이내 이메일/전화"],
                  ["최소 대관", "2시간부터"],
                  ["가능 시간", "매일 09:00 – 22:00"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline justify-between border-b border-dashed border-ink/15 pb-3">
                    <span className="eyebrow text-ink-mute">{k}</span>
                    <span className="font-hangul-serif text-base text-ink">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 md:col-span-7">
              <div className="rounded-sm border border-ink/15 bg-paper p-6 shadow-[0_1px_0_rgba(42,24,16,0.04),0_20px_40px_-30px_rgba(42,24,16,0.35)] md:p-10">
                <div className="mb-8 flex items-end justify-between border-b border-dashed border-ink/20 pb-4">
                  <div>
                    <p className="eyebrow text-ink-mute">Inquiry Form</p>
                    <p className="mt-1 font-display text-2xl text-ink">대관 문의</p>
                  </div>
                  <p className="num text-xs text-ink-mute">No. 2024 · 001</p>
                </div>

                {!showRentalInquiry ? (
                  <div className="flex flex-col items-start gap-6">
                    <p className="font-hangul-serif text-base leading-relaxed text-ink-soft">
                      아래 버튼을 눌러 짧은 양식을 작성해주세요. 이름·연락처·희망 날짜만 있으면 시작할 수 있어요.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowRentalInquiry(true)}
                      className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-[color:var(--seal)]"
                    >
                      <span>문의 양식 열기</span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRentalSubmit} className="space-y-6">
                    <FieldGroup>
                      <Field label="이름" htmlFor="rental-name" required>
                        <input
                          type="text"
                          id="rental-name"
                          name="name"
                          value={rentalFormData.name}
                          onChange={handleRentalInputChange}
                          required
                          placeholder="예) 김탱자"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="연락처" htmlFor="rental-phone" required>
                        <input
                          type="tel"
                          id="rental-phone"
                          name="phone"
                          value={rentalFormData.phone}
                          onChange={handleRentalInputChange}
                          required
                          placeholder="010-0000-0000"
                          className={`${inputCls} num`}
                        />
                      </Field>
                    </FieldGroup>

                    <Field label="이메일" htmlFor="rental-email" required>
                      <input
                        type="email"
                        id="rental-email"
                        name="email"
                        value={rentalFormData.email}
                        onChange={handleRentalInputChange}
                        required
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="대관 목적" htmlFor="rental-purpose" required>
                      <select
                        id="rental-purpose"
                        name="purpose"
                        value={rentalFormData.purpose}
                        onChange={handleRentalInputChange}
                        required
                        className={inputCls}
                      >
                        <option value="">선택해주세요</option>
                        <option value="스터디">스터디</option>
                        <option value="모임">모임</option>
                        <option value="행사">행사</option>
                        <option value="기타">기타</option>
                      </select>
                    </Field>

                    <FieldGroup>
                      <Field label="희망 날짜" htmlFor="rental-date" required>
                        <input
                          type="date"
                          id="rental-date"
                          name="date"
                          value={rentalFormData.date}
                          onChange={handleRentalInputChange}
                          required
                          className={`${inputCls} num`}
                        />
                      </Field>
                      <Field label="희망 시간" htmlFor="rental-time" required>
                        <input
                          type="time"
                          id="rental-time"
                          name="time"
                          value={rentalFormData.time}
                          onChange={handleRentalInputChange}
                          required
                          className={`${inputCls} num`}
                        />
                      </Field>
                    </FieldGroup>

                    <Field label="문의 내용" htmlFor="rental-message">
                      <textarea
                        id="rental-message"
                        name="message"
                        value={rentalFormData.message}
                        onChange={handleRentalInputChange}
                        rows={4}
                        placeholder="어떤 자리, 어떤 인원, 어떤 분위기의 시간을 계획하시나요?"
                        className={`${inputCls} resize-none`}
                      />
                    </Field>

                    {rentalSubmitStatus === "success" && (
                      <div className="rounded-sm border border-emerald-800/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                        문의가 접수되었어요. 하루 안에 답을 드릴게요.
                      </div>
                    )}
                    {rentalSubmitStatus === "error" && (
                      <div className="rounded-sm border border-rose-800/30 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                        전송 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-ink/20 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRentalInquiry(false);
                          setRentalFormData({ name: "", email: "", phone: "", purpose: "", date: "", time: "", message: "" });
                          setRentalSubmitStatus("idle");
                        }}
                        className="link-swipe text-sm text-ink-mute"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingRental}
                        className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-colors ${
                          isSubmittingRental
                            ? "cursor-not-allowed bg-ink/40 text-paper"
                            : "bg-ink text-paper hover:bg-[color:var(--seal)]"
                        }`}
                      >
                        <span>{isSubmittingRental ? "전송 중…" : "문의 보내기"}</span>
                        {!isSubmittingRental && (
                          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- meeting room schedule ---------- */

type Booking = { name: string; group: "china" | "shin" | "design" };

const RECURRING_GROUPS = [
  {
    id: "china" as const,
    name: "China 스터디",
    schedule: "화 09:00 – 12:00",
    swatch: "bg-[color:var(--group-china)]",
    ring: "ring-[color:var(--group-china)]",
  },
  {
    id: "shin" as const,
    name: "Shin 스터디",
    schedule: "월·화·금 16:30–21:30 · 수 16:30–20:00 · 토 13:00–19:00 · 일 14:00–18:00",
    swatch: "bg-[color:var(--group-shin)]",
    ring: "ring-[color:var(--group-shin)]",
  },
  {
    id: "design" as const,
    name: "디자인 스터디",
    schedule: "토 19:00 – 22:00",
    swatch: "bg-[color:var(--group-design)]",
    ring: "ring-[color:var(--group-design)]",
  },
];

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const HOURS = ["9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"] as const;

// Hour x Day booking map. null = 예약 가능
const SCHEDULE: Record<string, (Booking | null)[]> = {
  "9": [null, { name: "China", group: "china" }, null, null, null, null, null],
  "10": [null, { name: "China", group: "china" }, null, null, null, null, null],
  "11": [null, { name: "China", group: "china" }, null, null, null, null, null],
  "12": [null, null, null, null, null, null, null],
  "13": [null, null, null, null, null, { name: "Shin", group: "shin" }, null],
  "14": [null, null, null, null, null, { name: "Shin", group: "shin" }, { name: "Shin", group: "shin" }],
  "15": [null, null, null, null, null, { name: "Shin", group: "shin" }, { name: "Shin", group: "shin" }],
  "16": [
    { name: "Shin 16:30~", group: "shin" },
    { name: "Shin 16:30~", group: "shin" },
    { name: "Shin 16:30~", group: "shin" },
    null,
    { name: "Shin 16:30~", group: "shin" },
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
  ],
  "17": [
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    null,
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
  ],
  "18": [
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    null,
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
  ],
  "19": [
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    { name: "Shin ~20", group: "shin" },
    null,
    { name: "Shin", group: "shin" },
    { name: "디자인", group: "design" },
    null,
  ],
  "20": [
    { name: "Shin", group: "shin" },
    { name: "Shin", group: "shin" },
    null,
    null,
    { name: "Shin", group: "shin" },
    { name: "디자인", group: "design" },
    null,
  ],
  "21": [
    { name: "Shin ~21:30", group: "shin" },
    { name: "Shin ~21:30", group: "shin" },
    null,
    null,
    { name: "Shin ~21:30", group: "shin" },
    { name: "디자인", group: "design" },
    null,
  ],
  "22": [null, null, null, null, null, { name: "디자인", group: "design" }, null],
};

function MeetingSchedule() {
  return (
    <div
      className="col-span-12 mt-4 rounded-sm border border-ink/15 bg-paper p-6 md:p-10"
      style={{
        // Muted, journal-friendly palette derived from the site tokens.
        // Kept as CSS variables so both the swatches and cells reuse them.
        ["--group-china" as any]: "#5A7BA8",   // dusty blue
        ["--group-shin" as any]: "#C89466",    // warm terracotta (ties to brand orange)
        ["--group-design" as any]: "#B8A045",  // muted mustard (ties to brand-500)
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-dashed border-ink/20 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-ink-mute">Room Schedule · 26.06.01 ~</p>
          <h3
            className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            회의실 예약 현황
          </h3>
        </div>
        <div className="text-sm text-ink-soft md:text-right">
          <p>이용 문의 · 문자</p>
          <a href="sms:0507-1304-7291" className="num link-swipe font-display text-xl text-ink md:text-2xl">
            0507-1304-7291
          </a>
        </div>
      </div>

      {/* Recurring group cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {RECURRING_GROUPS.map((g) => (
          <div
            key={g.id}
            className="relative overflow-hidden rounded-sm border border-ink/15 bg-paper-deep/40 p-5"
          >
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 w-1 ${g.swatch}`}
            />
            <div className="flex items-center gap-2">
              <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-full ${g.swatch}`} />
              <p className="eyebrow text-ink">{g.name}</p>
            </div>
            <p className="mt-3 font-hangul-serif text-sm leading-relaxed text-ink-soft">
              {g.schedule}
            </p>
          </div>
        ))}
      </div>

      {/* Legend + hint */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-mute">
        <span className="eyebrow">Legend</span>
        {RECURRING_GROUPS.map((g) => (
          <span key={g.id} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-sm ${g.swatch}`} />
            <span className="text-ink">{g.name}</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm border border-ink/25 bg-paper" />
          <span className="text-ink">예약 가능</span>
        </span>
      </div>

      {/* Grid */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-xs md:text-sm">
          <thead>
            <tr>
              <th className="w-14 border-b border-ink/15 py-2 text-left align-bottom">
                <span className="eyebrow text-ink-mute">Hour</span>
              </th>
              {DAY_LABELS.map((d, i) => {
                const isWeekend = i >= 5;
                return (
                  <th
                    key={d}
                    className={`border-b border-ink/15 py-2 text-center align-bottom ${
                      isWeekend ? "text-[color:var(--seal)]" : "text-ink"
                    }`}
                  >
                    <span className="eyebrow">{d}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => {
              const row = SCHEDULE[h];
              return (
                <tr key={h} className="border-b border-dashed border-ink/10 last:border-b-0">
                  <td className="num py-2 pr-2 align-middle text-ink-mute">{h}</td>
                  {row.map((b, i) => (
                    <td key={i} className="p-1 align-middle">
                      {b ? (
                        <div
                          className={`relative flex h-8 items-center justify-center rounded-sm px-1 text-[10px] font-medium text-white md:h-9 md:text-xs ${
                            b.group === "china"
                              ? "bg-[color:var(--group-china)]"
                              : b.group === "shin"
                              ? "bg-[color:var(--group-shin)]"
                              : "bg-[color:var(--group-design)]"
                          }`}
                          title={b.name}
                        >
                          <span className="truncate">{b.name}</span>
                        </div>
                      ) : (
                        <div className="h-8 rounded-sm border border-ink/10 md:h-9" aria-label="예약 가능" />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-mute">
        * 표는 정기 예약 기준입니다. 빈 칸은 예약 가능한 시간대이며, 실시간 예약 여부는 문자로 문의해주세요.
      </p>
    </div>
  );
}

/* ---------- form primitives ---------- */

const inputCls =
  "w-full rounded-sm border border-ink/20 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-mute/70 focus:border-ink focus:outline-none focus:ring-0 transition-colors";

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-ink">
        <span className="eyebrow text-ink-mute">{label}</span>
        {required && <span className="text-[10px] text-[color:var(--seal)]">* required</span>}
      </label>
      {children}
    </div>
  );
}
