import React from "react";

interface StatSummaryProps {
  totalSubjects: number;
  presentCount: number;
  percentage: number;
}

export function StatSummary({
  totalSubjects,
  presentCount,
  percentage,
}: StatSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Stat Card 1 (Total) */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          TOTAL SUBJECTS
        </span>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {totalSubjects}
        </p>
      </div>

      {/* Stat Card 2 (Present) */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          PRESENT
        </span>
        <p className="text-3xl font-bold text-emerald-600 mt-2">
          {presentCount}
        </p>
      </div>

      {/* Stat Card 3 (Rate) */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          ATTENDANCE RATE
        </span>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {percentage}%
        </p>
      </div>
    </div>
  );
}
