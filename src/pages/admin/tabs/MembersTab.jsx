import React, { useState } from 'react';

export default function MembersTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Dialog state
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  
  // These would be populated by the selected member in the future
  const selectedMember = null;
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('');
  const [unbanReason, setUnbanReason] = useState('');

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#2B2A25]">Member Management</h2>
        <p className="text-[#6B6F63] text-sm mt-1">
          Search and manage member accounts, view their status, and manage access permissions.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#F9FBF8] p-4 rounded-lg border border-[#E5EBE1]">
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-[#8E9387]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 w-full border border-[#DCE3D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-transparent text-sm text-[#2B2A25]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="py-2 pl-3 pr-8 border border-[#DCE3D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-transparent text-sm text-[#2B2A25] bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Banned">Banned</option>
          </select>

          {(searchTerm || statusFilter !== 'All') && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#6B6F63] hover:text-[#2F5233] font-medium transition-colors whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#DCE3D5]">
        <table className="min-w-full divide-y divide-[#DCE3D5]">
          <thead className="bg-[#F5F8F2]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Member
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Account Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Joined Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DCE3D5]">
            {/* Empty Integration Placeholder */}
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-[#6B6F63]">
                  <svg className="w-12 h-12 text-[#A6AFA0] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-base font-medium text-[#2B2A25]">No member data</p>
                  <p className="text-sm mt-1">Member data will appear when API integration is enabled.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ban Dialog (UI Only) */}
      {isBanDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#2B2A25] mb-2">Ban Member</h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to ban this member? They will lose access to the platform for the specified duration.
            </p>
            
            {selectedMember ? (
              <div className="bg-[#F9FBF8] border border-[#E5EBE1] rounded-md p-3 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DCE3D5] flex items-center justify-center text-[#6B6F63] font-bold">
                  {selectedMember.name ? selectedMember.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2B2A25]">{selectedMember.name}</p>
                  <p className="text-xs text-[#6B6F63]">{selectedMember.email}</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F9FBF8] border border-[#E5EBE1] rounded-md p-3 mb-4 flex items-center justify-center">
                <p className="text-sm text-[#6B6F63]">No member selected</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2B2A25] mb-1">Reason <span className="text-red-500">*</span></label>
                <textarea 
                  rows="3"
                  className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
                  placeholder="Explain why this user is being banned..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2B2A25] mb-1">Duration (Days) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
                  placeholder="e.g., 7"
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsBanDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#6B6F63] bg-white border border-[#DCE3D5] rounded-md hover:bg-[#F5F8F2] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('API integration pending — no account changes were made.');
                  setIsBanDialogOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!banReason || !banDuration || !selectedMember}
              >
                Ban Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unban Dialog (UI Only) */}
      {isUnbanDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#2B2A25] mb-2">Unban Member</h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to unban this member? Their access to the platform will be restored immediately.
            </p>
            
            {selectedMember ? (
              <div className="bg-[#F9FBF8] border border-[#E5EBE1] rounded-md p-3 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DCE3D5] flex items-center justify-center text-[#6B6F63] font-bold">
                  {selectedMember.name ? selectedMember.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2B2A25]">{selectedMember.name}</p>
                  <p className="text-xs text-[#6B6F63]">{selectedMember.email}</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F9FBF8] border border-[#E5EBE1] rounded-md p-3 mb-4 flex items-center justify-center">
                <p className="text-sm text-[#6B6F63]">No member selected</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2B2A25] mb-1">Reason <span className="text-red-500">*</span></label>
                <textarea 
                  rows="3"
                  className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
                  placeholder="Explain why the ban is being lifted..."
                  value={unbanReason}
                  onChange={(e) => setUnbanReason(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsUnbanDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#6B6F63] bg-white border border-[#DCE3D5] rounded-md hover:bg-[#F5F8F2] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('API integration pending — no account changes were made.');
                  setIsUnbanDialogOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#2F5233] rounded-md hover:bg-[#244026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!unbanReason || !selectedMember}
              >
                Unban Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
