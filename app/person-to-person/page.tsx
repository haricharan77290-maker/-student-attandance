"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Student, AttendanceStatus, AttendanceSummary, ToastNotification } from "@/lib/types/student";
import {
  getInitialStudents,
  saveStudentsToStorage,
  getAttendanceForDate,
  saveAttendanceForDateToStorage,
  cleanupStudentFromAttendance,
} from "@/lib/services/attendanceStorage";

import { Header } from "@/components/Header";
import { DateSelector } from "@/components/DateSelector";
import { SummaryCards } from "@/components/SummaryCards";
import { SearchBar } from "@/components/SearchBar";
import { StudentList } from "@/components/StudentList";
import { StudentFormModal } from "@/components/StudentFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Toast } from "@/components/Toast";

type ConfirmMode =
  | { type: "delete"; student: Student }
  | { type: "save-with-unmarked"; unmarkedCount: number }
  | null;

export default function PersonToPersonAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [allAttendance, setAllAttendance] = useState<Record<string, Record<string, AttendanceStatus>>>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const loadedStudents = getInitialStudents();
    const loadedAttendance = getAttendanceForDate(selectedDate);
    queueMicrotask(() => {
      setStudents(loadedStudents);
      setAllAttendance((prev) => ({
        ...prev,
        [selectedDate]: loadedAttendance,
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadedForDate = getAttendanceForDate(selectedDate);
    queueMicrotask(() => {
      setAllAttendance((prev) => {
        if (prev[selectedDate]) return prev;
        return { ...prev, [selectedDate]: loadedForDate };
      });
    });
  }, [selectedDate]);

  const addToast = useCallback(
    (message: string, type: ToastNotification["type"] = "success") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dateAttendance: Record<string, AttendanceStatus> = useMemo(
    () => allAttendance[selectedDate] ?? {},
    [allAttendance, selectedDate]
  );

  const summary: AttendanceSummary = useMemo(() => {
    const total = students.length;
    let present = 0;
    let absent = 0;
    students.forEach((s) => {
      const st = dateAttendance[s.id];
      if (st === "present") present++;
      else if (st === "absent") absent++;
    });
    return { total, present, absent, notMarked: total - present - absent };
  }, [students, dateAttendance]);

  const markAttendance = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      setAllAttendance((prev) => {
        const dateRecord = prev[selectedDate] ?? {};
        const current = dateRecord[studentId];
        const newStatus: AttendanceStatus =
          current === status ? "unmarked" : status;
        const updated = { ...dateRecord };
        if (newStatus === "unmarked") {
          delete updated[studentId];
        } else {
          updated[studentId] = newStatus;
        }
        return { ...prev, [selectedDate]: updated };
      });
    },
    [selectedDate]
  );

  const handleMarkPresent = useCallback(
    (id: string) => markAttendance(id, "present"),
    [markAttendance]
  );

  const handleMarkAbsent = useCallback(
    (id: string) => markAttendance(id, "absent"),
    [markAttendance]
  );

  const handleOpenAdd = useCallback(() => {
    setEditingStudent(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  }, []);

  const handleSaveStudent = useCallback(
    (name: string, pin: string, editingStudentId?: string): string | null => {
      if (editingStudentId) {
        const updated = students.map((s) =>
          s.id === editingStudentId ? { ...s, name, pin } : s
        );
        setStudents(updated);
        saveStudentsToStorage(updated);
        addToast("Student updated successfully.", "success");
      } else {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `stu-${Date.now()}-${Math.random()}`;
        const newStudent: Student = { id, name, pin };
        const updated = [...students, newStudent];
        setStudents(updated);
        saveStudentsToStorage(updated);
        addToast("Student added successfully.", "success");
      }
      return null;
    },
    [students, addToast]
  );

  const handleRequestDelete = useCallback((student: Student) => {
    setConfirmMode({ type: "delete", student });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!confirmMode || confirmMode.type !== "delete") return;
    const { student } = confirmMode;
    const updated = students.filter((s) => s.id !== student.id);
    setStudents(updated);
    saveStudentsToStorage(updated);
    cleanupStudentFromAttendance(student.id);
    setAllAttendance((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((dateKey) => {
        if (next[dateKey][student.id]) {
          const dateRec = { ...next[dateKey] };
          delete dateRec[student.id];
          next[dateKey] = dateRec;
        }
      });
      return next;
    });
    addToast(`${student.name} deleted successfully.`, "success");
    setConfirmMode(null);
  }, [confirmMode, students, addToast]);

  const commitSaveAttendance = useCallback(() => {
    try {
      saveAttendanceForDateToStorage(selectedDate, dateAttendance);
      const [year, month, day] = selectedDate.split("-");
      addToast(
        `Attendance saved successfully for ${day}/${month}/${year}.`,
        "success"
      );
      setConfirmMode(null);
    } catch (err) {
      console.error("Save attendance failed:", err);
      addToast("Unable to save attendance. Please try again.", "error");
    }
  }, [selectedDate, dateAttendance, addToast]);

  const handleSaveAttendance = useCallback(() => {
    if (summary.notMarked > 0) {
      setConfirmMode({ type: "save-with-unmarked", unmarkedCount: summary.notMarked });
    } else {
      commitSaveAttendance();
    }
  }, [summary.notMarked, commitSaveAttendance]);

  const handleConfirmSaveWithUnmarked = useCallback(() => {
    commitSaveAttendance();
  }, [commitSaveAttendance]);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
    setSearchQuery("");
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Header onOpenAddModal={handleOpenAdd} />

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Person-to-Person Attendance</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Teacher marks attendance for each student individually
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                Manual Marking Mode
              </span>
            </div>
          </div>
        </div>

        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <SummaryCards summary={summary} />

        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        <StudentList
          students={students}
          searchQuery={searchQuery}
          dateAttendance={dateAttendance}
          selectedDate={selectedDate}
          onMarkPresent={handleMarkPresent}
          onMarkAbsent={handleMarkAbsent}
          onEditStudent={handleOpenEdit}
          onDeleteStudent={handleRequestDelete}
          onSaveAttendance={handleSaveAttendance}
          onOpenAddModal={handleOpenAdd}
        />
      </div>

      <StudentFormModal
        isOpen={isFormOpen}
        editingStudent={editingStudent}
        existingStudents={students}
        onSave={handleSaveStudent}
        onClose={() => setIsFormOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmMode?.type === "delete"}
        title="Delete Student"
        message={
          confirmMode?.type === "delete"
            ? `Are you sure you want to delete "${confirmMode.student.name}"? This will also remove all their attendance records.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmClassName="bg-red-600 text-white hover:bg-red-700"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmMode(null)}
      />

      <ConfirmDialog
        isOpen={confirmMode?.type === "save-with-unmarked"}
        title="Students Not Marked"
        message={
          confirmMode?.type === "save-with-unmarked"
            ? `${confirmMode.unmarkedCount} student${
                confirmMode.unmarkedCount === 1 ? " is" : "s are"
              } not marked. Unmarked students will NOT be saved as absent automatically. Do you want to save attendance anyway?`
            : ""
        }
        confirmLabel="Save Anyway"
        cancelLabel="Cancel"
        confirmClassName="bg-blue-600 text-white hover:bg-blue-700"
        onConfirm={handleConfirmSaveWithUnmarked}
        onCancel={() => setConfirmMode(null)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}