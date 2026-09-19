"use client";

import React from "react";
import { AttendanceStatus } from "@/lib/types";
import {
  SearchIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckAllIcon,
  PlusIcon,
  DownloadIcon,
} from "./icons";

interface RosterControlsProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: "all" | AttendanceStatus;
  onFilterChange: (f: "all" | AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onOpenAddStudent: () => void;
  onExportCSV: () => void;
  isSavingBatch?: boolean;
}

export function RosterControls({
  selectedDate,
  onSelectDate,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onMarkAllPresent,
  onOpenAddStudent,
  onExportCSV,
  isSavingBatch,
}: RosterControlsProps) {
  // Navigation helpers for dates
  const handleShiftDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    onSelectDate(current.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    onSelectDate(new Date().toISOString().split("T")[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <div className="zerog-card p-4 sm:p-5 flex flex-col gap-4 border border-white/5 bg-[#14171D]/90 backdrop-blur-xl">
        {/* Top Control Bar: Date Navigator & Batch Operations */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Date Selector Island */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#1B2028] rounded-xl border border-white/10 p-1">
              <button
                type="button"
                onClick={() => handleShiftDate(-1)}
                className="p-1.5 rounded-lg text-[#8C95A6] hover:text-[#F3F4F6] hover:bg-white/5 transition-all zerog-pill-btn"
                title="Previous Day"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-3 py-1 text-xs sm:text-sm font-medium text-[#F3F4F6]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#8C95A6]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onSelectDate(e.target.value)}
                  className="bg-transparent text-[#F3F4F6] font-mono text-xs sm:text-sm focus:outline-none cursor-pointer [color-scheme:dark]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleShiftDate(1)}
                className="p-1.5 rounded-lg text-[#8C95A6] hover:text-[#F3F4F6] hover:bg-white/5 transition-all zerog-pill-btn"
                title="Next Day"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {!isToday && (
              <button
                type="button"
                onClick={handleToday}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-[#F3F4F6] border border-white/10 transition-all zerog-pill-btn"
              >
                Jump to Today
              </button>
            )}
          </div>

          {/* Action Island: Mark All, Add Student, Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mark All Present */}
            <button
              type="button"
              disabled={isSavingBatch}
              onClick={onMarkAllPresent}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-all zerog-pill-btn disabled:opacity-50"
            >
              <CheckAllIcon className="w-4 h-4" />
              <span>{isSavingBatch ? "Aligning..." : "Mark All Present"}</span>
            </button>

            {/* Quick Add Student */}
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/[0.05] hover:bg-white/[0.09] text-[#F3F4F6] border border-white/10 transition-all zerog-pill-btn"
            >
              <PlusIcon className="w-4 h-4 text-[#8C95A6]" />
              <span>Add Cadet</span>
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={onExportCSV}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/[0.03] hover:bg-white/[0.07] text-[#8C95A6] hover:text-[#F3F4F6] border border-white/5 transition-all zerog-pill-btn"
              title="Export session attendance as CSV"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Bottom Control Bar: Search Input & Filter Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-white/[0.04]">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C95A6]">
              <SearchIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by cadet name or ID..."
              className="w-full pl-9 pr-4 py-2 bg-[#1B2028]/60 text-xs sm:text-sm text-[#F3F4F6] placeholder-[#8C95A6]/60 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { key: "all", label: "All", color: "" },
                { key: "present", label: "Present", color: "text-emerald-400" },
                { key: "late", label: "Late", color: "text-amber-400" },
                { key: "absent", label: "Absent", color: "text-rose-400" },
                { key: "unmarked", label: "Unmarked", color: "" },
              ] as Array<{ key: "all" | AttendanceStatus; label: string; color: string }>
            ).map((item) => {
              const isSelected = activeFilter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onFilterChange(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all zerog-pill-btn ${
                    isSelected
                      ? "bg-white/10 text-[#F3F4F6] border border-white/20 shadow-sm"
                      : "bg-white/[0.02] text-[#8C95A6] hover:text-[#F3F4F6] border border-white/5"
                  }`}
                >
                  <span className={item.color || ""}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
