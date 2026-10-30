import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import ModalMotion, { toastVariants, reducedToastVariants } from '../../components/ui/ModalMotion';
import { getAdminAuditLogs, getAdminAuditLogById } from '../../services/adminService';
import { getPaginationPages } from '../../utils/paginationUtils';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('all'); // all | today | 7days | 30days
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected event inspection modal (fetches /api/admin/audit-logs/{id})
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const toastTimerRef = useRef(null);

  // Clean up toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Toast feedback
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Fetch audit logs list from GET /api/admin/audit-logs
  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAdminAuditLogs({ pageIndex: 1, pageSize: 100, importantOnly: true });
      const items = data.items || data;
      if (Array.isArray(items) && items.length > 0) {
        setLogs(
          items.map((log) => ({
            id: log.id,
            adminId: log.adminId,
            action: log.action || '',
            targetType: log.targetType || 'unknown',
            targetId: log.targetId ? String(log.targetId) : null,
            ipAddress: log.ipAddress || null,
            traceId: log.traceId || '',
            createdAt: log.createdAt || new Date().toISOString(),
          }))
        );
      } else {
        setLogs([]);
      }
    } catch (err) {
      setLogs([]);
      setLoadError(err.message || 'Audit logs could not be loaded. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Inspect detail handler: calls GET /api/admin/audit-logs/{id}
  const handleInspect = async (log) => {
    setSelectedEvent(log);
    setIsModalLoading(true);
    try {
      const detail = await getAdminAuditLogById(log.id);
      if (detail && detail.id) {
        setSelectedEvent({
          id: detail.id,
          adminId: detail.adminId,
          action: detail.action || '',
          targetType: detail.targetType || 'unknown',
          targetId: detail.targetId ? String(detail.targetId) : null,
          ipAddress: detail.ipAddress || null,
          traceId: detail.traceId || '',
          createdAt: detail.createdAt || log.createdAt,
        });
      }
    } catch (err) {
      console.warn(`Backend /admin/audit-logs/${log.id} unavailable, showing cached record:`, err.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  // Extract distinct target types from logs for dropdown filter
  const availableTargetTypes = useMemo(() => {
    const types = new Set(logs.map((l) => l.targetType).filter(Boolean));
    return Array.from(types).sort();
  }, [logs]);

  // Filter & Sort Logic
  const filteredLogs = useMemo(() => {
    const now = new Date();

    return logs
      .filter((log) => {
        // 1. Target Type Filter
        if (targetTypeFilter !== 'All' && log.targetType !== targetTypeFilter) {
          return false;
        }

        // 2. Time Filter
        if (timeFilter !== 'all') {
          const logDate = new Date(log.createdAt);
          const diffMs = now - logDate;
          const diffHours = diffMs / (1000 * 60 * 60);

          if (timeFilter === 'today' && diffHours > 24) return false;
          if (timeFilter === '7days' && diffHours > 24 * 7) return false;
          if (timeFilter === '30days' && diffHours > 24 * 30) return false;
        }

        // 3. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = String(log.id).toLowerCase().includes(q);
          const matchAdminId = String(log.adminId).toLowerCase().includes(q);
          const matchAction = log.action.toLowerCase().includes(q);
          const matchTargetType = log.targetType.toLowerCase().includes(q);
          const matchTargetId = log.targetId ? log.targetId.toLowerCase().includes(q) : false;
          const matchIp = log.ipAddress ? log.ipAddress.toLowerCase().includes(q) : false;
          const matchTraceId = log.traceId ? log.traceId.toLowerCase().includes(q) : false;

          if (!matchId && !matchAdminId && !matchAction && !matchTargetType && !matchTargetId && !matchIp && !matchTraceId) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        if (sortBy === 'oldest') return timeA - timeB;
        return timeB - timeA; // default: newest
      });
  }, [logs, targetTypeFilter, timeFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Real statistics derived purely from backend audit schema
  const stats = useMemo(() => {
    const total = logs.length;
    const uniqueAdmins = new Set(logs.map((l) => l.adminId)).size;
    const uniqueTargetTypes = new Set(logs.map((l) => l.targetType)).size;
    const uniqueIps = new Set(logs.filter((l) => l.ipAddress).map((l) => l.ipAddress)).size;
    return { total, uniqueAdmins, uniqueTargetTypes, uniqueIps };
  }, [logs]);

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setTargetTypeFilter('All');
    setTimeFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Filters cleared to default view.');
  };

  const handleRefresh = () => {
    fetchAuditLogs();
    showToast('Audit log records refreshed.');
  };

  // CSV Export handler with real audited columns
  const handleExportCSV = () => {
    try {
      const headers = ['Log ID', 'Created At (ISO)', 'Admin ID', 'Action', 'Target Type', 'Target ID', 'Client IP Address', 'Trace ID'];
      const rows = filteredLogs.map((log) => [
        log.id,
        `"${log.createdAt}"`,
        log.adminId,
        `"${log.action}"`,
        `"${log.targetType}"`,
        `"${log.targetId || ''}"`,
        `"${log.ipAddress || ''}"`,
        `"${log.traceId || ''}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported ${filteredLogs.length} audit records to CSV.`);
    } catch (err) {
      console.error('CSV Export Error:', err);
      showToast('Failed to generate CSV export file.', 'error');
    }
  };

  // Copy JSON handler
  const handleCopyJSON = (data) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      showToast('Audit event payload copied to clipboard.');
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  // Format date-time helper
  const formatDateTime = (isoString) => {
    if (!isoString) return { date: '--/--/----', time: '--:--:--' };
    try {
      const d = new Date(isoString);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}:${seconds}`,
      };
    } catch {
      return { date: '--/--/----', time: '--:--:--' };
    }
  };

  // Action badge styling helper based on prefix
  const getActionBadgeClass = (action) => {
    if (action.startsWith('member')) return 'bg-[#EBF5FB] text-[#1B4F72] border-[#AED6F1]';
    if (action.startsWith('category')) return 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]';
    if (action.startsWith('moderation') || action.startsWith('post')) return 'bg-[#FFF8E6] text-[#8A6114] border-[#FCE3B4]';
    if (action.startsWith('auth') || action.startsWith('security')) return 'bg-[#FBEAE7] text-[#A63446] border-[#F4C2BC]';
    return 'bg-[#FAFBF9] text-[#4A4E44] border-[#DCE3D5]';
  };

  const isFiltered = Boolean(searchQuery || targetTypeFilter !== 'All' || timeFilter !== 'all');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Feedback */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              role="status"
              variants={shouldReduceMotion ? reducedToastVariants : toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border text-sm font-medium pointer-events-auto ${toast.type === 'error'
                  ? 'bg-[#FDF2F2] text-[#A63446] border-[#F4C2BC]'
                  : 'bg-[#2F5233] text-white border-[#25401F]'
                }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {toast.type === 'error' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                )}
              </svg>
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => {
                  if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
                  setToast({ show: false, message: '', type: 'success' });
                }}
                className={`ml-1.5 p-1 rounded-full transition-colors focus:outline-none focus-visible:ring-2 cursor-pointer ${toast.type === 'error'
                    ? 'hover:bg-[#FBEAE7] text-[#A63446] focus-visible:ring-[#A63446]'
                    : 'hover:bg-white/20 text-white focus-visible:ring-white'
                  }`}
                aria-label="Dismiss notification"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loadError && <div role="alert" className="rounded-xl border border-[#F4C2BC] bg-[#FDF2F2] p-4 text-sm text-[#A63446]">{loadError}</div>}

        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25] tracking-tight">
              Audit Logs
            </h1>
            <p className="text-sm text-[#6B6F63] mt-1">
              Important administrative changes to specific resources. Routine list and view events are excluded.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh audit feed"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full shadow-xs hover:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:transform-none disabled:active:scale-100 disabled:opacity-50 cursor-pointer transition-all"
            >
              <svg className={`w-3.5 h-3.5 text-[#6B6F63] ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-full shadow-xs hover:bg-[#d8e3d6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:transform-none cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 2. Top Summary KPI Cards (Derived from real audit fields) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Total Log Records</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25]">{stats.total}</span>
              <span className="text-[11px] text-[#6B6F63]">Recorded entries</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Active Admins</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2F5233]">{stats.uniqueAdmins}</span>
              <span className="text-[11px] text-[#6B6F63]">Operating accounts</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Target Resource Types</span>
              <div className="w-7 h-7 rounded-lg bg-[#EBF5FB] flex items-center justify-center text-[#1B4F72]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1B4F72]">{stats.uniqueTargetTypes}</span>
              <span className="text-[11px] text-[#6B6F63]">Distinct entities</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Client IP Addresses</span>
              <div className="w-7 h-7 rounded-lg bg-[#FAFBF9] flex items-center justify-center text-[#4A4E44]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25]">{stats.uniqueIps}</span>
              <span className="text-[11px] text-[#6B6F63]">Origin locations</span>
            </div>
          </div>
        </div>

        {/* 3. Toolbar & Filtering Controls */}
        <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by ID, action, target type, target ID, admin ID, IP..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl focus:bg-white focus:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] transition-all placeholder-[#8A9080] text-[#2B2A25]"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A9080] hover:text-[#2B2A25] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded-lg active:scale-95 motion-reduce:transform-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Target Type Filter */}
              <div className="relative">
                <select
                  value={targetTypeFilter}
                  onChange={(e) => {
                    setTargetTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] cursor-pointer"
                >
                  <option value="All">All Target Types</option>
                  {availableTargetTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Range Filter */}
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today (24h)</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pill Counter */}
          <div className="flex items-center justify-between text-xs text-[#6B6F63] pt-2 border-t border-[#EAF0E9]">
            <div>
              Total audit logs: <span className="font-bold text-[#2B2A25]">{logs.length}</span>
              {isFiltered && (
                <span className="ml-2 text-[#6B6F63]">
                  (Showing <span className="font-bold text-[#2B2A25]">{totalItems}</span> matching)
                </span>
              )}
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-[#2F5233] font-semibold underline hover:text-[#25401F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded px-1 active:scale-95 motion-reduce:transform-none cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* 4. Audit Log Table */}
        <div className="bg-white border border-[#DCE3D5] rounded-[24px] shadow-xs overflow-hidden">
          {/* Mobile Horizontal Scroll Cue */}
          <div className="md:hidden flex items-center justify-between px-4 py-2 text-[11px] text-[#6B6F63] bg-[#FAFBF9] border-b border-[#DCE3D5]">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swipe horizontally to view full audit trail
            </span>
            <span className="text-[10px] font-mono text-[#8A9080]">970px</span>
          </div>

          <div tabIndex={0} role="region" aria-label="Platform audit trail table" className="overflow-x-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]/40">
            <table className="w-full min-w-[970px] text-left text-xs border-separate border-spacing-0 table-fixed">
              <thead>
                <tr className="bg-[#FAFBF9] text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                  <th scope="col" className="py-3.5 px-4 font-semibold w-[140px] sm:sticky sm:left-0 bg-[#FAFBF9] z-20 sm:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] sm:border-r sm:border-[#DCE3D5]/80 border-b border-[#DCE3D5]">Timestamp</th>
                  <th scope="col" className="py-3.5 px-3 font-semibold w-[70px] border-b border-[#DCE3D5]">ID</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold w-[130px] border-b border-[#DCE3D5]">Admin</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold w-[150px] border-b border-[#DCE3D5]">Action</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold w-[140px] border-b border-[#DCE3D5]">Target Entity</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold w-[120px] border-b border-[#DCE3D5]">Client IP</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold w-[120px] border-b border-[#DCE3D5]">Trace ID</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-left w-[100px] md:sticky md:right-0 bg-[#FAFBF9] z-20 md:shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] md:border-l md:border-[#DCE3D5]/80 border-b border-[#DCE3D5]">Inspection</th>
                </tr>
              </thead>
              <tbody className="text-[#2B2A25]">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skel-audit-${idx}`} className="animate-pulse">
                      <td className="py-4 px-4 whitespace-nowrap sm:sticky sm:left-0 bg-white z-10 sm:border-r sm:border-[#DCE3D5]/80 border-b border-[#EAF0E9]">
                        <div className="h-4 bg-[#EAF0E9] rounded w-24 mb-1" />
                        <div className="h-3 bg-[#F4F6F1] rounded w-16" />
                      </td>
                      <td className="py-4 px-3 border-b border-[#EAF0E9]">
                        <div className="h-4 bg-[#EAF0E9] rounded w-12" />
                      </td>
                      <td className="py-4 px-4 border-b border-[#EAF0E9]">
                        <div className="h-6 bg-[#EAF0E9] rounded-full w-20" />
                      </td>
                      <td className="py-4 px-4 border-b border-[#EAF0E9]">
                        <div className="h-5 bg-[#EAF0E9] rounded w-28" />
                      </td>
                      <td className="py-4 px-4 border-b border-[#EAF0E9]">
                        <div className="h-4 bg-[#EAF0E9] rounded w-24" />
                      </td>
                      <td className="py-4 px-4 border-b border-[#EAF0E9]">
                        <div className="h-4 bg-[#EAF0E9] rounded w-24" />
                      </td>
                      <td className="py-4 px-4 border-b border-[#EAF0E9]">
                        <div className="h-4 bg-[#EAF0E9] rounded w-28" />
                      </td>
                      <td className="py-4 px-4 text-left md:sticky md:right-0 bg-white z-10 md:border-l md:border-[#DCE3D5]/80 border-b border-[#EAF0E9]">
                        <div className="h-7 bg-[#EAF0E9] rounded-lg w-16" />
                      </td>
                    </tr>
                  ))
                ) : paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => {
                    const formatted = formatDateTime(log.createdAt);
                    const badgeClass = getActionBadgeClass(log.action);

                    return (
                      <tr key={log.id} className="group hover:bg-[#F3F6EE]/60 transition-colors duration-150">
                        {/* Timestamp */}
                        <td className="py-4 px-4 whitespace-nowrap overflow-hidden border-b border-[#EAF0E9] sm:sticky sm:left-0 bg-white group-hover:bg-[#F7F9F5] z-10 sm:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] sm:border-r sm:border-[#DCE3D5]/80 transition-colors">
                          <p className="font-mono text-xs font-semibold text-[#2B2A25]">{formatted.date}</p>
                          <p className="font-mono text-[11px] text-[#6B6F63] mt-0.5">{formatted.time}</p>
                        </td>

                        {/* Event ID */}
                        <td className="py-4 px-3 whitespace-nowrap font-mono text-xs font-semibold text-[#2F5233] overflow-hidden truncate border-b border-[#EAF0E9]">
                          #{log.id}
                        </td>

                        {/* Admin ID */}
                        <td className="py-4 px-4 whitespace-nowrap overflow-hidden border-b border-[#EAF0E9]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAFBF9] text-[#2B2A25] border border-[#DCE3D5] max-w-full truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2F5233] shrink-0" />
                            <span className="truncate">Admin #{log.adminId}</span>
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 whitespace-nowrap overflow-hidden border-b border-[#EAF0E9]">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs font-semibold border max-w-full truncate ${badgeClass}`} title={log.action}>
                            <span className="truncate">{log.action}</span>
                          </span>
                        </td>

                        {/* Target Entity */}
                        <td className="py-4 px-4 whitespace-nowrap overflow-hidden border-b border-[#EAF0E9]">
                          <div className="flex items-center gap-1.5 min-w-0" title={`${log.targetType || ''} ${log.targetId ? `#${log.targetId}` : ''}`}>
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F4F6F1] text-[#6B6F63] border border-[#E0E5DC] truncate shrink-0">
                              {log.targetType}
                            </span>
                            {log.targetId && (
                              <span className="font-mono text-xs font-semibold text-[#2B2A25] truncate">
                                #{log.targetId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Client IP Address */}
                        <td className="py-4 px-4 whitespace-nowrap font-mono text-xs text-[#6B6F63] overflow-hidden truncate border-b border-[#EAF0E9]" title={log.ipAddress || ''}>
                          {log.ipAddress || '--'}
                        </td>

                        {/* Trace ID */}
                        <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-[#8A9080] overflow-hidden truncate border-b border-[#EAF0E9]" title={log.traceId || ''}>
                          {log.traceId ? (log.traceId.length > 14 ? `${log.traceId.slice(0, 14)}…` : log.traceId) : '--'}
                        </td>

                        {/* Inspection Actions */}
                        <td className="py-4 px-4 text-left whitespace-nowrap overflow-hidden border-b border-[#EAF0E9] md:sticky md:right-0 bg-white group-hover:bg-[#F7F9F5] z-10 md:shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] md:border-l md:border-[#DCE3D5]/80 transition-colors">
                          <button
                            type="button"
                            onClick={() => handleInspect(log)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] rounded-lg hover:bg-[#d8e3d6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.97] motion-reduce:transform-none transition-all cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center border-b border-[#EAF0E9]">
                      <div className="max-w-sm mx-auto text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#FAFBF9] border border-[#DCE3D5] flex items-center justify-center mx-auto text-[#8A9080]">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-semibold text-[#2B2A25]">No audit logs found</p>
                        <p className="text-xs text-[#6B6F63]">
                          No records match your active search or filter criteria. Try adjusting your parameters.
                        </p>
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="px-4 py-2 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] rounded-full hover:bg-[#d8e3d6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.97] motion-reduce:transform-none transition-all cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-[#DCE3D5] bg-[#FAFBF9] text-xs text-[#6B6F63]">
              <div>
                Showing <span className="font-bold text-[#2B2A25]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-bold text-[#2B2A25]">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
                <span className="font-bold text-[#2B2A25]">{totalItems}</span> events
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#DCE3D5] rounded-lg bg-white font-medium hover:bg-[#FAFBF9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.97] disabled:active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Previous
                </button>

                {getPaginationPages(currentPage, totalPages, 5).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.95] motion-reduce:transform-none cursor-pointer ${currentPage === pageNum
                        ? 'bg-[#2F5233] text-white shadow-xs'
                        : 'border border-[#DCE3D5] bg-white text-[#2B2A25] hover:bg-[#FAFBF9]'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-[#DCE3D5] rounded-lg bg-white font-medium hover:bg-[#FAFBF9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.97] disabled:active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Detailed Event Inspection Modal (Real GET /api/admin/audit-logs/{id} data) */}
        <ModalMotion
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          backdropClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          dialogClassName="bg-white rounded-[28px] border border-[#DCE3D5] shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          ariaLabelledBy="audit-modal-title"
        >
          {selectedEvent && (
            <>
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#DCE3D5] flex items-center justify-between bg-[#FAFBF9]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF0E9] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 id="audit-modal-title" className="text-base font-bold text-[#2B2A25]">
                      Audit Event Details
                    </h2>
                    <p className="text-xs font-mono text-[#6B6F63]">Log Record ID: #{selectedEvent.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#FAFBF9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body: Only real audited data */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {isModalLoading ? (
                  <div className="py-8 text-center text-[#6B6F63] space-y-2">
                    <div className="w-8 h-8 border-2 border-[#2F5233] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>Fetching full audit record from server...</p>
                  </div>
                ) : (
                  <>
                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                        <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider block">Admin Operator</span>
                        <p className="mt-1 font-bold text-xs text-[#2B2A25]">Admin #{selectedEvent.adminId}</p>
                      </div>

                      <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                        <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider block">Audited Action</span>
                        <p className="mt-1 font-mono font-bold text-xs text-[#2F5233]">{selectedEvent.action}</p>
                      </div>

                      <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                        <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider block">Target Resource</span>
                        <p className="mt-1 font-bold text-xs text-[#2B2A25]">
                          {selectedEvent.targetType} {selectedEvent.targetId ? `#${selectedEvent.targetId}` : ''}
                        </p>
                      </div>

                      <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                        <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider block">Client IP Address</span>
                        <p className="mt-1 font-mono font-bold text-xs text-[#2B2A25]">{selectedEvent.ipAddress || '--'}</p>
                      </div>

                      <div className="col-span-2 p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                        <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider block">Created At (Timestamp)</span>
                        <p className="mt-1 font-mono text-xs text-[#2B2A25]">
                          {selectedEvent.createdAt} ({formatDateTime(selectedEvent.createdAt).date} {formatDateTime(selectedEvent.createdAt).time})
                        </p>
                      </div>

                      <div className="col-span-2 p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                        <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider block">HTTP Trace Identifier</span>
                        <p className="mt-1 font-mono text-xs text-[#2B2A25] break-all">{selectedEvent.traceId || '--'}</p>
                      </div>
                    </div>

                    {/* Raw JSON Payload */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#6B6F63] uppercase tracking-wider">Raw Event Payload (API DTO)</span>
                        <button
                          type="button"
                          onClick={() => handleCopyJSON(selectedEvent)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#2F5233] bg-[#EAF0E9] rounded-md hover:bg-[#d8e3d6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-95 motion-reduce:transform-none transition-all cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy JSON</span>
                        </button>
                      </div>
                      <pre className="p-4 bg-[#1E293B] text-[#F1F5F9] rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                        {JSON.stringify(selectedEvent, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#DCE3D5] flex items-center justify-end bg-[#FAFBF9]">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full hover:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.97] motion-reduce:transform-none transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </ModalMotion>
      </div>
    </AdminLayout>
  );
}
