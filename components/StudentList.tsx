"use client";

import React from "react";
import { Student, AttendanceStatus } from "@/lib/types/student";
import { StudentCard } from "@/components/StudentCard";

interface StudentListProps {
  students: Student[];
  searchQuery: string;
  dateAttendance: Record<string, AttendanceStatus>;
  selectedDate: string;
  onMarkPresent: (id: string) => void;
  onMarkAbsent: (id: string) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onSaveAttendance: () => void;
  onOpenAddModal: () => void;
}

export function StudentList({
  students,
  searchQuery,
  dateAttendance,
  selectedDate,
  onMarkPresent,
  onMarkAbsent,
  onEditStudent,
  onDeleteStudent,
  onSaveAttendance,
  onOpenAddModal,
}: StudentListProps) {
  const filteredStudents = students.filter((student) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(q) ||
      student.pin.toLowerCase().includes(q)
    );
  });

  const formatDisplayDate = (dateStr: string): string => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-gray-800">Students</h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {filteredStudents.length}
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Date: {formatDisplayDate(selectedDate)}
        </span>
      </div>

      {/* Empty State */}
      {students.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-base font-medium text-gray-500 mb-4">
            No students found.
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
          >
            + Add First Student
          </button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <p className="text-sm">
            No students match &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              status={dateAttendance[student.id] ?? "unmarked"}
              onMarkPresent={onMarkPresent}
              onMarkAbsent={onMarkAbsent}
              onEdit={onEditStudent}
              onDelete={onDeleteStudent}
            />
          ))}
        </div>
      )}

      {/* Save Attendance Button */}
      {students.length > 0 && (
        <button
          type="button"
          onClick={onSaveAttendance}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
        >
          💾 Save Attendance
        </button>
      )}
    </div>
  );
}
