import React from 'react';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F0] flex flex-col">
      {/* Top Navbar: Full Width */}
      <AdminNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
