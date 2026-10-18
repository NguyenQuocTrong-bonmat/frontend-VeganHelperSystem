import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/imageUtils';
import { getAdminMembers, getAdminMemberById, banMember, unbanMember } from '../../services/adminService';
import { getPaginationPages } from '../../utils/paginationUtils';

export default function AdminMemberManagement() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [memberSummary, setMemberSummary] = useState({
    totalMembers: 0,
    activeMembers: 0,
    bannedMembers: 0,
    administrators: 0,
  });

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All | Active | Banned
  const [roleFilter, setRoleFilter] = useState('All'); // All | Member | Admin
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | name
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [banModal, setBanModal] = useState({
    isOpen: false,
    member: null,
    reason: '',
    duration: '30 Days',
  });

  const [unbanModal, setUnbanModal] = useState({
    isOpen: false,
    member: null,
    notes: '',
  });

  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    member: null,
    isLoading: false,
  });

  // Notification Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Filter & Search Logic
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (m.displayName || '').toLowerCase().includes(q);
          const matchUser = (m.username || '').toLowerCase().includes(q);
          const matchEmail = (m.email || '').toLowerCase().includes(q);
          if (!matchName && !matchUser && !matchEmail) return false;
        }

        // Status filter
        if (statusFilter !== 'All') {
          if (statusFilter === 'Active' && m.status !== 'Active') return false;
          if (statusFilter === 'Banned' && m.status !== 'Banned') return false;
        }

        // Role filter
        if (roleFilter !== 'All' && m.role !== roleFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return (a.displayName || '').localeCompare(b.displayName || '');
        }
        if (sortBy === 'oldest') {
          return a.id - b.id;
        }
        // default: newest
        return b.id - a.id;
      });
  }, [members, searchQuery, statusFilter, roleFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Reset pagination when filter changes
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setRoleFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Backend data loading (GET /api/admin/members)
  const fetchMembers = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAdminMembers({
        pageIndex: 1,
        pageSize: 100,
      });

      const items = data.items || data;
      if (Array.isArray(items)) {
        setMembers(
          items.map((m) => {
            const isBanned = m.status === 'banned' || Boolean(m.banId);
            let statusLabel = 'Active';
            if (isBanned) statusLabel = 'Banned';
            else if (m.status === 'locked' || (m.lockedUntil && new Date(m.lockedUntil) > new Date())) statusLabel = 'Locked';
            else if (m.status === 'pending_verification' || !m.emailVerifiedAt) statusLabel = 'Pending';
            else if (m.status === 'inactive' || !m.isActive) statusLabel = 'Inactive';
            else if (m.status === 'deleted') statusLabel = 'Deleted';

            const roleLabel = (m.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Member';

            return {
              id: m.id,
              displayName: m.displayName || m.username || `Member #${m.id}`,
              username: m.username || `user_${m.id}`,
              email: m.email || 'N/A',
              role: roleLabel,
              status: statusLabel,
              rawStatus: m.status,
              isActive: m.isActive,
              emailVerifiedAt: m.emailVerifiedAt,
              createdAt: m.createdAt,
              joinedDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : '--',
              lastLoginAt: m.lastLoginAt,
              lastLoginFormatted: m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleString('en-GB') : 'Never',
              lockedUntil: m.lockedUntil,
              avatarUrl: m.avatarUrl || null,
              banId: m.banId,
              banReason: m.banReason || '',
              banExpiresAt: m.banExpiresAt,
              banDuration: m.banExpiresAt ? new Date(m.banExpiresAt).toLocaleDateString('en-GB') : m.banId ? 'Permanent' : '',
            };
          })
        );

        setMemberSummary({
          totalMembers: data.totalCount ?? items.length,
          activeMembers: items.filter(
            (m) => m.status?.toLowerCase() === 'active' || (m.status?.toLowerCase() !== 'banned' && m.status?.toLowerCase() !== 'deleted' && m.isActive)
          ).length,
          bannedMembers: items.filter((m) => m.status?.toLowerCase() === 'banned' || m.banId != null).length,
          administrators: items.filter((m) => (m.role || '').toLowerCase() === 'admin').length,
        });
      } else {
        setMembers([]);
        setMemberSummary({ totalMembers: 0, activeMembers: 0, bannedMembers: 0, administrators: 0 });
      }
    } catch (err) {
      setMembers([]);
      setLoadError(err.message || 'Members could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Inspect detail handler: Calls GET /api/admin/members/{id}
  const handleOpenDetails = async (member) => {
    setDetailModal({ isOpen: true, member, isLoading: true });
    try {
      const detail = await getAdminMemberById(member.id);
      if (detail) {
        setDetailModal({
          isOpen: true,
          member: {
            ...member,
            ...detail,
            displayName: detail.displayName || member.displayName,
            username: detail.username || member.username,
            email: detail.email || member.email,
            role: (detail.role || '').toLowerCase() === 'admin' ? 'Admin' : 'Member',
            status:
              detail.status === 'banned' || detail.banId
                ? 'Banned'
                : detail.status === 'locked' || (detail.lockedUntil && new Date(detail.lockedUntil) > new Date())
                ? 'Locked'
                : detail.status
                ? detail.status.charAt(0).toUpperCase() + detail.status.slice(1)
                : member.status,
            banReason: detail.banReason || member.banReason,
            banExpiresAt: detail.banExpiresAt || member.banExpiresAt,
            banDuration: detail.banExpiresAt
              ? new Date(detail.banExpiresAt).toLocaleDateString('en-GB')
              : detail.banId
              ? 'Permanent'
              : member.banDuration,
            lastLoginFormatted: detail.lastLoginAt
              ? new Date(detail.lastLoginAt).toLocaleString('en-GB')
              : member.lastLoginFormatted,
            emailVerifiedAt: detail.emailVerifiedAt ?? member.emailVerifiedAt,
            createdAt: detail.createdAt ?? member.createdAt,
            lockedUntil: detail.lockedUntil ?? member.lockedUntil,
          },
          isLoading: false,
        });
      } else {
        setDetailModal((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setDetailModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Ban confirmation (POST /api/admin/members/{id}/ban)
  const handleConfirmBan = async (e) => {
    e.preventDefault();
    if (!banModal.member) return;
    if (!banModal.reason.trim()) {
      showToast('Please specify a reason for banning this account.', 'error');
      return;
    }

    try {
      let expiresAt = null;
      if (banModal.duration === '7 Days') {
        expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      } else if (banModal.duration === '30 Days') {
        expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
      } else if (banModal.duration === '90 Days') {
        expiresAt = new Date(Date.now() + 90 * 86400000).toISOString();
      }

      await banMember(banModal.member.id, {
        reason: banModal.reason.trim(),
        expiresAt,
      });

      showToast(`Account @${banModal.member.username} has been suspended.`, 'success');
      await fetchMembers();
      setBanModal({ isOpen: false, member: null, reason: '', duration: '30 Days' });
    } catch (err) {
      showToast(err.message || 'The account could not be suspended.', 'error');
    }
  };

  // Unban confirmation (POST /api/admin/members/{id}/unban)
  const handleConfirmUnban = async (e) => {
    e.preventDefault();
    if (!unbanModal.member) return;

    try {
      await unbanMember(unbanModal.member.id, {
        reason: unbanModal.notes?.trim() || 'Unbanned by administrator',
      });
      showToast(`Account @${unbanModal.member.username} has been restored to active status.`, 'success');
      await fetchMembers();
      setUnbanModal({ isOpen: false, member: null, notes: '' });
    } catch (err) {
      showToast(err.message || 'The account could not be restored.', 'error');
    }
  };

  const stats = {
    total: memberSummary.totalMembers,
    active: memberSummary.activeMembers,
    banned: memberSummary.bannedMembers,
    admins: memberSummary.administrators,
  };

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
              Member Management
            </h1>
            <p className="text-sm text-[#6B6F63] mt-1">
              Search, filter, inspect profiles, and manage member account statuses across the platform.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-full shadow-xs hover:border-[#2F5233] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-[#F4C2BC] bg-[#FDF2F2] p-4 text-sm text-[#8B2B3A] sm:flex-row sm:items-center sm:justify-between">
            <span>{loadError}</span>
            <button type="button" onClick={fetchMembers} className="self-start rounded-full border border-[#A63446] px-4 py-2 text-xs font-semibold hover:bg-white sm:self-auto">
              Try again
            </button>
          </div>
        )}

        {/* 2. Top Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Members */}
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Total Members</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25]">{stats.total}</span>
              <span className="text-[11px] text-[#6B6F63]">Registered accounts</span>
            </div>
          </div>

          {/* Card 2: Active Accounts */}
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Active Accounts</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2F5233]">{stats.active}</span>
              <span className="text-[11px] text-[#4C8C4A] font-semibold">Good standing</span>
            </div>
          </div>

          {/* Card 3: Suspended / Banned */}
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Suspended / Banned</span>
              <div className="w-7 h-7 rounded-lg bg-[#FBEAE7] flex items-center justify-center text-[#A63446]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#A63446]">{stats.banned}</span>
              <span className="text-[11px] text-[#A63446] font-medium">Access revoked</span>
            </div>
          </div>

          {/* Card 4: Administrators */}
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Administrators</span>
              <div className="w-7 h-7 rounded-lg bg-[#F2EDF7] flex items-center justify-center text-[#5B3E7A]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25]">{stats.admins}</span>
              <span className="text-[11px] text-[#6B6F63]">System managers</span>
            </div>
          </div>
        </div>

        {/* 3. Search & Filtering Controls Toolbar */}
        <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 shadow-xs space-y-4">
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
                placeholder="Search by name, email, or @username..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl focus:bg-white focus:border-[#2F5233] focus:ring-1 focus:ring-[#2F5233] outline-none transition-all placeholder-[#8A9080] text-[#2B2A25]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleFilterChange(setSearchQuery, '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Pills & Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Status Segmented Buttons */}
              <div className="flex items-center bg-[#F4F6F1] p-1 rounded-xl border border-[#DCE3D5]">
                {['All', 'Active', 'Banned'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(setStatusFilter, status)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                        : 'text-[#6B6F63] hover:text-[#2B2A25]'
                    }`}
                  >
                    {status === 'All' ? 'All Status' : status}
                  </button>
                ))}
              </div>

              {/* Role Select Dropdown */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => handleFilterChange(setRoleFilter, e.target.value)}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Member">Members</option>
                  <option value="Admin">Admins</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="name">Sort: Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active filter counter notice */}
          <div className="flex items-center justify-between text-xs text-[#6B6F63] pt-2 border-t border-[#EAF0E9]">
            <div>
              Showing <span className="font-bold text-[#2B2A25]">{filteredMembers.length}</span> of{' '}
              <span className="font-bold text-[#2B2A25]">{members.length}</span> members
            </div>
            {(searchQuery || statusFilter !== 'All' || roleFilter !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#2F5233] font-semibold underline hover:text-[#25401F]"
              >
                Clear all active filters
              </button>
            )}
          </div>
        </div>

        {/* 4. Members Table Card */}
        <div className="bg-white border border-[#DCE3D5] rounded-[24px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse table-fixed">
              <thead>
                <tr className="bg-[#FAFBF9] text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                  <th className="py-3.5 px-4 font-semibold w-[calc(28%-20px)]">Member</th>
                  <th className="py-3.5 px-4 font-semibold w-[28%]">Contact & Email</th>
                  <th className="py-3.5 px-4 font-semibold w-[11%]">Role</th>
                  <th className="py-3.5 px-4 font-semibold w-[13%]">Status</th>
                  <th className="py-3.5 px-4 font-semibold w-[10%]">Joined Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right w-[calc(10%+20px)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF0E9] text-[#2B2A25]">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skel-member-${idx}`} className="animate-pulse">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#EAF0E9] shrink-0" />
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="w-28 h-3.5 bg-[#EAF0E9] rounded" />
                            <div className="w-20 h-2.5 bg-[#F3F6EE] rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-36 h-3 bg-[#EAF0E9] rounded mb-1" />
                        <div className="w-24 h-2.5 bg-[#F3F6EE] rounded" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-16 h-5 bg-[#EAF0E9] rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-16 h-5 bg-[#EAF0E9] rounded-full" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-20 h-3 bg-[#EAF0E9] rounded" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="w-14 h-6 bg-[#EAF0E9] rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : paginatedMembers.length > 0 ? (
                  paginatedMembers.map((member) => {
                    const initials = member.displayName
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase();

                    const isBanned = member.status === 'Banned';

                    return (
                      <tr key={member.id} className="hover:bg-[#FAFBF9] transition-colors">
                        {/* Member Identity Column */}
                        <td className="py-4 px-4 overflow-hidden">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full border border-[#DCE3D5] flex items-center justify-center font-bold text-xs bg-[#EAF0E9] text-[#2F5233] shrink-0 overflow-hidden">
                              {member.avatarUrl ? (
                                <img
                                  src={getImageUrl(member.avatarUrl)}
                                  alt={member.displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div className="leading-tight min-w-0 flex-1">
                              <p className="font-semibold text-sm text-[#2B2A25] truncate" title={member.displayName}>
                                {member.displayName}
                              </p>
                              <p className="text-[11px] text-[#6B6F63] mt-0.5 truncate" title={`@${member.username}`}>
                                @{member.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email & Contact */}
                        <td className="py-4 px-4 text-[#6B6F63] overflow-hidden">
                          <div className="min-w-0">
                            <p className="font-medium text-[#2B2A25] truncate" title={member.email}>
                              {member.email}
                            </p>
                            <p className="text-[11px] text-[#8A9080] truncate flex items-center gap-1 mt-0.5">
                              {member.emailVerifiedAt ? (
                                <span className="text-[#2F5233] font-medium flex items-center gap-0.5 truncate">
                                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Verified
                                </span>
                              ) : (
                                <span className="text-[#8A9080]">Unverified</span>
                              )}
                            </p>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4 whitespace-nowrap overflow-hidden">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              member.role === 'Admin'
                                ? 'bg-[#F2EDF7] text-[#5B3E7A] border-[#DFD3EB]'
                                : 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap overflow-hidden">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              isBanned
                                ? 'bg-[#FBEAE7] text-[#A63446] border-[#F4C2BC]'
                                : 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isBanned ? 'bg-[#A63446]' : 'bg-[#4C8C4A]'
                              }`}
                            />
                            {member.status}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-4 text-[#6B6F63] font-medium whitespace-nowrap overflow-hidden font-mono">
                          {member.joinedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap overflow-hidden">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Inspect Details Button */}
                            <button
                              onClick={() => handleOpenDetails(member)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-lg hover:bg-[#2F5233] hover:text-white transition-all"
                              title="Inspect Member Profile"
                            >
                              Details
                            </button>

                            {/* Ban or Unban Button */}
                            {isBanned ? (
                              <button
                                onClick={() => setUnbanModal({ isOpen: true, member, notes: '' })}
                                className="px-3 py-1.5 text-xs font-semibold text-[#2F5233] bg-white border border-[#DCE3D5] rounded-lg hover:border-[#2F5233] transition-all"
                                title="Restore User Account"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setBanModal({
                                    isOpen: true,
                                    member,
                                    reason: '',
                                    duration: '30 Days',
                                  })
                                }
                                disabled={member.role === 'Admin'}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                  member.role === 'Admin'
                                    ? 'opacity-40 cursor-not-allowed text-[#8A9080] border border-[#EAF0E9]'
                                    : 'text-[#A63446] bg-[#FBEAE7] border border-[#F4C2BC] hover:bg-[#A63446] hover:text-white'
                                }`}
                                title={
                                  member.role === 'Admin'
                                    ? 'Admin accounts cannot be banned'
                                    : 'Suspend Member Account'
                                }
                              >
                                Ban
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#6B6F63]">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 text-[#A8BDA2] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold text-sm text-[#2B2A25]">No members found</p>
                        <p className="text-xs text-[#8A9080] mt-0.5">Try searching with a different name or clear active filters.</p>
                        <button
                          onClick={handleClearFilters}
                          className="mt-3 px-4 py-1.5 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-full hover:bg-[#2F5233] hover:text-white transition-all"
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

          {/* Table Footer: Pagination */}
          <div className="px-6 py-4 border-t border-[#DCE3D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6F63]">
            <div>
              Showing{' '}
              <span className="font-semibold text-[#2B2A25]">
                {filteredMembers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-[#2B2A25]">
                {Math.min(currentPage * pageSize, filteredMembers.length)}
              </span>{' '}
              of <span className="font-semibold text-[#2B2A25]">{filteredMembers.length}</span> results
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-white text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {getPaginationPages(currentPage, totalPages, 5).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#2F5233] text-white shadow-xs'
                      : 'border border-[#DCE3D5] bg-white text-[#6B6F63] hover:border-[#2F5233] hover:text-[#2B2A25]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-white text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MODAL 1: BAN MEMBER (FN39: Ban with Reason & Duration)       */}
        {/* ============================================================ */}
        {banModal.isOpen && banModal.member && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-md w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FBEAE7] text-[#A63446] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">Suspend User Account</h3>
                    <p className="text-xs text-[#6B6F63]">Account Restriction & Token Revocation</p>
                  </div>
                </div>
                <button
                  onClick={() => setBanModal({ isOpen: false, member: null, reason: '', duration: '30 Days' })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleConfirmBan} className="mt-4 space-y-4">
                {/* Target User Summary */}
                <div className="bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl p-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-semibold text-xs text-[#2B2A25] truncate" title={banModal.member.displayName}>{banModal.member.displayName}</p>
                    <p className="text-[11px] text-[#6B6F63] truncate" title={`@${banModal.member.username} • ${banModal.member.email}`}>@{banModal.member.username} • {banModal.member.email}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#A63446] bg-[#FBEAE7] px-2 py-0.5 rounded-full border border-[#F4C2BC] shrink-0">
                    Target
                  </span>
                </div>

                {/* Duration select */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2A25] mb-1.5">
                    Ban Duration
                  </label>
                  <select
                    value={banModal.duration}
                    onChange={(e) => setBanModal((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233]"
                  >
                    <option value="7 Days">7 Days (Temporary Warning)</option>
                    <option value="30 Days">30 Days (Standard Moderation)</option>
                    <option value="90 Days">90 Days (Repeated Violations)</option>
                    <option value="Permanent">Permanent (Account Deactivated)</option>
                  </select>
                </div>

                {/* Reason input */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B2A25] mb-1.5">
                    Reason for Suspension <span className="text-[#A63446]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Specify why this account is being banned (e.g., Harassment, Unverified medical claims, commercial spam)..."
                    value={banModal.reason}
                    onChange={(e) => setBanModal((prev) => ({ ...prev, reason: e.target.value }))}
                    className="w-full p-3 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25] placeholder-[#8A9080]"
                  />
                </div>

                {/* Warning note */}
                <p className="text-[11px] text-[#8A9080] leading-relaxed">
                  Notice: Confirming will revoke all active JWT access and refresh tokens immediately. The member will not be able to log in until the ban expires or is manually lifted.
                </p>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBanModal({ isOpen: false, member: null, reason: '', duration: '30 Days' })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#A63446] rounded-xl shadow-xs hover:bg-[#8B2B3A] transition-colors"
                  >
                    Confirm & Revoke Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: UNBAN MEMBER                                        */}
        {/* ============================================================ */}
        {unbanModal.isOpen && unbanModal.member && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-md w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAF0E9] text-[#2F5233] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">Restore Account Access</h3>
                    <p className="text-xs text-[#6B6F63]">Re-enable account login and member features</p>
                  </div>
                </div>
                <button
                  onClick={() => setUnbanModal({ isOpen: false, member: null, notes: '' })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleConfirmUnban} className="mt-4 space-y-4">
                <div className="bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl p-3">
                  <p className="font-semibold text-xs text-[#2B2A25]">{unbanModal.member.displayName}</p>
                  <p className="text-[11px] text-[#6B6F63]">@{unbanModal.member.username} • {unbanModal.member.email}</p>
                  {unbanModal.member.banReason && (
                    <div className="mt-2 text-[11px] text-[#A63446] bg-[#FBEAE7] p-2 rounded-lg border border-[#F4C2BC]">
                      Previous Ban Reason: {unbanModal.member.banReason}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2A25] mb-1.5">
                    Admin Audit Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Appeal approved, probation completed..."
                    value={unbanModal.notes}
                    onChange={(e) => setUnbanModal((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setUnbanModal({ isOpen: false, member: null, notes: '' })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#2F5233] rounded-xl shadow-xs hover:bg-[#25401F] transition-colors"
                  >
                    Restore Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 3: MEMBER DETAIL OVERVIEW                              */}
        {/* ============================================================ */}
        {detailModal.isOpen && detailModal.member && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-lg w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-4 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#DCE3D5] flex items-center justify-center font-bold text-sm bg-[#EAF0E9] text-[#2F5233] shrink-0 overflow-hidden">
                    {detailModal.member.avatarUrl ? (
                      <img
                        src={getImageUrl(detailModal.member.avatarUrl)}
                        alt={detailModal.member.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {detailModal.member.displayName
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-[#2B2A25] truncate" title={detailModal.member.displayName}>{detailModal.member.displayName}</h3>
                    <p className="text-xs text-[#6B6F63] truncate" title={`@${detailModal.member.username}`}>@{detailModal.member.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailModal({ isOpen: false, member: null })}
                  className="text-[#8A9080] hover:text-[#2B2A25] shrink-0 ml-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#DCE3D5]">
                  <div className="min-w-0 overflow-hidden">
                    <span className="text-[#8A9080] block text-[11px]">Email Address</span>
                    <span className="font-medium text-[#2B2A25] truncate block mt-0.5" title={detailModal.member.email}>{detailModal.member.email}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Phone Number</span>
                    <span className="font-medium text-[#2B2A25] block mt-0.5">{detailModal.member.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Platform Role</span>
                    <span className="font-semibold text-[#2F5233] block mt-0.5">{detailModal.member.role}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Account Status</span>
                    <span
                      className={`font-semibold block mt-0.5 ${
                        detailModal.member.status === 'Banned' ? 'text-[#A63446]' : 'text-[#4C8C4A]'
                      }`}
                    >
                      {detailModal.member.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Registration Date</span>
                    <span className="font-medium text-[#2B2A25] block mt-0.5">{detailModal.member.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Posts</span>
                    <span className="font-medium text-[#2B2A25] block mt-0.5">{detailModal.member.postsCount} posts</span>
                  </div>
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Reports Received</span>
                    <span className="font-medium text-[#2B2A25] block mt-0.5">{detailModal.member.reportsCount} reports</span>
                  </div>
                </div>

                {/* Diet preference */}
                <div>
                  <span className="font-semibold text-[#2B2A25] block mb-1">Diet Preference</span>
                  <p className="text-[#6B6F63] bg-[#FAFBF9] p-3 rounded-xl border border-[#DCE3D5] leading-relaxed">
                    {detailModal.member.bio}
                  </p>
                </div>

                {/* Ban info if banned */}
                {detailModal.member.status === 'Banned' && (
                  <div className="bg-[#FBEAE7] border border-[#F4C2BC] rounded-xl p-3 text-[#A63446]">
                    <span className="font-bold block mb-0.5">Suspension Information:</span>
                    <p className="text-[11px] leading-relaxed">
                      Duration: {detailModal.member.banDuration || 'Permanent'}
                      <br />
                      Reason: {detailModal.member.banReason || 'Rule violation'}
                    </p>
                  </div>
                )}

                {/* Footer action */}
                <div className="flex items-center justify-between pt-3 border-t border-[#DCE3D5]">
                  <Link
                    to={`/users/${detailModal.member.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F5233] hover:underline"
                  >
                    <span>View Public Posts</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>

                  <button
                    onClick={() => setDetailModal({ isOpen: false, member: null })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
