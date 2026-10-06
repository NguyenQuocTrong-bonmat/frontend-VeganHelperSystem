import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { getHealthProfile, updateHealthProfile, declareAllergies } from '../../services/healthProfileService';
import toast from 'react-hot-toast';

function HealthProfile({ isComponent = false }) {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [savingHealth, setSavingHealth] = useState(false);
  const [savingAllergies, setSavingAllergies] = useState(false);

  // Health Profile State
  const [healthData, setHealthData] = useState({
    heightCm: '',
    weightKg: '',
    biologicalSex: 'other',
    birthDate: '',
    dietType: 'vegan',
    activityLevel: 'Moderate'
  });

  // Food Allergies State
  const [allergyData, setAllergyData] = useState({
    allergyIngredientIds: [],
    customAllergies: []
  });
  
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await getHealthProfile();
        setHealthData({
          heightCm: profile.heightCm || '',
          weightKg: profile.weightKg || '',
          biologicalSex: profile.biologicalSex || 'other',
          birthDate: profile.birthDate || '',
          dietType: profile.dietType || 'vegan',
          activityLevel: profile.activityLevel || 'Moderate'
        });
        
        setAllergyData({
          allergyIngredientIds: profile.allergyIngredientIds || [],
          customAllergies: [] // API doesn't return customAllergies in GET, so we start empty or fetch elsewhere if added
        });
      } catch (err) {
        console.error('Failed to load health profile:', err);
        toast.error('Failed to load health profile.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHealthChange = (e) => {
    const { name, value } = e.target;
    setHealthData(prev => ({ ...prev, [name]: value }));
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    if (healthData.heightCm <= 0 || healthData.weightKg <= 0) {
      toast.error('Height and Weight must be greater than 0.');
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
    } catch (err) {
      toast.error(err.message || 'Failed to update health profile.');
    } finally {
      setSavingHealth(false);
    }
  };

  const addCustomAllergy = () => {
    const val = customInput.trim();
    if (!val) return;
    if (allergyData.customAllergies.includes(val)) {
      toast.error('Allergy already added.');
      return;
    }
    setAllergyData(prev => ({
      ...prev,
      customAllergies: [...prev.customAllergies, val]
    }));
    setCustomInput('');
  };

  const removeCustomAllergy = (allergy) => {
    setAllergyData(prev => ({
      ...prev,
      customAllergies: prev.customAllergies.filter(a => a !== allergy)
    }));
  };

  const handleAllergiesSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingAllergies(true);
      await declareAllergies({
        allergyIngredientIds: allergyData.allergyIngredientIds,
        customAllergies: allergyData.customAllergies
      });
      toast.success('Allergies updated successfully!');
      // Reset custom list since it's saved (optional UX choice)
      setAllergyData(prev => ({ ...prev, customAllergies: [] }));
    } catch (err) {
      toast.error(err.message || 'Failed to update allergies.');
    } finally {
      setSavingAllergies(false);
    }
  };

  if (loading) {
    return (
      <div className={!isComponent ? "min-h-screen flex flex-col bg-[#FDFBF6]" : "w-full"}>
        {!isComponent && <HeaderMember />}
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin"></div>
        </div>
        {!isComponent && <Footer />}
      </div>
    );
  }

  return (
    <div className={!isComponent ? "min-h-screen flex flex-col bg-[#FDFBF6]" : "w-full"}>
      {!isComponent && <HeaderMember />}
      
      {/* PAGE HEADER */}
      {!isComponent && (
      <div className="w-full bg-[#E9EFE6]/40 border-b border-[#DCE3D5]/50">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-fraunces font-semibold text-[#2B2A25] mb-2">
            Health & Allergies
          </h1>
          <p className="text-[#6B6F63] text-[15px]">
            Manage your physical profile and dietary restrictions
          </p>
        </div>
      </div>
      )}

      <main className={`flex-grow w-full max-w-4xl mx-auto px-6 ${!isComponent ? 'py-12' : 'py-6'} space-y-12`}>
        
        {/* SECTION 1: HEALTH PROFILE */}
        <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
            <div className="w-10 h-10 rounded-full bg-[#E9EFE6] flex items-center justify-center text-[#2F5233]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Health Profile</h2>
          </div>

          <form onSubmit={handleHealthSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2B2A25]">Height (cm)</label>
                <input 
                  type="number" 
                  name="heightCm"
                  value={healthData.heightCm}
                  onChange={handleHealthChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                  placeholder="e.g. 170"
                  min="1"
                  step="0.1"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2B2A25]">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weightKg"
                  value={healthData.weightKg}
                  onChange={handleHealthChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                  placeholder="e.g. 65"
                  min="1"
                  step="0.1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2B2A25]">Biological Sex</label>
                <select 
                  name="biologicalSex"
                  value={healthData.biologicalSex}
                  onChange={handleHealthChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2B2A25]">Birth Date</label>
                <input 
                  type="date" 
                  name="birthDate"
                  value={healthData.birthDate}
                  onChange={handleHealthChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2B2A25]">Diet Type</label>
                <select 
                  name="dietType"
                  value={healthData.dietType}
                  onChange={handleHealthChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                >
                  <option value="vegan">Vegan</option>
                  <option value="lacto_ovo_vegetarian">Lacto-Ovo Vegetarian</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#2B2A25]">Activity Level</label>
                <select 
                  name="activityLevel"
                  value={healthData.activityLevel}
                  onChange={handleHealthChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                >
                  <option value="Sedentary">Sedentary (Little or no exercise)</option>
                  <option value="LightlyActive">Lightly Active (Exercise 1-3 days/week)</option>
                  <option value="Moderate">Moderate (Exercise 3-5 days/week)</option>
                  <option value="Active">Active (Exercise 6-7 days/week)</option>
                  <option value="VeryActive">Very Active (Hard exercise every day)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={savingHealth}
                className="px-6 py-2.5 bg-[#2F5233] text-white font-medium rounded-lg hover:bg-[#25401F] transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {savingHealth && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
                Save Health Profile
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 2: FOOD ALLERGIES */}
        <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
            <div className="w-10 h-10 rounded-full bg-[#E9EFE6] flex items-center justify-center text-[#2F5233]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Food Allergies</h2>
          </div>

          <form onSubmit={handleAllergiesSubmit} className="space-y-6">
            <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-4 rounded-xl text-sm text-[#A63446]">
              <span className="font-semibold block mb-1">Backend Missing Feature:</span>
              System ingredient list search is currently <strong>BLOCKED</strong> due to missing backend endpoints. 
              You may add custom allergy items manually below.
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#2B2A25]">Add Custom Allergy</label>
              <div className="flex gap-3">
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
                  className="flex-grow px-4 py-2.5 rounded-lg border border-[#DCE3D5] focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all bg-[#FDFBF6]"
                  placeholder="e.g. Peanuts, Soy, Gluten..."
                />
                <button 
                  type="button" 
                  onClick={addCustomAllergy}
                  className="px-5 py-2.5 bg-[#E9EFE6] text-[#2F5233] font-medium rounded-lg hover:bg-[#DCE3D5] transition-colors border border-[#DCE3D5]"
                >
                  Add
                </button>
              </div>
            </div>

            {allergyData.customAllergies.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#2B2A25]">Your Custom Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {allergyData.customAllergies.map((allergy, index) => (
                    <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F5233]/10 text-[#2F5233] border border-[#2F5233]/20 rounded-full text-sm font-medium">
                      {allergy}
                      <button 
                        type="button" 
                        onClick={() => removeCustomAllergy(allergy)}
                        className="text-[#2F5233]/60 hover:text-[#2F5233] focus:outline-none"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={savingAllergies}
                className="px-6 py-2.5 bg-[#2F5233] text-white font-medium rounded-lg hover:bg-[#25401F] transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {savingAllergies && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
                Save Allergies
              </button>
            </div>
          </form>
        </section>
        
      </main>

      {!isComponent && <AIChatbot />}
      {!isComponent && <Footer />}
    </div>
  );
}

export default HealthProfile;
