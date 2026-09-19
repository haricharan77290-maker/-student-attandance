-- ==============================================================================
-- Personal Daily Attendance Tracker - Supabase SQL Schema
-- Run this in your Supabase SQL Editor to set up the database tables and RLS
-- ==============================================================================

-- 1. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT 'GENERAL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  present BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_subject_date UNIQUE (subject_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_subject_date ON attendance_records(subject_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);

-- Enable Row Level Security (RLS)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Transparent RLS Policies for Personal Tracker
CREATE POLICY "Allow public all on subjects" ON subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on attendance_records" ON attendance_records FOR ALL USING (true) WITH CHECK (true);
