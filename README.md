This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## YouTube API 설정

이 프로젝트는 YouTube Data API v3를 사용하여 영상 정보(제목, 썸네일, 조회수 등)를 자동으로 가져옵니다.

### 1. YouTube API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리**로 이동
4. "YouTube Data API v3" 검색 후 활성화
5. **API 및 서비스** > **사용자 인증 정보**로 이동
6. **사용자 인증 정보 만들기** > **API 키** 선택
7. 생성된 API 키 복사

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**중요**: `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 3. API 키 제한 설정 (중요!)

⚠️ **서버 사이드 호출 주의사항**

이 프로젝트는 Next.js 서버 사이드에서 YouTube API를 호출합니다. 따라서 API 키 제한 설정에 주의해야 합니다:

#### 옵션 A: 제한 없음 (개발 환경 권장)
1. Google Cloud Console에서 생성한 API 키 클릭
2. **애플리케이션 제한사항**에서 **"없음"** 선택
3. **API 제한사항**에서 "YouTube Data API v3"만 선택

#### 옵션 B: IP 주소 제한 (프로덕션 권장)
1. Google Cloud Console에서 생성한 API 키 클릭
2. **애플리케이션 제한사항**에서 **"IP 주소"** 선택
3. 서버 IP 주소 추가
4. **API 제한사항**에서 "YouTube Data API v3"만 선택

#### ❌ HTTP 리퍼러 제한 사용 금지
**"HTTP 리퍼러(웹사이트)" 제한은 서버 사이드 호출에서 작동하지 않습니다!**
- 서버 사이드 요청에는 리퍼러가 없어서 403 에러가 발생합니다
- 클라이언트 사이드에서만 HTTP 리퍼러 제한을 사용하세요

### 4. 채널 추적 설정 (자동 영상 가져오기)

채널의 모든 영상을 자동으로 가져오려면 `lib/video-data.ts`에서 채널 핸들을 설정하세요:

```typescript
export const CHANNEL_HANDLE = "@tangzarf"; // 채널 핸들 설정
```

**채널 핸들 형식:**
- `@tangzarf` (핸들 형식)
- 또는 채널 ID 사용 가능

**동작 방식:**
- 페이지 로드 시 채널의 최신 영상 50개를 자동으로 가져옵니다
- 10분마다 캐시가 갱신됩니다
- 새로고침 버튼으로 수동 업데이트 가능

### 5. 수동 영상 추가 (선택사항)

채널 외에 특정 영상을 수동으로 추가하려면 `lib/video-data.ts`에서 설정하세요:

```typescript
export const videoConfigs: VideoConfig[] = [
  {
    slug: "investment-basics",
    youtubeId: "YOUR_YOUTUBE_VIDEO_ID", // 여기에 실제 유튜브 영상 ID 입력
    category: "투자 입문",
  },
  // ...
];
```

YouTube 영상 ID는 URL에서 확인할 수 있습니다:
- `https://www.youtube.com/watch?v=VIDEO_ID` → `VIDEO_ID` 부분

### 6. 403 오류 해결 방법

YouTube API에서 403 오류가 발생하는 경우:

1. **API 키 확인**
   - `.env.local` 파일에 올바른 API 키가 설정되어 있는지 확인
   - 개발 서버 재시작 (`npm run dev`)

2. **YouTube Data API v3 활성화 (가장 중요!)**
   - 에러 메시지에 제공된 링크로 직접 이동:
     ```
     https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=YOUR_PROJECT_ID
     ```
   - 또는 수동으로:
     - Google Cloud Console > API 및 서비스 > 라이브러리
     - "YouTube Data API v3" 검색
     - **"사용"** 또는 **"활성화"** 버튼 클릭
   - ⚠️ API를 활성화한 후 몇 분 정도 기다려야 시스템에 반영됩니다

3. **API 키 제한 설정 확인**
   - 서버 사이드 호출이므로 "HTTP 리퍼러" 제한 사용 금지
   - "없음" 또는 "IP 주소" 제한 사용

4. **API 할당량 확인**
   - Google Cloud Console > API 및 서비스 > 할당량
   - 일일 할당량이 초과되지 않았는지 확인
   - 기본 할당량: 10,000 units/일

5. **에러 로그 확인**
   - 터미널에서 상세한 에러 메시지 확인
   - Google Cloud Console > 로깅에서 API 호출 로그 확인

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
