"use client";

import React, { useEffect, useState } from "react";
import { OrbitIcon, DatabaseIcon } from "./icons";
import { ClassSession } from "@/lib/types";

interface NavbarProps {
  classes: ClassSession[];
  activeClass: ClassSession | null;
  onSelectClass: (c: ClassSession) => void;
  isLiveSupabase: boolean;
}

export function Navbar({
  classes,
  activeClass,
  onSelectClass,
  isLiveSupabase,
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-4 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="zerog-card px-4 py-3 sm:px-6 sm:py-3.5 flex flex-wrap items-center justify-between gap-4 border border-white/5 bg-[#14171D]/80 backdrop-blur-xl">
        {/* Left: Brand / Orbital Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-zerog-drift">
            <OrbitIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#F3F4F6]">
                Zero-G Attendance
              </h1>
              <span className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-[#8C95A6] hidden sm:block">
              Weightless Session Matrix &bull; Real-time Roster
            </p>
          </div>
        </div>

        {/* Center: Class / Session Selector */}
        <div className="flex items-center gap-2 order-3 sm:order-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <select
              value={activeClass?.id || ""}
              onChange={(e) => {
                const selected = classes.find((c) => c.id === e.target.value);
                if (selected) onSelectClass(selected);
              }}
              className="w-full bg-[#1B2028]/80 text-[#F3F4F6] text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2 pr-8 border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all cursor-pointer appearance-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id} className="bg-[#14171D] text-[#F3F4F6]">
                  {cls.code} &bull; {cls.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8C95A6]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Telemetry / Live Sync Status */}
        <div className="flex items-center gap-3 order-2 sm:order-3">
          {/* Orbital Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-[#8C95A6] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
            <span>{timeStr || "--:--:--"}</span>
          </div>

          {/* Supabase Status Pill */}
          <div
            title={
              isLiveSupabase
                ? "Connected directly to live Supabase database"
                : "Local high-performance mode (Add live Supabase key in .env.local to stream to cloud)"
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isLiveSupabase
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/[0.04] text-[#8C95A6] border-white/10"
            }`}
          >
            <DatabaseIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isLiveSupabase ? "Supabase Live" : "Local Sandbox"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
