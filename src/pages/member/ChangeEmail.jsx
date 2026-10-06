import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import HeaderMember from '../../components/layout/HeaderMember';

export default function ChangeEmail() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 1 = request change, 2 = verify current email, 3 = verify new email
  const [step, setStep] = useState(1);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mask email: e.g. "ex***@gmail.com"
  const getMaskedEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
  };

  const isGoogleLinked = user?.provider === 'google' || user?.isGoogleLinked;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !currentPassword) {
      toast.error('Enter your new email and current password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.requestEmailChange({
        newEmail: newEmail.trim(),
        currentPassword,
      });
      setOtp('');
      setStep(2);
      toast.success('A verification code was sent to your current email.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to start the email change request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCurrentEmail = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.verifyCurrentEmailChange({ otp });
      setOtp('');
      setStep(3);
      toast.success('A verification code was sent to your new email.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'The current-email code is invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmNewEmail = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.confirmEmailChange({ otp });
      toast.success('Email changed successfully. Please log in again.');
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'The new-email code is invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Protect the route from Google users (though Security page shouldn't let them click here anyway)
  if (isGoogleLinked) {
    return (
      <>
        <HeaderMember />
        <div className="min-h-screen bg-vh-cream py-10 px-4 flex justify-center text-center font-dm-sans">
        <div className="max-w-md bg-white p-8 rounded-card-lg shadow-subtle border border-vh-border">
            <h2 className="text-xl font-dm-serif text-vh-forest mb-4">Cannot Change Email</h2>
            <p className="text-vh-text-secondary mb-6">Your account is linked to Google. Please unlink it in your Profile first.</p>
            <Link to="/profile" className="px-6 py-2 bg-vh-forest text-white rounded-control hover:bg-[#1a3829] transition-colors">
              Go to Profile
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderMember />
      <div className="min-h-screen bg-vh-cream py-10 px-4 sm:px-6 relative overflow-hidden font-dm-sans text-vh-text-primary">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vh-mint rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vh-sage rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

        <div className="max-w-2xl mx-auto relative z-10 space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-sm font-medium text-vh-text-secondary mb-4">
            <Link to="/home" className="hover:text-vh-forest transition-colors">Home</Link>
            <span className="mx-2 text-vh-border">/</span>
            <Link to="/security" className="hover:text-vh-forest transition-colors">Security</Link>
            <span className="mx-2 text-vh-border">/</span>
            <span className="text-vh-forest">Change Email</span>
          </nav>

          <div className="bg-vh-glass backdrop-blur-[16px] border border-white/70 shadow-glass rounded-card-lg p-6 sm:p-10">
            <h1 className="font-dm-serif text-2xl sm:text-3xl text-vh-forest border-b border-vh-border pb-4 mb-6">
              Change Email Address
            </h1>

            {/* Stepper indicator */}
            <div className="flex items-center mb-8 gap-2">
              <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-vh-forest' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-vh-forest' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-vh-forest' : 'bg-gray-200'}`}></div>
            </div>

            <div className="bg-vh-surface/50 border border-vh-border text-vh-text-secondary text-sm p-4 rounded-control mb-6">
              <span className="font-semibold block mb-1 text-vh-forest">Security check:</span>
              You will verify your current email and then your new email before the change is applied.
            </div>

            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 1: Enter New Email and Current Password</h3>
                  <p className="text-vh-text-secondary text-sm">Please provide the new email address and your current password to continue.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">New Email Address</label>
                    <input
                      type="email" 
                      placeholder="e.g. newemail@example.com"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Current Password</label>
                    <input
                      type="password" 
                      placeholder="Enter current password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-white"
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full px-6 py-2.5 rounded-control bg-vh-forest text-white font-medium disabled:opacity-60">
                      {isSubmitting ? 'Sending...' : 'Continue'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCurrentEmail} className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 2: Verify OTP Sent to Current Email</h3>
                  <p className="text-vh-text-secondary text-sm">A verification code has been sent to your current email.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Verification Code (OTP)</label>
                    <input
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-white text-center tracking-[0.5em]"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="button" onClick={() => { setOtp(''); setStep(1); }} className="px-6 py-2.5 rounded-control border border-vh-border text-vh-text-secondary font-medium flex-1">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-control bg-vh-forest text-white font-medium disabled:opacity-60 flex-1">
                      {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleConfirmNewEmail} className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 3: Verify OTP Sent to New Email</h3>
                  <p className="text-vh-text-secondary text-sm">A verification code has been sent to your new email address.</p>
                </div>
                
                <div className="p-4 bg-vh-surface/50 rounded-control border border-vh-border">
                  <p className="text-sm text-vh-text-secondary mb-1">New Email Address</p>
                  <p className="font-medium text-gray-500">{newEmail}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Verification Code (OTP)</label>
                    <input
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-white text-center tracking-[0.5em]"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="button" onClick={() => { setOtp(''); setStep(2); }} className="px-6 py-2.5 rounded-control border border-vh-border text-vh-text-secondary font-medium flex-1">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-control bg-vh-forest text-white font-medium disabled:opacity-60 flex-1">
                      {isSubmitting ? 'Confirming...' : 'Verify and Change Email'}
                    </button>
                  </div>
                </div>
              </form>
            )}
            
            <div className="mt-8 pt-6 border-t border-vh-border text-center">
              <button onClick={() => navigate('/security')} className="text-sm text-vh-text-secondary hover:text-vh-forest font-medium transition-colors">
                Cancel & return to Security
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
