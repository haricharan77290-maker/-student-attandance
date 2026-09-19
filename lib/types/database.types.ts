export interface SubjectRecord {
  id: string;
  name: string;
  code: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id?: string;
  subject_id: string;
  date: string;
  present: boolean;
  updated_at?: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  present: boolean;
}
