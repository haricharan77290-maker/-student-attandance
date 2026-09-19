import React from "react";
import { AttendanceSummary } from "@/lib/types/student";

interface SummaryCardsProps {
  summary: AttendanceSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Students */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Total Students
        </span>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {summary.total}
        </p>
      </div>

      {/* Present */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Present
        </span>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {summary.present}
        </p>
      </div>

      {/* Absent */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Absent
        </span>
        <p className="text-3xl font-bold text-red-600 mt-2">
          {summary.absent}
        </p>
      </div>

      {/* Not Marked */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Not Marked
        </span>
        <p className="text-3xl font-bold text-gray-400 mt-2">
          {summary.notMarked}
        </p>
      </div>
    </div>
  );
}
