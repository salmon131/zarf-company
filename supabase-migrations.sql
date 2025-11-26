-- 스터디 신청 정보를 저장하는 테이블 생성
CREATE TABLE IF NOT EXISTS study_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  study_type TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  age_range TEXT NOT NULL,
  desired_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_study_applications_created_at ON study_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_applications_study_type ON study_applications(study_type);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_study_applications_updated_at
BEFORE UPDATE ON study_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 대관 문의 정보를 저장하는 테이블 생성
CREATE TABLE IF NOT EXISTS rental_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  purpose TEXT NOT NULL,
  date TEXT,
  time TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_rental_inquiries_created_at ON rental_inquiries(created_at DESC);

-- updated_at 트리거 생성
CREATE TRIGGER update_rental_inquiries_updated_at
BEFORE UPDATE ON rental_inquiries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 그림작가 모집 신청 정보를 저장하는 테이블 생성
CREATE TABLE IF NOT EXISTS artist_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  portfolio TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_artist_applications_created_at ON artist_applications(created_at DESC);

-- updated_at 트리거 생성
CREATE TRIGGER update_artist_applications_updated_at
BEFORE UPDATE ON artist_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- bookings 테이블에 반복 예약 필드 추가 (이미 존재하는 경우 무시)
DO $$ 
BEGIN
  -- is_recurring 필드 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'is_recurring'
  ) THEN
    ALTER TABLE bookings ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- recurring_days_of_week 필드 추가 (JSON 배열로 저장: [0,1,2] = 일,월,화)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'recurring_days_of_week'
  ) THEN
    ALTER TABLE bookings ADD COLUMN recurring_days_of_week INTEGER[];
  END IF;
  
  -- recurring_end_date 필드 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'recurring_end_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN recurring_end_date DATE;
  END IF;
  
  -- parent_booking_id 필드 추가 (원본 반복 예약 ID)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'parent_booking_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN parent_booking_id UUID;
  END IF;
END $$;

