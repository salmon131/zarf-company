import { NextRequest, NextResponse } from "next/server";
import { getYouTubeVideoInfo, getMultipleYouTubeVideos } from "@/lib/youtube-api";

/**
 * GET /api/youtube?id=VIDEO_ID
 * 단일 영상 정보 가져오기
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("id");
  const videoIds = searchParams.get("ids");

  // 여러 영상 ID가 있는 경우 (쉼표로 구분)
  if (videoIds) {
    const ids = videoIds.split(",").filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json(
        { error: "영상 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const videos = await getMultipleYouTubeVideos(ids);
    return NextResponse.json({ videos });
  }

  // 단일 영상 ID
  if (!videoId) {
    return NextResponse.json(
      { error: "영상 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const videoInfo = await getYouTubeVideoInfo(videoId);

  if (!videoInfo) {
    return NextResponse.json(
      { error: "영상 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ video: videoInfo });
}

