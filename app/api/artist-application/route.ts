import { NextRequest, NextResponse } from "next/server";
import { artistApplicationApi } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, portfolio, message } = body;

    // 필수 필드 검증
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "필수 필드를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // Supabase에 신청 정보 저장
    const application = await artistApplicationApi.create({
      name,
      email,
      phone,
      portfolio: portfolio || null,
      message: message || null,
    });

    if (!application) {
      return NextResponse.json(
        { error: "신청 정보 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "신청이 성공적으로 접수되었습니다.",
        id: application.id
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("신청 정보 저장 오류:", error);
    return NextResponse.json(
      { 
        error: "신청 정보 저장에 실패했습니다.", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

