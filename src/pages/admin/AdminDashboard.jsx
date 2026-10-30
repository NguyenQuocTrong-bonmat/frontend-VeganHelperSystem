import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
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

export const getUtcWeekMonday = (date) => {
  const d = new Date(date);
  const dayOfWeek = d.getUTCDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diffToMonday);
  return utcDay(d);
};

export const isCurrentPeriod = (period, interval, now = new Date()) => {
  if (!period) return false;
  if (interval === 'day') {
    return period === utcDay(now);
  }
  if (interval === 'week') {
    return period === getUtcWeekMonday(now);
  }
  if (interval === 'month') {
    const currentYearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    return period.startsWith(currentYearMonth);
  }
  return false;
};

// Each block loads independently; changing chart grouping only refetches activity.
function useDashboardResource(kind, range, interval, retry) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setState({ data: null, loading: true, error: '' });
    const loaders = {
      overview: () => getAdminDashboardOverview(range, controller.signal),
      activity: () => getAdminDashboardActivity({ ...range, interval }, controller.signal),
      categories: () => getAdminDashboardCategories({ ...range, limit: 3 }, controller.signal),
      audit: () => getAdminAuditLogs({ pageSize: 5, from: `${range.from}T00:00:00Z`, to: `${range.to}T23:59:59.999999Z` }, controller.signal),
    };
    loaders[kind]().then((data) => {
      if (active) setState({ data, loading: false, error: '' });
    }).catch((err) => {
      if (active) setState({ data: null, loading: false, error: `${kind}: ${err.message || 'Unable to load data.'}` });
    });
    return () => { active = false; controller.abort(); };
  }, [kind, range, interval, retry]);
  return state;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [velocityPeriod, setVelocityPeriod] = useState('day');
  const [range, setRange] = useState(defaultRange);
  const [draftRange, setDraftRange] = useState(range);
  const [rangeError, setRangeError] = useState('');
  const [retry, setRetry] = useState(0);
  const overviewState = useDashboardResource('overview', range, null, retry);
  const activityState = useDashboardResource('activity', range, velocityPeriod, retry);
  const categoriesState = useDashboardResource('categories', range, null, retry);
  const auditState = useDashboardResource('audit', range, null, retry);
  const states = [overviewState, activityState, categoriesState, auditState];
  const loading = states.some((state) => state.loading);
  const error = states.map((state) => state.error).filter(Boolean).join(' · ');

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
  const overview = overviewState.data;
  const activity = activityState.data?.items || [];
  const maxPosts = Math.max(1, ...activity.map((item) => item.postCount));
  const currentPeriodTag =
    velocityPeriod === 'day'
      ? 'Today'
      : velocityPeriod === 'week'
      ? 'This Week'
      : 'This Month';
  const barData = activity.map((item) => {
    const isCurrent = isCurrentPeriod(item.period, velocityPeriod);
    return {
      label: new Date(`${item.period}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' }),
      period: item.period,
      height: `${(item.postCount / maxPosts) * 100}%`,
      value: item.postCount,
      isCurrent,
    };
  });
  const colors = ['bg-[#2F5233]', 'bg-[#4C8C4A]', 'bg-[#A8BDA2]'];
  const topCategories = (categoriesState.data?.items || []).map((item, index) => ({ ...item, count: item.postCount, color: colors[index] }));
  const metric = (value) => overviewState.loading ? '…' : value == null ? '—' : value.toLocaleString('en-GB');
  const recentEvents = (auditState.data?.items || []).map((item) => ({
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
            <label className="grid gap-1">From (UTC)<input aria-label="From (UTC)" type="date" required min="2000-01-01" max={utcDay(new Date())} value={draftRange.from} onChange={(e) => setDraftRange({ ...draftRange, from: e.target.value })} className="rounded-xl border border-[#DCE3D5] bg-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:border-[#2F5233] transition-all" /></label>
            <label className="grid gap-1">To (UTC)<input aria-label="To (UTC)" type="date" required min={draftRange.from} max={utcDay(new Date())} value={draftRange.to} onChange={(e) => setDraftRange({ ...draftRange, to: e.target.value })} className="rounded-xl border border-[#DCE3D5] bg-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:border-[#2F5233] transition-all" /></label>
            <button type="submit" className="rounded-xl bg-[#2F5233] hover:bg-[#25401F] px-4 py-2.5 text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none cursor-pointer">Apply</button>
          </form>
        </div>
        {rangeError && <p role="alert" className="text-sm text-[#A63446]">{rangeError}</p>}
        {loading && <p role="status" className="text-sm text-[#6B6F63]">Loading dashboard…</p>}
        {error && <div role="alert" className="rounded-xl border border-[#A63446] p-4 text-[#A63446]">{error}<button type="button" onClick={() => setRetry((value) => value + 1)} className="ml-4 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63446] rounded px-1 active:opacity-80">Retry</button></div>}

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
                      <span>{overviewState.loading ? 'LOADING' : overviewState.error ? 'UNAVAILABLE' : 'SYNCED'}</span>
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
                      <div className="flex items-center bg-[#EAF0E9] p-1 rounded-full text-xs border border-[#DCE3D5]" role="group" aria-label="Velocity period selection">
                        <button
                          type="button"
                          aria-pressed={velocityPeriod === 'day'}
                          onClick={() => setVelocityPeriod('day')}
                          className={`relative px-3 py-1 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer ${
                            velocityPeriod === 'day'
                              ? 'text-white font-semibold'
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          {velocityPeriod === 'day' && (
                            <motion.span
                              layoutId="admin-velocity-period-pill"
                              className="absolute inset-0 bg-[#2F5233] rounded-full shadow-xs"
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                          <span className="relative z-10">Daily</span>
                        </button>
                        <button
                          type="button"
                          aria-pressed={velocityPeriod === 'week'}
                          onClick={() => setVelocityPeriod('week')}
                          className={`relative px-3 py-1 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer ${
                            velocityPeriod === 'week'
                              ? 'text-white font-semibold'
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          {velocityPeriod === 'week' && (
                            <motion.span
                              layoutId="admin-velocity-period-pill"
                              className="absolute inset-0 bg-[#2F5233] rounded-full shadow-xs"
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                          <span className="relative z-10">Weekly</span>
                        </button>
                        <button 
                          type="button" 
                          aria-pressed={velocityPeriod === 'month'} 
                          onClick={() => setVelocityPeriod('month')} 
                          className={`relative px-3 py-1 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer ${
                            velocityPeriod === 'month' 
                              ? 'text-white font-semibold' 
                              : 'text-[#6B6F63] hover:text-[#2B2A25]'
                          }`}
                        >
                          {velocityPeriod === 'month' && (
                            <motion.span
                              layoutId="admin-velocity-period-pill"
                              className="absolute inset-0 bg-[#2F5233] rounded-full shadow-xs"
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                          <span className="relative z-10">Monthly</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Legend distinguishing past vs current period */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#6B6F63]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C6D9C8]" aria-hidden="true" />
                      <span>Past</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2F5233]" aria-hidden="true" />
                      <span className="font-semibold text-[#2F5233]">{currentPeriodTag}</span>
                    </div>
                  </div>

                  {activityState.loading && <p className="mt-3 text-xs text-[#6B6F63]">Loading post activity…</p>}
                  {!activityState.loading && !activityState.error && !activity.some((item) => item.postCount > 0) && <p className="mt-3 text-xs text-[#6B6F63]">No posts were created in this period.</p>}
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
                            className={`w-full rounded-full transition-all duration-300 relative min-h-[4px] ${
                              bar.isCurrent
                                ? 'bg-[#2F5233] hover:bg-[#1E3B21] shadow-xs ring-2 ring-[#2F5233]/20'
                                : 'bg-[#C6D9C8] hover:bg-[#A8BDA2]'
                            }`}
                            title={`${bar.label}${bar.isCurrent ? ` (${currentPeriodTag})` : ''}: ${bar.value} posts`}
                            role="img"
                            aria-label={`${bar.label}: ${bar.value} posts`}
                          />
                        </div>

                        <span
                          className={`text-[11px] mt-1 transition-colors ${
                            bar.isCurrent
                              ? 'font-bold text-[#2F5233]'
                              : 'font-semibold text-[#6B6F63]'
                          }`}
                        >
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Wide Table: Recent Activity & Audit Log (Spanning Col 1 & 2) */}
            <div className="bg-white border border-[#DCE3D5] rounded-[28px] p-6 shadow-xs">
              <div className="pb-4 border-b border-[#DCE3D5]">
                <Link to="/admin/audit-logs" className="font-semibold text-base text-[#2B2A25] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded px-0.5 active:opacity-80">Audit Trail & Recent Events</Link>
                <p className="text-xs text-[#6B6F63]">Recent platform management actions</p>
              </div>

              {/* Mobile Horizontal Scroll Cue */}
              <div className="sm:hidden flex items-center justify-between text-[11px] text-[#6B6F63] py-1.5 border-b border-[#DCE3D5]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Swipe horizontally to view full events
                </span>
                <span className="text-[10px] font-mono text-[#8A9080]">560px</span>
              </div>

              {/* Table */}
              <div tabIndex={0} role="region" aria-label="Recent activity table" className="overflow-x-auto mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]/40">
                <table className="w-full min-w-[560px] text-left text-xs border-separate border-spacing-0 table-fixed">
                  <thead>
                    <tr className="text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                      <th scope="col" className="py-3 px-2 font-normal w-[180px] sm:sticky sm:left-0 bg-white z-20 sm:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] sm:border-r sm:border-[#DCE3D5]/80 border-b border-[#DCE3D5]">Name</th>
                      <th scope="col" className="py-3 px-2 font-normal w-[95px] border-b border-[#DCE3D5]">Date</th>
                      <th scope="col" className="py-3 px-2 font-normal w-[85px] border-b border-[#DCE3D5]">Time</th>
                      <th scope="col" className="py-3 px-2 font-normal w-[100px] border-b border-[#DCE3D5]">Status</th>
                      <th scope="col" className="py-3 px-2 font-normal text-left w-[100px] border-b border-[#DCE3D5]">Target</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#2B2A25]">
                    {auditState.loading && <tr><td colSpan={5} className="py-6 text-center text-[#6B6F63] border-b border-[#EAF0E9]">Loading audit events…</td></tr>}
                    {!auditState.loading && recentEvents.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-[#6B6F63] border-b border-[#EAF0E9]">{auditState.error ? 'Audit data unavailable.' : 'No management actions in this period.'}</td></tr>}
                    {recentEvents.map((row) => (
                      <tr key={row.id} className="group hover:bg-[#F3F6EE]/60 transition-colors duration-150">
                        <td className="py-3 px-2 overflow-hidden border-b border-[#EAF0E9] sm:sticky sm:left-0 bg-white group-hover:bg-[#F7F9F5] z-10 sm:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] sm:border-r sm:border-[#DCE3D5]/80 transition-colors">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2B2A25] truncate" title={row.name}>{row.name}</p>
                            <p className="text-[10px] text-[#6B6F63] truncate" title={row.subtext}>{row.subtext}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-[#6B6F63] overflow-hidden truncate border-b border-[#EAF0E9]" title={row.date}>{row.date}</td>
                        <td className="py-3 px-2 text-[#6B6F63] overflow-hidden truncate border-b border-[#EAF0E9]" title={row.time}>{row.time}</td>
                        <td className="py-3 px-2 overflow-hidden border-b border-[#EAF0E9]">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#6B6F63] max-w-full truncate" title={row.status}>
                            <span className="w-2 h-2 rounded-full bg-[#9CA3AF] shrink-0" />
                            <span className="truncate">{row.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-left font-medium text-[#6B6F63] overflow-hidden truncate border-b border-[#EAF0E9]" title={row.detail}>{row.detail}</td>
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
                  {categoriesState.loading && <p className="text-xs text-[#6B6F63]">Loading categories…</p>}
                  {!categoriesState.loading && topCategories.length === 0 && <p className="text-xs text-[#6B6F63]">{categoriesState.error ? 'Category data unavailable.' : 'No categorized published posts in this period.'}</p>}
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
                <Link to="/admin/content" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF0E9] hover:bg-[#DCE5D9] text-[#2F5233] border border-[#DCE3D5] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer">Review</Link>
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
