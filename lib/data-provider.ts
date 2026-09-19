import { Student, AttendanceRecord, ClassSession, AttendanceStatus } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

export const DEFAULT_CLASSES: ClassSession[] = [
  {
    id: "cls-1",
    name: "Orbital Mechanics & Propulsion",
    code: "AST-301",
    cohort: "Cohort Alpha (2026)",
    room: "Zero-G Lab 4",
    scheduledTime: "09:00 - 10:30 AM",
  },
  {
    id: "cls-2",
    name: "Quantum Telemetry Systems",
    code: "QNT-210",
    cohort: "Cohort Beta (2026)",
    room: "Hangar Bay 2",
    scheduledTime: "11:00 - 12:30 PM",
  },
  {
    id: "cls-3",
    name: "Astro-Navigation & Vectoring",
    code: "NAV-105",
    cohort: "Cohort Alpha (2026)",
    room: "Observatory A",
    scheduledTime: "02:00 - 03:30 PM",
  },
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: "stu-1",
    name: "Elena Rostova",
    studentId: "AST-2041",
    cohort: "Cohort Alpha (2026)",
    email: "elena.rostova@stellar.edu",
  },
  {
    id: "stu-2",
    name: "Kai Sorenson",
    studentId: "AST-2042",
    cohort: "Cohort Alpha (2026)",
    email: "kai.sorenson@stellar.edu",
  },
  {
    id: "stu-3",
    name: "Amina Al-Mansoor",
    studentId: "AST-2043",
    cohort: "Cohort Alpha (2026)",
    email: "amina.mansoor@stellar.edu",
  },
  {
    id: "stu-4",
    name: "Marcus Vance",
    studentId: "AST-2044",
    cohort: "Cohort Alpha (2026)",
    email: "marcus.vance@stellar.edu",
  },
  {
    id: "stu-5",
    name: "Zoe Chen",
    studentId: "AST-2045",
    cohort: "Cohort Alpha (2026)",
    email: "zoe.chen@stellar.edu",
  },
  {
    id: "stu-6",
    name: "Liam O'Connor",
    studentId: "AST-2046",
    cohort: "Cohort Alpha (2026)",
    email: "liam.oconnor@stellar.edu",
  },
  {
    id: "stu-7",
    name: "Seraphina Cruz",
    studentId: "AST-2047",
    cohort: "Cohort Alpha (2026)",
    email: "seraphina.cruz@stellar.edu",
  },
  {
    id: "stu-8",
    name: "Tariq Johnson",
    studentId: "AST-2048",
    cohort: "Cohort Alpha (2026)",
    email: "tariq.johnson@stellar.edu",
  },
];

// In-memory runtime cache for seamless local execution
const localStudents: Student[] = [...DEFAULT_STUDENTS];
const localRecords: Map<string, AttendanceRecord> = new Map();

// Helper key for record lookup
const getRecordKey = (studentId: string, classId: string, date: string) =>
  `${studentId}_${classId}_${date}`;

export async function fetchClasses(): Promise<ClassSession[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("classes").select("*");
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          cohort: item.cohort,
          room: item.room,
          scheduledTime: item.scheduled_time,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetchClasses fallback:", e);
    }
  }
  return DEFAULT_CLASSES;
}

export async function fetchStudents(): Promise<Student[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("students").select("*");
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          studentId: item.student_id,
          cohort: item.cohort,
          email: item.email,
          avatarUrl: item.avatar_url,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetchStudents fallback:", e);
    }
  }
  return localStudents;
}

export async function fetchAttendanceRecords(
  classId: string,
  date: string
): Promise<AttendanceRecord[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("class_id", classId)
        .eq("date", date);

      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          studentId: item.student_id,
          classId: item.class_id,
          date: item.date,
          status: item.status as AttendanceStatus,
          notes: item.notes,
          updatedAt: item.updated_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetchAttendanceRecords fallback:", e);
    }
  }

  // Fallback to local memory records
  const result: AttendanceRecord[] = [];
  localRecords.forEach((record) => {
    if (record.classId === classId && record.date === date) {
      result.push(record);
    }
  });
  return result;
}

export async function saveAttendanceRecord(
  studentId: string,
  classId: string,
  date: string,
  status: AttendanceStatus,
  notes?: string
): Promise<AttendanceRecord> {
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("attendance_records")
        .upsert(
          {
            student_id: studentId,
            class_id: classId,
            date: date,
            status: status,
            notes: notes || null,
            updated_at: timestamp,
          },
          { onConflict: "student_id,class_id,date" }
        )
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          studentId: data.student_id,
          classId: data.class_id,
          date: data.date,
          status: data.status as AttendanceStatus,
          notes: data.notes,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn("Supabase saveAttendanceRecord fallback:", e);
    }
  }

  // Local fallback
  const key = getRecordKey(studentId, classId, date);
  const existing = localRecords.get(key);
  const record: AttendanceRecord = {
    id: existing ? existing.id : `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    studentId,
    classId,
    date,
    status,
    notes,
    updatedAt: timestamp,
  };
  localRecords.set(key, record);
  return record;
}

export async function saveBatchAttendance(
  studentIds: string[],
  classId: string,
  date: string,
  status: AttendanceStatus
): Promise<AttendanceRecord[]> {
  const records: AttendanceRecord[] = [];
  for (const studentId of studentIds) {
    const rec = await saveAttendanceRecord(studentId, classId, date, status);
    records.push(rec);
  }
  return records;
}

export async function insertStudent(
  student: Omit<Student, "id">
): Promise<Student> {
  const newId = `stu-${Date.now()}`;
  const studentWithId: Student = { ...student, id: newId };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .insert({
          id: newId,
          name: student.name,
          student_id: student.studentId,
          cohort: student.cohort,
          email: student.email,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          studentId: data.student_id,
          cohort: data.cohort,
          email: data.email,
        };
      }
    } catch (e) {
      console.warn("Supabase insertStudent fallback:", e);
    }
  }

  localStudents.push(studentWithId);
  return studentWithId;
}
