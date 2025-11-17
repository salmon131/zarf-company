import { NextRequest, NextResponse } from "next/server";
import { getChannelVideos, getChannelByHandle } from "@/lib/youtube-api";

/**
 * GET /api/youtube/channel?handle=@tangzarf
 * 채널의 모든 영상 가져오기
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json(
      { error: "채널 핸들(@handle)이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // 채널 정보 확인
    const channelInfo = await getChannelByHandle(handle);

    if (!channelInfo) {
      return NextResponse.json(
        { error: "채널을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 채널의 모든 영상 가져오기
    const videos = await getChannelVideos(handle, 50);

    return NextResponse.json({
      channelId: channelInfo.channelId,
      uploadsPlaylistId: channelInfo.uploadsPlaylistId,
      videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("채널 영상 가져오기 오류:", error);
    return NextResponse.json(
      { error: "채널 영상을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

