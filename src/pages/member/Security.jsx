import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import HeaderMember from '../../components/layout/HeaderMember';

export default function Security() {
  const { user } = useAuth();
  
  // Section A states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Section B states
  const [isGoogleConnected, setIsGoogleConnected] = useState(false); // Unknown from backend initially
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [isUnlinkingGoogle, setIsUnlinkingGoogle] = useState(false);
  const [unlinkStep, setUnlinkStep] = useState(1); // 1: Password, 2: OTP
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [unlinkOtp, setUnlinkOtp] = useState('');

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
      throw new Error('Change Password feature is not yet supported by the Backend API.');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLinkGoogle = async (credentialResponse) => {
    setIsLinkingGoogle(true);
    try {
      await authService.linkGoogle({ idToken: credentialResponse.credential });
      setIsGoogleConnected(true);
      toast.success('Google account linked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to link Google account.');
    } finally {
      setIsLinkingGoogle(false);
    }
  };

  const handleRequestUnlink = async (e) => {
    e.preventDefault();
    if (!unlinkPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    setIsUnlinkingGoogle(true);
    try {
      await authService.requestUnlinkGoogle({ currentPassword: unlinkPassword });
      toast.success('OTP has been sent to your email.');
      setUnlinkStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to request account unlink.');
    } finally {
      setIsUnlinkingGoogle(false);
    }
  };

  const handleConfirmUnlink = async (e) => {
    e.preventDefault();
    if (!unlinkOtp) {
      toast.error('Please enter the OTP.');
      return;
    }
    setIsUnlinkingGoogle(true);
    try {
      await authService.confirmUnlinkGoogle({ otp: unlinkOtp });
      setIsGoogleConnected(false);
      setUnlinkStep(1);
      setUnlinkPassword('');
      setUnlinkOtp('');
      toast.success('Google account unlinked successfully.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to unlink Google account.');
    } finally {
      setIsUnlinkingGoogle(false);
    }
  };

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

            {/* Section B - Google Account */}
            <section className="bg-vh-glass backdrop-blur-[16px] border border-white/70 shadow-glass rounded-card-lg p-6 sm:p-8 h-full flex flex-col hover:border-vh-sage/40 transition-colors">
              <h2 className="font-dm-serif text-xl sm:text-2xl text-vh-forest border-b border-vh-border pb-3 mb-6 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-vh-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  Google Account
                </span>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider ${isGoogleConnected ? 'bg-vh-mint/50 text-vh-forest border border-vh-sage' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  {isGoogleConnected ? 'Connected' : 'Not connected'}
                </span>
              </h2>
              
              <div className="flex-1">
                {!isGoogleConnected ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-vh-surface/50 rounded-control border border-vh-border">
                      <p className="text-sm text-vh-text-secondary leading-relaxed">
                        Link your Google account for faster, one-click sign-ins in the future. You will no longer need to remember your password.
                      </p>
                    </div>
                    <div className="relative inline-block w-full sm:w-auto mt-4">
                      {isLinkingGoogle && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-control">
                          <span className="text-sm font-medium text-vh-forest flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-vh-forest" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Linking...
                          </span>
                        </div>
                      )}
                      <GoogleLogin
                        onSuccess={handleLinkGoogle}
                        onError={() => toast.error('Google link was unsuccessful.')}
                        theme="outline"
                        text="continue_with"
                        size="large"
                        locale="en"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-vh-surface/50 rounded-control border border-vh-border">
                      <p className="text-sm text-vh-text-secondary leading-relaxed">
                        Your Google account is currently linked. Unlinking it requires local password verification to ensure account security.
                      </p>
                    </div>
                    
                    {unlinkStep === 1 && (
                      <form onSubmit={handleRequestUnlink} className="space-y-5 p-5 border border-vh-border/60 rounded-control bg-white/60 shadow-sm mt-4">
                        <div>
                          <label className="block text-sm font-medium text-vh-text-primary mb-1.5" htmlFor="unlinkPassword">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="unlinkPassword"
                            required
                            value={unlinkPassword}
                            onChange={(e) => setUnlinkPassword(e.target.value)}
                            placeholder="Enter current password to unlink"
                            className="w-full px-4 py-3 rounded-control border border-vh-border bg-vh-surface/80 focus:bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-sm transition-all duration-normal"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isUnlinkingGoogle}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-control border-2 border-[#A63446] text-[#A63446] text-sm font-bold hover:bg-[#A63446] hover:text-white transition-all disabled:opacity-60 flex justify-center items-center gap-2 focus:ring-4 focus:ring-red-100"
                        >
                          {isUnlinkingGoogle ? 'Requesting...' : 'Unlink Google Account'}
                        </button>
                      </form>
                    )}

                    {unlinkStep === 2 && (
                      <form onSubmit={handleConfirmUnlink} className="space-y-5 p-5 border border-vh-sage/40 rounded-control bg-vh-mint/20 shadow-sm mt-4">
                        <div>
                          <label className="block text-sm font-medium text-vh-forest mb-1.5" htmlFor="unlinkOtp">
                            OTP Verification
                          </label>
                          <p className="text-sm text-vh-text-secondary mb-3">
                            We sent a 6-digit OTP to your verified email. Please enter it below.
                          </p>
                          <input
                            type="text"
                            id="unlinkOtp"
                            required
                            value={unlinkOtp}
                            onChange={(e) => setUnlinkOtp(e.target.value)}
                            placeholder="• • • • • •"
                            className="w-full px-4 py-3 rounded-control border border-vh-border bg-white focus:outline-none focus:border-vh-sage focus:ring-2 focus:ring-vh-sage/20 text-lg transition-all duration-normal text-center tracking-[0.5em] font-bold"
                            maxLength="6"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={isUnlinkingGoogle}
                            className="flex-1 px-6 py-3 rounded-control bg-[#A63446] text-white text-sm font-bold hover:bg-red-800 transition-colors disabled:opacity-60 flex justify-center items-center focus:ring-4 focus:ring-red-100 shadow-floating"
                          >
                            {isUnlinkingGoogle ? 'Verifying OTP...' : 'Confirm Unlink'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setUnlinkStep(1)}
                            className="px-6 py-3 rounded-control bg-white border border-vh-border text-vh-text-primary text-sm font-bold hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
