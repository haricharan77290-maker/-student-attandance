"use client";

import React, { useState } from "react";
import { XCircleIcon, PlusIcon } from "./icons";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (
    name: string,
    studentId: string,
    cohort: string,
    email: string
  ) => Promise<void>;
  defaultCohort?: string;
}

export function AddStudentModal({
  isOpen,
  onClose,
  onAddStudent,
  defaultCohort = "Cohort Alpha (2026)",
}: AddStudentModalProps) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [cohort, setCohort] = useState(defaultCohort);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Student name is required.");
      return;
    }
    const finalId =
      studentId.trim() || `AST-${Math.floor(2000 + Math.random() * 900)}`;
    const finalEmail =
      email.trim() ||
      `${name.toLowerCase().replace(/\s+/g, ".")}@stellar.edu`;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await onAddStudent(name.trim(), finalId, cohort.trim(), finalEmail);
      setName("");
      setStudentId("");
      setEmail("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add student.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-stagger-rise">
      <div
        className="relative w-full max-w-md zerog-card p-6 border border-white/10 bg-[#14171D] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h3 className="text-lg font-bold text-[#F3F4F6] tracking-tight">
              Enlist New Cadet
            </h3>
            <p className="text-xs text-[#8C95A6]">
              Add a student to the zero-g attendance matrix.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C95A6] hover:text-[#F3F4F6] hover:bg-white/5 transition-all"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#8C95A6] mb-1">
              Cadet Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full px-3.5 py-2 bg-[#1B2028] text-sm text-[#F3F4F6] placeholder-[#8C95A6]/50 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8C95A6] mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="AST-2049"
                className="w-full px-3.5 py-2 bg-[#1B2028] text-sm text-[#F3F4F6] placeholder-[#8C95A6]/50 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8C95A6] mb-1">
                Cohort
              </label>
              <input
                type="text"
                value={cohort}
                onChange={(e) => setCohort(e.target.value)}
                placeholder="Cohort Alpha"
                className="w-full px-3.5 py-2 bg-[#1B2028] text-sm text-[#F3F4F6] placeholder-[#8C95A6]/50 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8C95A6] mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya.lin@stellar.edu"
              className="w-full px-3.5 py-2 bg-[#1B2028] text-sm text-[#F3F4F6] placeholder-[#8C95A6]/50 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-[#8C95A6] hover:text-[#F3F4F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all zerog-pill-btn disabled:opacity-50"
            >
              <PlusIcon className="w-4 h-4" />
              <span>{isSubmitting ? "Enlisting..." : "Enlist Cadet"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
