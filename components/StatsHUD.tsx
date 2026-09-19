"use client";

import React from "react";
import { AttendanceStats } from "@/lib/types";
import { CheckCircleIcon, ClockIcon, XCircleIcon, SparklesIcon } from "./icons";

interface StatsHUDProps {
  stats: AttendanceStats;
  classNameTitle?: string;
  room?: string;
  scheduledTime?: string;
}

export function StatsHUD({
  stats,
  classNameTitle,
  room,
  scheduledTime,
}: StatsHUDProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Session Quick Meta Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#8C95A6]">
            Active Chamber
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F4F6]">
            {classNameTitle || "Orbital Session"}
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#8C95A6]">
          {room && (
            <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5">
              Room: <strong className="text-[#F3F4F6] font-medium">{room}</strong>
            </span>
          )}
          {scheduledTime && (
            <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 font-mono">
              {scheduledTime}
            </span>
          )}
        </div>
      </div>

      {/* Floating HUD Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Roster */}
        <div className="zerog-card p-4 sm:p-5 flex flex-col justify-between hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C95A6]">Roster Total</span>
            <span className="p-1.5 rounded-lg bg-white/[0.04] text-[#8C95A6]">
              <SparklesIcon className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F4F6]">
              {stats.total}
            </div>
            <p className="text-[11px] text-[#8C95A6] mt-0.5">Enrolled cadets</p>
          </div>
        </div>

        {/* Attendance Velocity Rate */}
        <div className="zerog-card p-4 sm:p-5 flex flex-col justify-between hover:border-white/10 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C95A6]">Turnout Ratio</span>
            <span className="text-[11px] font-mono text-emerald-400">
              {stats.ratePercentage}%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F4F6]">
              {stats.ratePercentage}%
            </div>
            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, stats.ratePercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Present (Emerald Drift) */}
        <div className="zerog-card p-4 sm:p-5 flex flex-col justify-between border-emerald-500/10 hover:border-emerald-500/25 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C95A6]">Present</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircleIcon className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400">
              {stats.present}
            </div>
            <p className="text-[11px] text-[#8C95A6] mt-0.5">Checked in on time</p>
          </div>
        </div>

        {/* Late (Amber Float) */}
        <div className="zerog-card p-4 sm:p-5 flex flex-col justify-between border-amber-500/10 hover:border-amber-500/25 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C95A6]">Late Drift</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ClockIcon className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-400">
              {stats.late}
            </div>
            <p className="text-[11px] text-[#8C95A6] mt-0.5">Delayed arrival</p>
          </div>
        </div>

        {/* Absent (Crimson Drop) */}
        <div className="zerog-card p-4 sm:p-5 flex flex-col justify-between border-rose-500/10 hover:border-rose-500/25 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C95A6]">Absent</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircleIcon className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-400">
              {stats.absent}
            </div>
            <p className="text-[11px] text-[#8C95A6] mt-0.5">
              {stats.unmarked > 0 ? `${stats.unmarked} unmarked` : "Zero-G unconfirmed"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
