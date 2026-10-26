import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { createPost, getCategories } from '../../services/postService';

/**
 * Reusable Create Post Form used both inside CreatePostModal (on Home)
 * and as the standalone /posts/create page.
 *
 * Supports:
 * - Recipe creation (full metadata, cooking times, difficulty, ingredients, steps)
 * - Story / Article creation (streamlined fields without requiring recipe steps)
 * - Photo / Media file attachments with live previews
 * - Unsaved changes dirty tracking
 */
export default function CreatePostForm({
  initialPostType = 'recipe',
  focusPhoto = false,
  isModal = false,
  onSuccess,
  onCancel,
  onDirtyChange,
}) {
  const fileInputRef = useRef(null);

  // Categories list
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('easy');
  const [prepTimeMins, setPrepTimeMins] = useState(0);
  const [cookingTimeMins, setCookingTimeMins] = useState(0);
  const [dietType, setDietType] = useState('vegan');
  const [mediaFiles, setMediaFiles] = useState([]);

  // Ingredients & Steps lists (Optional for posts)
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Focus photo input if focusPhoto requested
  useEffect(() => {
    if (focusPhoto && fileInputRef.current) {
      const timer = setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [focusPhoto]);

  // Fetch categories on mount
  useEffect(() => {
    let isCancelled = false;
    async function loadCats() {
      setIsFetching(true);
      try {
        const data = await getCategories();
        if (isCancelled) return;
        const cats = Array.isArray(data) ? data : data.items || [];
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load categories:', err);
        }
      } finally {
        if (!isCancelled) setIsFetching(false);
      }
    }
    loadCats();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Track dirty state
  useEffect(() => {
    const isDirty =
      title.trim() !== '' ||
      content.trim() !== '' ||
      mediaFiles.length > 0 ||
      ingredients.some((i) => i.trim() !== '') ||
      steps.some((s) => s.trim() !== '');

    onDirtyChange?.(isDirty);
  }, [title, content, mediaFiles, ingredients, steps, onDirtyChange]);

  const handleAddIngredient = () => setIngredients((prev) => [...prev, '']);
  const handleIngredientChange = (val, idx) => {
    const list = [...ingredients];
    list[idx] = val;
    setIngredients(list);
  };
  const handleRemoveIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddStep = () => setSteps((prev) => [...prev, '']);
  const handleStepChange = (val, idx) => {
    const list = [...steps];
    list[idx] = val;
    setSteps(list);
  };
  const handleRemoveStep = (idx) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your post.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Please enter content for your post.');
      return;
    }
    if (mediaFiles.length === 0) {
      setErrorMessage('Please upload at least 1 image or video for the post cover.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        categoryId: parseInt(categoryId, 10),
        content: content.trim(),
        dietType,
        mediaFiles,
        // Optional cooking details
        difficultyLevel,
        prepTimeMins: parseInt(prepTimeMins, 10) || 0,
        cookingTimeMins: parseInt(cookingTimeMins, 10) || 0,
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        steps: steps.filter((s) => s.trim() !== ''),
      };

      const result = await createPost(payload);
      toast.success('Post published successfully!');

      onSuccess?.(result);
    } catch (err) {
      console.error('Submit post error:', err);
      const msg =
        err.status === 401
          ? 'Your session has expired. Please log in again.'
          : err.message || 'Failed to create post. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${isModal ? '' : 'max-w-4xl mx-auto'}`}>
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-vh-error/30 text-vh-error text-sm font-medium"
        >
          {errorMessage}
        </div>
      )}

      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-16 text-vh-text-secondary gap-3">
          <div className="w-8 h-8 border-3 border-vh-mint border-t-vh-forest rounded-full animate-spin" />
          <p className="font-dm-sans text-sm font-medium">Preparing post studio...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7 text-left font-dm-sans">
          {/* 1. General Information */}
          <section className="space-y-4">
            <h3 className="font-dm-serif text-lg sm:text-xl text-vh-forest border-b border-vh-border/70 pb-2">
              Post Information
            </h3>

            <div>
              <label htmlFor="post-title-input" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                Title <span className="text-vh-error">*</span>
              </label>
              <input
                id="post-title-input"
                type="text"
                required
                maxLength={255}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post an inviting title..."
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm sm:text-base text-vh-text-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="post-category-select" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                  Category <span className="text-vh-error">*</span>
                </label>
                <select
                  id="post-category-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm sm:text-base text-vh-text-primary transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="post-diet-select" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                  Diet Type
                </label>
                <select
                  id="post-diet-select"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm sm:text-base text-vh-text-primary transition-all cursor-pointer"
                >
                  <option value="vegan">Vegan</option>
                  <option value="lacto_ovo_vegetarian">Lacto-Ovo Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="post-content-textarea" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                Content <span className="text-vh-error">*</span>
              </label>
              <textarea
                id="post-content-textarea"
                rows={isModal ? 3 : 4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, story, or recipe details..."
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm sm:text-base text-vh-text-primary transition-all resize-y"
              />
            </div>
          </section>


          {/* 2. Media / Cover Upload */}
          <section className="space-y-3">
            <h3 className="font-dm-serif text-lg sm:text-xl text-vh-forest border-b border-vh-border/70 pb-2">
              Post Media & Cover <span className="text-vh-error">*</span>
            </h3>

            <div className="w-full">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setMediaFiles((prev) => [...prev, ...newFiles]);
                  }
                }}
                className="w-full text-xs sm:text-sm text-vh-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-vh-mint file:text-vh-forest hover:file:bg-vh-sage/40 transition-colors cursor-pointer"
              />

              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {mediaFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border border-vh-border group shadow-2xs"
                    >
                      {file.type?.startsWith('video/') ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 motion-reduce:transform-none"
                        />
                      )}

                      {file.type?.startsWith('video/') && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium pointer-events-none">
                          Video
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = mediaFiles.filter((_, i) => i !== idx);
                          setMediaFiles(newFiles);
                          if (newFiles.length === 0 && fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full p-1.5 text-vh-error hover:bg-white shadow-xs cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-error active:scale-90 motion-reduce:transform-none"
                        aria-label={`Remove file ${idx + 1}`}
                        title="Remove file"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 3. Cooking Details & Instructions (Optional) */}
          <section className="space-y-4 pt-2 border-t border-vh-border/70">
            <div>
              <h3 className="font-dm-serif text-lg sm:text-xl text-vh-forest">
                Cooking Details (Optional)
              </h3>
              <p className="text-xs text-vh-text-secondary mt-0.5">
                Add preparation time, difficulty level, ingredients, and steps if your post includes a recipe.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="prep-time-input" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                  Prep Time (mins)
                </label>
                <input
                  id="prep-time-input"
                  type="number"
                  min="0"
                  value={prepTimeMins}
                  onChange={(e) => setPrepTimeMins(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm text-vh-text-primary transition-all"
                />
              </div>
              <div>
                <label htmlFor="cook-time-input" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                  Cook Time (mins)
                </label>
                <input
                  id="cook-time-input"
                  type="number"
                  min="0"
                  value={cookingTimeMins}
                  onChange={(e) => setCookingTimeMins(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm text-vh-text-primary transition-all"
                />
              </div>
              <div>
                <label htmlFor="difficulty-select" className="block text-xs sm:text-sm font-medium text-vh-text-primary mb-1.5">
                  Difficulty Level
                </label>
                <select
                  id="difficulty-select"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-sm text-vh-text-primary transition-all cursor-pointer"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </section>

          {/* Ingredients */}
          <section className="space-y-3">
            <h3 className="font-dm-serif text-lg sm:text-xl text-vh-forest border-b border-vh-border/70 pb-2">
              Ingredients (Optional)
            </h3>
            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <span className="text-vh-forest/80 font-medium text-xs sm:text-sm w-5 shrink-0 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(e.target.value, idx)}
                    placeholder="e.g. 2 cups of fresh Thai basil or 200g firm tofu"
                    className="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-xs sm:text-sm text-vh-text-primary transition-all"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1.5 text-vh-error/60 hover:text-vh-error hover:bg-vh-error/10 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-error active:scale-90 motion-reduce:transform-none"
                      aria-label={`Remove ingredient ${idx + 1}`}
                      title="Remove ingredient"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-vh-forest bg-vh-mint/40 hover:bg-vh-mint rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-1 active:scale-95 motion-reduce:transform-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Ingredient</span>
            </button>
          </section>

          {/* Cooking Instructions */}
          <section className="space-y-3">
            <h3 className="font-dm-serif text-lg sm:text-xl text-vh-forest border-b border-vh-border/70 pb-2">
              Step-by-Step Instructions (Optional)
            </h3>
            <div className="space-y-2.5">
              {steps.map((st, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="text-vh-forest/80 font-medium text-xs sm:text-sm w-5 shrink-0 pt-2 text-right">
                    {idx + 1}.
                  </span>
                  <textarea
                    rows={2}
                    value={st}
                    onChange={(e) => handleStepChange(e.target.value, idx)}
                    placeholder={`Describe step ${idx + 1}...`}
                    className="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-vh-border bg-vh-surface focus:bg-white focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest text-xs sm:text-sm text-vh-text-primary transition-all resize-y min-h-[52px]"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 mt-1 text-vh-error/60 hover:text-vh-error hover:bg-vh-error/10 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-error active:scale-90 motion-reduce:transform-none"
                      aria-label={`Remove step ${idx + 1}`}
                      title="Remove step"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-vh-forest bg-vh-mint/40 hover:bg-vh-mint rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-1 active:scale-95 motion-reduce:transform-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Step</span>
            </button>
          </section>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-vh-border/70">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2.5 rounded-full border border-vh-border text-xs sm:text-sm font-semibold text-vh-text-secondary hover:text-vh-forest hover:bg-vh-cream transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 rounded-full bg-vh-forest text-white text-xs sm:text-sm font-semibold hover:bg-vh-sage transition-all shadow-sm active:scale-[0.98] motion-reduce:transform-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
