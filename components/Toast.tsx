"use client";

import React, { useEffect } from "react";
import { ToastNotification } from "@/lib/types/student";

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

const TOAST_DURATION_MS = 4000;

const toastColors: Record<ToastNotification["type"], string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-blue-600 text-white",
};

const toastIcons: Record<ToastNotification["type"], string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center w-full max-w-sm px-4"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg w-full ${toastColors[toast.type]}`}
        >
          <span className="text-base leading-none">{toastIcons[toast.type]}</span>
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="ml-1 opacity-75 hover:opacity-100 transition cursor-pointer text-base leading-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
