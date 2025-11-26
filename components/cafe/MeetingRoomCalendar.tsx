"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  is_recurring?: boolean;
  recurring_days_of_week?: number[];
  recurring_end_date?: string;
  parent_booking_id?: string; // 원본 반복 예약 ID (자동 생성된 예약의 경우)
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
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number; dayIndex: number; blockWidth: number } | null>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null); // 마우스 위치 추적용

  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    purpose: "",
    isRecurring: false, // 3개월간 반복 여부
    recurringDaysOfWeek: [] as number[], // 반복 요일 (0=일요일, 1=월요일, ..., 6=토요일)
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  // 예약 데이터
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Supabase에서 예약 데이터 불러오기 (pending과 approved 상태 모두 표시)
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async () => {
    setIsLoading(true);
    const data = await bookingApi.getAll();
    // pending과 approved 상태의 예약 모두 표시
    setBookings(data.filter(b => b.status === 'approved' || b.status === 'pending'));
    setIsLoading(false);
  };
  
  // 예약 블록 클릭 핸들러 (관리 기능 제거 - 클릭 시 아무 동작 없음)
  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    // 관리 기능은 admin 페이지에서 처리
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

  // 선택된 블록의 좌측 상단 위치 계산 (absolute 위치 기준 - 컨테이너 내부 상대 위치)
  // 실제 DOM 요소의 위치를 직접 측정하여 정확한 위치 계산
  const getBlockTopLeftPosition = (
    date: string,
    hour: number,
    minute: number
  ): { x: number; y: number; dayIndex: number; blockWidth: number } | null => {
    if (!calendarRef.current) return null;
    
    // 날짜의 열 인덱스 찾기
    const dayIndex = weekSchedule.findIndex(day => day.date === date);
    if (dayIndex === -1) return null;
    
    // 그리드 컨테이너 찾기 (relative 위치의 부모)
    const gridContainer = calendarRef.current.querySelector('.overflow-y-auto') as HTMLElement;
    if (!gridContainer) return null;
    
    const containerRect = gridContainer.getBoundingClientRect();
    
    // 실제 그리드 행 찾기 (시간에 해당하는 행)
    const gridRows = gridContainer.querySelectorAll('.grid.grid-cols-8.border-b');
    const targetHour = Math.floor(hour);
    const rowIndex = targetHour - 9; // 9시부터 시작
    
    if (rowIndex < 0 || rowIndex >= gridRows.length) return null;
    
    const targetRow = gridRows[rowIndex] as HTMLElement;
    if (!targetRow) return null;
    
    // 해당 날짜의 셀 찾기 (첫 번째는 시간 열이므로 dayIndex + 1)
    const cells = targetRow.querySelectorAll('.relative.border-r');
    const targetCell = cells[dayIndex + 1] as HTMLElement; // +1 to skip time column
    
    if (!targetCell) return null;
    
    // 셀의 실제 위치를 가져와서 컨테이너 기준 상대 위치 계산
    const cellRect = targetCell.getBoundingClientRect();
    
    // 분 단위 오프셋 계산 (셀 내에서의 위치)
    const minuteOffset = (minute / 60) * 64; // 셀 높이(64px) 기준으로 분 계산
    
    // 블록 너비 계산
    const columnWidthPercent = 100 / 8;
    const containerWidth = containerRect.width;
    const blockWidthPx = (columnWidthPercent / 100) * containerWidth - 10;
    
    // absolute 위치이므로 컨테이너 기준 상대 위치 반환
    return {
      x: cellRect.left - containerRect.left, // 블록의 왼쪽 끝 위치 (컨테이너 기준, 픽셀)
      y: cellRect.top - containerRect.top + minuteOffset, // 블록의 상단 위치 (컨테이너 기준, 픽셀) + 분 오프셋
      dayIndex, // 날짜 인덱스 (0=월요일, 1=화요일, ...)
      blockWidth: blockWidthPx // 블록 너비 (픽셀)
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
    
    let finalEndTime = dragEnd;
    
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
      
      finalEndTime = { date: dragStart.date, hour: endHour, minute: endMinute };
      setDragEnd(finalEndTime);
      setSelectedStartTime(dragStart);
      setSelectedEndTime(finalEndTime);
    } else if (hasDragged && dragEnd) {
      // 드래그가 발생한 경우 - dragEnd를 그대로 사용
      const startMinutes = dragStart.hour * 60 + dragStart.minute;
      const endMinutes = dragEnd.hour * 60 + dragEnd.minute;
      const durationMinutes = endMinutes - startMinutes;
      
      // 최소 15분 블록 보장 (15분 미만인 경우에만)
      if (durationMinutes > 0 && durationMinutes < 15) {
        finalEndTime = {
          date: dragStart.date,
          hour: dragStart.hour,
          minute: dragStart.minute + 15
        };
        // 60분 넘어가면 시간 증가
        if (finalEndTime.minute >= 60) {
          finalEndTime.hour += 1;
          finalEndTime.minute -= 60;
        }
        setDragEnd(finalEndTime);
      } else {
        // 15분 이상이면 dragEnd를 그대로 사용
        finalEndTime = dragEnd;
      }
      
      // 드래그로 만든 블록의 시간을 그대로 사용
      setSelectedStartTime(dragStart);
      setSelectedEndTime(finalEndTime);
    } else if (dragStart) {
      // dragEnd가 없으면 기본 1시간 블록 생성
      const endHour = dragStart.hour + 1;
      const endMinute = dragStart.minute;
      const defaultEndTime = { date: dragStart.date, hour: endHour, minute: endMinute };
      setSelectedStartTime(dragStart);
      setSelectedEndTime(defaultEndTime);
      setDragEnd(defaultEndTime);
    }
    
    // 모달 위치 계산 - 선택된 블록의 좌측 상단에 배치
    const blockPosition = getBlockTopLeftPosition(
      dragStart.date,
      dragStart.hour,
      dragStart.minute
    );
    
    if (blockPosition) {
      setModalPosition(blockPosition);
    } else {
      // 위치 계산 실패 시 기본 위치
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      if (lastMousePos.current) {
        setModalPosition({
          x: lastMousePos.current.x + scrollLeft,
          y: lastMousePos.current.y + scrollTop,
          dayIndex: 0,
          blockWidth: 100
        });
      } else if (calendarRef.current) {
        const rect = calendarRef.current.getBoundingClientRect();
        setModalPosition({
          x: rect.left + scrollLeft + 100,
          y: rect.top + scrollTop + 100,
          dayIndex: 0,
          blockWidth: 100
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
    
    // 모달 위치 계산 - 선택된 블록의 좌측 상단에 배치
    const blockPosition = getBlockTopLeftPosition(
      date,
      time.hour,
      time.minute
    );
    
    if (blockPosition) {
      setModalPosition(blockPosition);
    } else {
      // 위치 계산 실패 시 클릭한 셀 위치 사용
      const clickedCell = e.currentTarget as HTMLDivElement;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const rect = clickedCell.getBoundingClientRect();
      const dayIndex = weekSchedule.findIndex(day => day.date === date);
      setModalPosition({
        x: rect.left + scrollLeft,
        y: rect.top + scrollTop,
        dayIndex: dayIndex >= 0 ? dayIndex : 0,
        blockWidth: 100
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'isRecurring') {
      setBookingData((prev) => ({ 
        ...prev, 
        isRecurring: checked,
        // 반복 예약 체크 해제 시 요일 선택도 초기화
        recurringDaysOfWeek: checked ? prev.recurringDaysOfWeek : []
      }));
    } else {
      setBookingData((prev) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  // 요일 반복 선택 핸들러
  const handleDayToggle = (dayIndex: number) => {
    setBookingData((prev) => {
      const newDays = prev.recurringDaysOfWeek.includes(dayIndex)
        ? prev.recurringDaysOfWeek.filter(d => d !== dayIndex)
        : [...prev.recurringDaysOfWeek, dayIndex];
      return {
        ...prev,
        recurringDaysOfWeek: newDays
      };
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedStartTime || !selectedEndTime) return;
    
    const formatTime = (hour: number, minute: number) => {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };
    
    const startTimeStr = formatTime(selectedStartTime.hour, selectedStartTime.minute);
    const endTimeStr = formatTime(selectedEndTime.hour, selectedEndTime.minute);
    
    // 반복 예약인 경우 1건만 저장 (관리자 승인 시 자동으로 반복 생성됨)
    const baseDate = new Date(selectedStartTime.date);
    const selectedDayOfWeek = baseDate.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    
    // 반복 예약인 경우 요일 선택이 없으면 선택된 날짜의 요일을 기본값으로 사용
    const recurringDays = bookingData.isRecurring 
      ? (bookingData.recurringDaysOfWeek.length > 0 
          ? bookingData.recurringDaysOfWeek 
          : [selectedDayOfWeek])
      : [];
    
    // 3개월 후 날짜 계산 (반복 종료일)
    const endDate = new Date(baseDate);
    endDate.setMonth(endDate.getMonth() + 3);
    const recurringEndDate = bookingData.isRecurring ? endDate.toISOString().split('T')[0] : null;
    
    // 예약 데이터 생성 (반복 예약 정보 포함)
    const newBookingData: any = {
      date: selectedStartTime.date,
      startTime: startTimeStr,
      endTime: endTimeStr,
      name: bookingData.name,
      email: "",
      phone: bookingData.phone,
      purpose: bookingData.purpose,
      status: "pending" as const, // 승인 대기 상태로 생성
      is_recurring: bookingData.isRecurring,
      recurring_days_of_week: bookingData.isRecurring ? recurringDays : null,
      recurring_end_date: recurringEndDate,
    };
    
    const createdBooking = await bookingApi.create(newBookingData);
    
    if (!createdBooking) {
      alert('예약 생성에 실패했습니다.');
      return;
    }
    
    setBookings((prev) => [...prev, createdBooking]);
    
    if (bookingData.isRecurring) {
      alert('3개월간 반복 예약 요청이 생성되었습니다. 관리자 승인 후 자동으로 반복 등록됩니다.');
    } else {
      alert('예약 요청이 생성되었습니다. 관리자 승인 후 등록됩니다.');
    }
    
    setTimeout(() => {
      setShowBookingForm(false);
      setSelectedStartTime(null);
      setSelectedEndTime(null);
      setDragStart(null);
      setDragEnd(null);
      setBookingData({ name: "", phone: "", purpose: "", isRecurring: false, recurringDaysOfWeek: [] });
      setModalPosition(null);
    }, 500);
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

  // approved 상태의 예약만 표시 (이미 loadBookings에서 필터링됨)

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
            
          </div>
        </div>
      </Card>


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
                  const bookingBlocks: React.ReactElement[] = [];
                  
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
                          className="absolute z-20 pointer-events-none"
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
              
              {/* 예약 폼 - 블록의 좌측/우측 상단에 배치 (블록을 가리지 않음) */}
              {showBookingForm && selectedStartTime && selectedEndTime && modalPosition && (
                <div 
                  className="absolute pointer-events-auto w-96 z-50"
                  style={{
                    // 월, 화요일(dayIndex 0, 1)은 모달을 블록의 오른쪽에 배치
                    // 그 외의 경우는 모달을 블록의 왼쪽에 배치
                    // 여백을 32px로 증가시켜 블록과의 거리를 더 띄움
                    left: modalPosition.dayIndex <= 1
                      ? `${modalPosition.x + modalPosition.blockWidth + 32}px` // 블록 오른쪽 + 여백 32px
                      : `${modalPosition.x - 416}px`, // 블록 왼쪽 (모달 너비 384px + 여백 32px)
                    // 블록의 상단에 정확히 맞춤
                    top: `${modalPosition.y}px`,
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
                          setBookingData({ name: "", phone: "", purpose: "", isRecurring: false, recurringDaysOfWeek: [] });
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

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            id="booking-recurring"
                            name="isRecurring"
                            checked={bookingData.isRecurring}
                            onChange={handleBookingInputChange}
                            className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 accent-brand-500"
                            style={{ accentColor: '#f97316' }}
                          />
                          <label htmlFor="booking-recurring" className="text-sm font-medium text-gray-700 cursor-pointer">
                            3개월간 반복
                          </label>
                        </div>
                        
                        {/* 요일 반복 선택 (반복 예약이 체크된 경우에만 표시) */}
                        {bookingData.isRecurring && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              반복 요일 선택
                            </label>
                            <div className="flex gap-2">
                              {[
                                { label: '월', index: 1 },
                                { label: '화', index: 2 },
                                { label: '수', index: 3 },
                                { label: '목', index: 4 },
                                { label: '금', index: 5 },
                                { label: '토', index: 6 },
                                { label: '일', index: 0 },
                              ].map(({ label, index }) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleDayToggle(index)}
                                  className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                    bookingData.recurringDaysOfWeek.includes(index)
                                      ? 'bg-brand-500 text-white'
                                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                            {bookingData.recurringDaysOfWeek.length === 0 && (
                              <p className="text-xs text-gray-500 mt-2">
                                선택된 날짜의 요일이 기본값으로 설정됩니다.
                              </p>
                            )}
                          </div>
                        )}
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
                            setBookingData({ name: "", phone: "", purpose: "", isRecurring: false, recurringDaysOfWeek: [] });
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

    </div>
  );
}
