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
      // 이미 생성된 반복 예약이 있는지 확인 (중복 생성 방지)
      const allBookingsCheck = await bookingApi.getAll();
      const existingRecurringCount = allBookingsCheck.filter(b => b.parent_booking_id === existingBooking.id).length;
      
      // 날짜 범위 계산하여 예상되는 반복 예약 개수와 비교
      const [baseYear, baseMonth, baseDay] = existingBooking.date.split('-').map(Number);
      const [endYear, endMonth, endDay] = existingBooking.recurring_end_date.split('-').map(Number);
      const baseDate = new Date(baseYear, baseMonth - 1, baseDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);
      
      // 예상 반복 예약 개수 계산 (원본 날짜 제외)
      let expectedCount = 0;
      let recurringDays: number[] = [];
      if (Array.isArray(existingBooking.recurring_days_of_week)) {
        recurringDays = existingBooking.recurring_days_of_week;
      } else if (typeof existingBooking.recurring_days_of_week === 'string') {
        try {
          recurringDays = JSON.parse(existingBooking.recurring_days_of_week);
        } catch (e) {
          console.error('recurring_days_of_week 파싱 오류:', e);
          recurringDays = [];
        }
      }
      
      let tempDate = new Date(baseDate);
      tempDate.setDate(tempDate.getDate() + 1); // 원본 날짜 다음 날부터
      while (tempDate <= endDate) {
        const jsDayOfWeek = tempDate.getDay();
        // 월요일=0 기준으로 변환: 월=0, 화=1, 수=2, 목=3, 금=4, 토=5, 일=6
        const dayOfWeek = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;
        if (recurringDays.includes(dayOfWeek)) {
          expectedCount++;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }
      
      // pending에서 approved로 변경되는 경우, 또는 반복 예약이 충분히 생성되지 않은 경우 생성
      const shouldCreateRecurring = existingBooking.status === 'pending' || existingRecurringCount < expectedCount;
      
      console.log('반복 예약 생성 조건 확인:', {
        existingStatus: existingBooking.status,
        existingRecurringCount,
        expectedCount,
        shouldCreateRecurring
      });
      
      if (shouldCreateRecurring) {
        console.log('🔄 반복 예약 생성 시작:', {
          baseDate: existingBooking.date,
          endDate: existingBooking.recurring_end_date,
          recurringDays,
          recurringDaysLabels: recurringDays.map(d => ['월', '화', '수', '목', '금', '토', '일'][d]),
          startTime: existingBooking.startTime,
          endTime: existingBooking.endTime,
          existingBookingId: existingBooking.id,
          existingStatus: existingBooking.status,
          existingRecurringCount
        });
        
        const createdRecurringBookings: Booking[] = [];
        
        // 시작일부터 종료일까지 반복 예약 생성 (원본 예약 날짜 포함)
        let currentDate = new Date(baseDate);
        
        let checkedDates = 0;
        let matchedDates = 0;
        
        // 모든 기존 예약을 한 번만 가져오기 (성능 최적화)
        const allExistingBookings = await bookingApi.getAll();
        
        while (currentDate <= endDate) {
          checkedDates++;
          const jsDayOfWeek = currentDate.getDay(); // JavaScript getDay(): 0=일요일, 1=월요일, ..., 6=토요일
          // 월요일=0 기준으로 변환: 월=0, 화=1, 수=2, 목=3, 금=4, 토=5, 일=6
          const dayOfWeek = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;
          const dayLabel = ['월', '화', '수', '목', '금', '토', '일'][dayOfWeek];
          
          // 선택된 요일인 경우에만 예약 생성
          if (recurringDays.includes(dayOfWeek)) {
            matchedDates++;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            
            console.log(`  ✓ 매칭된 날짜: ${dateStr} (${dayLabel}요일, dayOfWeek=${dayOfWeek})`);
            
            // 원본 예약 날짜는 이미 승인되어 있으므로 건너뛰기
            if (dateStr === existingBooking.date) {
              console.log(`  ⏭️ 원본 예약 날짜 건너뛰기: ${dateStr}`);
              currentDate.setDate(currentDate.getDate() + 1);
              continue;
            }
            
            // 이미 존재하는 예약인지 확인 (중복 방지)
            const alreadyExists = allExistingBookings.some(
              b => b.date === dateStr && 
                   b.startTime === existingBooking.startTime && 
                   b.endTime === existingBooking.endTime &&
                   (b.status === 'approved' || b.parent_booking_id === existingBooking.id)
            );
            
            if (!alreadyExists) {
              try {
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
                  console.log(`✅ 반복 예약 생성 성공: ${dateStr} ${existingBooking.startTime} ~ ${existingBooking.endTime} (요일: ${['월', '화', '수', '목', '금', '토', '일'][dayOfWeek]})`);
                } else {
                  console.error(`❌ 반복 예약 생성 실패 (null 반환): ${dateStr}`);
                }
              } catch (error) {
                console.error(`❌ 반복 예약 생성 오류: ${dateStr}`, error);
              }
            } else {
              console.log(`⏭️ 이미 존재하는 예약 건너뛰기: ${dateStr}`);
            }
          }
          
          // 다음 날로 이동
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        console.log(`반복 예약 생성 완료: 총 ${checkedDates}일 확인, ${matchedDates}일 매칭, ${createdRecurringBookings.length}개 생성`);
        
        if (createdRecurringBookings.length === 0 && matchedDates > 0) {
          console.error('⚠️ 반복 예약 생성 실패 - 디버깅 정보:', {
            baseDate: existingBooking.date,
            endDate: existingBooking.recurring_end_date,
            recurringDays,
            checkedDates,
            matchedDates,
            recurringDaysType: typeof existingBooking.recurring_days_of_week,
            recurringDaysValue: existingBooking.recurring_days_of_week,
            existingBookingId: existingBooking.id
          });
        }
      } else if (hasExistingRecurring) {
        console.log('ℹ️ 이미 반복 예약이 생성되어 있음:', existingBooking.id);
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

    // 삭제할 예약 정보 조회
    const existingBookings = await bookingApi.getAll();
    const bookingToDelete = existingBookings.find(b => b.id === id);
    
    if (!bookingToDelete) {
      return NextResponse.json(
        { error: "예약을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    let deletedCount = 0;

    // 반복 예약인 경우: 원본 예약이면 모든 관련 예약 삭제, 자동 생성된 예약이면 원본과 모든 관련 예약 삭제
    if (bookingToDelete.is_recurring || bookingToDelete.parent_booking_id) {
      const parentId = bookingToDelete.is_recurring ? bookingToDelete.id : bookingToDelete.parent_booking_id;
      
      if (parentId) {
        // 원본 예약과 모든 자동 생성된 예약 삭제
        const allRelatedBookings = existingBookings.filter(
          b => b.id === parentId || b.parent_booking_id === parentId
        );
        
        for (const booking of allRelatedBookings) {
          const success = await bookingApi.delete(booking.id);
          if (success) {
            deletedCount++;
          }
        }
        
        console.log(`반복 예약 전체 삭제: ${deletedCount}개 삭제됨`);
      }
    } else {
      // 일반 예약인 경우 단일 삭제
      const success = await bookingApi.delete(id);
      if (success) {
        deletedCount = 1;
      }
    }

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: "예약 정보 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deletedCount });
  } catch (error: any) {
    console.error("예약 정보 삭제 오류:", error);
    return NextResponse.json(
      { error: "예약 정보 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}

