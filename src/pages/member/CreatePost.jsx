import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getCategories } from '../../services/postService';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Categories list
  const [categories, setCategories] = useState([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('easy');
  const [prepTimeMins, setPrepTimeMins] = useState(15);
  const [cookingTimeMins, setCookingTimeMins] = useState(30);
  const [dietType, setDietType] = useState('vegan');
  const [mediaFiles, setMediaFiles] = useState([]);

  // Ingredients & Steps lists
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  // UI state
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadCats() {
      setIsFetching(true);
      try {
        const data = await getCategories();
        const cats = Array.isArray(data) ? data : data.items || [];
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setIsFetching(false);
      }
    }
    loadCats();
  }, []);

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleIngredientChange = (val, idx) => {
    const list = [...ingredients];
    list[idx] = val;
    setIngredients(list);
  };
  const handleRemoveIngredient = (idx) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddStep = () => setSteps([...steps, '']);
  const handleStepChange = (val, idx) => {
    const list = [...steps];
    list[idx] = val;
    setSteps(list);
  };
  const handleRemoveStep = (idx) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a post title.');
      return;
    }
    if (!categoryId) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Please enter recipe description or content.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        postType: 'recipe', // Backend expects lowercase
        categoryId: parseInt(categoryId, 10),
        content: content.trim(),
        difficultyLevel,
        prepTimeMins: parseInt(prepTimeMins, 10) || 0,
        cookingTimeMins: parseInt(cookingTimeMins, 10) || 0,
        dietType,
        mediaFiles,
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        steps: steps.filter((s) => s.trim() !== ''),
      };

      await createPost(payload);
      toast.success('Recipe published successfully!');
      navigate('/my-posts');
    } catch (err) {
      console.error('Submit post error:', err);
      const msg = err.status === 401
        ? 'Your session has expired. Please log in again.'
        : err.message || 'Failed to create post. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vh-cream py-10 px-4 sm:px-6 relative overflow-hidden font-dm-sans text-vh-text-primary">
      {/* Botanical Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-vh-mint rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vh-sage rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 text-center">
          <h1 className="font-dm-serif text-3xl sm:text-4xl text-vh-forest font-normal mb-2">
            Recipe Studio
          </h1>
          <p className="text-vh-text-secondary text-sm sm:text-base">
            Share your botanical creations with the community.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-control bg-red-50 border border-vh-error/30 text-vh-error text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-vh-sage mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-vh-text-secondary font-medium">Preparing recipe studio...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-vh-glass backdrop-blur-[16px] border border-white/70 shadow-glass rounded-card-lg p-6 sm:p-10 space-y-10">
          
          {/* Recipe Information */}
          <section className="space-y-6">
            <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-2">Recipe Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-vh-text-primary mb-2">
                Recipe Title <span className="text-vh-error">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Traditional Hue Style Vegan Pho"
                className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-vh-text-primary mb-2">
                  Category <span className="text-vh-error">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-vh-text-primary mb-2">
                  Diet Type
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                >
                  <option value="vegan">Vegan</option>
                  <option value="lacto_ovo_vegetarian">Lacto-Ovo Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vh-text-primary mb-2">
                Description <span className="text-vh-error">*</span>
              </label>
              <textarea
                rows="4"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Introduce your recipe, culinary background or special notes..."
                className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal resize-y"
              ></textarea>
            </div>
          </section>

          {/* Recipe Cover */}
          <section className="space-y-4">
            <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-2">Recipe Cover</h2>
            
            <div className="w-full">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    setMediaFiles(prev => [...prev, ...newFiles]);
                  }
                }}
                className="w-full text-sm text-vh-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-control file:border-0 file:text-sm file:font-medium file:bg-vh-mint file:text-vh-forest hover:file:bg-vh-sage/40 transition-colors cursor-pointer"
              />
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {mediaFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-card overflow-hidden border border-vh-border group shadow-sm">
                      {file.type?.startsWith('video/') ? (
                        <video 
                          src={URL.createObjectURL(file)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                          controls
                        />
                      ) : (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                        />
                      )}
                      
                      {/* Badge cho video */}
                      {file.type?.startsWith('video/') && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-control shadow-sm font-medium z-10 pointer-events-none">
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
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 text-vh-error opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-floating cursor-pointer"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Cooking Details */}
          <section className="space-y-6">
            <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-2">Cooking Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-vh-text-primary mb-2">
                  Prep Time (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  value={prepTimeMins}
                  onChange={(e) => setPrepTimeMins(e.target.value)}
                  className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-vh-text-primary mb-2">
                  Cook Time (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cookingTimeMins}
                  onChange={(e) => setCookingTimeMins(e.target.value)}
                  className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-vh-text-primary mb-2">
                  Difficulty
                </label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </section>

          {/* Ingredients */}
          <section className="space-y-4">
            <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-2">Ingredients</h2>
            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-3 group items-center">
                  <span className="text-vh-sage font-medium w-6 shrink-0 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(e.target.value, idx)}
                    placeholder="e.g. 2 cups of fresh basil"
                    className="flex-1 px-4 py-2.5 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-2 text-vh-error/60 hover:text-vh-error hover:bg-vh-error/10 rounded-control transition-colors"
                      title="Remove ingredient"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-vh-forest bg-vh-mint/50 hover:bg-vh-mint rounded-control transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Ingredient
            </button>
          </section>

          {/* Cooking Instructions */}
          <section className="space-y-4">
            <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-2">Cooking Instructions</h2>
            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div key={idx} className="flex gap-3 group items-start">
                  <span className="text-vh-sage font-medium w-6 shrink-0 pt-3 text-right">{idx + 1}.</span>
                  <textarea
                    rows="2"
                    value={st}
                    onChange={(e) => handleStepChange(e.target.value, idx)}
                    placeholder="Describe this step..."
                    className="flex-1 px-4 py-2.5 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal resize-y"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-2 mt-1 text-vh-error/60 hover:text-vh-error hover:bg-vh-error/10 rounded-control transition-colors"
                      title="Remove step"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-vh-forest bg-vh-mint/50 hover:bg-vh-mint rounded-control transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Step
            </button>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-vh-border">
            <button
              type="button"
              onClick={() => navigate('/my-posts')}
              className="w-full sm:w-auto px-6 py-3 rounded-control border-2 border-vh-sage/30 text-base font-medium text-vh-text-secondary hover:bg-vh-sage/10 hover:text-vh-forest transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-control bg-vh-forest text-white text-base font-medium hover:bg-[#1a3829] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-floating cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : 'Publish Recipe'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
