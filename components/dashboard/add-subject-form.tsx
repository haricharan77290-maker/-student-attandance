"use client";

import React, { useState } from "react";

interface AddSubjectFormProps {
  onAddSubject: (name: string, code: string) => void;
}

export function AddSubjectForm({ onAddSubject }: AddSubjectFormProps) {
  const [inputName, setInputName] = useState("");
  const [inputCode, setInputCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      return;
    }

    onAddSubject(inputName.trim(), inputCode.trim() || "GENERAL");
    setInputName("");
    setInputCode("");
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
        ADD SUBJECT
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Subject Name (e.g. Mathematics)"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Code (e.g. MATH101)"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full sm:w-44 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-2.5 font-medium text-white transition hover:bg-slate-800"
        >
          Add
        </button>
      </form>
    </div>
  );
}
