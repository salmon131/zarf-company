import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    if (password === ADMIN_PIN) {
      // 쿠키에 인증 정보 저장 (24시간 유효)
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24시간
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("인증 오류:", error);
    return NextResponse.json(
      { error: "인증 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_auth");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("로그아웃 오류:", error);
    return NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

