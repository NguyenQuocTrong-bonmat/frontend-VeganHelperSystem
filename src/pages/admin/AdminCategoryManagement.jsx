import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../services/adminService';
import { getPaginationPages } from '../../utils/paginationUtils';

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Attempt loading backend categories if endpoint is responsive
  const loadCategories = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAdminCategories({ pageIndex: 1, pageSize: 100 });
      const items = data.items || data;
      if (Array.isArray(items)) {
        setCategories(
          items.map((cat, idx) => ({
            id: cat.id || idx + 1,
            name: cat.name,
            slug: cat.slug ? (cat.slug.startsWith('/') ? cat.slug : `/${cat.slug}`) : `/recipes/${(cat.name || 'category').toLowerCase().replace(/\s+/g, '-')}`,
            rawSlug: cat.slug || '',
            type: cat.postCategoryKind === 'food' ? 'Food Type' : 'Recipe Type',
            postCategoryKind: cat.postCategoryKind || (cat.type === 'Food Type' ? 'food' : 'recipe'),
            postsCount: cat.postCount ?? cat.postsCount ?? 0,
          }))
        );
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategories([]);
      setLoadError(err.message || 'Categories could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('posts-desc'); // posts-desc | name-asc | newest
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal states
  const [formModal, setFormModal] = useState({
    isOpen: false,
    isEditing: false,
    category: null,
    name: '',
    slug: '',
    type: 'Recipe Type',
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null,
  });

  // Toast feedback state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = cat.name.toLowerCase().includes(q);
          const matchSlug = cat.slug.toLowerCase().includes(q);
          if (!matchName && !matchSlug) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'posts-desc') return b.postsCount - a.postsCount;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'newest') return b.id - a.id;
        return 0;
      });
  }, [categories, searchQuery, sortBy]);

  // Pagination calculation
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);


  // Handlers for Add/Edit Form
  const handleOpenAddModal = () => {
    setFormModal({
      isOpen: true,
      isEditing: false,
      category: null,
      name: '',
      slug: '',
      type: 'Recipe Type',
    });
  };

  const handleOpenEditModal = (cat) => {
    setFormModal({
      isOpen: true,
      isEditing: true,
      category: cat,
      name: cat.name,
      slug: cat.slug,
      type: cat.type || (cat.postCategoryKind === 'food' ? 'Food Type' : 'Recipe Type'),
    });
  };

  const handleNameChange = (newName) => {
    // Auto-generate slug if creating new
    if (!formModal.isEditing) {
      const generatedSlug = `/recipes/${newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;
      setFormModal((prev) => ({
        ...prev,
        name: newName,
        slug: generatedSlug,
      }));
    } else {
      setFormModal((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formModal.name.trim()) {
      showToast('Please enter a valid category name.', 'error');
      return;
    }

    const cleanSlug = (formModal.slug.trim().replace(/^\/+/, '').replace(/^recipes\//, '') || formModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
    const kind = formModal.type === 'Food Type' ? 'food' : 'recipe';

    if (formModal.isEditing && formModal.category) {
      // Update existing
      try {
        await updateAdminCategory(formModal.category.id, {
          name: formModal.name.trim(),
          slug: cleanSlug,
          postCategoryKind: kind,
        });
        showToast(`Category "${formModal.name}" has been updated on backend.`, 'success');
        await loadCategories();
      } catch (err) {
        showToast(err.message || 'The category could not be updated.', 'error');
        return;
      }
    } else {
      // Create new
      try {
        await createAdminCategory({
          name: formModal.name.trim(),
          slug: cleanSlug,
          postCategoryKind: kind,
        });
        showToast(`New category "${formModal.name}" created on backend.`, 'success');
        await loadCategories();
      } catch (err) {
        showToast(err.message || 'The category could not be created.', 'error');
        return;
      }
    }

    setFormModal({
      isOpen: false,
      isEditing: false,
      category: null,
      name: '',
      slug: '',
      type: 'Recipe Type',
    });
  };

  // Delete Category handler (FN40: Prevent deletion if postsCount > 0)
  const handleOpenDeleteModal = (cat) => {
    if (cat.postsCount > 0) {
      showToast(
        `Cannot delete "${cat.name}" because ${cat.postsCount} posts are linked to it. Reassign posts first.`,
        'error'
      );
      return;
    }
    setDeleteModal({ isOpen: true, category: cat });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.category) return;
    try {
      await deleteAdminCategory(deleteModal.category.id);
      showToast(`Category "${deleteModal.category.name}" has been deleted from backend.`, 'success');
      await loadCategories();
    } catch (err) {
      showToast(err.message || 'The category could not be deleted.', 'error');
      return;
    }
    setDeleteModal({ isOpen: false, category: null });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('posts-desc');
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Notification */}
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
              Category Management
            </h1>
            <p className="text-sm text-[#6B6F63] mt-1">
              Configure and organize recipe types, food types, and community categories.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F5233] rounded-full shadow-xs hover:bg-[#25401F] active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-[#F4C2BC] bg-[#FDF2F2] p-4 text-sm text-[#8B2B3A] sm:flex-row sm:items-center sm:justify-between">
            <span>{loadError}</span>
            <button type="button" onClick={loadCategories} className="self-start rounded-full border border-[#A63446] px-4 py-2 text-xs font-semibold hover:bg-white sm:self-auto">
              Try again
            </button>
          </div>
        )}

        {/* 3. Toolbar & Controls */}
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
                placeholder="Search categories by name or slug..."
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-medium text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl shadow-xs outline-none focus:border-[#2F5233] cursor-pointer"
                >
                  <option value="posts-desc">Sort: Highest Posts</option>
                  <option value="name-asc">Sort: Name (A-Z)</option>
                  <option value="newest">Sort: Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active search status */}
          <div className="flex items-center justify-between text-xs text-[#6B6F63] pt-2 border-t border-[#EAF0E9]">
            <div>
              Total categories:{' '}
              <span className="font-bold text-[#2B2A25]">{categories.length}</span>
              {Boolean(searchQuery) && (
                <span className="ml-2 text-[#6B6F63]">
                  (Showing <span className="font-bold text-[#2B2A25]">{filteredCategories.length}</span> matching)
                </span>
              )}
            </div>
            {Boolean(searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#2F5233] font-semibold underline hover:text-[#25401F]"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* 4. Categories Table */}
        <div className="bg-white border border-[#DCE3D5] rounded-[24px] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse table-fixed">
              <thead>
                <tr className="bg-[#FAFBF9] text-[#6B6F63] font-medium border-b border-[#DCE3D5]">
                  <th className="py-3.5 px-5 font-semibold w-[45%]">Category</th>
                  <th className="py-3.5 px-4 font-semibold w-[20%]">Type</th>
                  <th className="py-3.5 px-4 font-semibold text-left w-[20%]">Associated Recipes</th>
                  <th className="py-3.5 px-5 font-semibold text-left w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF0E9] text-[#2B2A25]">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`skel-cat-${idx}`} className="animate-pulse">
                      <td className="py-4 px-5">
                        <div className="space-y-1.5">
                          <div className="w-36 h-3.5 bg-[#EAF0E9] rounded" />
                          <div className="w-24 h-2.5 bg-[#F3F6EE] rounded" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-20 h-5 bg-[#EAF0E9] rounded-full" />
                      </td>
                      <td className="py-4 px-4 text-left">
                        <div className="w-16 h-5 bg-[#EAF0E9] rounded-full" />
                      </td>
                      <td className="py-4 px-5 text-left">
                        <div className="w-16 h-6 bg-[#EAF0E9] rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat) => {
                    const hasLinkedPosts = cat.postsCount > 0;

                    return (
                      <tr key={cat.id} className="hover:bg-[#FAFBF9] transition-colors">
                        {/* Name & Slug */}
                        <td className="py-4 px-5 overflow-hidden">
                          <p className="font-semibold text-sm text-[#2B2A25] truncate" title={cat.name}>{cat.name}</p>
                          <p className="text-[11px] text-[#6B6F63] font-mono mt-0.5 truncate" title={cat.slug}>{cat.slug}</p>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-4 overflow-hidden">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border max-w-full truncate ${
                              cat.type === 'Food Type'
                                ? 'bg-[#FFF8E6] text-[#8A6114] border-[#FCE3B4]'
                                : 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                            }`}
                            title={cat.type}
                          >
                            <span className="truncate">{cat.type}</span>
                          </span>
                        </td>

                        {/* Linked Posts count */}
                        <td className="py-4 px-4 text-left whitespace-nowrap overflow-hidden">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                              hasLinkedPosts
                                ? 'bg-[#EAF0E9] text-[#2F5233] border-[#DCE3D5]'
                                : 'bg-[#FAFBF9] text-[#8A9080] border-[#EAF0E9]'
                            }`}
                          >
                            {cat.postsCount} posts
                          </span>
                        </td>

                        {/* Actions (FN40: Lock delete if linked to posts) */}
                        <td className="py-4 px-5 text-left whitespace-nowrap overflow-hidden">
                          <div className="inline-flex items-center justify-start gap-2">
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(cat)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] rounded-lg hover:bg-[#2F5233] hover:text-white transition-all"
                              title="Edit Category"
                            >
                              Edit
                            </button>

                            {/* Delete Button (Protected when postsCount > 0) */}
                            <button
                              onClick={() => handleOpenDeleteModal(cat)}
                              disabled={hasLinkedPosts}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                hasLinkedPosts
                                  ? 'opacity-40 cursor-not-allowed text-[#8A9080] bg-[#FAFBF9] border border-[#EAF0E9]'
                                  : 'text-[#A63446] bg-[#FBEAE7] border border-[#F4C2BC] hover:bg-[#A63446] hover:text-white'
                              }`}
                              title={
                                hasLinkedPosts
                                  ? `Locked: ${cat.postsCount} posts linked (Cannot delete)`
                                  : 'Delete Category'
                              }
                            >
                              {hasLinkedPosts ? (
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  <span>Locked</span>
                                </span>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-[#6B6F63]">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 text-[#A8BDA2] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold text-sm text-[#2B2A25]">No categories found</p>
                        <p className="text-xs text-[#8A9080] mt-0.5">Try searching with a different keyword or reset filters.</p>
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

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#DCE3D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6F63]">
            <div>
              Showing{' '}
              <span className="font-semibold text-[#2B2A25]">
                {filteredCategories.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-[#2B2A25]">
                {Math.min(currentPage * pageSize, filteredCategories.length)}
              </span>{' '}
              of <span className="font-semibold text-[#2B2A25]">{filteredCategories.length}</span> categories
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
        {/* MODAL 1: ADD / EDIT CATEGORY FORM                            */}
        {/* ============================================================ */}
        {formModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-lg w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAF0E9] text-[#2F5233] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">
                      {formModal.isEditing ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    <p className="text-xs text-[#6B6F63]">
                      {formModal.isEditing
                        ? 'Update category name, slug, and type'
                        : 'Add a new recipe or food category to the platform'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFormModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="mt-4 space-y-4 text-xs">
                {/* Category Name */}
                <div>
                  <label className="block font-semibold text-[#2B2A25] mb-1.5">
                    Category Name <span className="text-[#A63446]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Món kho thực dưỡng, Canh dưỡng sinh..."
                    value={formModal.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25]"
                  />
                </div>

                {/* Slug & Type Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2B2A25] mb-1.5">
                      URL Slug <span className="text-[#A63446]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/recipes/category-slug"
                      value={formModal.slug}
                      onChange={(e) => setFormModal((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2B2A25] mb-1.5">
                      Type
                    </label>
                    <select
                      value={formModal.type}
                      onChange={(e) => setFormModal((prev) => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25]"
                    >
                      <option value="Recipe Type">Recipe Type</option>
                      <option value="Food Type">Food Type</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCE3D5]">
                  <button
                    type="button"
                    onClick={() => setFormModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#2F5233] rounded-xl shadow-xs hover:bg-[#25401F] transition-colors"
                  >
                    {formModal.isEditing ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: DELETE CONFIRMATION (Only for 0 posts)              */}
        {/* ============================================================ */}
        {deleteModal.isOpen && deleteModal.category && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl max-w-md w-full shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-3 border-b border-[#DCE3D5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FBEAE7] text-[#A63446] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2B2A25]">Delete Category</h3>
                    <p className="text-xs text-[#6B6F63]">Confirm category removal</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteModal({ isOpen: false, category: null })}
                  className="text-[#8A9080] hover:text-[#2B2A25]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <p className="text-[#2B2A25]">
                  Are you sure you want to permanently delete category{' '}
                  <strong className="text-[#2F5233]">"{deleteModal.category.name}"</strong>?
                </p>
                <div className="bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl p-3 text-[#6B6F63]">
                  <p>Slug: <span className="font-mono text-[#2B2A25]">{deleteModal.category.slug}</span></p>
                  <p className="mt-1">Associated recipes: <strong className="text-[#2F5233]">0 posts</strong> (Safe to remove)</p>
                </div>
                <p className="text-[11px] text-[#8A9080]">
                  This action cannot be undone. Once deleted, this category will no longer be available for filtering or recipe assignment.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: false, category: null })}
                    className="px-4 py-2 text-xs font-semibold text-[#2B2A25] bg-white border border-[#DCE3D5] rounded-xl hover:bg-[#FAFBF9] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#A63446] rounded-xl shadow-xs hover:bg-[#8B2B3A] transition-colors"
                  >
                    Delete Category
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
