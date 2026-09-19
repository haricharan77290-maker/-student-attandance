"use client";

import React from "react";
import { Student, AttendanceStatus, StudentAttendanceStats } from "@/lib/types/student";

interface StudentCardProps {
  student: Student;
  status: AttendanceStatus;
  overallStats?: StudentAttendanceStats;
  onMarkPresent: (id: string) => void;
  onMarkAbsent: (id: string) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

function getPercentageColor(percentage: number): string {
  if (percentage >= 75) return "text-green-600 bg-green-100";
  if (percentage >= 50) return "text-amber-600 bg-amber-100";
  return "text-red-600 bg-red-100";
}

export function StudentCard({
  student,
  status,
  overallStats,
  onMarkPresent,
  onMarkAbsent,
  onEdit,
  onDelete,
}: StudentCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300">
      {/* Student Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-bold text-gray-800 leading-snug truncate">
            {student.name}
          </h3>
          <span className="font-mono text-sm text-gray-500 tracking-wide whitespace-nowrap">
            PIN: {student.pin}
          </span>

          {/* Overall Attendance Percentage */}
          {overallStats && overallStats.totalMarked > 0 && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPercentageColor(
                overallStats.percentage
              )}`}
              title={`${overallStats.present}/${overallStats.totalMarked} days present`}
            >
              <span className="font-mono">{overallStats.percentage}%</span>
              <span className="text-[10px] opacity-75">Overall</span>
            </span>
          )}

          {overallStats && overallStats.totalMarked === 0 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-400">
              No data
            </span>
          )}
        </div>

        {/* Mobile-visible status badge */}
        {status !== "unmarked" && (
          <span
            className={`mt-1.5 inline-block text-xs font-semibold rounded-full px-2.5 py-0.5 ${
              status === "present"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status === "present" ? "✓ Present" : "✕ Absent"}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Present */}
        <button
          type="button"
          aria-label={`Mark ${student.name} as present`}
          aria-pressed={status === "present"}
          onClick={() => onMarkPresent(student.id)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition cursor-pointer ${
            status === "present"
              ? "bg-green-600 text-white shadow-sm ring-2 ring-green-600 ring-offset-1"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          ✓ Present
        </button>

        {/* Absent */}
        <button
          type="button"
          aria-label={`Mark ${student.name} as absent`}
          aria-pressed={status === "absent"}
          onClick={() => onMarkAbsent(student.id)}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition cursor-pointer ${
            status === "absent"
              ? "bg-red-600 text-white shadow-sm ring-2 ring-red-600 ring-offset-1"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          ✕ Absent
        </button>

        {/* Edit */}
        <button
          type="button"
          aria-label={`Edit ${student.name}`}
          onClick={() => onEdit(student)}
          className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-200 cursor-pointer"
        >
          ✏️ Edit
        </button>

        {/* Delete */}
        <button
          type="button"
          aria-label={`Delete ${student.name}`}
          onClick={() => onDelete(student)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-red-100 hover:text-red-700 cursor-pointer"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
