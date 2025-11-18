// YouTube Data API v3 유틸리티

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewCount: number;
  publishedAt: string;
  channelTitle: string;
  duration?: string;
  durationSeconds?: number; // 초 단위 duration
  isShort?: boolean; // Shorts 여부
  categoryId?: string; // YouTube 카테고리 ID
}

/**
 * YouTube 영상 정보를 가져옵니다 (서버 사이드 전용)
 */
export async function getYouTubeVideoInfo(
  videoId: string
): Promise<YouTubeVideoInfo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return null;
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,statistics,contentDetails");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`YouTube API 오류: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData.error || errorData,
        videoId,
      });
      
      // 403 에러인 경우 상세 안내
      if (response.status === 403) {
        console.error(`
⚠️ YouTube API 403 오류 해결 방법:
1. Google Cloud Console에서 API 키 확인
2. YouTube Data API v3가 활성화되어 있는지 확인
3. API 키 제한 설정 확인:
   - 서버 사이드 호출의 경우 "IP 주소" 또는 "없음"으로 설정
   - "HTTP 리퍼러" 제한이 있으면 서버 사이드에서 403 발생 가능
4. API 할당량 확인
        `);
      }
      
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    const snippet = item.snippet;
    const statistics = item.statistics;
    const contentDetails = item.contentDetails;

    // ISO 8601 duration을 초로 변환하는 함수
    const parseDurationToSeconds = (duration: string): number => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return 0;

      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseInt(match[3] || "0", 10);

      return hours * 3600 + minutes * 60 + seconds;
    };

    // ISO 8601 duration을 문자열로 변환하는 함수
    const parseDuration = (duration: string): string => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return "";

      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseInt(match[3] || "0", 10);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const durationSeconds = contentDetails?.duration 
      ? parseDurationToSeconds(contentDetails.duration) 
      : undefined;
    
    // Shorts 판별: 60초 이하인 경우 Shorts로 간주
    const isShort = durationSeconds !== undefined && durationSeconds <= 60;

    return {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
      viewCount: parseInt(statistics.viewCount || "0", 10),
      publishedAt: snippet.publishedAt,
      channelTitle: snippet.channelTitle,
      duration: contentDetails?.duration ? parseDuration(contentDetails.duration) : undefined,
      durationSeconds,
      isShort,
      categoryId: snippet.categoryId,
    };
  } catch (error) {
    console.error("YouTube API 호출 오류:", error);
    return null;
  }
}

/**
 * 여러 YouTube 영상 정보를 한 번에 가져옵니다
 */
export async function getMultipleYouTubeVideos(
  videoIds: string[]
): Promise<YouTubeVideoInfo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return [];
  }

  try {
    // YouTube API는 최대 50개까지 한 번에 요청 가능
    const ids = videoIds.slice(0, 50).join(",");

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,statistics,contentDetails");
    url.searchParams.set("id", ids);
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`YouTube API 오류: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData.error || errorData,
        videoIds: ids,
      });
      
      // 403 에러인 경우 상세 안내
      if (response.status === 403) {
        console.error(`
⚠️ YouTube API 403 오류 해결 방법:
1. Google Cloud Console에서 API 키 확인
2. YouTube Data API v3가 활성화되어 있는지 확인
3. API 키 제한 설정 확인:
   - 서버 사이드 호출의 경우 "IP 주소" 또는 "없음"으로 설정
   - "HTTP 리퍼러" 제한이 있으면 서버 사이드에서 403 발생 가능
4. API 할당량 확인
        `);
      }
      
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // ISO 8601 duration을 초로 변환하는 함수
    const parseDurationToSeconds = (duration: string): number => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return 0;

      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseInt(match[3] || "0", 10);

      return hours * 3600 + minutes * 60 + seconds;
    };

    // ISO 8601 duration을 문자열로 변환하는 함수
    const parseDuration = (duration: string): string => {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return "";

      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseInt(match[3] || "0", 10);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return data.items.map((item: any) => {
      const snippet = item.snippet;
      const statistics = item.statistics;
      const contentDetails = item.contentDetails;

      const durationSeconds = contentDetails?.duration 
        ? parseDurationToSeconds(contentDetails.duration) 
        : undefined;
      
      // Shorts 판별: 60초 이하인 경우 Shorts로 간주
      const isShort = durationSeconds !== undefined && durationSeconds <= 60;

      return {
        id: item.id,
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default.url,
        viewCount: parseInt(statistics.viewCount || "0", 10),
        publishedAt: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        duration: contentDetails?.duration ? parseDuration(contentDetails.duration) : undefined,
        durationSeconds,
        isShort,
        categoryId: snippet.categoryId,
      };
    });
  } catch (error) {
    console.error("YouTube API 호출 오류:", error);
    return [];
  }
}

/**
 * 채널의 사용자명(@handle) 또는 채널 ID로 채널 정보를 가져옵니다
 */
export async function getChannelByHandle(
  handle: string
): Promise<{ channelId: string; uploadsPlaylistId: string } | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return null;
  }

  try {
    // @ 기호 제거
    const cleanHandle = handle.replace(/^@/, "");

    // 채널 검색 (forUsername은 deprecated, search 사용)
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("q", cleanHandle);
    searchUrl.searchParams.set("type", "channel");
    searchUrl.searchParams.set("maxResults", "1");
    searchUrl.searchParams.set("key", apiKey);

    const searchResponse = await fetch(searchUrl.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!searchResponse.ok) {
      console.error(`채널 검색 오류: ${searchResponse.status}`);
      return null;
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      console.error("채널을 찾을 수 없습니다:", cleanHandle);
      return null;
    }

    const channelId = searchData.items[0].id.channelId;

    // 채널 정보 가져오기 (uploads 플레이리스트 ID 포함)
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("id", channelId);
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(channelUrl.toString(), {
      next: { revalidate: 3600 },
    });

    if (!channelResponse.ok) {
      console.error(`채널 정보 가져오기 오류: ${channelResponse.status}`);
      return null;
    }

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      return null;
    }

    const uploadsPlaylistId =
      channelData.items[0].contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      console.error("업로드 플레이리스트를 찾을 수 없습니다.");
      return null;
    }

    return {
      channelId,
      uploadsPlaylistId,
    };
  } catch (error) {
    console.error("채널 정보 가져오기 오류:", error);
    return null;
  }
}

/**
 * 채널의 모든 업로드 영상을 가져옵니다
 */
export async function getChannelVideos(
  channelHandle: string,
  maxResults: number = 50
): Promise<YouTubeVideoInfo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return [];
  }

  try {
    // 채널 정보 가져오기
    const channelInfo = await getChannelByHandle(channelHandle);

    if (!channelInfo) {
      return [];
    }

    const { uploadsPlaylistId } = channelInfo;

    // 플레이리스트의 영상 목록 가져오기
    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems"
    );
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", Math.min(maxResults, 50).toString());
    playlistUrl.searchParams.set("key", apiKey);

    const playlistResponse = await fetch(playlistUrl.toString(), {
      next: { revalidate: 600 }, // 10분 캐시 (더 자주 업데이트)
    });

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}));
      console.error(`플레이리스트 가져오기 오류: ${playlistResponse.status}`, {
        error: errorData.error || errorData,
      });
      return [];
    }

    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return [];
    }

    // 영상 ID 추출
    const videoIds = playlistData.items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      return [];
    }

    // 영상 상세 정보 가져오기
    return await getMultipleYouTubeVideos(videoIds);
  } catch (error) {
    console.error("채널 영상 가져오기 오류:", error);
    return [];
  }
}

/**
 * 채널의 재생목록 목록을 가져옵니다
 */
export interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  publishedAt: string;
}

export async function getChannelPlaylists(
  channelHandle: string,
  maxResults: number = 50
): Promise<PlaylistInfo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return [];
  }

  try {
    // 채널 정보 가져오기
    const channelInfo = await getChannelByHandle(channelHandle);

    if (!channelInfo) {
      return [];
    }

    const { channelId } = channelInfo;

    // 채널의 재생목록 목록 가져오기
    const playlistsUrl = new URL("https://www.googleapis.com/youtube/v3/playlists");
    playlistsUrl.searchParams.set("part", "snippet,contentDetails");
    playlistsUrl.searchParams.set("channelId", channelId);
    playlistsUrl.searchParams.set("maxResults", Math.min(maxResults, 50).toString());
    playlistsUrl.searchParams.set("key", apiKey);

    const playlistsResponse = await fetch(playlistsUrl.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!playlistsResponse.ok) {
      const errorData = await playlistsResponse.json().catch(() => ({}));
      console.error(`재생목록 가져오기 오류: ${playlistsResponse.status}`, {
        error: errorData.error || errorData,
      });
      return [];
    }

    const playlistsData = await playlistsResponse.json();

    if (!playlistsData.items || playlistsData.items.length === 0) {
      return [];
    }

    return playlistsData.items.map((item: any) => {
      const snippet = item.snippet;
      const contentDetails = item.contentDetails;

      return {
        id: item.id,
        title: snippet.title,
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
        itemCount: parseInt(contentDetails?.itemCount || "0", 10),
        publishedAt: snippet.publishedAt,
      };
    });
  } catch (error) {
    console.error("재생목록 가져오기 오류:", error);
    return [];
  }
}

/**
 * 재생목록 정보를 가져옵니다
 */
export async function getPlaylistInfo(
  playlistId: string
): Promise<PlaylistInfo | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return null;
  }

  try {
    const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlists");
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("id", playlistId);
    playlistUrl.searchParams.set("key", apiKey);

    const playlistResponse = await fetch(playlistUrl.toString(), {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}));
      console.error(`재생목록 정보 가져오기 오류: ${playlistResponse.status}`, {
        error: errorData.error || errorData,
      });
      return null;
    }

    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return null;
    }

    const item = playlistData.items[0];
    const snippet = item.snippet;
    const contentDetails = item.contentDetails;

    return {
      id: item.id,
      title: snippet.title,
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "",
      itemCount: parseInt(contentDetails?.itemCount || "0", 10),
      publishedAt: snippet.publishedAt,
    };
  } catch (error) {
    console.error("재생목록 정보 가져오기 오류:", error);
    return null;
  }
}

/**
 * 특정 재생목록의 영상 목록을 가져옵니다
 */
export async function getPlaylistVideos(
  playlistId: string,
  maxResults: number = 50
): Promise<YouTubeVideoInfo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return [];
  }

  try {
    const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", playlistId);
    playlistUrl.searchParams.set("maxResults", Math.min(maxResults, 50).toString());
    playlistUrl.searchParams.set("key", apiKey);

    const playlistResponse = await fetch(playlistUrl.toString(), {
      next: { revalidate: 600 }, // 10분 캐시
    });

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}));
      console.error(`재생목록 영상 가져오기 오류: ${playlistResponse.status}`, {
        error: errorData.error || errorData,
      });
      return [];
    }

    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return [];
    }

    // 영상 ID 추출
    const videoIds = playlistData.items
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) {
      return [];
    }

    // 영상 상세 정보 가져오기
    return await getMultipleYouTubeVideos(videoIds);
  } catch (error) {
    console.error("재생목록 영상 가져오기 오류:", error);
    return [];
  }
}

