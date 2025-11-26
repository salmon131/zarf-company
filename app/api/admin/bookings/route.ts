import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { bookingApi, Booking } from "@/lib/supabase";

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

    // 예약 정보 조회
    const bookings = await bookingApi.getAll();

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("예약 정보 조회 오류:", error);
    return NextResponse.json(
      { error: "예약 정보 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 인증 확인
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "예약 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 기존 예약 정보 조회
    const existingBookings = await bookingApi.getAll();
    const existingBooking = existingBookings.find(b => b.id === id);
    
    if (!existingBooking) {
      return NextResponse.json(
        { error: "예약을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const updatedBooking = await bookingApi.update(id, updates);

    if (!updatedBooking) {
      return NextResponse.json(
        { error: "예약 정보 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    // 반복 예약이 승인된 경우 자동으로 반복 예약 생성
    if (updates.status === 'approved' && existingBooking.is_recurring && existingBooking.recurring_days_of_week && existingBooking.recurring_end_date) {
      // 날짜 문자열을 직접 파싱하여 타임존 문제 방지
      const [baseYear, baseMonth, baseDay] = existingBooking.date.split('-').map(Number);
      const [endYear, endMonth, endDay] = existingBooking.recurring_end_date.split('-').map(Number);
      
      const baseDate = new Date(baseYear, baseMonth - 1, baseDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);
      const recurringDays = existingBooking.recurring_days_of_week;
      
      const createdRecurringBookings: Booking[] = [];
      
      // 시작일부터 종료일까지 반복 예약 생성
      let currentDate = new Date(baseDate);
      
      // 원본 예약 날짜도 포함하여 시작 (원본 예약은 이미 승인되어 있지만, 반복 요일에 포함되어야 함)
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        
        // 선택된 요일인 경우에만 예약 생성
        if (recurringDays.includes(dayOfWeek)) {
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
          
          // 원본 예약 날짜는 이미 승인되어 있으므로 건너뛰기
          if (dateStr === existingBooking.date) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
          }
          
          // 이미 존재하는 예약인지 확인 (중복 방지)
          const existingBookings = await bookingApi.getAll();
          const alreadyExists = existingBookings.some(
            b => b.date === dateStr && 
                 b.startTime === existingBooking.startTime && 
                 b.endTime === existingBooking.endTime &&
                 b.status === 'approved'
          );
          
          if (!alreadyExists) {
            const recurringBooking = await bookingApi.create({
              date: dateStr,
              startTime: existingBooking.startTime,
              endTime: existingBooking.endTime,
              name: existingBooking.name,
              email: existingBooking.email,
              phone: existingBooking.phone,
              purpose: existingBooking.purpose,
              title: existingBooking.title,
              status: 'approved', // 자동 승인
              is_recurring: false, // 반복 생성된 예약은 개별 예약으로 표시
              parent_booking_id: existingBooking.id, // 원본 예약 ID 저장 (admin 페이지에서 필터링용)
            });
            
            if (recurringBooking) {
              createdRecurringBookings.push(recurringBooking);
            }
          }
        }
        
        // 다음 날로 이동
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      if (createdRecurringBookings.length > 0) {
        console.log(`${createdRecurringBookings.length}개의 반복 예약이 자동 생성되었습니다.`);
      } else {
        console.log('반복 예약 생성: 생성된 예약이 없습니다.');
        console.log('원본 예약 정보:', {
          date: existingBooking.date,
          recurring_days_of_week: existingBooking.recurring_days_of_week,
          recurring_end_date: existingBooking.recurring_end_date
        });
      }
    }

    return NextResponse.json({ booking: updatedBooking });
  } catch (error: any) {
    console.error("예약 정보 수정 오류:", error);
    return NextResponse.json(
      { error: "예약 정보 수정에 실패했습니다." },
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
        { error: "예약 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const success = await bookingApi.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "예약 정보 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("예약 정보 삭제 오류:", error);
    return NextResponse.json(
      { error: "예약 정보 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}

