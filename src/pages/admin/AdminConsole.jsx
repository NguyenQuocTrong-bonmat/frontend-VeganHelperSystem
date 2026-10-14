import React, { useState } from 'react';
import MembersTab from './tabs/MembersTab';
import CategoriesTab from './tabs/CategoriesTab';

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="min-h-screen bg-[#FDFBF6] py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-[#2B2A25]">Admin Console</h1>
          <p className="text-[#6B6F63] mt-2">Manage members, categories and content moderation.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#DCE3D5] overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-inset ${
              activeTab === 'members'
                ? 'border-[#2F5233] text-[#2F5233]'
                : 'border-transparent text-[#6B6F63] hover:text-[#2F5233] hover:border-[#DCE3D5]'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-inset ${
              activeTab === 'categories'
                ? 'border-[#2F5233] text-[#2F5233]'
                : 'border-transparent text-[#6B6F63] hover:text-[#2F5233] hover:border-[#DCE3D5]'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-inset ${
              activeTab === 'content'
                ? 'border-[#2F5233] text-[#2F5233]'
                : 'border-transparent text-[#6B6F63] hover:text-[#2F5233] hover:border-[#DCE3D5]'
            }`}
          >
            Content Moderation
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="bg-white border border-[#DCE3D5] rounded-xl p-6 md:p-8 shadow-sm">
          {activeTab === 'members' && (
            <MembersTab />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab />
          )}

          {activeTab === 'content' && (
            <div className="text-center py-10">
              <h2 className="text-lg font-semibold text-[#2B2A25] mb-2">Content Moderation</h2>
              <p className="text-[#6B6F63] text-sm">Integration pending for Content Moderation (FN41).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
