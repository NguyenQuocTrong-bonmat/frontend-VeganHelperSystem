import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { getHealthProfile, getBmiResult, getBmiHistory } from '../../services/healthProfileService';
import toast from 'react-hot-toast';

function BmiDashboard({ isComponent = false }) {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [healthProfile, setHealthProfile] = useState(null);
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load in parallel
        const [profile, bmiData, historyData] = await Promise.all([
          getHealthProfile().catch(e => null),
          getBmiResult().catch(e => {
            if (e.status === 400) return null; // Missing info error from backend
            throw e;
          }),
          getBmiHistory().catch(e => ({ history: [] }))
        ]);
        
        setHealthProfile(profile);
        setBmiResult(bmiData);
        setBmiHistory(historyData?.history || []);
      } catch (err) {
        console.error('Failed to load BMI data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryColor = (category) => {
    if (!category) return 'text-[#6B6F63]';
    const lower = category.toLowerCase();
    if (lower.includes('underweight')) return 'text-blue-600';
    if (lower.includes('normal')) return 'text-[#2F5233]'; // Healthy green
    if (lower.includes('overweight')) return 'text-orange-500';
    return 'text-red-600'; // Obese
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

  if (error) {
    return (
      <div className={!isComponent ? "min-h-screen flex flex-col bg-[#FDFBF6]" : "w-full"}>
        {!isComponent && <HeaderMember />}
        <div className="flex-grow flex items-center justify-center p-6 min-h-[300px]">
          <div className="bg-white p-8 rounded-2xl border border-[#DCE3D5] text-center max-w-md w-full">
            <h2 className="text-xl font-fraunces font-semibold text-[#A63446] mb-2">{error}</h2>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-[#2F5233] text-white rounded-lg">Retry</button>
          </div>
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
            BMI Dashboard
          </h1>
          <p className="text-[#6B6F63] text-[15px]">
            Track your body mass index and healthy weight progress
          </p>
        </div>
      </div>
      )}

      <main className={`flex-grow w-full max-w-4xl mx-auto px-6 ${!isComponent ? 'py-12' : 'py-6'} space-y-12`}>
        
        {/* SECTION 1: CURRENT BMI */}
        <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-6">Current BMI</h2>
            
            {bmiResult ? (
              <div>
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-8">
                  <div className="text-6xl font-fraunces font-bold text-[#2B2A25]">
                    {bmiResult.bmi.toFixed(1)}
                  </div>
                  <div className={`text-xl font-medium mb-1 ${getCategoryColor(bmiResult.category)}`}>
                    {bmiResult.category}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div className="bg-[#FDFBF6] border border-[#DCE3D5] p-4 rounded-xl text-center">
                    <div className="text-[#6B6F63] text-xs uppercase tracking-wider mb-1">Height</div>
                    <div className="font-semibold text-lg text-[#2B2A25]">{healthProfile?.heightCm || '--'} cm</div>
                  </div>
                  <div className="bg-[#FDFBF6] border border-[#DCE3D5] p-4 rounded-xl text-center">
                    <div className="text-[#6B6F63] text-xs uppercase tracking-wider mb-1">Weight</div>
                    <div className="font-semibold text-lg text-[#2B2A25]">{healthProfile?.weightKg || '--'} kg</div>
                  </div>
                </div>
                
                {bmiResult.idealWeightRange && (
                  <div className="mt-6 text-sm text-[#6B6F63]">
                    <span className="font-medium text-[#2B2A25]">Ideal Weight Range:</span> {bmiResult.idealWeightRange.minKg.toFixed(1)}kg - {bmiResult.idealWeightRange.maxKg.toFixed(1)}kg
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-6 rounded-xl text-center md:text-left">
                <p className="text-[#A63446] font-medium mb-2">Insufficient Health Data</p>
                <p className="text-[#A63446]/80 text-sm mb-4">Please update your height and weight in the Health Profile to calculate your BMI.</p>
                <button 
                  onClick={() => navigate('/health')}
                  className="px-5 py-2 bg-[#A63446] text-white rounded-lg text-sm font-medium hover:bg-[#8B2A3A] transition-colors"
                >
                  Update Profile
                </button>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center justify-center w-48 h-48 rounded-full bg-[#F3F6EE] border-8 border-[#E9EFE6]">
            <svg className="w-20 h-20 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </section>

        {/* SECTION 2: BMI HISTORY */}
        <section className="bg-white border border-[#DCE3D5] rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DCE3D5]/50">
            <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25]">History</h2>
          </div>

          {bmiHistory.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F63]">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FDFBF6] border border-[#DCE3D5] text-[#2F5233] rounded-full flex items-center justify-center text-2xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">No BMI history available yet.</p>
              <p className="text-sm mt-1">Your BMI history will appear here once you update your weight.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DCE3D5]">
                    <th className="py-3 px-4 text-xs font-medium text-[#6B6F63] uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-xs font-medium text-[#6B6F63] uppercase tracking-wider text-right">Weight (kg)</th>
                    <th className="py-3 px-4 text-xs font-medium text-[#6B6F63] uppercase tracking-wider text-right">BMI</th>
                  </tr>
                </thead>
                <tbody>
                  {bmiHistory.map((record, index) => (
                    <tr key={index} className="border-b border-[#FDFBF6] hover:bg-[#F3F6EE]/50 transition-colors">
                      <td className="py-4 px-4 text-sm text-[#2B2A25] font-medium">{formatDate(record.timestamp)}</td>
                      <td className="py-4 px-4 text-sm text-[#2B2A25] text-right">{record.weightKg.toFixed(1)}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-[#2F5233] text-right">{record.bmi.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        
      </main>

      {!isComponent && <AIChatbot />}
      {!isComponent && <Footer />}
    </div>
  );
}

export default BmiDashboard;
