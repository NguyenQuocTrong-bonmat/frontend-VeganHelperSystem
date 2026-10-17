import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/imageUtils';

export default function AdminMemberManagement() {
  // Initial clean dataset representing platform members until live backend API connection
  const [members, setMembers] = useState([
    {
      id: 1,
      displayName: 'Mai Linh',
      username: 'mailinh_chef',
      email: 'mailinh.vegan@example.com',
      phone: '+84 912 345 678',
      role: 'Chef',
      status: 'Active',
      joinedDate: '15/05/2026',
      avatarUrl: null,
      bio: 'Plant-based chef passionate about traditional Vietnamese fermented dishes.',
      postsCount: 24,
      reportsCount: 0,
    },
    {
      id: 2,
      displayName: 'Hoàng Thu Thảo',
      username: 'thuthaoveg',
      email: 'thuthao.h@example.com',
      phone: '+84 983 221 445',
      role: 'Member',
      status: 'Active',
      joinedDate: '02/06/2026',
      avatarUrl: null,
      bio: 'Vegan food enthusiast and daily home cook sharing quick lunch recipes.',
      postsCount: 8,
      reportsCount: 0,
    },
    {
      id: 3,
      displayName: 'Chef Duy',
      username: 'chefduy_culinary',
      email: 'duy.culinary@botanical.vn',
      phone: '+84 905 889 123',
      role: 'Chef',
      status: 'Active',
      joinedDate: '20/04/2026',
      avatarUrl: null,
      bio: 'Executive plant-based culinary advisor at Botanical Hearth.',
      postsCount: 42,
      reportsCount: 0,
    },
    {
      id: 4,
      displayName: 'Phạm Văn Minh',
      username: 'minh_pv',
      email: 'minh.pv91@example.com',
      phone: '+84 977 114 990',
      role: 'Member',
      status: 'Banned',
      joinedDate: '11/01/2026',
      avatarUrl: null,
      bio: 'Account restricted due to community guidelines violation.',
      postsCount: 2,
      reportsCount: 5,
      banReason: 'Spamming external affiliate links and unverified dietary claims.',
      banDuration: 'Permanent',
    },
    {
      id: 5,
      displayName: 'Lê Ngọc Mai',
      username: 'ngocmai_green',
      email: 'ngocmai.nutrition@example.com',
      phone: '+84 934 556 778',
      role: 'Member',
      status: 'Active',
      joinedDate: '18/07/2026',
      avatarUrl: null,
      bio: 'Holistic wellness advocate studying plant nutrition & macronutrient balance.',
      postsCount: 15,
      reportsCount: 0,
    },
    {
      id: 6,
      displayName: 'Trần Hà',
      username: 'tran_ha_plant',
      email: 'tran.ha@example.org',
      phone: '+84 918 998 877',
      role: 'Member',
      status: 'Active',
      joinedDate: '29/08/2026',
      avatarUrl: null,
      bio: 'Community member exploring cruelty-free meal prep and vegan baking.',
      postsCount: 6,
      reportsCount: 0,
    },
    {
      id: 7,
      displayName: 'Nguyễn Quốc Trọng',
      username: 'admin_trong',
      email: 'admin.trong@veganhelper.vn',
      phone: '+84 901 000 999',
      role: 'Admin',
      status: 'Active',
      joinedDate: '01/01/2026',
      avatarUrl: null,
      bio: 'System Administrator & Content Operations Lead.',
      postsCount: 30,
      reportsCount: 0,
    },
  ]);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All | Active | Banned
  const [roleFilter, setRoleFilter] = useState('All'); // All | Member | Chef | Admin
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
          const matchName = m.displayName.toLowerCase().includes(q);
          const matchUser = m.username.toLowerCase().includes(q);
          const matchEmail = m.email.toLowerCase().includes(q);
          if (!matchName && !matchUser && !matchEmail) return false;
        }

        // Status filter
        if (statusFilter !== 'All' && m.status !== statusFilter) {
          return false;
        }

        // Role filter
        if (roleFilter !== 'All' && m.role !== roleFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.displayName.localeCompare(b.displayName);
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

  // Ban confirmation
  const handleConfirmBan = (e) => {
    e.preventDefault();
    if (!banModal.member) return;
    if (!banModal.reason.trim()) {
      showToast('Please specify a reason for banning this account.', 'error');
      return;
    }

    setMembers((prev) =>
      prev.map((m) =>
        m.id === banModal.member.id
          ? {
              ...m,
              status: 'Banned',
              banReason: banModal.reason,
              banDuration: banModal.duration,
            }
          : m
      )
    );

    showToast(`Account @${banModal.member.username} has been suspended.`, 'success');
    setBanModal({ isOpen: false, member: null, reason: '', duration: '30 Days' });
  };

  // Unban confirmation
  const handleConfirmUnban = (e) => {
    e.preventDefault();
    if (!unbanModal.member) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === unbanModal.member.id
          ? {
              ...m,
              status: 'Active',
              banReason: undefined,
              banDuration: undefined,
            }
          : m
      )
    );

    showToast(`Account @${unbanModal.member.username} has been restored to active status.`, 'success');
    setUnbanModal({ isOpen: false, member: null, notes: '' });
  };

  // Calculated Stats
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === 'Active').length;
    const banned = members.filter((m) => m.status === 'Banned').length;
    const chefs = members.filter((m) => m.role === 'Chef').length;
    return { total, active, banned, chefs };
  }, [members]);

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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25] tracking-tight">
                Member Management
              </h1>
              <span className="text-xs font-bold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2.5 py-0.5 rounded-full">
                FN38 & FN39
              </span>
            </div>
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

          {/* Card 4: Verified Chefs */}
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B6F63]">Verified Chefs</span>
              <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2B2A25]">{stats.chefs}</span>
              <span className="text-[11px] text-[#6B6F63]">Recipe creators</span>
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
                  <option value="Chef">Chefs</option>
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
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFBF9] text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                  <th className="py-3.5 px-4 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Contact & Email</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF0E9] text-[#2B2A25]">
                {paginatedMembers.length > 0 ? (
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
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
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
                            <div className="leading-tight">
                              <p className="font-semibold text-sm text-[#2B2A25]">{member.displayName}</p>
                              <p className="text-[11px] text-[#6B6F63] mt-0.5">@{member.username}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email & Contact */}
                        <td className="py-4 px-4 text-[#6B6F63]">
                          <div>
                            <p className="font-medium text-[#2B2A25]">{member.email}</p>
                            <p className="text-[11px] text-[#8A9080]">{member.phone}</p>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              member.role === 'Admin'
                                ? 'bg-[#F2EDF7] text-[#5B3E7A] border-[#DFD3EB]'
                                : member.role === 'Chef'
                                ? 'bg-[#FFF8E6] text-[#8A6114] border-[#FCE3B4]'
                                : 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
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
                        <td className="py-4 px-4 text-[#6B6F63] font-medium">{member.joinedDate}</td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Inspect Details Button */}
                            <button
                              onClick={() => setDetailModal({ isOpen: true, member })}
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
                                    : 'Suspend Member Account (FN39)'
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

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
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
                );
              })}

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
                    <p className="text-xs text-[#6B6F63]">FN39 — Account Restriction & Token Revoke</p>
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
                  <div>
                    <p className="font-semibold text-xs text-[#2B2A25]">{banModal.member.displayName}</p>
                    <p className="text-[11px] text-[#6B6F63]">@{banModal.member.username} • {banModal.member.email}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#A63446] bg-[#FBEAE7] px-2 py-0.5 rounded-full border border-[#F4C2BC]">
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
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">{detailModal.member.displayName}</h3>
                    <p className="text-xs text-[#6B6F63]">@{detailModal.member.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailModal({ isOpen: false, member: null })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#DCE3D5]">
                  <div>
                    <span className="text-[#8A9080] block text-[11px]">Email Address</span>
                    <span className="font-medium text-[#2B2A25] truncate block mt-0.5">{detailModal.member.email}</span>
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
                    <span className="text-[#8A9080] block text-[11px]">Published Recipes / Posts</span>
                    <span className="font-medium text-[#2B2A25] block mt-0.5">{detailModal.member.postsCount} posts</span>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <span className="font-semibold text-[#2B2A25] block mb-1">Personal Bio</span>
                  <p className="text-[#6B6F63] bg-[#FAFBF9] p-3 rounded-xl border border-[#DCE3D5] leading-relaxed">
                    {detailModal.member.bio || 'No profile biography provided.'}
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
                    to="/my-posts"
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
