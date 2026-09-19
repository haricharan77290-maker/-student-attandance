import React from "react";

interface HeaderProps {
  onOpenAddModal: () => void;
}

export function Header({ onOpenAddModal }: HeaderProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
          Student Attendance
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-normal">
          Attendance Management System
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenAddModal}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 self-start sm:self-auto cursor-pointer"
      >
        <span>+ Add Student</span>
      </button>
    </div>
  );
}
