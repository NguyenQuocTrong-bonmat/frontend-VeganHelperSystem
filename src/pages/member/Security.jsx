import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import HeaderMember from '../../components/layout/HeaderMember';

export default function Security() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Section A states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success('Password changed successfully. Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const isGoogleLinked = user?.provider === 'google' || user?.isGoogleLinked;

  return (
    <>
      <HeaderMember />
      <div className="min-h-screen bg-vh-cream py-10 px-4 sm:px-6 relative overflow-hidden font-dm-sans text-vh-text-primary">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vh-mint rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vh-sage rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm font-medium text-vh-text-secondary mb-4">
            <Link to="/home" className="hover:text-vh-forest transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </Link>
            <span className="mx-2 text-vh-border">/</span>
            <span className="text-vh-forest">Security</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-vh-border pb-6">
            <div>
              <h1 className="font-dm-serif text-3xl sm:text-4xl text-vh-forest font-normal mb-2">
                Security & Linked Accounts
              </h1>
              <p className="text-vh-text-secondary text-sm sm:text-base">
                Manage your password and connected login methods securely.
              </p>
            </div>
            <Link 
              to="/home"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-control bg-white border border-vh-border text-vh-forest font-medium hover:bg-vh-mint/20 hover:border-vh-sage transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Section A - Password Management */}
            <section className="bg-vh-glass backdrop-blur-[16px] border border-white/70 shadow-glass rounded-card-lg p-6 sm:p-8 h-full flex flex-col hover:border-vh-sage/40 transition-colors">
              <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-3 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-vh-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                Password Management
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-5 flex-1 flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-vh-text-primary mb-1.5" htmlFor="currentPassword">
                    Current Password <span className="text-vh-error">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vh-text-primary mb-1.5" htmlFor="newPassword">
                    New Password <span className="text-vh-error">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vh-text-primary mb-1.5" htmlFor="confirmPassword">
                    Confirm New Password <span className="text-vh-error">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-base transition-all duration-normal"
                  />
                </div>
                <div className="pt-6 mt-auto">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto px-8 py-3 rounded-control bg-vh-forest text-white text-base font-medium hover:bg-[#1a3829] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-floating flex justify-center items-center gap-2 focus:ring-4 focus:ring-vh-forest/20"
                  >
                    {isChangingPassword ? (
                       <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                    ) : null}
                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </section>

            {/* Section B - Change Email */}
            <section className="bg-vh-glass backdrop-blur-[16px] border border-white/70 shadow-glass rounded-card-lg p-6 sm:p-8 h-full flex flex-col hover:border-vh-sage/40 transition-colors">
              <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-3 mb-6 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-vh-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Email Address
                </span>
              </h2>
              
              <div className="flex-1 flex flex-col">
                <div className="space-y-6 flex-1">
                  <div className="p-4 bg-vh-surface/50 rounded-control border border-vh-border">
                    <p className="text-sm text-vh-text-secondary leading-relaxed mb-2">
                      Current Email Address:
                    </p>
                    <p className="font-medium text-vh-text-primary text-lg">
                      {user?.email || 'Loading...'}
                    </p>
                  </div>
                  
                  {isGoogleLinked ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-control text-sm text-red-700">
                      <p className="font-medium mb-1">Google Account Linked</p>
                      <p>
                        Your account is currently linked to Google. To change your email address, you must first unlink your Google account in your{' '}
                        <Link to="/profile" className="font-bold underline hover:text-red-900">
                          Profile
                        </Link>.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-vh-surface/50 rounded-control border border-vh-border">
                      <p className="text-sm text-vh-text-secondary leading-relaxed">
                        To change your email address, you will need to verify your current email and then verify the new email via OTP.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-auto">
                  <Link
                    to={isGoogleLinked ? "#" : "/security/change-email"}
                    onClick={(e) => {
                      if (isGoogleLinked) e.preventDefault();
                    }}
                    className={`w-full sm:w-auto px-8 py-3 rounded-control border text-base font-medium transition-colors flex justify-center items-center gap-2 shadow-floating focus:ring-4 ${
                      isGoogleLinked
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-vh-forest text-vh-forest hover:bg-vh-forest hover:text-white focus:ring-vh-forest/20"
                    }`}
                  >
                    Change Email
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
