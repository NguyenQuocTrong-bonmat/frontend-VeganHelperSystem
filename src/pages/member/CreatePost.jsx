import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getCategories } from '../../services/postService';

export default function CreatePost() {
  const navigate = useNavigate();

  // Categories list
  const [categories, setCategories] = useState([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Easy');
  const [prepTimeMins, setPrepTimeMins] = useState(15);
  const [cookingTimeMins, setCookingTimeMins] = useState(30);
  const [dietType, setDietType] = useState('Vegan');
  const [mediaFiles, setMediaFiles] = useState([]);

  // Ingredients & Steps lists
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories();
        const cats = Array.isArray(data) ? data : data.items || [];
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      } catch (err) {
        console.error('Failed to load categories:', err);
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
        postType: 'Recipe',
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
      navigate('/my-posts');
    } catch (err) {
      console.error('Submit post error:', err);
      setErrorMessage(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF6] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white border border-[#DCE3D5] rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="font-fraunces text-2xl sm:text-3xl text-[#2B2A25] font-semibold mb-6">
          Create New Recipe
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-[#FDF8F7] border border-[#F2D6D3] text-[#A63446] text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
              Recipe Title <span className="text-[#A63446]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Traditional Hue Style Vegan Pho"
              className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm"
            />
          </div>

          {/* Category & Diet Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
                Category <span className="text-[#A63446]">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
                Diet Type
              </label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm bg-white"
              >
                <option value="Vegan">Vegan</option>
                <option value="Raw Vegan">Raw Vegan</option>
                <option value="Plant-based">Plant-based</option>
              </select>
            </div>
          </div>

          {/* Prep, Cook Time & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
                Prep Time (mins)
              </label>
              <input
                type="number"
                min="0"
                value={prepTimeMins}
                onChange={(e) => setPrepTimeMins(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
                Cook Time (mins)
              </label>
              <input
                type="number"
                min="0"
                value={cookingTimeMins}
                onChange={(e) => setCookingTimeMins(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
                Difficulty
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm bg-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Content / Description */}
          <div>
            <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
              Description <span className="text-[#A63446]">*</span>
            </label>
            <textarea
              rows="4"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Introduce your recipe, culinary background or special notes..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:outline-none focus:border-[#2F5233] text-sm"
            ></textarea>
          </div>

          {/* Media Files */}
          <div>
            <label className="block text-sm font-medium text-[#2B2A25] mb-1.5">
              Recipe Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setMediaFiles(Array.from(e.target.files))}
              className="w-full text-sm text-[#6B6F63] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#E9EFE6] file:text-[#2F5233] hover:file:bg-[#DCE3D5] cursor-pointer"
            />
          </div>

          {/* Ingredients list */}
          <div>
            <label className="block text-sm font-medium text-[#2B2A25] mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(e.target.value, idx)}
                    placeholder={`Ingredient ${idx + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#DCE3D5] text-sm"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="px-3 text-[#A63446] hover:bg-[#FDF8F7] rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="mt-2 text-sm text-[#2F5233] font-medium hover:underline cursor-pointer"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Steps list */}
          <div>
            <label className="block text-sm font-medium text-[#2B2A25] mb-2">
              Cooking Steps
            </label>
            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={st}
                    onChange={(e) => handleStepChange(e.target.value, idx)}
                    placeholder={`Step ${idx + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#DCE3D5] text-sm"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="px-3 text-[#A63446] hover:bg-[#FDF8F7] rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="mt-2 text-sm text-[#2F5233] font-medium hover:underline cursor-pointer"
            >
              + Add Step
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCE3D5]">
            <button
              type="button"
              onClick={() => navigate('/my-posts')}
              className="px-5 py-2.5 rounded-lg border border-[#DCE3D5] text-sm font-medium text-[#6B6F63] hover:bg-[#F3F6EE] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#2F5233] text-white text-sm font-medium hover:bg-[#25401F] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
