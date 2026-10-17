import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [velocityPeriod, setVelocityPeriod] = useState('Monthly');

  // Velocity bar data matching the design in reference image (rounded bars + striped/solid highlight)
  const barData = [
    { label: 'JAN', height: '42%', value: '2.1k', isHighlight: false },
    { label: 'FEB', height: '68%', value: '3.4k', isHighlight: false },
    { label: 'MAR', height: '54%', value: '2.7k', isHighlight: false },
    { label: 'APR', height: '92%', value: '4.8k', isHighlight: true, badge: '+17.8%' },
    { label: 'MAY', height: '62%', value: '3.1k', isHighlight: false },
    { label: 'JUN', height: '70%', value: '3.5k', isHighlight: false },
  ];

  // Top 3 categories with highest post counts
  const topCategories = [
    { name: 'Món Kho & Hầm', count: '1,240', percentage: 45, color: 'bg-[#2F5233]', icon: '🍲' },
    { name: 'Bún & Phở Chay', count: '890', percentage: 32, color: 'bg-[#4C8C4A]', icon: '🍜' },
    { name: 'Món Cuốn & Khai Vị', count: '620', percentage: 23, color: 'bg-[#A8BDA2]', icon: '🥗' },
  ];

  // Recent activity / audit logs matching the table in reference image
  const recentEvents = [
    {
      id: 1,
      name: 'Chef Duy Culinary',
      subtext: '+18.6% engagement',
      date: '16 Oct 2026',
      time: '10:30 PM',
      status: 'Approved',
      detail: 'Claypot Lemongrass Tofu',
      iconBg: 'bg-[#FCE7F3] text-[#DB2777]',
      icon: '🍲',
    },
    {
      id: 2,
      name: 'AI Moderation Guard',
      subtext: 'Auto-flagged spam',
      date: '15 Oct 2026',
      time: '11:45 PM',
      status: 'Flagged',
      detail: 'Comment: @crypto_fast',
      iconBg: 'bg-[#E0F2FE] text-[#0284C7]',
      icon: '🛡️',
    },
    {
      id: 3,
      name: 'Admin Linh Nguyen',
      subtext: 'Role Governance',
      date: '14 Oct 2026',
      time: '10:15 PM',
      status: 'Successful',
      detail: 'Verified Chef: Thu Ha',
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      icon: '⭐',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 w-full max-w-[1600px] mx-auto">
        {/* ============================================================== */}
        {/* 1. TOP HEADER: Greeting + Date Filter + Action Button */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-fraunces font-medium tracking-tight text-[#2B2A25]">
              Welcome Back,{' '}
              <span className="font-bold text-[#2F5233]">
                {user?.fullName?.split(' ')[0] || user?.username || 'Admin'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6F63] mt-1 font-vietnam">
              Platform performance overview & system management
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Date Range Pill */}
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full shadow-xs hover:border-[#2F5233] transition-colors">
              <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>01 Oct, 2026 - 17 Oct, 2026</span>
              <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Add New Action Button */}
            <Link
              to="/admin/categories"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#2F5233] rounded-full shadow-xs hover:bg-[#25401F] transition-all"
            >
              <span>+ Add Category</span>
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MAIN 3-COLUMN DASHBOARD GRID */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================ */}
          {/* LEFT 2 COLUMNS (lg:col-span-8): Hero Card + Chart + Table */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Row: Left Card (Community Reach) + Center Card (Velocity Chart) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Card A: Community Reach & Green Card (md:col-span-5) */}
              <div className="md:col-span-5 bg-white border border-[#DCE3D5] rounded-[28px] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-[#2B2A25]">Community Reach</h3>
                      <p className="text-xs text-[#6B6F63]">Total registered members</p>
                    </div>
                    <Link
                      to="/admin/members"
                      className="w-8 h-8 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] transition-colors"
                      title="View Members"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </Link>
                  </div>

                  {/* Dark Emerald Credit/Hero Card matching reference with Botanical Moss tone */}
                  <div className="mt-4 bg-gradient-to-br from-[#244C38] via-[#2F5233] to-[#1E3B21] rounded-[22px] p-5 text-white shadow-md relative overflow-hidden">
                    {/* Background subtle radial texture */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs tracking-widest text-white/90">VEGAN CORE</span>
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Member Directory</p>
                      <h2 className="text-3xl font-extrabold tracking-tight mt-0.5">14,820</h2>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-white/80 font-mono">
                      <span>•••• 909090</span>
                      <span>EXP 10/26</span>
                    </div>
                  </div>
                </div>

                {/* Sub-metric underneath green card */}
                <div className="mt-4 pt-3 border-t border-[#DCE3D5] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[#6B6F63]">Weekly Growth</p>
                    <p className="text-base font-bold text-[#2B2A25] mt-0.5">+124 Members</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                    +12.8%
                  </span>
                </div>
              </div>

              {/* Card B: Engagement Rate / Velocity Bar Chart (md:col-span-7) */}
              <div className="md:col-span-7 bg-white border border-[#DCE3D5] rounded-[28px] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sm text-[#2B2A25]">Recipe Velocity</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Pill Toggle: Monthly | Annually */}
                      <div className="flex items-center bg-[#EAF0E9] p-1 rounded-full text-xs border border-[#DCE3D5]">
                        <button
                          onClick={() => setVelocityPeriod('Monthly')}
                          className={`px-3 py-1 rounded-full font-medium transition-all ${
                            velocityPeriod === 'Monthly'
                              ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          Weekly
                        </button>
                        <button
                          onClick={() => setVelocityPeriod('Annually')}
                          className={`px-3 py-1 rounded-full font-medium transition-all ${
                            velocityPeriod === 'Annually'
                              ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Bar Chart matching the pill styling in reference image */}
                  <div className="mt-8 relative h-48 flex items-end justify-between px-2 pt-8">
                    {/* Y-axis dashed background lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                    </div>

                    {/* Bars */}
                    {barData.map((bar) => (
                      <div key={bar.label} className="relative z-10 flex flex-col items-center gap-2 group h-full justify-end flex-1">
                        {/* Highlighting badge above peak bar */}
                        {bar.isHighlight && (
                          <div className="absolute -top-7 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2F5233] text-white shadow-sm flex items-center gap-0.5 animate-bounce">
                            <span>{bar.badge}</span>
                          </div>
                        )}

                        <div className="w-9 sm:w-11 h-full flex flex-col justify-end">
                          <div
                            style={{ height: bar.height }}
                            className={`w-full rounded-full transition-all duration-300 relative ${
                              bar.isHighlight
                                ? 'bg-[#2F5233] shadow-sm'
                                : 'bg-[#C6D9C8] hover:bg-[#A8BDA2]'
                            }`}
                          />
                        </div>

                        <span className="text-[11px] font-semibold text-[#6B6F63] mt-1">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Wide Table: Recent Activity & Audit Log (Spanning Col 1 & 2) */}
            <div className="bg-white border border-[#DCE3D5] rounded-[28px] p-6 shadow-xs">
              <div className="flex items-start justify-between pb-4 border-b border-[#DCE3D5]">
                <div>
                  <h3 className="font-semibold text-base text-[#2B2A25]">Audit Trail & Recent Events</h3>
                  <p className="text-xs text-[#6B6F63]">Recent platform management actions</p>
                </div>
                <Link
                  to="/admin/audit-logs"
                  className="w-8 h-8 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] transition-colors"
                  title="View All Audit Logs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                      <th className="py-3 px-2 font-normal">Name</th>
                      <th className="py-3 px-2 font-normal">Date</th>
                      <th className="py-3 px-2 font-normal">Time</th>
                      <th className="py-3 px-2 font-normal">Status</th>
                      <th className="py-3 px-2 font-normal text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF0E9] text-[#2B2A25]">
                    {recentEvents.map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAFBF9] transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${row.iconBg}`}>
                              {row.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-[#2B2A25]">{row.name}</p>
                              <p className="text-[10px] text-[#6B6F63]">{row.subtext}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium">{row.date}</td>
                        <td className="py-3 px-2 text-[#6B6F63]">{row.time}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#2B2A25]">
                            <span className="w-2 h-2 rounded-full bg-[#4C8C4A]" />
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-semibold text-[#2B2A25]">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN (lg:col-span-4): Wave Card + Credit + Team */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Published Recipes with Wave Line Chart */}
            <div className="bg-white border border-[#DCE3D5] rounded-[28px] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[#2B2A25]">Recipe Directory</h3>
                    <p className="text-xs text-[#6B6F63]">Total published database</p>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <p className="text-[11px] text-[#6B6F63]">Total Recipes</p>
                  <h2 className="text-3xl font-extrabold text-[#2B2A25] mt-0.5">3,450</h2>
                </div>

                {/* Smooth Wave Area Chart in Botanical Green */}
                <div className="mt-6 h-28 w-full relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2F5233" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#2F5233" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,45 C40,20 70,60 110,35 C150,10 180,50 220,30 C260,10 280,40 300,25 L300,80 L0,80 Z"
                      fill="url(#waveGradient)"
                    />
                    <path
                      d="M0,45 C40,20 70,60 110,35 C150,10 180,50 220,30 C260,10 280,40 300,25"
                      fill="none"
                      stroke="#2F5233"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2: Top Categories Overview (Highest Post Counts) */}
            <div className="bg-white border border-[#DCE3D5] rounded-[28px] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-[#2B2A25]">Top Categories</h3>
                    <p className="text-xs text-[#6B6F63]">Most popular recipe classifications</p>
                  </div>
                  <Link
                    to="/admin/categories"
                    className="w-8 h-8 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] transition-colors"
                    title="View All Categories"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                </div>

                {/* Stacked Proportional Bar */}
                <div className="mt-4 flex h-2.5 w-full rounded-full overflow-hidden bg-[#EAF0E9] p-0.5 gap-0.5">
                  <div style={{ width: '45%' }} className="bg-[#2F5233] rounded-l-full h-full" title="Món Kho & Hầm: 45%" />
                  <div style={{ width: '32%' }} className="bg-[#4C8C4A] h-full" title="Bún & Phở Chay: 32%" />
                  <div style={{ width: '23%' }} className="bg-[#A8BDA2] rounded-r-full h-full" title="Món Cuốn & Khai Vị: 23%" />
                </div>

                {/* Category List with Individual Progress Bars */}
                <div className="space-y-3 mt-4">
                  {topCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#2B2A25] flex items-center gap-1.5">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <span className="text-[#6B6F63] text-[11px]">
                          <span className="font-bold text-[#2B2A25]">{cat.count}</span> posts ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EAF0E9] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${cat.percentage}%` }}
                          className={`h-full rounded-full ${cat.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Amount of Flagged Content (Moved to bottom) */}
            <div className="bg-white border border-[#DCE3D5] rounded-[28px] p-6 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FBEAE7] flex items-center justify-center text-[#A63446]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#2B2A25]">Flagged Content</h3>
                    <p className="text-[11px] text-[#6B6F63]">AI & community reports</p>
                  </div>
                </div>
                <Link
                  to="/admin/content"
                  className="w-8 h-8 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] transition-colors"
                  title="View Flagged Content"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
              </div>

              <div className="flex items-center justify-between mt-4">
                <h2 className="text-3xl font-extrabold text-[#2B2A25]">5 Items</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FBEAE7] text-[#A63446] border border-[#F5C2BC]">
                  Action Needed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
