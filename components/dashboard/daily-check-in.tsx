"use client";

import React from "react";
import { SubjectItem } from "@/lib/types/database.types";

interface DailyCheckInProps {
  subjects: SubjectItem[];
  onTogglePresent: (id: string) => void;
  onRemoveSubject: (id: string) => void;
}

export function DailyCheckIn({
  subjects,
  onTogglePresent,
  onRemoveSubject,
}: DailyCheckInProps) {
  return (
    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
      <h2 className="text-lg font-semibold text-slate-900 mb-5">
        Today&apos;s Log
      </h2>
      {subjects.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          No subjects added yet. Add a subject above to start tracking.
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
            >
              <div>
                <h3 className="font-medium text-slate-900">{subject.name}</h3>
                <p className="text-xs font-medium text-slate-400">
                  {subject.code}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => onTogglePresent(subject.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    subject.present
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                  }`}
                >
                  {subject.present ? "Present ✓" : "Absent"}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveSubject(subject.id)}
                  className="text-xs text-slate-400 hover:text-rose-500 ml-3 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
