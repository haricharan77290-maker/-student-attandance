import React from "react";
import Link from "next/link";
import { STADCLogo, STADCLogoText } from "./STADCLogo";

interface HeaderProps {
  onOpenAddModal: () => void;
}

export function Header({ onOpenAddModal }: HeaderProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <STADCLogo className="w-10 h-10" />
        <div>
          <Link href="/" className="flex items-center gap-2">
            <STADCLogoText className="text-2xl md:text-3xl" />
          </Link>
          <p className="text-gray-500 mt-1 text-sm font-normal">
            Attendance Management System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Link
          href="/person-to-person"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-purple-700 cursor-pointer"
        >
          <span>Person-to-Person</span>
        </Link>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 cursor-pointer"
        >
          <span>+ Add Student</span>
        </button>
      </div>
    </div>
  );
}
