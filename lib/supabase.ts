import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 API 키
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Booking 타입 정의
export interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  title?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  is_recurring?: boolean;
  recurring_days_of_week?: number[]; // 0=일요일, 1=월요일, ..., 6=토요일
  recurring_end_date?: string; // 반복 종료일 (YYYY-MM-DD)
  parent_booking_id?: string; // 원본 반복 예약 ID (자동 생성된 예약의 경우)
}

// 예약 관련 API 함수들
export const bookingApi = {
  // 모든 예약 조회
  async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('startTime', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data || [];
  },

  // 새 예약 생성
  async create(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return null;
    }

    return data;
  },

  // 예약 수정
  async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return null;
    }

    return data;
  },

  // 예약 삭제
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }

    return true;
  },

  // 예약 승인
  async approve(id: string, title?: string): Promise<Booking | null> {
    const updates: Partial<Booking> = { status: 'approved' };
    if (title) {
      updates.title = title;
    }

    return this.update(id, updates);
  },

  // 예약 거부
  async reject(id: string): Promise<Booking | null> {
    return this.update(id, { status: 'rejected' });
  },
};

// StudyApplication 타입 정의
export interface StudyApplication {
  id: string;
  study_type: string;
  phone: string;
  preferred_time: string;
  age_range: string;
  desired_content?: string;
  created_at: string;
  updated_at: string;
}

// 스터디 신청 관련 API 함수들
export const studyApplicationApi = {
  // 모든 신청 조회
  async getAll(): Promise<StudyApplication[]> {
    const { data, error } = await supabase
      .from('study_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching study applications:', error);
      return [];
    }

    return data || [];
  },

  // 새 신청 생성
  async create(application: Omit<StudyApplication, 'id' | 'created_at' | 'updated_at'>): Promise<StudyApplication | null> {
    const { data, error } = await supabase
      .from('study_applications')
      .insert([application])
      .select()
      .single();

    if (error) {
      console.error('Error creating study application:', error);
      return null;
    }

    return data;
  },

  // 신청 삭제
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('study_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting study application:', error);
      return false;
    }

    return true;
  },
};

// RentalInquiry 타입 정의
export interface RentalInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  date?: string;
  time?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

// 대관 문의 관련 API 함수들
export const rentalInquiryApi = {
  // 모든 문의 조회
  async getAll(): Promise<RentalInquiry[]> {
    const { data, error } = await supabase
      .from('rental_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rental inquiries:', error);
      return [];
    }

    return data || [];
  },

  // 새 문의 생성
  async create(inquiry: Omit<RentalInquiry, 'id' | 'created_at' | 'updated_at'>): Promise<RentalInquiry | null> {
    const { data, error } = await supabase
      .from('rental_inquiries')
      .insert([inquiry])
      .select()
      .single();

    if (error) {
      console.error('Error creating rental inquiry:', error);
      return null;
    }

    return data;
  },

  // 문의 삭제
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('rental_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rental inquiry:', error);
      return false;
    }

    return true;
  },
};

// ArtistApplication 타입 정의
export interface ArtistApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  portfolio?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

// 그림작가 모집 관련 API 함수들
export const artistApplicationApi = {
  // 모든 신청 조회
  async getAll(): Promise<ArtistApplication[]> {
    const { data, error } = await supabase
      .from('artist_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching artist applications:', error);
      return [];
    }

    return data || [];
  },

  // 새 신청 생성
  async create(application: Omit<ArtistApplication, 'id' | 'created_at' | 'updated_at'>): Promise<ArtistApplication | null> {
    const { data, error } = await supabase
      .from('artist_applications')
      .insert([application])
      .select()
      .single();

    if (error) {
      console.error('Error creating artist application:', error);
      return null;
    }

    return data;
  },

  // 신청 삭제
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('artist_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting artist application:', error);
      return false;
    }

    return true;
  },
};

