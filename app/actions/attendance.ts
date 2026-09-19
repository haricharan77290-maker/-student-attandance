"use server";

import {
  fetchClasses,
  fetchStudents,
  fetchAttendanceRecords,
  saveAttendanceRecord,
  saveBatchAttendance,
  insertStudent,
} from "@/lib/data-provider";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AttendanceStatus, Student, AttendanceRecord, ClassSession } from "@/lib/types";

export interface RosterDataPayload {
  classes: ClassSession[];
  students: Student[];
  records: AttendanceRecord[];
  isLiveSupabase: boolean;
}

export async function getRosterData(
  classId?: string,
  date?: string
): Promise<RosterDataPayload> {
  const classes = await fetchClasses();
  const activeClassId = classId || (classes[0] ? classes[0].id : "cls-1");
  const targetDate = date || new Date().toISOString().split("T")[0];

  const students = await fetchStudents();
  const records = await fetchAttendanceRecords(activeClassId, targetDate);

  return {
    classes,
    students,
    records,
    isLiveSupabase: isSupabaseConfigured(),
  };
}

export async function recordStudentAttendance(
  studentId: string,
  classId: string,
  date: string,
  status: AttendanceStatus,
  notes?: string
): Promise<AttendanceRecord> {
  return await saveAttendanceRecord(studentId, classId, date, status, notes);
}

export async function batchMarkRoster(
  studentIds: string[],
  classId: string,
  date: string,
  status: AttendanceStatus
): Promise<AttendanceRecord[]> {
  return await saveBatchAttendance(studentIds, classId, date, status);
}

export async function createRosterStudent(
  name: string,
  studentId: string,
  cohort: string,
  email: string
): Promise<Student> {
  return await insertStudent({
    name,
    studentId,
    cohort,
    email,
  });
}
