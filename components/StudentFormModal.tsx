"use client";

import React, { useState } from "react";
import { Student } from "@/lib/types/student";

interface StudentFormModalProps {
  isOpen: boolean;
  editingStudent: Student | null;
  existingStudents: Student[];
  onSave: (
    name: string,
    pin: string,
    editingStudentId?: string
  ) => string | null;
  onClose: () => void;
}

function StudentFormInner({
  editingStudent,
  existingStudents,
  onSave,
  onClose,
}: Omit<StudentFormModalProps, "isOpen">) {
  const [name, setName] = useState(editingStudent?.name ?? "");
  const [pin, setPin] = useState(editingStudent?.pin ?? "");
  const [error, setError] = useState("");

  const isEditing = editingStudent !== null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPin = pin.trim().toUpperCase();

    if (!trimmedName) {
      setError("Please enter student name.");
      return;
    }

    if (!trimmedPin) {
      setError("Please enter student PIN.");
      return;
    }

    const isDuplicate = existingStudents.some(
      (student) =>
        student.pin.trim().toUpperCase() === trimmedPin &&
        student.id !== editingStudent?.id
    );

    if (isDuplicate) {
      setError("This PIN is already assigned to another student.");
      return;
    }

    const saveError = onSave(
      trimmedName,
      trimmedPin,
      editingStudent?.id
    );

    if (saveError) {
      setError(saveError);
      return;
    }

    onClose();
  };

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-form-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="student-form-title"
            className="text-xl font-bold text-gray-800"
          >
            {isEditing ? "Edit Student" : "Add Student"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5 flex flex-col gap-4">
            <div>
              <label
                htmlFor="form-student-name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Student Name
              </label>

              <input
                id="form-student-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Enter student name"
                autoComplete="off"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="form-student-pin"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Student PIN
              </label>

              <input
                id="form-student-pin"
                type="text"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="253B5A0408"
                autoComplete="off"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 font-mono text-sm uppercase text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                PIN is stored as text.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              {isEditing ? "Update Student" : "Add Student"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Main exported component */
export function StudentFormModal({
  isOpen,
  editingStudent,
  existingStudents,
  onSave,
  onClose,
}: StudentFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <StudentFormInner
      key={editingStudent?.id ?? "add"}
      editingStudent={editingStudent}
      existingStudents={existingStudents}
      onSave={onSave}
      onClose={onClose}
    />
  );
}