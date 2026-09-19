export type AttendanceStatus = "present" | "late" | "absent" | "unmarked";

export interface Student {
  id: string;
  name: string;
  studentId: string; // e.g. "AST-2041"
  cohort: string;    // e.g. "Orbital Class 2026"
  avatarUrl?: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  updatedAt: string;
}

export interface ClassSession {
  id: string;
  name: string;
  code: string;
  cohort: string;
  room: string;
  scheduledTime: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
  unmarked: number;
  ratePercentage: number;
}
