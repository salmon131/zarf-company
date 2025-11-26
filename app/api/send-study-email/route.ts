import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studyType, phone, preferredTime, ageRange, desiredContent } = body;

    // 필수 필드 검증
    if (!studyType || !phone || !preferredTime || !ageRange) {
      return NextResponse.json(
        { error: "필수 필드를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 전송 설정
    // 환경 변수에서 SMTP 설정을 가져옵니다
    // SMTP_USER가 없으면 EMAIL_TO를 발신자로도 사용 (같은 계정 사용)
    const emailTo = process.env.EMAIL_TO || "qk006@naver.com";
    const smtpUser = process.env.SMTP_USER || emailTo;
    const emailFrom = process.env.EMAIL_FROM || smtpUser;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.naver.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // 587 포트는 false, 465 포트는 true
      auth: {
        user: smtpUser,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 이메일 내용 구성
    const emailContent = `
스터디 신청이 접수되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 신청 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

스터디 유형: ${studyType}
전화번호: ${phone}
희망 시간: ${preferredTime}
나이대: ${ageRange}
원하는 수업 내용: ${desiredContent || "없음"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

신청일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
    `.trim();

    // 이메일 전송
    const info = await transporter.sendMail({
      from: `"자프 컴퍼니" <${emailFrom}>`,
      to: emailTo,
      subject: `[스터디 신청] ${studyType}`,
      text: emailContent,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff8f0;">
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">스터디 신청이 접수되었습니다</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 25px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">📋 신청 정보</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 0; color: #6b7280; font-weight: 600; width: 140px;">스터디 유형</td>
                  <td style="padding: 12px 0; color: #1f2937;">${studyType}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">전화번호</td>
                  <td style="padding: 12px 0; color: #1f2937;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">희망 시간</td>
                  <td style="padding: 12px 0; color: #1f2937;">${preferredTime}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">나이대</td>
                  <td style="padding: 12px 0; color: #1f2937;">${ageRange}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-weight: 600;">원하는 수업 내용</td>
                  <td style="padding: 12px 0; color: #1f2937;">${desiredContent || "없음"}</td>
                </tr>
              </table>
            </div>
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              신청일시: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "이메일이 성공적으로 전송되었습니다.",
        messageId: info.messageId 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("이메일 전송 오류:", error);
    return NextResponse.json(
      { 
        error: "이메일 전송에 실패했습니다.", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

