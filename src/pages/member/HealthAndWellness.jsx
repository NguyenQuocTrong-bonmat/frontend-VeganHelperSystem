import React, { useState, useEffect, useCallback } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { 
  getHealthProfile, 
  updateHealthProfile, 
  declareAllergies, 
  searchIngredients,
  getBmiResult, 
  getBmiHistory 
} from '../../services/healthProfileService';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/dateUtils';

/**
 * HealthAndWellness — Unified view integrating Health Profile, Food Allergies, Current BMI, and BMI History.
 * 
 * Props:
 * - isComponent: boolean. If true, renders only the inner contents without duplicated page headers/footers.
 * - onProfileUpdated: optional callback invoked when health profile is successfully saved.
 */
export default function HealthAndWellness({ isComponent = false, onProfileUpdated }) {
  const [loading, setLoading] = useState(true);
  const [savingHealth, setSavingHealth] = useState(false);
  const [savingAllergies, setSavingAllergies] = useState(false);

  // 1. Health Profile State
  const [healthData, setHealthData] = useState({
    heightCm: '',
    weightKg: '',
    biologicalSex: 'other',
    birthDate: '',
    dietType: 'vegan',
    activityLevel: 'moderate'
  });

  // 2. Food Allergies State
  const [allergyData, setAllergyData] = useState({
    systemAllergies: [],
    customAllergies: []
  });
  const [customInput, setCustomInput] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientResults, setIngredientResults] = useState([]);
  const [searchingIngredients, setSearchingIngredients] = useState(false);

  // 3 & 4. BMI & BMI History State
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);

  // Fetch BMI Result & History
  const fetchBmiData = useCallback(async () => {
    try {
      const [bmiData, historyData] = await Promise.all([
        getBmiResult().catch((e) => {
          if (e.status === 400) return null; // Missing height/weight
          console.warn('Failed to load BMI result:', e);
          return null;
        }),
        getBmiHistory().catch((e) => {
          console.warn('Failed to load BMI history:', e);
          return { history: [] };
        })
      ]);
      setBmiResult(bmiData);
      setBmiHistory(historyData?.history || []);
    } catch (err) {
      console.error('Error fetching BMI data:', err);
    }
  }, []);

  // Initial Load: Health profile + Allergies + BMI in parallel
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      setLoading(true);
      try {
        const [profile, bmiData, historyData] = await Promise.all([
          getHealthProfile().catch((e) => {
            console.error('Failed to load health profile:', e);
            toast.error('Failed to load health profile.');
            return null;
          }),
          getBmiResult().catch((e) => {
            if (e.status === 400) return null;
            return null;
          }),
          getBmiHistory().catch(() => ({ history: [] }))
        ]);

        if (!isMounted) return;

        if (profile) {
          setHealthData({
            heightCm: profile.heightCm || '',
            weightKg: profile.weightKg || '',
            biologicalSex: profile.biologicalSex || 'other',
            birthDate: profile.birthDate || '',
            dietType: profile.dietType || 'vegan',
            activityLevel: profile.activityLevel || 'moderate'
          });

          const systemAllergies = (profile.allergies || [])
            .filter((a) => !a.isCustom)
            .map((a) => ({ id: a.ingredientId, name: a.name }));

          setAllergyData({
            systemAllergies,
            customAllergies: profile.customAllergies || []
          });
        }

        setBmiResult(bmiData);
        setBmiHistory(historyData?.history || []);
      } catch (err) {
        console.error('Failed to load Health & Wellness data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, []);


  // Category color helper
  const getCategoryColor = (category) => {
    if (!category) return 'text-[#6B6F63]';
    const lower = category.toLowerCase();
    if (lower.includes('underweight')) return 'text-blue-600';
    if (lower.includes('normal')) return 'text-[#2F5233]'; // Healthy botanical green
    if (lower.includes('overweight')) return 'text-orange-500';
    return 'text-red-600'; // Obese
  };

  // Health Profile Handlers
  const handleHealthChange = (e) => {
    const { name, value } = e.target;
    setHealthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    if (healthData.heightCm < 100 || healthData.heightCm > 250) {
      toast.error('Height must be between 100cm and 250cm.');
      return;
    }
    if (healthData.weightKg < 30 || healthData.weightKg > 200) {
      toast.error('Weight must be between 30kg and 200kg.');
      return;
    }

    try {
      setSavingHealth(true);
      await updateHealthProfile({
        heightCm: Number(healthData.heightCm),
        weightKg: Number(healthData.weightKg),
        biologicalSex: healthData.biologicalSex,
        birthDate: healthData.birthDate,
        dietType: healthData.dietType,
        activityLevel: healthData.activityLevel
      });
      toast.success('Health profile updated successfully!');

      // Automatically refresh BMI & BMI History without page reload
      await fetchBmiData();
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to update health profile.');
    } finally {
      setSavingHealth(false);
    }
  };

  // Custom Allergy Handlers
  const addCustomAllergy = () => {
    const val = customInput.trim();
    if (!val) return;
    if (val.length > 100) {
      toast.error('Custom allergy name cannot exceed 100 characters.');
      return;
    }
    if (allergyData.customAllergies.includes(val)) {
      toast.error('Allergy already added.');
      return;
    }
    if (allergyData.customAllergies.length >= 50) {
      toast.error('Maximum of 50 custom allergies allowed.');
      return;
    }
    setAllergyData((prev) => ({
      ...prev,
      customAllergies: [...prev.customAllergies, val]
    }));
    setCustomInput('');
  };

  const removeCustomAllergy = (allergy) => {
    setAllergyData((prev) => ({
      ...prev,
      customAllergies: prev.customAllergies.filter((a) => a !== allergy)
    }));
  };

  // System Allergy Search & Handlers
  const handleSearchIngredients = async () => {
    if (!ingredientSearch.trim()) return;
    setSearchingIngredients(true);
    try {
      const result = await searchIngredients(ingredientSearch.trim(), 1, 20);
      setIngredientResults(result.items || []);
      if (result.items?.length === 0) {
        toast('No ingredients found.', { icon: 'ℹ️' });
      }
    } catch (err) {
      toast.error('Failed to search ingredients.');
    } finally {
      setSearchingIngredients(false);
    }
  };

  const addSystemAllergy = (ingredient) => {
    const ingredientId = ingredient.id ?? ingredient.Id;
    if (allergyData.systemAllergies.some((a) => (a.id ?? a.Id) === ingredientId)) {
      toast.error('Ingredient already added.');
      return;
    }
    if (allergyData.systemAllergies.length >= 100) {
      toast.error('Maximum of 100 system allergies allowed.');
      return;
    }
    setAllergyData((prev) => ({
      ...prev,
      systemAllergies: [...prev.systemAllergies, { ...ingredient, id: ingredientId }]
    }));
  };

  const removeSystemAllergy = (id) => {
    setAllergyData((prev) => ({
      ...prev,
      systemAllergies: prev.systemAllergies.filter((a) => a.id !== id)
    }));
  };

  const handleAllergiesSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingAllergies(true);
      await declareAllergies({
        allergyIngredientIds: allergyData.systemAllergies.map((a) => a.id),
        customAllergies: allergyData.customAllergies
      });
      toast.success('Allergies updated successfully!');
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      toast.error(err.message || 'Failed to update allergies.');
    } finally {
      setSavingAllergies(false);
    }
  };

  if (loading) {
    return (
      <div className={!isComponent ? 'min-h-screen flex flex-col bg-[#FDFBF6]' : 'w-full'}>
        {!isComponent && <HeaderMember />}
        <div className="flex-grow flex items-center justify-center min-h-[350px]">
          <div className="w-10 h-10 border-4 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin"></div>
        </div>
        {!isComponent && <Footer />}
      </div>
    );
  }

  return (
    <div className={!isComponent ? 'min-h-screen flex flex-col bg-[#FDFBF6]' : 'w-full'}>
      {!isComponent && <HeaderMember />}

      {/* Standalone Page Header (when routed directly to /health) */}
      {!isComponent && (
        <div className="w-full bg-[#E9EFE6]/40 border-b border-[#DCE3D5]/50">
          <div className="max-w-6xl mx-auto px-6 py-10 text-center">
            <h1 className="text-3xl md:text-4xl font-fraunces font-semibold text-[#2B2A25] mb-2">
              Health & Wellness
            </h1>
            <p className="text-[#6B6F63] text-[15px]">
              Manage your physical profile, dietary restrictions, and track your BMI metrics
            </p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER — Balanced 2-Column Responsive Layout */}
      <main className={`flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 ${!isComponent ? 'py-10' : 'py-8'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Health Profile followed by Food Allergies   */}
          {/* ======================================================== */}
          <div className="space-y-8 flex flex-col">
            
            {/* SECTION 1: HEALTH PROFILE */}
            <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
                <div className="w-10 h-10 rounded-full bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Health Profile</h2>
                  <p className="text-xs text-[#6B6F63] mt-0.5">Physical biometric measurements and daily activity</p>
                </div>
              </div>

              <form onSubmit={handleHealthSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#2B2A25]">Height (cm)</label>
                    <input 
                      type="number" 
                      name="heightCm"
                      value={healthData.heightCm}
                      onChange={handleHealthChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                      placeholder="e.g. 170"
                      min="100"
                      max="250"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#2B2A25]">Weight (kg)</label>
                    <input 
                      type="number" 
                      name="weightKg"
                      value={healthData.weightKg}
                      onChange={handleHealthChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                      placeholder="e.g. 65"
                      min="30"
                      max="200"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#2B2A25]">Biological Sex</label>
                    <select 
                      name="biologicalSex"
                      value={healthData.biologicalSex}
                      onChange={handleHealthChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#2B2A25]">Birth Date</label>
                    <input 
                      type="date" 
                      name="birthDate"
                      value={healthData.birthDate ? healthData.birthDate.split('T')[0] : ''}
                      onChange={handleHealthChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#2B2A25]">Diet Type</label>
                    <select 
                      name="dietType"
                      value={healthData.dietType}
                      onChange={handleHealthChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                    >
                      <option value="vegan">Vegan</option>
                      <option value="lacto_ovo_vegetarian">Lacto-Ovo Vegetarian</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#2B2A25]">Activity Level</label>
                    <select 
                      name="activityLevel"
                      value={healthData.activityLevel}
                      onChange={handleHealthChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                    >
                      <option value="sedentary">Sedentary (Little/no exercise)</option>
                      <option value="light">Lightly Active (1-3 days/wk)</option>
                      <option value="moderate">Moderate (3-5 days/wk)</option>
                      <option value="active">Active (6-7 days/wk)</option>
                      <option value="very_active">Very Active (Heavy training)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={savingHealth}
                    className="px-6 py-2.5 bg-[#2F5233] text-white font-medium rounded-lg hover:bg-[#25401F] transition-all disabled:opacity-70 flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer text-sm"
                  >
                    {savingHealth && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    )}
                    Save Health Profile
                  </button>
                </div>
              </form>
            </section>

            {/* SECTION 2: FOOD ALLERGIES */}
            <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
                <div className="w-10 h-10 rounded-full bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Food Allergies</h2>
                  <p className="text-xs text-[#6B6F63] mt-0.5">Filter out allergens from recommended recipes</p>
                </div>
              </div>

              <form onSubmit={handleAllergiesSubmit} className="space-y-6">
                
                {/* Search System Ingredients */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-medium text-[#2B2A25]">Search System Ingredients</label>
                  <div className="flex gap-2.5">
                    <input 
                      type="text" 
                      value={ingredientSearch}
                      onChange={(e) => setIngredientSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearchIngredients();
                        }
                      }}
                      className="flex-grow min-w-0 px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                      placeholder="e.g. Tomato, Peanut, Soy..."
                    />
                    <button 
                      type="button" 
                      onClick={handleSearchIngredients}
                      disabled={searchingIngredients}
                      className="px-5 py-2.5 bg-[#E9EFE6] text-[#2F5233] font-medium rounded-lg hover:bg-[#DCE3D5] transition-colors border border-[#DCE3D5] disabled:opacity-70 flex items-center gap-1.5 shrink-0 cursor-pointer text-sm"
                    >
                      {searchingIngredients && (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      )}
                      Search
                    </button>
                  </div>

                  {/* Search Results Dropdown */}
                  {ingredientResults.length > 0 && (
                    <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl max-h-48 overflow-y-auto p-1.5 shadow-inner">
                      {ingredientResults.map((ing) => (
                        <div key={ing.id} className="flex justify-between items-center p-2 hover:bg-[#E9EFE6] rounded-lg transition-colors">
                          <span className="text-sm text-[#2B2A25] font-medium">{ing.name}</span>
                          <button 
                            type="button" 
                            onClick={() => addSystemAllergy(ing)}
                            className="text-xs font-semibold text-[#2F5233] bg-white px-3 py-1.5 rounded-md hover:bg-[#DCE3D5] transition-colors border border-[#DCE3D5] shadow-xs cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected System Allergies Tags */}
                  {allergyData.systemAllergies.length > 0 && (
                    <div className="p-3.5 border border-[#E9EFE6] bg-[#FDFBF6] rounded-xl">
                      <span className="block text-[11px] font-semibold text-[#6B6F63] mb-2.5 uppercase tracking-wider">
                        Selected System Allergies ({allergyData.systemAllergies.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {allergyData.systemAllergies.map((allergy) => (
                          <div key={allergy.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F5233]/10 text-[#2F5233] border border-[#2F5233]/20 rounded-full text-xs font-medium">
                            {allergy.name}
                            <button 
                              type="button" 
                              onClick={() => removeSystemAllergy(allergy.id)}
                              className="text-[#2F5233]/60 hover:text-[#2F5233] focus:outline-none cursor-pointer"
                              aria-label={`Remove ${allergy.name}`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#DCE3D5]/50"></div>

                {/* Custom Allergy Adder */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-medium text-[#2B2A25]">Add Custom Allergy</label>
                  <div className="flex gap-2.5">
                    <input 
                      type="text" 
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomAllergy();
                        }
                      }}
                      className="flex-grow min-w-0 px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6] text-[15px]"
                      placeholder="e.g. Sesame, Celery, Mango..."
                    />
                    <button 
                      type="button" 
                      onClick={addCustomAllergy}
                      className="px-5 py-2.5 bg-[#E9EFE6] text-[#2F5233] font-medium rounded-lg hover:bg-[#DCE3D5] transition-colors border border-[#DCE3D5] shrink-0 cursor-pointer text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {/* Custom Allergies Tags */}
                  {allergyData.customAllergies.length > 0 && (
                    <div className="p-3.5 border border-[#E9EFE6] bg-[#FDFBF6] rounded-xl">
                      <span className="block text-[11px] font-semibold text-[#6B6F63] mb-2.5 uppercase tracking-wider">
                        Your Custom Allergies ({allergyData.customAllergies.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {allergyData.customAllergies.map((allergy, index) => (
                          <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A63446]/10 text-[#A63446] border border-[#A63446]/20 rounded-full text-xs font-medium">
                            {allergy}
                            <button 
                              type="button" 
                              onClick={() => removeCustomAllergy(allergy)}
                              className="text-[#A63446]/60 hover:text-[#A63446] focus:outline-none cursor-pointer"
                              aria-label={`Remove ${allergy}`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end border-t border-[#DCE3D5]/50">
                  <button 
                    type="submit" 
                    disabled={savingAllergies}
                    className="px-6 py-2.5 bg-[#2F5233] text-white font-medium rounded-lg hover:bg-[#25401F] transition-all disabled:opacity-70 flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer text-sm"
                  >
                    {savingAllergies && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    )}
                    Save Allergies
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Current BMI followed by BMI History        */}
          {/* ======================================================== */}
          <div className="space-y-8 flex flex-col">
            
            {/* SECTION 3: CURRENT BMI */}
            <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
                <div className="w-10 h-10 rounded-full bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Current BMI</h2>
                  <p className="text-xs text-[#6B6F63] mt-0.5">Calculated body mass index based on current profile</p>
                </div>
              </div>

              {bmiResult ? (
                <div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-4 mb-6 text-center sm:text-left">
                    <div className="text-5xl sm:text-6xl font-fraunces font-bold text-[#2B2A25]">
                      {bmiResult.bmi.toFixed(1)}
                    </div>
                    <div className={`text-lg sm:text-xl font-semibold ${getCategoryColor(bmiResult.category)}`}>
                      {bmiResult.category}
                    </div>
                  </div>

                  {/* Biometric Snapshot Card */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FDFBF6] border border-[#DCE3D5] p-3.5 rounded-xl text-center">
                      <div className="text-[#6B6F63] text-xs uppercase tracking-wider mb-1 font-medium">Height used</div>
                      <div className="font-semibold text-lg text-[#2B2A25]">{healthData.heightCm || '--'} cm</div>
                    </div>
                    <div className="bg-[#FDFBF6] border border-[#DCE3D5] p-3.5 rounded-xl text-center">
                      <div className="text-[#6B6F63] text-xs uppercase tracking-wider mb-1 font-medium">Weight used</div>
                      <div className="font-semibold text-lg text-[#2B2A25]">{healthData.weightKg || '--'} kg</div>
                    </div>
                  </div>

                  {/* Ideal Weight Range */}
                  {bmiResult.idealWeightRange && (
                    <div className="mt-5 p-3.5 bg-[#F3F6EE] border border-[#DCE3D5]/60 rounded-xl text-sm text-[#4A4D44] flex items-center gap-2">
                      <span className="text-[#2F5233] font-semibold text-base">🎯</span>
                      <span>
                        <strong className="font-semibold text-[#2B2A25]">Ideal Weight Range:</strong>{' '}
                        {bmiResult.idealWeightRange.minKg.toFixed(1)}kg – {bmiResult.idealWeightRange.maxKg.toFixed(1)}kg
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-6 rounded-xl text-center">
                  <p className="text-[#A63446] font-semibold mb-1.5">Insufficient Health Data</p>
                  <p className="text-[#A63446]/80 text-sm">
                    Enter valid height and weight in the Health Profile to calculate your BMI and ideal weight range.
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 4: BMI HISTORY */}
            <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 sm:p-8 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
                <div className="w-10 h-10 rounded-full bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">BMI History</h2>
                  <p className="text-xs text-[#6B6F63] mt-0.5">Chronological record of weight changes and progress</p>
                </div>
              </div>

              {bmiHistory.length === 0 ? (
                <div className="py-12 text-center text-[#6B6F63] my-auto">
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#FDFBF6] border border-[#DCE3D5] text-[#2F5233] rounded-full flex items-center justify-center text-xl">
                    ⏱️
                  </div>
                  <p className="font-medium text-[#2B2A25]">No BMI history records yet</p>
                  <p className="text-xs text-[#6B6F63] mt-1 max-w-xs mx-auto">
                    New historical records are logged automatically each time you update your weight in the Health Profile.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[280px]">
                    <thead>
                      <tr className="border-b border-[#DCE3D5]">
                        <th className="py-2.5 px-3 text-xs font-semibold text-[#6B6F63] uppercase tracking-wider">Date</th>
                        <th className="py-2.5 px-3 text-xs font-semibold text-[#6B6F63] uppercase tracking-wider text-right">Weight</th>
                        <th className="py-2.5 px-3 text-xs font-semibold text-[#6B6F63] uppercase tracking-wider text-right">BMI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FDFBF6]">
                      {bmiHistory.map((record, index) => (
                        <tr key={index} className="hover:bg-[#F3F6EE]/50 transition-colors">
                          <td className="py-3 px-3 text-sm text-[#2B2A25] font-medium whitespace-nowrap">
                            {formatDate(record.timestamp)}
                          </td>
                          <td className="py-3 px-3 text-sm text-[#2B2A25] text-right font-medium whitespace-nowrap">
                            {record.weightKg?.toFixed ? `${record.weightKg.toFixed(1)} kg` : `${record.weightKg} kg`}
                          </td>
                          <td className="py-3 px-3 text-sm font-semibold text-[#2F5233] text-right whitespace-nowrap">
                            {record.bmi?.toFixed ? record.bmi.toFixed(1) : record.bmi}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

        </div>
      </main>

      {!isComponent && <AIChatbot />}
      {!isComponent && <Footer />}
    </div>
  );
}
