"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { bookingApi } from "@/lib/supabase";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  title?: string; // 관리자가 설정하는 스케줄 제목
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface TimeSlot {
  hour: number;
  bookings: Booking[];
}

interface DaySchedule {
  date: string;
  dayName: string;
  day: number;
  month: number;
  year: number;
  isToday: boolean;
  slots: TimeSlot[];
}

export default function MeetingRoomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedStartTime, setSelectedStartTime] = useState<{ date: string; hour: number; minute: number } | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<{ date: string; hour: number; minute: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ date: string; hour: number; minute: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ date: string; hour: number; minute: number } | null>(null);
  const [hasDragged, setHasDragged] = useState(false); // 실제 드래그가 발생했는지 추적
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPendingList, setShowPendingList] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null); // 마우스 위치 추적용
  
  // 관리자 권한 관리
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 예약 편집 모달
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalPosition, setEditModalPosition] = useState<{ x: number; y: number } | null>(null);

  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    purpose: "",
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  // 예약 데이터
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Supabase에서 예약 데이터 불러오기
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async () => {
    setIsLoading(true);
    const data = await bookingApi.getAll();
    setBookings(data);
    setIsLoading(false);
  };
  
  // 관리자 PIN 확인 (localStorage에서 확인)
  useEffect(() => {
    const adminAccess = localStorage.getItem('adminAccess');
    if (adminAccess === 'true') {
      setIsAdmin(true);
    }
  }, []);
  
  // 관리자 로그인
  const handleAdminLogin = () => {
    const pin = prompt('관리자 PIN을 입력하세요:');
    const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234'; // 기본값 1234
    
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      localStorage.setItem('adminAccess', 'true');
      alert('관리자 모드로 전환되었습니다.');
    } else if (pin) {
      alert('잘못된 PIN입니다.');
    }
  };
  
  // 관리자 로그아웃
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminAccess');
    alert('관리자 모드가 해제되었습니다.');
  };
  
  // 예약 블록 클릭 핸들러
  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    if (!isAdmin) return; // 관리자만 편집 가능
    
    e.stopPropagation();
    
    // 블록의 시작 시간으로 해당 셀 찾기
    if (calendarRef.current) {
      const [startHour] = booking.startTime.split(':').map(Number);
      
      // 해당 날짜와 시간의 셀을 찾기
      const gridContainer = calendarRef.current.querySelector('.overflow-y-auto');
      if (gridContainer) {
        // 날짜별 인덱스 찾기
        const dayIndex = weekSchedule.findIndex(day => day.date === booking.date);
        
        if (dayIndex >= 0) {
          // 해당 시간의 행 찾기 (9시부터 시작하므로 startHour - 9)
          const hourRows = gridContainer.querySelectorAll('.grid.grid-cols-8.border-b');
          const targetRow = hourRows[startHour - 9];
          
          if (targetRow) {
            // 해당 날짜의 셀 찾기 (첫 번째는 시간 열이므로 dayIndex + 1)
            const cells = targetRow.querySelectorAll('.relative.border-r');
            const clickedCell = cells[dayIndex] as HTMLElement;
            
            if (clickedCell) {
              const prevCellPos = getPreviousDayCellPosition(clickedCell, booking.date);
              if (prevCellPos) {
                setEditModalPosition(prevCellPos);
              } else {
                // 이전 셀이 없으면 기본 위치
                const rect = clickedCell.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                setEditModalPosition({
                  x: rect.left + scrollLeft,
                  y: rect.top + scrollTop
                });
              }
            }
          }
        }
      }
    }
    
    setEditingBooking(booking);
    setShowEditModal(true);
  };
  
  // 예약 수정
  const handleUpdateBooking = async (updatedBooking: Booking) => {
    // 시간 유효성 검사
    const [startHour, startMinute] = updatedBooking.startTime.split(':').map(Number);
    const [endHour, endMinute] = updatedBooking.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes <= startMinutes) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }
    
    // 다른 승인된 예약과 겹치는지 확인 (자기 자신 제외)
    const otherApprovedBookings = bookings.filter(
      b => b.id !== updatedBooking.id && 
           b.date === updatedBooking.date && 
           b.status === "approved"
    );
    
    for (const booking of otherApprovedBookings) {
      const [bookingStartHour, bookingStartMinute] = booking.startTime.split(':').map(Number);
      const [bookingEndHour, bookingEndMinute] = booking.endTime.split(':').map(Number);
      const bookingStartMinutes = bookingStartHour * 60 + bookingStartMinute;
      const bookingEndMinutes = bookingEndHour * 60 + bookingEndMinute;
      
      // 시간 범위가 겹치는지 확인
      if (!(endMinutes <= bookingStartMinutes || startMinutes >= bookingEndMinutes)) {
        alert('해당 시간대에 이미 승인된 예약이 있습니다.');
        return;
      }
    }
    
    // Supabase에 업데이트
    const result = await bookingApi.update(updatedBooking.id, updatedBooking);
    
    if (result) {
      // 로컬 상태 업데이트
      setBookings((prev) =>
        prev.map((b) => (b.id === updatedBooking.id ? result : b))
      );
      setShowEditModal(false);
      setEditingBooking(null);
      setEditModalPosition(null);
      alert('예약이 수정되었습니다.');
    } else {
      alert('예약 수정에 실패했습니다.');
    }
  };
  
  // 예약 삭제
  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm('정말 이 예약을 삭제하시겠습니까?')) {
      const success = await bookingApi.delete(bookingId);
      
      if (success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        setShowEditModal(false);
        setEditingBooking(null);
        setEditModalPosition(null);
        alert('예약이 삭제되었습니다.');
      } else {
        alert('예약 삭제에 실패했습니다.');
      }
    }
  };

  // 현재 시간 계산 (1분마다 업데이트)
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return {
      date: now.toISOString().split("T")[0],
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
    };
  });

  // 현재 시간 실시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime({
        date: now.toISOString().split("T")[0],
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      });
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 주간 뷰 데이터 생성
  const weekSchedule = useMemo(() => {
    const schedule: DaySchedule[] = [];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 현재 주의 시작일 (월요일)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dateStr = date.toISOString().split("T")[0];
      const isToday = dateStr === today.toISOString().split("T")[0];
      
      // 시간대별 예약 정보 생성 (9시 ~ 24시, 30분 단위)
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour < 24; hour++) {
        const dayBookings = bookings.filter(
          (b) => {
            const bookingDate = b.date;
            const [startHour, startMinute] = b.startTime.split(":").map(Number);
            const [endHour, endMinute] = b.endTime.split(":").map(Number);
            
            if (bookingDate !== dateStr) return false;
            
            // 시간대가 겹치는지 확인
            const slotStart = hour * 60;
            const slotEnd = (hour + 1) * 60;
            const bookingStart = startHour * 60 + startMinute;
            const bookingEnd = endHour * 60 + endMinute;
            
            return bookingStart < slotEnd && bookingEnd > slotStart;
          }
        );
        slots.push({
          hour,
          bookings: dayBookings,
        });
      }
      
      schedule.push({
        date: dateStr,
        dayName: dayNames[date.getDay()],
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isToday,
        slots,
      });
    }
    
    return schedule;
  }, [currentDate, bookings]);

  // 월간 뷰 데이터 생성
  const monthSchedule = useMemo(() => {
    const schedule: DaySchedule[] = [];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // 이전 달의 마지막 날들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateStr = date.toISOString().split("T")[0];
      const isToday = dateStr === today.toISOString().split("T")[0];
      
      schedule.push({
        date: dateStr,
        dayName: dayNames[date.getDay()],
        day: date.getDate(),
        month: month - 1,
        year,
        isToday,
        slots: [],
      });
    }
    
    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      const isToday = dateStr === today.toISOString().split("T")[0];
      
      schedule.push({
        date: dateStr,
        dayName: dayNames[date.getDay()],
        day,
        month,
        year,
        isToday,
        slots: [],
      });
    }
    
    // 다음 달의 첫 날들 (6주 채우기)
    const remainingDays = 42 - schedule.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toISOString().split("T")[0];
      const isToday = dateStr === today.toISOString().split("T")[0];
      
      schedule.push({
        date: dateStr,
        dayName: dayNames[date.getDay()],
        day,
        month: month + 1,
        year,
        isToday,
        slots: [],
      });
    }
    
    return schedule;
  }, [currentDate, bookings]);

  // 마우스 위치에서 시간 계산 (전체 그리드 기준)
  const getTimeFromMousePosition = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string
  ): { hour: number; minute: number } | null => {
    if (!calendarRef.current) return null;
    
    const calendarRect = calendarRef.current.getBoundingClientRect();
    const gridRect = e.currentTarget.closest('.grid')?.getBoundingClientRect();
    if (!gridRect) return null;
    
    // 시간 컬럼을 제외한 그리드 시작 위치
    const gridStartY = gridRect.top;
    const y = e.clientY - gridStartY;
    
    const hourHeight = 60; // 1시간당 60px
    const totalMinutes = (y / hourHeight) * 60;
    const hour = Math.floor(totalMinutes / 60) + 9; // 9시부터 시작
    const minute = Math.floor((totalMinutes % 60) / 15) * 15; // 15분 단위로 반올림
    
    if (hour < 9 || hour >= 24) return null;
    if (minute >= 60) {
      return { hour: hour + 1, minute: 0 };
    }
    
    return { hour, minute };
  };

  // 블록의 위/중간 판단 (15분 기준)
  const getTimeFromBlockPosition = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string,
    hour: number
  ): { hour: number; minute: number } => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // 클릭한 셀 내에서의 상대 위치
    const y = e.clientY - rect.top;
    const cellHeight = rect.height; // 실제 셀 높이
    
    // 15분 단위 계산 (4등분)
    const quarter = Math.floor((y / cellHeight) * 4);
    const minute = Math.min(quarter * 15, 45); // 최대 45분
    
    return { hour, minute };
  };

  // 클릭한 날짜 셀의 이전 날짜 셀 위치 계산 (9시 셀 상단 라인)
  const getPreviousDayCellPosition = (
    clickedElement: HTMLDivElement,
    date: string
  ): { x: number; y: number } | null => {
    if (!calendarRef.current) return null;
    
    // 캘린더 그리드 컨테이너 찾기
    const calendarRect = calendarRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // 클릭한 날짜의 열 인덱스 찾기
    const dayIndex = weekSchedule.findIndex(day => day.date === date);
    if (dayIndex === -1) return null;
    
    // 이전 날짜 셀의 위치 계산
    const columnWidth = calendarRect.width / 8; // 8개 열 (시간 + 7일)
    const prevColumnIndex = dayIndex; // 이전 날짜 (dayIndex는 0부터 시작)
    
    // 헤더 높이만큼 아래 = 9시 셀의 상단 라인
    const headerHeight = 80; // p-4 패딩 포함 헤더 높이
    const modalTop = headerHeight;
    
    if (prevColumnIndex < 0) {
      // 첫 번째 날짜인 경우 시간 열 옆에 배치
      return {
        x: calendarRect.left + scrollLeft + columnWidth - 20,
        y: calendarRect.top + scrollTop + modalTop
      };
    }
    
    // 이전 날짜 셀의 오른쪽 끝 위치
    return {
      x: calendarRect.left + scrollLeft + (prevColumnIndex + 1) * columnWidth - 20,
      y: calendarRect.top + scrollTop + modalTop
    };
  };

  // 시간 범위가 승인된 예약과 겹치는지 확인하는 함수
  const hasApprovedBookingInRange = (date: string, startHour: number, startMinute: number, endHour: number, endMinute: number): boolean => {
    const approvedBookings = bookings.filter(b => b.date === date && b.status === "approved");
    
    for (const booking of approvedBookings) {
      const [bookingStartHour, bookingStartMinute] = booking.startTime.split(':').map(Number);
      const [bookingEndHour, bookingEndMinute] = booking.endTime.split(':').map(Number);
      
      const newStartMinutes = startHour * 60 + startMinute;
      const newEndMinutes = endHour * 60 + endMinute;
      const bookingStartMinutes = bookingStartHour * 60 + bookingStartMinute;
      const bookingEndMinutes = bookingEndHour * 60 + bookingEndMinute;
      
      // 시간 범위가 겹치는지 확인
      if (!(newEndMinutes <= bookingStartMinutes || newStartMinutes >= bookingEndMinutes)) {
        return true; // 겹침
      }
    }
    
    return false; // 겹치지 않음
  };

  const handleTimeSlotMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string,
    hour: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const time = getTimeFromBlockPosition(e, date, hour);
    const startTime = { date, ...time };
    
    // 승인된 예약이 있는지 확인
    if (hasApprovedBookingInRange(date, time.hour, time.minute, time.hour, time.minute)) {
      alert('이미 승인된 예약이 있는 시간대입니다.');
      return;
    }
    
    // 드래그 시작 시 끝 시간은 시작 시간과 동일하게 설정 (드래그로 늘어남)
    setDragStart(startTime);
    setDragEnd(startTime);
    setSelectedStartTime(startTime);
    setSelectedEndTime(startTime);
    setIsDragging(true);
    setHasDragged(false); // 드래그 시작 시 초기화
    lastMousePos.current = { x: e.clientX, y: e.clientY }; // 시작 위치 저장
    
    // 클릭한 셀 저장 (모달 위치 계산용)
    const clickedCell = e.currentTarget as HTMLDivElement;
    (lastMousePos.current as any).clickedCell = clickedCell;
  };

  const handleTimeSlotMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string
  ) => {
    if (!isDragging || !dragStart) return;
    
    const time = getTimeFromMousePosition(e, date);
    if (time && date === dragStart.date) {
      const startMinutes = dragStart.hour * 60 + dragStart.minute;
      const endMinutes = time.hour * 60 + time.minute;
      
      // 아래 방향으로만 드래그 허용 (시작 시간보다 크거나 같은 경우만)
      if (endMinutes >= startMinutes) {
        // 승인된 예약과 겹치는지 확인
        if (hasApprovedBookingInRange(date, dragStart.hour, dragStart.minute, time.hour, time.minute)) {
          // 겹치면 드래그를 더 이상 진행하지 않음
          return;
        }
      
      if (endMinutes !== startMinutes) {
        setHasDragged(true); // 실제 드래그 발생
      }
        const newEndTime = { date, ...time };
        setDragEnd(newEndTime);
        // 모달의 시간도 실시간 업데이트
        setSelectedEndTime(newEndTime);
      }
      // 위로 드래그하는 경우 무시 (역방향 드래그 방지)
    }
  };

  const handleTimeSlotMouseUp = () => {
    if (!isDragging || !dragStart) return;
    
    setIsDragging(false);
    
    // 클릭만 한 경우 (드래그 없음) - 기본 1시간 블록 생성
    if (!hasDragged && dragStart) {
        let endHour = dragStart.hour + 1;
        let endMinute = dragStart.minute;
      // 23시 이후는 24시(자정)까지 허용
      if (endHour > 24) {
        endHour = 24;
        endMinute = 0;
      }
      
      // 승인된 예약과 겹치는지 확인
      if (hasApprovedBookingInRange(dragStart.date, dragStart.hour, dragStart.minute, endHour, endMinute)) {
        alert('이미 승인된 예약이 있는 시간대입니다.');
        setDragStart(null);
        setDragEnd(null);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        return;
      }
      
      const endTime = { date: dragStart.date, hour: endHour, minute: endMinute };
      setDragEnd(endTime);
      setSelectedEndTime(endTime);
    }
    
    // 모달 위치 계산 및 표시
    if (lastMousePos.current && (lastMousePos.current as any).clickedCell) {
      const clickedCell = (lastMousePos.current as any).clickedCell;
      const prevCellPos = getPreviousDayCellPosition(clickedCell, dragStart.date);
      if (prevCellPos) {
        setModalPosition(prevCellPos);
      } else {
        // 이전 셀이 없으면 (첫 번째 날짜) 기본 위치
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        setModalPosition({
          x: lastMousePos.current.x + scrollLeft,
          y: lastMousePos.current.y + scrollTop
        });
      }
    }
    setShowBookingForm(true);
    setHasDragged(false); // 초기화
  };

  const handleTimeSlotClick = (
    e: React.MouseEvent<HTMLDivElement>,
    date: string,
    hour: number
  ) => {
    // 드래그 중이면 클릭 무시 (드래그가 끝난 후 클릭 이벤트가 발생하는 경우 방지)
    if (isDragging) return;
    
    // 마우스 다운 이벤트가 발생했지만 드래그가 없었던 경우에만 클릭 처리
    const time = getTimeFromBlockPosition(e, date, hour);
    const startTime = { date, ...time };
    
    // 기본 1시간 블록 생성
    let endHour = time.hour + 1;
    let endMinute = time.minute;
    
    if (endHour >= 24) {
      endHour = 23;
      endMinute = 59;
    }
    
    setSelectedStartTime(startTime);
    setSelectedEndTime({ date, hour: endHour, minute: endMinute });
    
    // 클릭한 셀의 이전 날짜 셀 위치 계산
    const clickedCell = e.currentTarget as HTMLDivElement;
    const prevCellPos = getPreviousDayCellPosition(clickedCell, date);
    if (prevCellPos) {
      setModalPosition(prevCellPos);
    } else {
      // 이전 셀이 없으면 (첫 번째 날짜) 기본 위치
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      setModalPosition({
        x: e.clientX + scrollLeft,
        y: e.clientY + scrollTop
      });
    }
    setShowBookingForm(true);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedStartTime || !selectedEndTime) return;
    
    const formatTime = (hour: number, minute: number) => {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };
    
    const newBookingData = {
      date: selectedStartTime.date,
      startTime: formatTime(selectedStartTime.hour, selectedStartTime.minute),
      endTime: formatTime(selectedEndTime.hour, selectedEndTime.minute),
      name: bookingData.name,
      email: "", // 이메일 필드 제거됨
      phone: bookingData.phone,
      purpose: bookingData.purpose,
      status: "pending" as const,
    };
    
    // Supabase에 예약 생성
    const createdBooking = await bookingApi.create(newBookingData);
    
    if (createdBooking) {
      // 로컬 상태 업데이트
      setBookings((prev) => [...prev, createdBooking]);
      
      // 이메일 전송
      const subject = encodeURIComponent(`[카페탱 회의실 예약 요청] ${bookingData.name}님의 예약`);
      const body = encodeURIComponent(
        `이름: ${bookingData.name}\n연락처: ${bookingData.phone}\n목적: ${bookingData.purpose}\n예약 날짜: ${selectedStartTime.date}\n예약 시간: ${newBookingData.startTime} ~ ${newBookingData.endTime}\n\n회의실 사용을 요청드립니다.`
      );
      window.location.href = `mailto:qk006@naver.com?subject=${subject}&body=${body}`;
      
      setTimeout(() => {
        setShowBookingForm(false);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setDragStart(null);
        setDragEnd(null);
        setBookingData({ name: "", phone: "", purpose: "" });
        setModalPosition(null);
      }, 500);
    } else {
      alert('예약 생성에 실패했습니다.');
    }
  };

  // 전역 마우스 이벤트 처리
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY }; // 마우스 위치 지속 추적
      
      if (!isDragging || !dragStart || !calendarRef.current) return;
      
      const gridContainer = calendarRef.current.querySelector('.overflow-y-auto');
      if (!gridContainer) return;
      
      const gridRect = gridContainer.getBoundingClientRect();
      const y = e.clientY - gridRect.top + gridContainer.scrollTop; // 스크롤 위치 포함
      
      const cellHeight = 64; // h-16 = 64px (실제 셀 높이)
      const totalMinutes = (y / cellHeight) * 60;
      const hour = Math.floor(totalMinutes / 60) + 9;
      const minute = Math.floor((totalMinutes % 60) / 15) * 15;
      
      // 9시부터 24시(자정)까지 허용
      if (hour < 9 || hour > 24) return;
      
      // 24시(자정)까지 허용
      if (hour === 24) {
        const time = { date: dragStart.date, hour: 24, minute: 0 };
        const startMinutes = dragStart.hour * 60 + dragStart.minute;
        const endMinutes = 24 * 60; // 자정 = 1440분
        
        if (endMinutes > startMinutes) {
          // 승인된 예약과 겹치는지 확인
          if (hasApprovedBookingInRange(dragStart.date, dragStart.hour, dragStart.minute, 24, 0)) {
            return;
          }
          setDragEnd(time);
          setSelectedEndTime(time);
          setHasDragged(true);
        }
        return;
      }
      
      if (minute >= 60) {
        const time = { date: dragStart.date, hour: hour + 1, minute: 0 };
        if (hour + 1 > 24) return;
        const startMinutes = dragStart.hour * 60 + dragStart.minute;
        const endMinutes = time.hour * 60 + time.minute;
        
        if (endMinutes > startMinutes) {
          // 승인된 예약과 겹치는지 확인
          if (hasApprovedBookingInRange(dragStart.date, dragStart.hour, dragStart.minute, time.hour, time.minute)) {
            return;
          }
          setDragEnd(time);
          setSelectedEndTime(time); // 모달의 시간도 실시간 업데이트
          setHasDragged(true); // 실제 드래그 발생
        }
        return;
      }
      
      const time = { date: dragStart.date, hour, minute };
      const startMinutes = dragStart.hour * 60 + dragStart.minute;
      const endMinutes = time.hour * 60 + time.minute;
      
      // 아래 방향으로만 드래그 허용 (시작 시간보다 크거나 같은 경우만)
      if (endMinutes >= startMinutes) {
        // 승인된 예약과 겹치는지 확인
        if (hasApprovedBookingInRange(dragStart.date, dragStart.hour, dragStart.minute, time.hour, time.minute)) {
          return;
        }
      
      if (endMinutes !== startMinutes) {
        setHasDragged(true); // 실제 드래그 발생
      }
        setDragEnd(time);
        // 모달의 시간도 실시간 업데이트
        setSelectedEndTime(time);
      }
      // 위로 드래그하는 경우 무시 (역방향 드래그 방지)
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleTimeSlotMouseUp();
        setHasDragged(false); // 초기화
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.userSelect = "none"; // 드래그 중 텍스트 선택 방지
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, dragStart, hasDragged]);

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const approvedBookings = bookings.filter((b) => b.status === "approved");

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  const formatWeekRange = () => {
    if (weekSchedule.length === 0) return "";
    const start = weekSchedule[0];
    const end = weekSchedule[6];
    return `${start.month + 1}/${start.day} - ${end.month + 1}/${end.day}`;
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  // 현재 시간 표시선 위치 계산
  const getCurrentTimeLinePosition = (date: string) => {
    if (date !== currentTime.date) return null;
    const totalMinutes = (currentTime.hour - 9) * 60 + currentTime.minute;
    return (totalMinutes / 60) * 60; // 1시간당 60px
  };

  return (
    <div className="space-y-6">
      {/* 캘린더 컨트롤 */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={viewMode === "week" ? handlePrevWeek : handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {viewMode === "week" ? formatWeekRange() : formatDate(currentDate)}
              </h3>
            </div>
            <button
              onClick={viewMode === "week" ? handleNextWeek : handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Button onClick={handleToday} variant="outline" size="sm">
              오늘
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "month"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              월간
            </button>
            
            {/* 관리자 로그인/로그아웃 버튼 */}
            {isAdmin ? (
              <>
            <Button
              onClick={() => setShowPendingList(!showPendingList)}
              variant="outline"
              size="sm"
            >
              승인 대기 ({pendingBookings.length})
            </Button>
                <Button
                  onClick={handleAdminLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  관리자 로그아웃
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAdminLogin}
                variant="outline"
                size="sm"
              >
                관리자 로그인
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 승인 대기 목록 */}
      {showPendingList && isAdmin && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              승인 대기 목록 ({pendingBookings.length}건)
            </h3>
            <button
              onClick={() => setShowPendingList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {pendingBookings.length === 0 ? (
            <p className="text-gray-600">승인 대기 중인 예약이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-4 rounded-lg border border-yellow-300"
                >
                  <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                          승인 대기
                        </span>
                        <span className="text-sm text-gray-600">
                          {booking.date} {booking.startTime} ~ {booking.endTime}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">{booking.name}</p>
                      <p className="text-sm text-gray-600">{booking.phone}</p>
                      {booking.purpose && (
                        <p className="text-sm text-gray-700 mt-2">{booking.purpose}</p>
                      )}
                    </div>
                    </div>
                    
                    {/* 스케줄 제목 입력 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        스케줄 제목 (캘린더에 표시될 이름)
                      </label>
                      <input
                        type="text"
                        defaultValue={booking.title || ''}
                        placeholder="예: 팀 회의, 고객 미팅 등"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        onChange={(e) => {
                          setBookings((prev) =>
                            prev.map((b) =>
                              b.id === booking.id ? { ...b, title: e.target.value } : b
                            )
                          );
                        }}
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={async () => {
                          const currentBooking = bookings.find(b => b.id === booking.id);
                          if (!currentBooking?.title || currentBooking.title.trim() === '') {
                            alert('스케줄 제목을 입력해주세요.');
                            return;
                          }
                          
                          // Supabase에 승인 업데이트
                          const result = await bookingApi.approve(booking.id, currentBooking.title);
                          
                          if (result) {
                            setBookings((prev) =>
                              prev.map((b) =>
                                b.id === booking.id ? result : b
                              )
                            );
                            alert('예약이 승인되었습니다.');
                          } else {
                            alert('예약 승인에 실패했습니다.');
                          }
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        승인
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('정말 이 예약을 거부하시겠습니까?')) {
                            const success = await bookingApi.delete(booking.id);
                            
                            if (success) {
                              setBookings((prev) => prev.filter((b) => b.id !== booking.id));
                              alert('예약이 거부되었습니다.');
                            } else {
                              alert('예약 거부에 실패했습니다.');
                            }
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        거부
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-gray-600">예약 정보를 불러오는 중...</span>
        </div>
      )}

      {/* 주간 뷰 */}
      {!isLoading && viewMode === "week" && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto" ref={calendarRef}>
            <div className="min-w-[800px]">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-4 border-r border-gray-200 bg-gray-50">
                  <div className="text-sm font-semibold text-gray-600">시간</div>
                </div>
                {weekSchedule.map((day) => (
                  <div
                    key={day.date}
                    className={`p-4 text-center border-r border-gray-200 ${
                      day.isToday ? "bg-brand-50" : "bg-white"
                    }`}
                  >
                    <div className="text-xs text-gray-600 mb-1">{day.dayName}</div>
                    <div
                      className={`text-lg font-bold ${
                        day.isToday ? "text-brand-600" : "text-gray-900"
                      }`}
                    >
                      {day.day}
                    </div>
                  </div>
                ))}
              </div>

              {/* 시간대 그리드 */}
              <div className="relative max-h-[600px] overflow-y-auto" id="calendar-grid">
                {/* 통합된 선택 블록 (그리드 위에 오버레이) */}
                {dragStart && dragEnd && (
                  (() => {
                    // 선택된 날짜의 열 인덱스 찾기 (시간 열 제외하고 1부터 시작)
                    const dayIndex = weekSchedule.findIndex(day => day.date === dragStart.date);
                    if (dayIndex === -1) return null;
                    
                    const startMinutes = dragStart.hour * 60 + dragStart.minute;
                    const endMinutes = dragEnd.hour * 60 + dragEnd.minute;
                    const durationMinutes = endMinutes - startMinutes;
                    
                    // 블록이 보이지 않는 경우 (시작과 끝이 같음) 렌더링하지 않음
                    if (durationMinutes <= 0) return null;
                    
                    // 위치 계산 (셀 높이 h-16 = 64px)
                    const columnWidth = 100 / 8; // 8개 열 (시간 + 7일)
                    const left = (dayIndex + 1) * columnWidth; // +1은 시간 열 건너뛰기
                    const cellHeight = 64; // h-16 = 64px
                    const top = (dragStart.hour - 9) * cellHeight + (dragStart.minute / 60) * cellHeight; // 9시부터 시작
                    const height = (durationMinutes / 60) * cellHeight; // 1시간당 64px
                    
                    // 시간 포맷팅
                    const formatTime = (hour: number, minute: number) => {
                      // 24시는 자정(오전 12시)으로 표시
                      if (hour === 24) {
                        return '자정';
                      }
                      const period = hour < 12 ? '오전' : '오후';
                      const displayHour = hour === 0 ? 12 : hour <= 12 ? hour : hour - 12;
                      return `${period} ${displayHour}:${minute.toString().padStart(2, '0')}`;
                    };
                    
                    const startTimeStr = formatTime(dragStart.hour, dragStart.minute);
                    const endTimeStr = formatTime(dragEnd.hour, dragEnd.minute);
                    
                    return (
                      <div
                        className="absolute z-30 pointer-events-none"
                        style={{
                          left: `${left}%`,
                          width: `calc(${columnWidth}% - 10px)`,
                          top: `${top}px`,
                          height: `${height}px`,
                          borderRadius: "12px",
                          background: "#fbbf24", // amber-400 (브랜드 컬러)
                          boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(245, 158, 11, 0.2)",
                          padding: "8px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#ffffff",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}>
                          {startTimeStr} ~ {endTimeStr}
                        </div>
                      </div>
                    );
                  })()
                )}
                
                {/* 통합 예약 블록 렌더링 */}
                {(() => {
                  const bookingBlocks: JSX.Element[] = [];
                  
                  weekSchedule.forEach((day, dayIndex) => {
                    const dayBookings = bookings.filter((b) => b.date === day.date);
                    
                    dayBookings.forEach((booking) => {
                      const [startHour, startMinute] = booking.startTime.split(':').map(Number);
                      const [endHour, endMinute] = booking.endTime.split(':').map(Number);
                      
                      const cellHeight = 64; // h-16
                      const top = (startHour - 9) * cellHeight + (startMinute / 60) * cellHeight;
                      const durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                      const height = (durationMinutes / 60) * cellHeight;
                      
                      const columnWidth = 100 / 8; // 8 columns (time + 7 days)
                      const left = columnWidth * (dayIndex + 1); // +1 to skip time column
                      
                      const isPending = booking.status === "pending";
                      const bgColor = "#fbbf24"; // amber-400 (브랜드 컬러)
                      const opacity = isPending ? 0.5 : 1; // 대기는 반투명하게
                      
                      bookingBlocks.push(
                        <div
                          key={booking.id}
                          className={`absolute z-20 ${isAdmin ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
                          onClick={(e) => handleBookingClick(booking, e)}
                          style={{
                            left: `${left}%`,
                            width: `calc(${columnWidth}% - 10px)`,
                            top: `${top}px`,
                            height: `${height}px`,
                            borderRadius: "12px",
                            background: bgColor,
                            opacity: opacity,
                            boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(245, 158, 11, 0.2)",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (isAdmin) {
                              e.currentTarget.style.transform = "scale(1.02)";
                              e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(245, 158, 11, 0.4), 0 10px 10px -5px rgba(245, 158, 11, 0.3)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isAdmin) {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -2px rgba(245, 158, 11, 0.2)";
                            }
                          }}
                        >
                          <div style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#ffffff",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}>
                            {booking.title || booking.name}
                          </div>
                          <div style={{
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "#ffffff",
                            textAlign: "center",
                            marginTop: "2px",
                            opacity: 0.9,
                          }}>
                            {booking.startTime} ~ {booking.endTime}
                          </div>
                          {isPending && (
                            <div style={{
                              fontSize: "10px",
                              fontWeight: "500",
                              color: "#ffffff",
                              textAlign: "center",
                              marginTop: "2px",
                              opacity: 0.8,
                            }}>
                              (대기)
                            </div>
                          )}
                        </div>
                      );
                    });
                  });
                  
                  return bookingBlocks;
                })()}
                
                {Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                    <div className="p-2 border-r border-gray-200 bg-gray-50 text-sm text-gray-600 text-center">
                      {hour}:00
                    </div>
                    {weekSchedule.map((day) => {
                      // 현재 시간 표시선 계산
                      const currentTimeLineTop = day.date === currentTime.date && hour === currentTime.hour
                        ? (currentTime.minute / 60) * 60 // 각 시간 슬롯 내에서의 분 위치 (60px = 1시간)
                        : null;

                      return (
                        <div
                          key={`${day.date}-${hour}`}
                          className="relative border-r border-gray-100 h-16 cursor-pointer transition-colors"
                          onMouseDown={(e) => handleTimeSlotMouseDown(e, day.date, hour)}
                          onMouseMove={(e) => handleTimeSlotMouseMove(e, day.date)}
                        >
                          {/* 현재 시간 표시선 */}
                          {currentTimeLineTop !== null && (
                            <div
                              className="absolute left-0 right-0 z-20 pointer-events-none"
                              style={{
                                top: `${currentTimeLineTop}px`,
                                height: "2px",
                                backgroundColor: "#ef4444",
                              }}
                            >
                              <div
                                className="absolute -left-2 -top-1 w-3 h-3 rounded-full bg-red-500"
                              />
                            </div>
                          )}
                          
                          {/* 호버 효과 */}
                          <div className="absolute inset-0 bg-transparent hover:bg-gray-50 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 월간 뷰 */}
      {!isLoading && viewMode === "month" && (
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="p-4 text-center bg-gray-50 border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-semibold text-gray-600">{day}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthSchedule.map((day) => {
              const dayBookings = bookings.filter(
                (b) => b.date === day.date
              );
              const isOtherMonth = day.month !== currentDate.getMonth();

              return (
                <div
                  key={day.date}
                  className={`min-h-[100px] border-r border-b border-gray-100 p-2 ${
                    isOtherMonth ? "bg-gray-50" : "bg-white"
                  } ${day.isToday ? "ring-2 ring-brand-500" : ""}`}
                >
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      day.isToday ? "text-brand-600" : isOtherMonth ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {day.day}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => {
                      const isPending = booking.status === "pending";
                      const bgColor = isPending ? "bg-amber-400" : "bg-amber-400";
                      const opacity = isPending ? "opacity-50" : "opacity-100";
                      
                      return (
                      <div
                        key={booking.id}
                          className={`${bgColor} ${opacity} text-white text-xs rounded px-1 py-0.5 truncate`}
                      >
                          {booking.startTime} {booking.title || booking.name} {isPending && "(대기)"}
                      </div>
                      );
                    })}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-500">+{dayBookings.length - 3}개</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 예약 폼 - 이전 날짜 셀에 배치 */}
      {showBookingForm && selectedStartTime && selectedEndTime && modalPosition && (
          <div 
          className="absolute pointer-events-auto w-96 z-50"
            style={{
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
            transform: 'translate(-100%, 0)' // 모달 너비만큼 왼쪽으로 이동 (이전 셀 안에 배치)
            }}
          >
            <Card className="p-6 bg-white shadow-2xl border-2 border-brand-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  회의실 예약 요청
                </h3>
                <button
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedStartTime(null);
                    setSelectedEndTime(null);
                    setDragStart(null);
                    setDragEnd(null);
                    setModalPosition(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 mb-4 text-sm font-semibold bg-brand-50 p-2 rounded">
                {selectedStartTime.date} {formatTime(selectedStartTime.hour, selectedStartTime.minute)} ~ {formatTime(selectedEndTime.hour, selectedEndTime.minute)}
              </p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="booking-name"
                    name="name"
                    value={bookingData.name}
                    onChange={handleBookingInputChange}
                    required
                    placeholder="이름을 입력해주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* 이메일 필드 제거됨 */}

                <div>
                  <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="booking-phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleBookingInputChange}
                    required
                    placeholder="연락 가능한 전화번호를 입력해주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="booking-purpose" className="block text-sm font-medium text-gray-700 mb-2">
                    사용 목적
                  </label>
                  <textarea
                    id="booking-purpose"
                    name="purpose"
                    value={bookingData.purpose}
                    onChange={handleBookingInputChange}
                    rows={3}
                    placeholder="회의실 사용 목적을 간단히 적어주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedStartTime(null);
                      setSelectedEndTime(null);
                      setDragStart(null);
                      setDragEnd(null);
                      setBookingData({ name: "", phone: "", purpose: "" });
                      setModalPosition(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    예약 요청
                  </Button>
                </div>
              </form>
            </Card>
          </div>
      )}

      {/* 예약 편집 모달 */}
      {showEditModal && editingBooking && isAdmin && editModalPosition && (
        <div 
          className="absolute pointer-events-auto w-96 z-50"
          style={{
            left: `${editModalPosition.x}px`,
            top: `${editModalPosition.y}px`,
            transform: 'translate(-100%, 0)' // 모달 너비만큼 왼쪽으로 이동
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl p-6 border-2 border-amber-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">일정 수정</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBooking(null);
                  setEditModalPosition(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* 날짜 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜
                </label>
                <input
                  type="date"
                  value={editingBooking.date}
                  onChange={(e) => {
                    setEditingBooking({
                      ...editingBooking,
                      date: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* 시작 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={editingBooking.startTime}
                  onChange={(e) => {
                    setEditingBooking({
                      ...editingBooking,
                      startTime: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* 종료 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료 시간
                </label>
                <input
                  type="time"
                  value={editingBooking.endTime}
                  onChange={(e) => {
                    setEditingBooking({
                      ...editingBooking,
                      endTime: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* 예약자 정보 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">예약자 정보</p>
                <p className="font-semibold text-gray-900">{editingBooking.name}</p>
                <p className="text-sm text-gray-600">{editingBooking.phone}</p>
                {editingBooking.purpose && (
                  <p className="text-sm text-gray-700 mt-2">{editingBooking.purpose}</p>
                )}
              </div>

              {/* 스케줄 제목 수정 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  스케줄 제목
                </label>
                <input
                  type="text"
                  value={editingBooking.title || ''}
                  onChange={(e) => {
                    setEditingBooking({
                      ...editingBooking,
                      title: e.target.value,
                    });
                  }}
                  placeholder="예: 팀 회의, 고객 미팅 등"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* 상태 변경 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select
                  value={editingBooking.status}
                  onChange={(e) => {
                    setEditingBooking({
                      ...editingBooking,
                      status: e.target.value as "pending" | "approved",
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="pending">승인 대기</option>
                  <option value="approved">승인됨</option>
                </select>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDeleteBooking(editingBooking.id)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium border border-gray-300 hover:border-gray-400"
                >
                  삭제
                </button>
                <button
                  onClick={() => handleUpdateBooking(editingBooking)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
