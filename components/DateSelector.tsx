"use client";

import React from "react";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;

  const formatDisplayDate = (dateStr: string): string => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <label
            htmlFor="attendance-date"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
          >
            Attendance Date
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-base font-semibold text-gray-700">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>
        </div>
        {!isToday && (
          <button
            type="button"
            onClick={() => onDateChange(today)}
            className="self-end sm:self-auto rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
          >
            Jump to Today
          </button>
        )}
      </div>
    </div>
  );
}
