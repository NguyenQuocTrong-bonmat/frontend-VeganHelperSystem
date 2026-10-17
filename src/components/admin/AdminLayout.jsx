import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminIconRail from './AdminIconRail';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F3F6EE] p-3 sm:p-5 lg:p-7 flex flex-col justify-center">
      {/* Outer Rounded Application Shell mirroring reference UI */}
      <div className="w-full max-w-[1520px] mx-auto bg-[#FDFBF6] rounded-[32px] shadow-sm border border-[#DCE3D5] flex flex-col min-h-[92vh] overflow-hidden">
        {/* Top Floating Pill Navbar */}
        <AdminNavbar />

        {/* Body Layout: Left Floating Icon Dock + Main Content Canvas */}
        <div className="flex-1 flex overflow-hidden">
          {/* Floating Left Icon Rail */}
          <AdminIconRail />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
