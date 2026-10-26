import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MembersTab from './tabs/MembersTab';
import CategoriesTab from './tabs/CategoriesTab';

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState('members');
  const shouldReduceMotion = useReducedMotion();

  const tabs = [
    { id: 'members', label: 'Members' },
    { id: 'categories', label: 'Categories' },
    { id: 'content', label: 'Content Moderation' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF6] py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-[#2B2A25]">Admin Console</h1>
          <p className="text-[#6B6F63] mt-2">Manage members, categories and content moderation.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#DCE3D5] overflow-x-auto pb-px" role="tablist" aria-label="Admin Console tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-inset cursor-pointer ${
                  isActive
                    ? 'text-[#2F5233]'
                    : 'text-[#6B6F63] hover:text-[#2F5233]'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="admin-console-active-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F5233]"
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
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
