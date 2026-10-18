import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboardOverview, getAdminDashboardActivity, getAdminDashboardCategories, getAdminAuditLogs } from '../../services/adminService';

const utcDay = (date) => date.toISOString().slice(0, 10);
const defaultRange = () => {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 29);
  return { from: utcDay(from), to: utcDay(to) };
};
const auditDate = (value) => new Date(/[zZ]$|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [velocityPeriod, setVelocityPeriod] = useState('day');
  const [range, setRange] = useState(defaultRange);
  const [draftRange, setDraftRange] = useState(range);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rangeError, setRangeError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setData(null);
    Promise.all([
      getAdminDashboardOverview(range, controller.signal),
      getAdminDashboardActivity({ ...range, interval: velocityPeriod }, controller.signal),
      getAdminDashboardCategories({ ...range, limit: 3 }, controller.signal),
      getAdminAuditLogs({ pageSize: 5, from: `${range.from}T00:00:00Z`, to: `${range.to}T23:59:59.999999Z` }),
    ]).then(([overview, activity, categories, audit]) => {
      if (active) setData({ overview, activity, categories, audit });
    }).catch((err) => {
      if (active) { setData(null); setError(err.message || 'Unable to load dashboard.'); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [range, velocityPeriod, retry]);

  const applyRange = (event) => {
    event.preventDefault();
    const days = (Date.parse(draftRange.to) - Date.parse(draftRange.from)) / 86400000;
    if (!draftRange.from || !draftRange.to || !Number.isFinite(days) || days < 0 || days >= 366 || draftRange.from < '2000-01-01' || draftRange.to > utcDay(new Date())) {
      setRangeError('Choose up to 366 days, from year 2000 through today (UTC).');
      return;
    }
    setRangeError('');
    setRange({ ...draftRange });
  };
  const overview = data?.overview;
  const activity = data?.activity?.items || [];
  const maxPosts = Math.max(1, ...activity.map((item) => item.postCount));
  const barData = activity.map((item) => ({
    label: new Date(`${item.period}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' }),
    period: item.period,
    height: `${item.postCount / maxPosts * 100}%`, value: item.postCount,
  }));
  const colors = ['bg-[#2F5233]', 'bg-[#4C8C4A]', 'bg-[#A8BDA2]'];
  const topCategories = (data?.categories?.items || []).map((item, index) => ({ ...item, count: item.postCount, color: colors[index] }));
  const metric = (value) => loading ? '…' : value == null ? '—' : value.toLocaleString('en-GB');
  const recentEvents = (data?.audit?.items || []).map((item) => ({
    id: item.id, name: item.action, subtext: `Admin #${item.adminId}`,
    date: auditDate(item.createdAt).toLocaleDateString('en-GB'),
    time: auditDate(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    status: 'Recorded', detail: `${item.targetType}${item.targetId ? ` #${item.targetId}` : ''}`,
  }));


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

          {/* Date Range Selector nicely aligned */}
          <form onSubmit={applyRange} className="flex flex-wrap items-end gap-2 text-xs text-[#2B2A25]">
            <label className="grid gap-1">From (UTC)<input aria-label="From (UTC)" type="date" required min="2000-01-01" max={utcDay(new Date())} value={draftRange.from} onChange={(e) => setDraftRange({ ...draftRange, from: e.target.value })} className="rounded-xl border border-[#DCE3D5] bg-white p-2" /></label>
            <label className="grid gap-1">To (UTC)<input aria-label="To (UTC)" type="date" required min={draftRange.from} max={utcDay(new Date())} value={draftRange.to} onChange={(e) => setDraftRange({ ...draftRange, to: e.target.value })} className="rounded-xl border border-[#DCE3D5] bg-white p-2" /></label>
            <button type="submit" className="rounded-xl bg-[#2F5233] px-4 py-2.5 text-white">Apply</button>
          </form>
        </div>
        {rangeError && <p role="alert" className="text-sm text-[#A63446]">{rangeError}</p>}
        {loading && <p role="status" className="text-sm text-[#6B6F63]">Loading dashboard…</p>}
        {error && <div role="alert" className="rounded-xl border border-[#A63446] p-4 text-[#A63446]">{error}<button type="button" onClick={() => setRetry((value) => value + 1)} className="ml-4 underline">Retry</button></div>}

        {/* ============================================================== */}
        {/* 2. MAIN 3-COLUMN DASHBOARD GRID */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================ */}
          {/* LEFT 2 COLUMNS (lg:col-span-8): Hero Card + Chart + Table */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 min-w-0 space-y-6">
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
                  </div>

                  {/* Dark Emerald Credit/Hero Card matching reference with Botanical Moss tone */}
                  <div className="mt-4 bg-gradient-to-br from-[#244C38] via-[#2F5233] to-[#1E3B21] rounded-[22px] p-5 text-white shadow-md relative overflow-hidden">
                    {/* Background subtle radial texture */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs tracking-widest text-white/90">VEGAN HELPER</span>
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] text-white/70 uppercase tracking-wider font-medium">Member Directory</p>
                      <h2 className="text-3xl font-extrabold tracking-tight mt-0.5">{metric(overview?.members.total)}</h2>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] text-white/80 font-mono">
                      <span>REGISTERED MEMBERS</span>
                      <span>{loading ? 'LOADING' : error ? 'UNAVAILABLE' : 'SYNCED'}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-metric underneath green card */}
                <div className="mt-4 pt-3 border-t border-[#DCE3D5] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-[#6B6F63]">New members in selected period</p>
                    <p className="text-base font-bold text-[#2B2A25] mt-0.5">{metric(overview?.members.newInPeriod)} Members</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                    {!overview ? '—' : overview.members.growthPercentage == null ? 'No prior baseline' : `${overview.members.growthPercentage > 0 ? '+' : ''}${overview.members.growthPercentage}%`}
                  </span>
                </div>
              </div>

              {/* Card B: Engagement Rate / Velocity Bar Chart (md:col-span-7) */}
              <div className="md:col-span-7 min-w-0 bg-white border border-[#DCE3D5] rounded-[28px] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-sm text-[#2B2A25]">Post Activity</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Group creation counts by calendar day, week or month. */}
                      <div className="flex items-center bg-[#EAF0E9] p-1 rounded-full text-xs border border-[#DCE3D5]">
                        <button
                          aria-pressed={velocityPeriod === 'day'}
                          onClick={() => setVelocityPeriod('day')}
                          className={`px-3 py-1 rounded-full font-medium transition-all ${
                            velocityPeriod === 'day'
                              ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          Daily
                        </button>
                        <button
                          aria-pressed={velocityPeriod === 'week'}
                          onClick={() => setVelocityPeriod('week')}
                          className={`px-3 py-1 rounded-full font-medium transition-all ${
                            velocityPeriod === 'week'
                              ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          Weekly
                        </button>
                        <button type="button" aria-pressed={velocityPeriod === 'month'} onClick={() => setVelocityPeriod('month')} className={`px-3 py-1 rounded-full font-medium ${velocityPeriod === 'month' ? 'bg-[#2F5233] text-white' : 'text-[#6B6F63]'}`}>Monthly</button>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Bar Chart matching the pill styling in reference image */}
                  <div className="mt-8 relative h-48 flex items-end gap-2 overflow-x-auto px-2 pt-8" aria-label="Post creation activity">
                    {/* Y-axis dashed background lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                      <div className="border-b border-dashed border-[#DCE3D5] w-full" />
                    </div>

                    {/* Bars */}
                    {barData.map((bar) => (
                      <div key={bar.period} className="relative z-10 flex min-w-10 flex-col items-center gap-2 group h-full justify-end flex-1">
                        <div className="w-9 sm:w-11 h-full flex flex-col justify-end">
                          <div
                            style={{ height: bar.height }}
                            className="w-full rounded-full bg-[#C6D9C8] hover:bg-[#A8BDA2] transition-all duration-300 relative"
                            title={`${bar.label}: ${bar.value}`}
                            role="img" aria-label={`${bar.label}: ${bar.value} posts`}
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
              <div className="pb-4 border-b border-[#DCE3D5]">
                <Link to="/admin/audit-logs" className="font-semibold text-base text-[#2B2A25] hover:underline">Audit Trail & Recent Events</Link>
                <p className="text-xs text-[#6B6F63]">Recent platform management actions</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs table-fixed">
                  <thead>
                    <tr className="text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                      <th className="py-3 px-2 font-normal w-[32%]">Name</th>
                      <th className="py-3 px-2 font-normal w-[18%]">Date</th>
                      <th className="py-3 px-2 font-normal w-[15%]">Time</th>
                      <th className="py-3 px-2 font-normal w-[17%]">Status</th>
                      <th className="py-3 px-2 font-normal text-right w-[18%]">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF0E9] text-[#2B2A25]">
                    {!loading && recentEvents.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-[#6B6F63]">{error ? 'Audit data unavailable.' : 'No management actions in this period.'}</td></tr>}
                    {recentEvents.map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAFBF9] transition-colors">
                        <td className="py-3 px-2 overflow-hidden">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2B2A25] truncate" title={row.name}>{row.name}</p>
                            <p className="text-[10px] text-[#6B6F63] truncate" title={row.subtext}>{row.subtext}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-[#6B6F63] overflow-hidden truncate" title={row.date}>{row.date}</td>
                        <td className="py-3 px-2 text-[#6B6F63] overflow-hidden truncate" title={row.time}>{row.time}</td>
                        <td className="py-3 px-2 overflow-hidden">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#6B6F63] max-w-full truncate" title={row.status}>
                            <span className="w-2 h-2 rounded-full bg-[#9CA3AF] shrink-0" />
                            <span className="truncate">{row.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-[#6B6F63] overflow-hidden truncate" title={row.detail}>{row.detail}</td>
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
                    <h3 className="font-semibold text-sm text-[#2B2A25]">Post Directory</h3>
                    <p className="text-xs text-[#6B6F63]">Total published database</p>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <p className="text-[11px] text-[#6B6F63]">Total Published Posts</p>
                  <h2 className="text-3xl font-extrabold text-[#2B2A25] mt-0.5">{metric(overview?.posts.totalPublished)}</h2>
                </div>

                <p className="mt-2 text-xs text-center text-[#6B6F63]">{metric(overview?.posts.createdInPeriod)} created in selected period</p>
                {/* Creation activity across the selected date range. */}
                <div className="mt-6 h-28 w-full relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2F5233" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#2F5233" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={activity.length ? `M0,80 ${activity.map((item, index) => `L${index * 300 / Math.max(1, activity.length - 1)},${75 - item.postCount / maxPosts * 65}`).join(' ')} L300,80 Z` : ''}
                      fill="url(#waveGradient)"
                    />
                    <path
                      d={activity.map((item, index) => `${index === 0 ? 'M' : 'L'}${index * 300 / Math.max(1, activity.length - 1)},${75 - item.postCount / maxPosts * 65}`).join(' ')}
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
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2A25]">Top Categories</h3>
                  <p className="text-xs text-[#6B6F63]">Share of categorized published posts in selected period</p>
                </div>

                {/* Relative counts among the displayed top categories. */}
                <div className="mt-4 flex h-2.5 w-full rounded-full overflow-hidden bg-[#EAF0E9] p-0.5 gap-0.5">
                  {topCategories.map((cat) => <div key={cat.categoryId} style={{ width: `${cat.count / Math.max(1, topCategories.reduce((sum, item) => sum + item.count, 0)) * 100}%` }} className={`${cat.color} h-full`} />)}
                </div>

                {/* Category List with Individual Progress Bars (Clean without icons) */}
                <div className="space-y-3 mt-4">
                  {!loading && topCategories.length === 0 && <p className="text-xs text-[#6B6F63]">{error ? 'Category data unavailable.' : 'No categorized published posts in this period.'}</p>}
                  {topCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#2B2A25]">
                          {cat.name} · {cat.percentage}%
                        </span>
                        <span className="text-[#6B6F63] text-[11px]">
                          <span className="font-bold text-[#2B2A25]">{cat.count}</span> posts
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

              <div className="flex items-center justify-between mt-4">
                <h2 className="text-3xl font-extrabold text-[#2B2A25]">{metric(overview?.moderation.totalPending)} Items</h2>
                <Link to="/admin/content" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">Review</Link>
              </div>
              <p className="mt-3 text-xs text-[#6B6F63]">{metric(overview?.moderation.aiFlaggedPosts)} AI flagged posts · {metric(overview?.moderation.reportedPosts)} reported posts · {metric(overview?.moderation.reportedComments)} reported comments</p>
              <p className="mt-1 text-xs text-[#6B6F63]">Current pending content. A post flagged by both AI and users is counted once in the total.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
