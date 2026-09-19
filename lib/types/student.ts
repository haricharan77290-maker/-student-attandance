export interface Student {
  id: string;
  name: string;
  pin: string; // Full alphanumeric string e.g. "253B5A0408"
}

export type AttendanceStatus = "present" | "absent" | "unmarked";

// Mapping: { [dateString YYYY-MM-DD]: { [studentId]: AttendanceStatus } }
export type DateAttendanceMap = Record<string, Record<string, AttendanceStatus>>;

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  notMarked: number;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export interface StudentAttendanceStats {
  totalMarked: number;
  present: number;
  absent: number;
  percentage: number;
}
