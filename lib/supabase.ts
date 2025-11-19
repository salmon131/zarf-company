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

