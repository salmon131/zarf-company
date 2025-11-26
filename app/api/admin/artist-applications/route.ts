import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { artistApplicationApi } from "@/lib/supabase";

// 인증 확인 헬퍼 함수
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth");
  return authCookie?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 신청 정보 조회
    const applications = await artistApplicationApi.getAll();

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error("신청 정보 조회 오류:", error);
    return NextResponse.json(
      { error: "신청 정보 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 인증 확인
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "신청 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const success = await artistApplicationApi.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "신청 정보 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("신청 정보 삭제 오류:", error);
    return NextResponse.json(
      { error: "신청 정보 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}

