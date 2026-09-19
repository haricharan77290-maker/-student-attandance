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

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  // Map of date -> { studentId -> status }
  const [allAttendance, setAllAttendance] = useState<Record<string, Record<string, AttendanceStatus>>>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [confirmMode, setConfirmMode] = useState<ConfirmMode>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // ─── Load from storage on mount ─────────────────────────────────────────────
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

  // ─── Load attendance when date changes ──────────────────────────────────────
  useEffect(() => {
    const loadedForDate = getAttendanceForDate(selectedDate);
    queueMicrotask(() => {
      setAllAttendance((prev) => {
        if (prev[selectedDate]) return prev;
        return { ...prev, [selectedDate]: loadedForDate };
      });
    });
  }, [selectedDate]);

  // ─── Toast helpers ───────────────────────────────────────────────────────────
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

  // ─── Derived: current date attendance ────────────────────────────────────────
  const dateAttendance: Record<string, AttendanceStatus> = useMemo(
    () => allAttendance[selectedDate] ?? {},
    [allAttendance, selectedDate]
  );

  // ─── Derived: summary stats ──────────────────────────────────────────────────
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

  // ─── Attendance marking ──────────────────────────────────────────────────────
  const markAttendance = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      setAllAttendance((prev) => {
        const dateRecord = prev[selectedDate] ?? {};
        const current = dateRecord[studentId];
        // Clicking same status toggles back to unmarked
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

  // ─── Add / Edit student ──────────────────────────────────────────────────────
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
        // Update
        const updated = students.map((s) =>
          s.id === editingStudentId ? { ...s, name, pin } : s
        );
        setStudents(updated);
        saveStudentsToStorage(updated);
        addToast("Student updated successfully.", "success");
      } else {
        // Create
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

  // ─── Delete student ──────────────────────────────────────────────────────────
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
    // Also remove from in-memory attendance state
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

  // ─── Save attendance ─────────────────────────────────────────────────────────
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

  // ─── Date change ─────────────────────────────────────────────────────────────
  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
    setSearchQuery("");
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* 1. Header */}
        <Header onOpenAddModal={handleOpenAdd} />

        {/* 2. Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {/* 3. Summary Cards */}
        <SummaryCards summary={summary} />

        {/* 4. Search Bar */}
        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        {/* 5. Student List */}
        <StudentList
          students={students}
          searchQuery={searchQuery}
          dateAttendance={dateAttendance}
          selectedDate={selectedDate}
          allAttendance={allAttendance}
          onMarkPresent={handleMarkPresent}
          onMarkAbsent={handleMarkAbsent}
          onEditStudent={handleOpenEdit}
          onDeleteStudent={handleRequestDelete}
          onSaveAttendance={handleSaveAttendance}
          onOpenAddModal={handleOpenAdd}
        />
      </div>

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={isFormOpen}
        editingStudent={editingStudent}
        existingStudents={students}
        onSave={handleSaveStudent}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Delete Confirm Dialog */}
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

      {/* Save with Unmarked Warning */}
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

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
