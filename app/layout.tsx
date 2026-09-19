import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Attendance | Class Attendance Management System",
  description: "Complete All-In-One Student Attendance Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
