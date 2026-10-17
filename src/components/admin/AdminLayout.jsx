import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminIconRail from './AdminIconRail';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F0] flex flex-col">
      {/* Top Navbar: Full Width */}
      <AdminNavbar />

      {/* Body: Left Docked Rail + Main Dashboard Content */}
      <div className="flex-1 flex w-full">
        {/* Left Icon Rail */}
        <AdminIconRail />

        {/* Main Dashboard Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
