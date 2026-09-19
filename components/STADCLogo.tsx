import React from "react";

export function STADCLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="STADC Logo">
      <defs>
        <linearGradient id="stadcGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="50%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#EC4899"/>
        </linearGradient>
      </defs>
      {/* Background circle with gradient */}
      <circle cx="16" cy="16" r="15" fill="url(#stadcGradient)" opacity="0.15"/>
      {/* Outer ring */}
      <circle cx="16" cy="16" r="15" stroke="url(#stadcGradient)" strokeWidth="2" fill="none"/>
      
      {/* S - Students */}
      <path d="M10 8C10 6.89543 10.8954 6 12 6H14C15.1046 6 16 6.89543 16 8V10H12V8H10V16H12V14C12 12.8954 12.8954 12 14 12H16C17.1046 12 18 12.8954 18 14V22C18 23.1046 17.1046 24 16 24H14C12.8954 24 12 23.1046 12 22V20H10V22C10 23.1046 9.10457 24 8 24H6C4.89543 24 4 23.1046 4 22V8C4 6.89543 4.89543 6 6 6H8V8H10Z" fill="url(#stadcGradient)"/>
      
      {/* T - Teacher */}
      <path d="M18 6H26C27.1046 6 28 6.89543 28 8V10H24V8H22V22H24V20H26V22C26 23.1046 26.8954 24 28 24H30C31.1046 24 32 23.1046 32 22V8C32 6.89543 31.1046 6 30 6H22V6H18Z" fill="url(#stadcGradient)"/>
      
      {/* A - Attendance */}
      <path d="M10 24L14 30L18 24H14L10 24ZM8 26H10V28H8V26ZM18 26H20V28H18V26Z" fill="url(#stadcGradient)"/>
      
      {/* D - Daily */}
      <path d="M22 24C22 22.8954 22.8954 22 24 22H26C27.1046 22 28 22.8954 28 24V30C28 31.1046 27.1046 32 26 32H24C22.8954 32 22 31.1046 22 30V24ZM24 22C23.4477 22 23 22.4477 23 23V29C23 29.5523 23.4477 30 24 30H26C26.5523 30 27 29.5523 27 29V23C27 22.4477 26.5523 22 26 22H24Z" fill="url(#stadcGradient)"/>
      
      {/* C - Check */}
      <path d="M6 24C6 22.8954 6.89543 22 8 22H10C11.1046 22 12 22.8954 12 24V30C12 31.1046 11.1046 32 10 32H8C6.89543 32 6 31.1046 6 30V24ZM8 22C7.44772 22 7 22.4477 7 23V29C7 29.5523 7.44772 30 8 30H10C10.5523 30 11 29.5523 11 29V23C11 22.4477 10.5523 22 10 22H8Z" fill="url(#stadcGradient)"/>
      
      {/* Connecting lines representing tracking/connection */}
      <path d="M14 16L18 16" stroke="url(#stadcGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M14 16L14 20" stroke="url(#stadcGradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

export function STADCLogoText({ className = "text-xl font-bold" }: { className?: string }) {
  return (
    <span className={className} style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      STADC
    </span>
  );
}