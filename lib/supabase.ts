import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 API 키
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

