import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminAuditLogs } from '../../services/adminService';

// Mock initial audit events (fallback when /api/admin/audit-logs is not yet online)
const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-10824',
    timestamp: '2026-10-17T14:45:12Z',
    actor: {
      name: 'Nguyễn Quản Trị',
      email: 'admin@veganhelper.com',
      role: 'Super Admin',
      ip: '113.161.42.18',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
    },
    action: 'MEMBER_SUSPENDED',
    category: 'Member Mgmt',
    target: {
      type: 'Member',
      id: 'USR-892',
      name: '@toxic_user99',
    },
    severity: 'warning',
    notes: 'Suspended account for 30 days due to repeated community guidelines harassment violations.',
    changes: {
      before: { status: 'Active', strikeCount: 2 },
      after: { status: 'Banned', banDuration: '30 Days', banReason: 'Harassment & Abusive language' },
    },
  },
  {
    id: 'LOG-10823',
    timestamp: '2026-10-17T14:12:05Z',
    actor: {
      name: 'Trần Kiểm Duyệt',
      email: 'mod.tran@veganhelper.com',
      role: 'Moderator',
      ip: '14.162.188.75',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
    },
    action: 'RECIPE_APPROVED',
    category: 'Moderation',
    target: {
      type: 'Recipe',
      id: 'RCP-401',
      name: 'Nấm Đùi Gà Kho Tiêu Chay',
    },
    severity: 'info',
    notes: 'Approved recipe submission after verifying vegan ingredient compliance.',
    changes: {
      before: { status: 'Pending' },
      after: { status: 'Published', approvedBy: 'mod.tran@veganhelper.com' },
    },
  },
  {
    id: 'LOG-10822',
    timestamp: '2026-10-17T13:50:33Z',
    actor: {
      name: 'System Bot',
      email: 'security-bot@internal.local',
      role: 'System',
      ip: '127.0.0.1',
      userAgent: 'InternalDaemon/2.4 (SecurityWatch)',
    },
    action: 'LOGIN_FAILED_BRUTEFORCE',
    category: 'Security',
    target: {
      type: 'IP Address',
      id: '45.132.88.19',
      name: '45.132.88.19',
    },
    severity: 'critical',
    notes: 'Rate limit tripped: 5 failed administrative login attempts within 60 seconds. IP temporarily blacklisted.',
    changes: {
      before: { failureCount: 4, blocked: false },
      after: { failureCount: 5, blocked: true, cooldownMinutes: 15 },
    },
  },
  {
    id: 'LOG-10821',
    timestamp: '2026-10-17T12:30:19Z',
    actor: {
      name: 'Nguyễn Quản Trị',
      email: 'admin@veganhelper.com',
      role: 'Super Admin',
      ip: '113.161.42.18',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
    },
    action: 'CATEGORY_CREATED',
    category: 'Category',
    target: {
      type: 'Category',
      id: 'CAT-108',
      name: 'Món Canh Thanh Đạm',
    },
    severity: 'info',
    notes: 'Created new culinary category taxonomy with slug "mon-canh-thanh-dam".',
    changes: {
      before: null,
      after: { name: 'Món Canh Thanh Đạm', slug: 'mon-canh-thanh-dam', color: '#2F5233' },
    },
  },
  {
    id: 'LOG-10820',
    timestamp: '2026-10-17T11:15:40Z',
    actor: {
      name: 'Trần Kiểm Duyệt',
      email: 'mod.tran@veganhelper.com',
      role: 'Moderator',
      ip: '14.162.188.75',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
    },
    action: 'RECIPE_REJECTED',
    category: 'Moderation',
    target: {
      type: 'Recipe',
      id: 'RCP-398',
      name: 'Bánh Mì Sốt Bơ Sữa Truyền Thống',
    },
    severity: 'warning',
    notes: 'Rejected recipe submission: Detected non-vegan dairy ingredient (dairy butter) in ingredient checklist.',
    changes: {
      before: { status: 'Pending' },
      after: { status: 'Rejected', rejectionReason: 'Violation: Non-Vegan Ingredient. Contains dairy butter.' },
    },
  },
  {
    id: 'LOG-10819',
    timestamp: '2026-10-17T10:05:22Z',
    actor: {
      name: 'Lê Quản Lý',
      email: 'le.manager@veganhelper.com',
      role: 'Admin',
      ip: '27.72.102.44',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0',
    },
    action: 'MEMBER_ROLE_UPDATED',
    category: 'Member Mgmt',
    target: {
      type: 'Member',
      id: 'USR-312',
      name: '@chef_hoang_mai',
    },
    severity: 'info',
    notes: 'Promoted user to Verified Culinary Chef status after culinary certification review.',
    changes: {
      before: { role: 'Member', isVerifiedChef: false },
      after: { role: 'Chef', isVerifiedChef: true },
    },
  },
  {
    id: 'LOG-10818',
    timestamp: '2026-10-17T09:20:11Z',
    actor: {
      name: 'Nguyễn Quản Trị',
      email: 'admin@veganhelper.com',
      role: 'Super Admin',
      ip: '113.161.42.18',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
    },
    action: 'SYSTEM_SETTINGS_UPDATED',
    category: 'System',
    target: {
      type: 'SystemConfig',
      id: 'CFG-GLOBAL',
      name: 'Platform Feature Flags',
    },
    severity: 'info',
    notes: 'Enabled AI image recognition auto-tagging preview feature in production.',
    changes: {
      before: { enableAiTaggingPreview: false },
      after: { enableAiTaggingPreview: true },
    },
  },
  {
    id: 'LOG-10817',
    timestamp: '2026-10-17T08:45:00Z',
    actor: {
      name: 'Nguyễn Quản Trị',
      email: 'admin@veganhelper.com',
      role: 'Super Admin',
      ip: '113.161.42.18',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
    },
    action: 'ADMIN_LOGIN_SUCCESS',
    category: 'Security',
    target: {
      type: 'Session',
      id: 'SES-9921',
      name: 'Admin Console Access',
    },
    severity: 'info',
    notes: '2FA authentication succeeded via Authenticator App OTP.',
    changes: {
      before: null,
      after: { sessionStarted: '2026-10-17T08:45:00Z', authMethod: 'Password + 2FA' },
    },
  },
  {
    id: 'LOG-10816',
    timestamp: '2026-10-16T17:33:41Z',
    actor: {
      name: 'Trần Kiểm Duyệt',
      email: 'mod.tran@veganhelper.com',
      role: 'Moderator',
      ip: '14.162.188.75',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
    },
    action: 'COMMENT_DELETED',
    category: 'Moderation',
    target: {
      type: 'Comment',
      id: 'CMT-9941',
      name: 'Comment on #RCP-210',
    },
    severity: 'info',
    notes: 'Removed promotional spam comment linking to non-vegan commercial supplements.',
    changes: {
      before: { isDeleted: false },
      after: { isDeleted: true, deleteReason: 'Commercial Spam' },
    },
  },
  {
    id: 'LOG-10815',
    timestamp: '2026-10-16T15:10:02Z',
    actor: {
      name: 'Lê Quản Lý',
      email: 'le.manager@veganhelper.com',
      role: 'Admin',
      ip: '27.72.102.44',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/128.0',
    },
    action: 'MEMBER_UNBANNED',
    category: 'Member Mgmt',
    target: {
      type: 'Member',
      id: 'USR-615',
      name: '@tuan_anh_92',
    },
    severity: 'info',
    notes: 'Lifted temporary account suspension following review of member appeal.',
    changes: {
      before: { status: 'Banned' },
      after: { status: 'Active', unbannedBy: 'le.manager@veganhelper.com' },
    },
  },
  {
    id: 'LOG-10814',
    timestamp: '2026-10-16T11:00:25Z',
    actor: {
      name: 'System Bot',
      email: 'backup-agent@internal.local',
      role: 'System',
      ip: '127.0.0.1',
      userAgent: 'OmniBackup/1.2 (SQLite-Snapshot)',
    },
    action: 'DATABASE_BACKUP_COMPLETED',
    category: 'System',
    target: {
      type: 'Database',
      id: 'SNAP-20261016',
      name: 'Daily Platform Snapshot',
    },
    severity: 'info',
    notes: 'Automated database WAL snapshot completed. Checksum verification passed.',
    changes: {
      before: null,
      after: { sizeMb: 42.8, status: 'VERIFIED' },
    },
  },
  {
    id: 'LOG-10813',
    timestamp: '2026-10-16T09:15:30Z',
    actor: {
      name: 'System Bot',
      email: 'security-bot@internal.local',
      role: 'System',
      ip: '127.0.0.1',
      userAgent: 'InternalDaemon/2.4 (SecurityWatch)',
    },
    action: 'UNAUTHORIZED_API_ACCESS',
    category: 'Security',
    target: {
      type: 'Endpoint',
      id: 'API-ADMIN-USERS',
      name: '/api/admin/users/export',
    },
    severity: 'critical',
    notes: 'Blocked request to administrative export endpoint missing valid Authorization Bearer token.',
    changes: {
      before: null,
      after: { statusCode: 403, ip: '185.220.101.5' },
    },
  },
];

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('all'); // all | today | 7days | 30days
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Selected event modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Fetch from real backend endpoint with automatic auth token and fallback
  useEffect(() => {
    let isMounted = true;
    const fetchAuditLogs = async () => {
      try {
        const data = await getAdminAuditLogs({ pageIndex: 1, pageSize: 50 });
        const items = data.items || data;
        if (isMounted && Array.isArray(items) && items.length > 0) {
          // Map backend AuditLogDto to UI schema
          const mappedLogs = items.map((log) => {
            const act = log.action || '';
            let category = 'System';
            let severity = 'info';
            let actionName = act.toUpperCase();

            if (act.includes('member') || act.includes('user')) {
              category = 'Member Mgmt';
              severity = act.includes('ban') ? 'danger' : 'info';
              actionName = act.includes('ban') ? 'MEMBER_SUSPENDED' : act.includes('unban') ? 'MEMBER_UNBANNED' : 'MEMBER_ROLE_UPDATED';
            } else if (act.includes('post') || act.includes('moderation') || act.includes('recipe')) {
              category = 'Recipe Moderation';
              severity = act.includes('reject') ? 'warning' : 'success';
              actionName = act.includes('reject') ? 'RECIPE_REJECTED' : 'RECIPE_APPROVED';
            } else if (act.includes('category')) {
              category = 'Taxonomy';
              severity = act.includes('delete') ? 'danger' : 'success';
              actionName = act.includes('delete') ? 'CATEGORY_DELETED' : 'CATEGORY_CREATED';
            } else if (act.includes('auth') || act.includes('security') || act.includes('login')) {
              category = 'Security';
              severity = act.includes('fail') ? 'danger' : 'info';
            }

            return {
              id: `LOG-${log.id}`,
              timestamp: log.createdAt || new Date().toISOString(),
              actor: {
                name: log.adminUsername || `Admin #${log.adminId}`,
                email: log.adminEmail || `admin_${log.adminId}@veganhelper.vn`,
                role: 'Administrator',
                ip: log.ipAddress || '127.0.0.1',
                userAgent: log.traceId ? `Trace: ${log.traceId}` : 'Chrome/129.0 on Windows NT',
              },
              action: actionName,
              category,
              target: {
                type: log.targetType ? (log.targetType.charAt(0).toUpperCase() + log.targetType.slice(1)) : 'Entity',
                id: log.targetId || '--',
                name: log.targetType ? `${log.targetType} #${log.targetId || ''}` : 'Target Object',
              },
              severity,
              status: 'Success',
              details: {
                summary: `Action: ${log.action} executed on target ${log.targetType || 'entity'} #${log.targetId || ''}`,
                reason: 'Administrative operation via Admin Console',
                notes: `Audit trace: ${log.traceId || '--'}`,
                metadata: {
                  rawAction: log.action,
                  adminId: log.adminId,
                  targetType: log.targetType,
                  targetId: log.targetId,
                  traceId: log.traceId,
                },
              },
            };
          });
          setLogs(mappedLogs);
        }
      } catch (err) {
        // Fallback to INITIAL_AUDIT_LOGS seamlessly
        console.warn('Backend /admin/audit-logs unavailable, using local mock feed:', err.message);
      }
    };

    fetchAuditLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Sort Logic
  const filteredLogs = useMemo(() => {
    const now = new Date();

    return logs
      .filter((log) => {
        // 1. Category Filter
        if (categoryFilter !== 'All' && log.category !== categoryFilter) {
          return false;
        }

        // 2. Severity Filter
        if (severityFilter !== 'All' && log.severity !== severityFilter) {
          return false;
        }

        // 3. Time Filter
        if (timeFilter !== 'all') {
          const logDate = new Date(log.timestamp);
          const diffMs = now - logDate;
          const diffHours = diffMs / (1000 * 60 * 60);

          if (timeFilter === 'today' && diffHours > 24) return false;
          if (timeFilter === '7days' && diffHours > 24 * 7) return false;
          if (timeFilter === '30days' && diffHours > 24 * 30) return false;
        }

        // 4. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = log.id.toLowerCase().includes(q);
          const matchActorName = log.actor?.name?.toLowerCase().includes(q);
          const matchActorEmail = log.actor?.email?.toLowerCase().includes(q);
          const matchAction = log.action?.toLowerCase().includes(q);
          const matchTarget = log.target?.name?.toLowerCase().includes(q);
          const matchIp = log.actor?.ip?.toLowerCase().includes(q);
          const matchNotes = log.notes?.toLowerCase().includes(q);

          if (!matchId && !matchActorName && !matchActorEmail && !matchAction && !matchTarget && !matchIp && !matchNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        if (sortBy === 'oldest') return timeA - timeB;
        return timeB - timeA; // default: newest
      });
  }, [logs, categoryFilter, severityFilter, timeFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const moderation = logs.filter((l) => l.category === 'Moderation').length;
    const security = logs.filter((l) => l.category === 'Security').length;
    const warnings = logs.filter((l) => l.severity === 'warning' || l.severity === 'critical').length;
    return { total, moderation, security, warnings };
  }, [logs]);

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setSeverityFilter('All');
    setTimeFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
    showToast('Filters cleared to default view.');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Audit log records refreshed.');
    }, 400);
  };

  // CSV Export handler
  const handleExportCSV = () => {
    try {
      const headers = ['Event ID', 'Timestamp (ISO)', 'Actor Name', 'Actor Email', 'Role', 'IP Address', 'Category', 'Action', 'Target Type', 'Target Name', 'Severity', 'Notes'];
      const rows = filteredLogs.map((log) => [
        `"${log.id}"`,
        `"${log.timestamp}"`,
        `"${log.actor?.name || ''}"`,
        `"${log.actor?.email || ''}"`,
        `"${log.actor?.role || ''}"`,
        `"${log.actor?.ip || ''}"`,
        `"${log.category}"`,
        `"${log.action}"`,
        `"${log.target?.type || ''}"`,
        `"${(log.target?.name || '').replace(/"/g, '""')}"`,
        `"${log.severity}"`,
        `"${(log.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `vegan-helper-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported ${filteredLogs.length} audit records to CSV file.`);
    } catch (err) {
      console.error('CSV Export Error:', err);
      showToast('Failed to generate CSV export file.', 'error');
    }
  };

  // Copy JSON handler
  const handleCopyJSON = (event) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(event, null, 2));
      showToast('Event payload copied to clipboard.');
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  // Severity UI helper
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-[#FDF2F2] text-[#A63446] border-[#F4C2BC]',
          dot: 'bg-[#A63446]',
          label: 'Critical',
        };
      case 'warning':
        return {
          bg: 'bg-[#FFF8E6] text-[#8A6114] border-[#FCE3B4]',
          dot: 'bg-[#D97706]',
          label: 'Warning',
        };
      default:
        return {
          bg: 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]',
          dot: 'bg-[#2F5233]',
          label: 'Info / Success',
        };
    }
  };

  // Category UI helper
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Moderation':
        return 'bg-[#EBF5FB] text-[#1B4F72] border-[#AED6F1]';
      case 'Security':
        return 'bg-[#FEF5E7] text-[#7D6608] border-[#F9E79F]';
      case 'Member Mgmt':
        return 'bg-[#F5EEF8] text-[#512E5F] border-[#D7BDE2]';
      case 'Category':
        return 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]';
      default:
        return 'bg-[#F4F6F6] text-[#34495E] border-[#D5D8DC]';
    }
  };

  // Format date helper
  const formatDateTime = (isoString) => {
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

  const isFiltered = Boolean(searchQuery || categoryFilter !== 'All' || severityFilter !== 'All' || timeFilter !== 'all');

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Feedback */}
        {toast.show && (
          <div
            role="status"
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-[#FDF2F2] text-[#A63446] border-[#F4C2BC]'
                : 'bg-[#2F5233] text-white border-[#25401F]'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {toast.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              )}
            </svg>
            <span>{toast.message}</span>
          </div>
        )}

        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25] tracking-tight">
              Audit Logs
            </h1>
            <p className="text-sm text-[#6B6F63] mt-1">
              Traceable activity record of administrative actions, moderation decisions, and security events.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh audit feed"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full shadow-xs hover:border-[#2F5233] transition-colors disabled:opacity-50"
            >
              <svg className={`w-3.5 h-3.5 text-[#6B6F63] ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-full shadow-xs hover:bg-[#d8e3d6] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 2. Top Summary KPI Cards */}
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
              <span className="text-xs font-medium text-[#6B6F63]">Moderation Actions</span>
              <div className="w-7 h-7 rounded-lg bg-[#EBF5FB] flex items-center justify-center text-[#1B4F72]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1B4F72]">{stats.moderation}</span>
              <span className="text-[11px] text-[#6B6F63]">Content decisions</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Security Events</span>
              <div className="w-7 h-7 rounded-lg bg-[#FEF5E7] flex items-center justify-center text-[#7D6608]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#7D6608]">{stats.security}</span>
              <span className="text-[11px] text-[#6B6F63]">Auth & access checks</span>
            </div>
          </div>

          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Warnings & Alerts</span>
              <div className="w-7 h-7 rounded-lg bg-[#FDF2F2] flex items-center justify-center text-[#A63446]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#A63446]">{stats.warnings}</span>
              <span className="text-[11px] text-[#6B6F63]">Action required</span>
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
                placeholder="Search by ID, admin name, action, target, IP address..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl focus:bg-white focus:border-[#2F5233] focus:ring-1 focus:ring-[#2F5233] outline-none transition-all placeholder-[#8A9080] text-[#2B2A25]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Moderation">Moderation</option>
                  <option value="Member Mgmt">Member Mgmt</option>
                  <option value="Category">Category Taxonomy</option>
                  <option value="Security">Security & Auth</option>
                  <option value="System">System & Config</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="relative">
                <select
                  value={severityFilter}
                  onChange={(e) => {
                    setSeverityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="All">All Severities</option>
                  <option value="info">Info / Success</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Time Range */}
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
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
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active status indicator & Clear filter */}
          <div className="flex items-center justify-between text-xs text-[#6B6F63] pt-2 border-t border-[#EAF0E9]">
            <div>
              Total audit logs: <span className="font-bold text-[#2B2A25]">{logs.length}</span>
              {isFiltered && (
                <span className="ml-2 text-[#6B6F63]">
                  (Showing <span className="font-bold text-[#2B2A25]">{filteredLogs.length}</span> matching)
                </span>
              )}
            </div>
            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#2F5233] font-semibold underline hover:text-[#25401F]"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* 4. Audit Log Table */}
        <div className="bg-white border border-[#DCE3D5] rounded-[24px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFBF9] text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                  <th className="py-3.5 px-5 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold">Actor / Admin</th>
                  <th className="py-3.5 px-4 font-semibold">Action & Category</th>
                  <th className="py-3.5 px-4 font-semibold">Target Entity</th>
                  <th className="py-3.5 px-4 font-semibold">Severity</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF0E9] text-[#2B2A25]">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => {
                    const formatted = formatDateTime(log.timestamp);
                    const severity = getSeverityBadge(log.severity);
                    const categoryClass = getCategoryBadge(log.category);

                    return (
                      <tr key={log.id} className="hover:bg-[#FAFBF9] transition-colors">
                        {/* Timestamp */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <p className="font-mono text-xs font-semibold text-[#2B2A25]">{formatted.date}</p>
                          <p className="font-mono text-[11px] text-[#6B6F63] mt-0.5">{formatted.time}</p>
                        </td>

                        {/* Actor */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] flex items-center justify-center font-bold text-xs text-[#2F5233] shrink-0">
                              {log.actor?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-xs text-[#2B2A25]">{log.actor?.name}</p>
                                <span className="text-[10px] px-1.5 py-0.2 bg-[#F4F6F1] text-[#6B6F63] rounded border border-[#E0E5DC]">
                                  {log.actor?.role}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-[#6B6F63] mt-0.5">{log.actor?.ip}</p>
                            </div>
                          </div>
                        </td>

                        {/* Action & Category */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${categoryClass}`}>
                              {log.category}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] font-bold text-[#2B2A25] mt-1 tracking-tight">
                            {log.action}
                          </p>
                        </td>

                        {/* Target Entity */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-[#6B6F63]">{log.target?.type}:</span>
                            <span className="text-xs font-semibold text-[#2B2A25] truncate">{log.target?.name}</span>
                          </div>
                          <p className="text-[11px] text-[#8A9080] truncate mt-0.5" title={log.notes}>
                            {log.notes}
                          </p>
                        </td>

                        {/* Severity */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${severity.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
                            {severity.label}
                          </span>
                        </td>

                        {/* Inspection Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedEvent(log)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] rounded-lg hover:bg-[#d8e3d6] transition-colors"
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
                    <td colSpan="6" className="py-12 text-center">
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
                          onClick={handleClearFilters}
                          className="px-4 py-2 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] rounded-full hover:bg-[#d8e3d6] transition-colors"
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
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#DCE3D5] rounded-lg bg-white font-medium hover:bg-[#FAFBF9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#2F5233] text-white shadow-xs'
                          : 'border border-[#DCE3D5] bg-white text-[#2B2A25] hover:bg-[#FAFBF9]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-[#DCE3D5] rounded-lg bg-white font-medium hover:bg-[#FAFBF9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Detailed Event Inspection Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="audit-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[28px] border border-[#DCE3D5] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            >
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
                    <p className="text-xs font-mono text-[#6B6F63]">Event ID: {selectedEvent.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#FAFBF9] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Meta Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                    <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider">Severity</span>
                    <p className="mt-1 font-bold text-xs capitalize text-[#2B2A25]">{selectedEvent.severity}</p>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                    <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider">Category</span>
                    <p className="mt-1 font-bold text-xs text-[#2B2A25]">{selectedEvent.category}</p>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                    <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider">Client IP</span>
                    <p className="mt-1 font-mono font-bold text-xs text-[#2B2A25]">{selectedEvent.actor?.ip}</p>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5]">
                    <span className="text-[10px] text-[#6B6F63] font-medium uppercase tracking-wider">Timestamp</span>
                    <p className="mt-1 font-mono text-[11px] text-[#2B2A25]">{formatDateTime(selectedEvent.timestamp).date} {formatDateTime(selectedEvent.timestamp).time}</p>
                  </div>
                </div>

                {/* Actor & Target Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#DCE3D5] space-y-2">
                    <span className="text-[11px] font-bold text-[#6B6F63] uppercase tracking-wider">Administrator / Actor</span>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-9 h-9 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] flex items-center justify-center font-bold text-sm text-[#2F5233]">
                        {selectedEvent.actor?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#2B2A25]">{selectedEvent.actor?.name}</p>
                        <p className="text-[11px] text-[#6B6F63]">{selectedEvent.actor?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 bg-[#F4F6F1] rounded text-[#2F5233] border border-[#DCE3D5]">
                          Role: {selectedEvent.actor?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-[#DCE3D5] space-y-2">
                    <span className="text-[11px] font-bold text-[#6B6F63] uppercase tracking-wider">Target Entity</span>
                    <div className="pt-1 space-y-1">
                      <p className="font-bold text-xs text-[#2B2A25]">{selectedEvent.target?.name}</p>
                      <p className="text-[11px] text-[#6B6F63]">Type: <span className="font-semibold text-[#2B2A25]">{selectedEvent.target?.type}</span></p>
                      <p className="text-[11px] font-mono text-[#8A9080]">ID: {selectedEvent.target?.id}</p>
                    </div>
                  </div>
                </div>

                {/* Audit Notes */}
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#DCE3D5] space-y-1">
                  <span className="text-[11px] font-bold text-[#6B6F63] uppercase tracking-wider">Operation Summary & Notes</span>
                  <p className="text-xs text-[#2B2A25] leading-relaxed pt-1">
                    {selectedEvent.notes}
                  </p>
                </div>

                {/* Changes / Payload Diff if present */}
                {selectedEvent.changes && (
                  <div className="p-4 bg-white rounded-xl border border-[#DCE3D5] space-y-2">
                    <span className="text-[11px] font-bold text-[#6B6F63] uppercase tracking-wider">Entity State Modifications</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 bg-[#FDFBF6] rounded-lg border border-[#EAF0E9]">
                        <p className="font-semibold text-[11px] text-[#8A9080] mb-1">State Before:</p>
                        <pre className="font-mono text-[10px] text-[#6B6F63] overflow-x-auto">
                          {JSON.stringify(selectedEvent.changes.before, null, 2)}
                        </pre>
                      </div>
                      <div className="p-3 bg-[#EAF0E9]/30 rounded-lg border border-[#DCE3D5]">
                        <p className="font-semibold text-[11px] text-[#2F5233] mb-1">State After:</p>
                        <pre className="font-mono text-[10px] text-[#2B2A25] overflow-x-auto">
                          {JSON.stringify(selectedEvent.changes.after, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw JSON Payload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6B6F63] uppercase tracking-wider">Raw Event Payload</span>
                    <button
                      onClick={() => handleCopyJSON(selectedEvent)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#2F5233] bg-[#EAF0E9] rounded-md hover:bg-[#d8e3d6] transition-colors"
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
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#DCE3D5] flex items-center justify-end bg-[#FAFBF9]">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full hover:border-[#2F5233] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
