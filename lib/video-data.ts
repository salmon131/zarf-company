// 채널 설정 (채널의 모든 영상을 자동으로 가져옴)
export const CHANNEL_HANDLE = "@tangzarf"; // 채널 핸들 설정

// 유튜브 영상 ID 매핑 데이터 (수동으로 추가한 영상)
// slug → youtubeId 매핑
export const videoData: Record<string, string> = {
  "investment-basics": "Tgn6_do77e8",
  "etf-guide": "dKjdwDGB-g4",
  "investment-psychology": "1zi3BVG0LyI",
  "chart-reading": "hWgfJ1cYRGw",
};

// 영상 slug와 카테고리 매핑 (YouTube API에서 가져오지 않는 정보)
export interface VideoConfig {
  slug: string;
  youtubeId: string;
  category: string;
}

export const videoConfigs: VideoConfig[] = [
  {
    slug: "investment-basics",
    youtubeId: "Tgn6_do77e8",
    category: "투자 입문",
  },
  {
    slug: "etf-guide",
    youtubeId: "dKjdwDGB-g4",
    category: "ETF",
  },
  {
    slug: "investment-psychology",
    youtubeId: "1zi3BVG0LyI",
    category: "투자 심리",
  },
  {
    slug: "chart-reading",
    youtubeId: "hWgfJ1cYRGw",
    category: "투자 입문",
  }
];

// 영상 메타데이터 (하위 호환성을 위해 유지, 하지만 YouTube API에서 가져오는 것을 권장)
export interface VideoMetadata {
  title: string;
  description?: string;
  category: string;
  views: number;
  duration: string;
  youtubeId: string;
}

