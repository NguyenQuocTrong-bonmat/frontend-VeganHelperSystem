import React, { useState, useEffect } from 'react';

const REASON_CATEGORIES = [
  {
    id: 'non_vegan',
    label: 'Non-vegan content',
    description: 'Contains meat, seafood, dairy, eggs, or animal-derived ingredients.',
  },
  {
    id: 'spam',
    label: 'Spam or advertising',
    description: 'Commercial promotions, repetitive messages, or irrelevant links.',
  },
  {
    id: 'harassment',
    label: 'Harassment or hate speech',
    description: 'Bullying, targeted attacks, offensive remarks, or hostility.',
  },
  {
    id: 'violence',
    label: 'Violence or graphic content',
    description: 'Disturbing imagery, dangerous behavior, or threats.',
  },
  {
    id: 'other',
    label: 'Other violation',
    description: 'Any other issue that violates community standards.',
  },
];

export default function ReportPostModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  postTitle = '',
}) {
  const [selectedCategory, setSelectedCategory] = useState('non_vegan');
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory('non_vegan');
      setReason('');
      setValidationError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = reason.trim();

    if (trimmed.length > 1000) {
      setValidationError('Description cannot exceed 1,000 characters.');
      return;
    }

    setValidationError('');

    const categoryObj = REASON_CATEGORIES.find((cat) => cat.id === selectedCategory);
    const finalReason = trimmed || `${categoryObj?.label || 'Violation'}: ${categoryObj?.description || 'Violates community guidelines.'}`;

    onSubmit({
      reasonCategory: selectedCategory,
      reason: finalReason,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-post-modal-title"
    >
      <div className="bg-white border border-[#DCE3D5] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-[#2B2A25]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#DCE3D5] pb-4 mb-4">
          <div>
            <h3 id="report-post-modal-title" className="font-fraunces font-medium text-xl text-[#2B2A25]">
              Report Post
            </h3>
            {postTitle && (
              <p className="text-xs text-[#6B6F63] mt-0.5 truncate max-w-sm" title={postTitle}>
                Post: {postTitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs font-semibold text-[#6B6F63] hover:text-[#2B2A25] px-2 py-1 rounded transition-colors disabled:opacity-50"
            aria-label="Close report dialog"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <p className="leading-relaxed text-[#6B6F63]">An Admin will review your report. The post stays visible and its author is not notified unless an Admin hides it.</p>
          {/* Reason Category Selection */}
          <div>
            <label className="block font-semibold text-[#2B2A25] mb-2">
              Select Violation Reason:
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {REASON_CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? 'border-[#2F5233] bg-[#F4F7F2]'
                      : 'border-[#DCE3D5] hover:border-[#8A9080] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportCategory"
                    value={cat.id}
                    checked={selectedCategory === cat.id}
                    onChange={() => {
                      setSelectedCategory(cat.id);
                      if (cat.id !== 'other') {
                        setReason('');
                        setValidationError('');
                      }
                    }}
                    disabled={isSubmitting}
                    className="mt-0.5 text-[#2F5233] focus:ring-[#2F5233]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#2B2A25]">{cat.label}</p>
                    <p className="text-[11px] text-[#6B6F63] mt-0.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason Details Textarea - Only shown when "Other violation" is selected */}
          {selectedCategory === 'other' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="report-details" className="font-semibold text-[#2B2A25]">
                  Additional Details (Optional):
                </label>
                <span className="text-[11px] text-[#6B6F63]">
                  {reason.length} / 1000
                </span>
              </div>
              <textarea
                id="report-details"
                rows="3"
                maxLength={1000}
                placeholder="Explain why this post violates community guidelines..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (validationError) setValidationError('');
                }}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#FAFBF9] border border-[#DCE3D5] rounded-xl text-xs text-[#2B2A25] focus:outline-none focus:border-[#2F5233] resize-y min-h-[80px]"
              />
              {validationError && (
                <p className="text-[11px] text-[#A63446] mt-1 font-medium">{validationError}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DCE3D5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-[#DCE3D5] rounded-lg font-medium text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#FAFBF9] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#A63446] hover:bg-[#8F2D3C] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
