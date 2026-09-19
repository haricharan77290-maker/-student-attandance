import { Student, AttendanceStatus, DateAttendanceMap } from "@/lib/types/student";

const STUDENTS_KEY = "teacher_attendance_students_v2";
const ATTENDANCE_KEY = "teacher_attendance_records_v2";
const INITIALIZED_KEY = "teacher_attendance_initialized_v2";

const INITIAL_DEMO_STUDENTS: Student[] = [
  { id: "stu-demo-1", name: "Rahul Kumar", pin: "253B5A0408" },
  { id: "stu-demo-2", name: "Priya Sharma", pin: "253B5A0409" },
  { id: "stu-demo-3", name: "Amit Verma", pin: "253B5A0410" },
];

export function getInitialStudents(): Student[] {
  if (typeof window === "undefined") return [];

  try {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    const stored = localStorage.getItem(STUDENTS_KEY);

    if (!isInitialized) {
      // First time loading the application: Seed initial demo students
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(INITIAL_DEMO_STUDENTS));
      localStorage.setItem(INITIALIZED_KEY, "true");
      return INITIAL_DEMO_STUDENTS;
    }

    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load students from localStorage:", error);
  }

  return [];
}

export function saveStudentsToStorage(students: Student[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (error) {
    console.error("Failed to save students to localStorage:", error);
  }
}

export function getAllAttendanceFromStorage(): DateAttendanceMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load attendance from localStorage:", error);
  }
  return {};
}

export function getAttendanceForDate(
  date: string
): Record<string, AttendanceStatus> {
  const all = getAllAttendanceFromStorage();
  return all[date] || {};
}

export function saveAttendanceForDateToStorage(
  date: string,
  records: Record<string, AttendanceStatus>
): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllAttendanceFromStorage();
    all[date] = records;
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error("Failed to save attendance to localStorage:", error);
  }
}

export function cleanupStudentFromAttendance(studentId: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllAttendanceFromStorage();
    let changed = false;

    Object.keys(all).forEach((dateKey) => {
      if (all[dateKey] && all[dateKey][studentId]) {
        delete all[dateKey][studentId];
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(all));
    }
  } catch (error) {
    console.error("Failed to cleanup student attendance:", error);
  }
}

export function isPinDuplicate(
  pin: string,
  students: Student[],
  excludeStudentId?: string
): boolean {
  const normalizedPin = pin.trim().toUpperCase();
  return students.some(
    (s) => s.pin.trim().toUpperCase() === normalizedPin && s.id !== excludeStudentId
  );
}
