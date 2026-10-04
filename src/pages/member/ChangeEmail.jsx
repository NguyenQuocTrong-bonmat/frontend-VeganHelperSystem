import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderMember from '../../components/layout/HeaderMember';

export default function ChangeEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1 = Verify Current Email, 2 = Enter New Email, 3 = Verify New Email
  const [step, setStep] = useState(1);

  // Mask email: e.g. "ex***@gmail.com"
  const getMaskedEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.substring(0, 2)}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
  };

  const isGoogleLinked = user?.provider === 'google' || user?.isGoogleLinked;

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

            <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm p-4 rounded-control mb-6">
              <span className="font-semibold block mb-1">Notice:</span>
              This feature is currently disabled because the Backend API for changing emails is not yet supported.
            </div>

            {step === 1 && (
              <div className="space-y-6">
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
                      disabled
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      disabled
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="pt-2">
                    <button disabled className="w-full px-6 py-2.5 rounded-control bg-gray-300 text-gray-600 font-medium cursor-not-allowed">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
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
                      disabled
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button disabled className="px-6 py-2.5 rounded-control bg-gray-200 text-gray-500 font-medium cursor-not-allowed flex-1">
                      Resend OTP
                    </button>
                    <button disabled className="px-6 py-2.5 rounded-control bg-gray-300 text-gray-600 font-medium cursor-not-allowed flex-1">
                      Verify OTP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Step 3: Verify OTP Sent to New Email</h3>
                  <p className="text-vh-text-secondary text-sm">A verification code has been sent to your new email address.</p>
                </div>
                
                <div className="p-4 bg-vh-surface/50 rounded-control border border-vh-border">
                  <p className="text-sm text-vh-text-secondary mb-1">New Email Address</p>
                  <p className="font-medium text-gray-500">Not provided</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Verification Code (OTP)</label>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      disabled
                      className="w-full px-4 py-3 rounded-control border border-vh-border bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button disabled className="px-6 py-2.5 rounded-control bg-gray-200 text-gray-500 font-medium cursor-not-allowed flex-1">
                      Resend OTP
                    </button>
                    <button disabled className="px-6 py-2.5 rounded-control bg-gray-300 text-gray-600 font-medium cursor-not-allowed flex-1">
                      Verify and Change Email
                    </button>
                  </div>
                </div>
              </div>
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
