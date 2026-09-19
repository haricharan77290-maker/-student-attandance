"use client";

import React from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200 mb-6">
      <label
        htmlFor="student-search"
        className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
      >
        Search Student
      </label>
      <input
        id="student-search"
        type="text"
        placeholder="Search by name or PIN..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        autoComplete="off"
      />
    </div>
  );
}
