import React, { useState } from 'react';

export default function CategoriesTab() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryType: 'post',
    postCategoryKind: '',
    isActive: true
  });
  
  const selectedCategory = null;

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      slug: '',
      categoryType: 'post',
      postCategoryKind: '',
      isActive: true
    });
    setIsFormDialogOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('API integration pending — no category changes were made.');
    setIsFormDialogOpen(false);
  };

  const handleDeleteSubmit = () => {
    alert('API integration pending — no category changes were made.');
    setIsDeleteDialogOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#2B2A25]">Category Management</h2>
          <p className="text-[#6B6F63] text-sm mt-1">
            Configure and organize taxonomy, recipes, and community classifications.
          </p>
        </div>
        <button 
          onClick={handleOpenAddDialog}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2F5233] rounded-md hover:bg-[#244026] transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#F9FBF8] p-4 rounded-lg border border-[#E5EBE1]">
        <div className="flex-1 max-w-md w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-[#8E9387]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 pr-4 py-2 w-full border border-[#DCE3D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-transparent text-sm text-[#2B2A25]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="text-sm text-[#6B6F63] hover:text-[#2F5233] font-medium transition-colors whitespace-nowrap"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#DCE3D5]">
        <table className="min-w-full divide-y divide-[#DCE3D5]">
          <thead className="bg-[#F5F8F2]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Category Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Type / Kind
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#6B6F63] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DCE3D5]">
            {/* Empty Integration Placeholder */}
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-[#6B6F63]">
                  <svg className="w-12 h-12 text-[#A6AFA0] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-base font-medium text-[#2B2A25]">No category data</p>
                  <p className="text-sm mt-1">Category data will appear when API integration is enabled.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add / Edit Form Dialog */}
      {isFormDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#2B2A25] mb-4">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2B2A25] mb-1">Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
                  placeholder="e.g., Main Courses"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#2B2A25] mb-1">Slug <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
                  placeholder="e.g., main-courses"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2B2A25] mb-1">Category Type <span className="text-red-500">*</span></label>
                <select 
                  required
                  className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233] bg-white"
                  value={formData.categoryType}
                  onChange={(e) => setFormData({...formData, categoryType: e.target.value})}
                >
                  <option value="post">Post</option>
                  <option value="product">Product</option>
                </select>
              </div>

              {formData.categoryType === 'post' && (
                <div>
                  <label className="block text-sm font-medium text-[#2B2A25] mb-1">Post Category Kind</label>
                  <input 
                    type="text" 
                    className="w-full border border-[#DCE3D5] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
                    placeholder="e.g., recipe"
                    value={formData.postCategoryKind}
                    onChange={(e) => setFormData({...formData, postCategoryKind: e.target.value})}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  className="w-4 h-4 text-[#2F5233] focus:ring-[#2F5233] border-[#DCE3D5] rounded"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm text-[#2B2A25]">
                  Active (visible to users)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#E5EBE1]">
                <button 
                  type="button"
                  onClick={() => setIsFormDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#6B6F63] bg-white border border-[#DCE3D5] rounded-md hover:bg-[#F5F8F2] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#2F5233] rounded-md hover:bg-[#244026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.name || !formData.slug || !formData.categoryType}
                >
                  {isEditing ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#2B2A25] mb-2">Delete Category</h3>
            <p className="text-sm text-[#6B6F63] mb-4">
              Are you sure you want to delete this category? 
              Deletion may be restricted when content references this category.
            </p>
            
            {selectedCategory ? (
              <div className="bg-[#F9FBF8] border border-[#E5EBE1] rounded-md p-3 mb-4">
                <p className="text-sm font-semibold text-[#2B2A25]">{selectedCategory.name}</p>
                <p className="text-xs text-[#6B6F63]">Slug: {selectedCategory.slug}</p>
              </div>
            ) : (
              <div className="bg-[#F9FBF8] border border-[#E5EBE1] rounded-md p-3 mb-4 flex items-center justify-center">
                <p className="text-sm text-[#6B6F63]">No category selected</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#6B6F63] bg-white border border-[#DCE3D5] rounded-md hover:bg-[#F5F8F2] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={!selectedCategory}
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
