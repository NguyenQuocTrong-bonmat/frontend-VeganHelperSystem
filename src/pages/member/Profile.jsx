import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import HeaderMember from '../../components/layout/HeaderMember';

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Profile States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    phoneNumber: '',
    biologicalSex: 'female',
    birthDate: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Link/Unlink Google States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getProfile();
      setProfile(data.data || data); 
      
      const p = data.data || data;
      setEditForm({
        displayName: p.displayName || '',
        phoneNumber: p.phoneNumber || '',
        biologicalSex: p.biologicalSex || 'female',
        birthDate: p.birthDate ? p.birthDate.split('T')[0] : ''
      });
    } catch (err) {
      toast.error('Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    let key = id;
    if (id === 'modalFullName') key = 'displayName';
    if (id === 'modalPhone') key = 'phoneNumber';
    if (id === 'modalSex') key = 'biologicalSex';
    if (id === 'modalDob') key = 'birthDate';

    setEditForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Avatar file must be less than 5MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (editForm.displayName) formData.append('displayName', editForm.displayName);
      if (editForm.phoneNumber) formData.append('phoneNumber', editForm.phoneNumber);
      if (editForm.biologicalSex) formData.append('biologicalSex', editForm.biologicalSex);
      if (editForm.birthDate) formData.append('birthDate', editForm.birthDate);
      if (avatarFile) formData.append('avatar', avatarFile);

      await authService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditOpen(false);
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLinkGoogle = async (credentialResponse) => {
    try {
      await authService.linkGoogle({ idToken: credentialResponse.credential });
      toast.success('Google account linked successfully!');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to link Google account.');
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await authService.setPassword(passwordForm);
      toast.success('Password set successfully!');
      setIsPasswordModalOpen(false);
      setIsUnlinkModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to set password.');
    }
  };

  const handleUnlinkGoogle = async (e) => {
    e.preventDefault();
    try {
      await authService.unlinkGoogle({ currentPassword });
      toast.success('Google account unlinked successfully!');
      setIsUnlinkModalOpen(false);
      setCurrentPassword('');
      fetchProfile();
    } catch (err) {
      if (err.response?.status === 400 && (err.response?.data?.error?.includes('password') || err.response?.data?.error?.includes('tạo mật khẩu') || err.response?.data?.error?.includes('set a password'))) {
        toast.error('Bạn cần tạo mật khẩu trước khi hủy liên kết Google.');
        setIsUnlinkModalOpen(false);
        setIsPasswordModalOpen(true);
      } else {
        toast.error(err.response?.data?.error || 'Failed to unlink Google account.');
      }
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-primary-moss">Loading profile...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-accent-beetroot">Error loading profile.</div>;

  const getJoinedText = () => {
    if (!profile?.createdAt) return 'Joined recently';
    const date = new Date(profile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `Joined ${diffDays === 0 ? 'today' : `${diffDays} days ago`}`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `Joined ${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    const diffYears = Math.floor(diffDays / 365);
    return `Joined ${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

  const userAvatar = getImageUrl(profile.avatarUrl) || defaultAvatar;
  const currentAvatarPreview = avatarPreview || userAvatar;

  return (

    <>
      {/* BEGIN: MainHeader */}
      <HeaderMember />
      {/* END: MainHeader */}
      {/* BEGIN: MainContent */}
      <main className="flex-grow py-10 px-4 sm:px-6">
        <div className="max-w-[960px] mx-auto space-y-6">
          {/* BEGIN: UserIdentityHeaderCard */}
          <section className="bg-surface-paper rounded-xl border border-border-sage-mist p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6" data-purpose="user-identity-card">
            {/* User Left Info (Avatar + Details) */}
            <div className="flex items-center gap-5">
              {/* 80px Circular Avatar with Verified Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full border border-border-sage-mist bg-herb-white/70 flex items-center justify-center text-text-stem-gray">
                  <img src={userAvatar} alt={profile.displayName} className="w-full h-full object-cover rounded-full" />
                </div>
                {/* Green verified checkmark badge */}
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary-moss text-white flex items-center justify-center ring-2 ring-surface-paper shadow-sm" title="Verified Member">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                  </svg>
                </span>
              </div>
              {/* Name, Chip Badge, Email, Timestamp */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-fraunces text-2xl font-bold text-text-charcoal tracking-tight">{profile.displayName}</h1>
                  {/* Subtle Community Member chip */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-herb-white text-text-stem-gray border border-border-sage-mist">
                    Community Member
                  </span>
                </div>
                {/* Email address line */}
                <div className="flex items-center text-sm text-text-stem-gray gap-2">
                  <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="">{profile.email}</span>
                </div>
                {/* Timestamp line */}
                <div className="flex items-center text-sm text-text-stem-gray gap-2">
                  <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="">
                    {getJoinedText()}
                  </span>
                </div>
              </div>
            </div>
            {/* Right: Primary Action Button */}
            <div className="flex-shrink-0 self-start md:self-center">
              <button onClick={() => setIsEditOpen(true)} className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-moss hover:bg-moss-hover text-white text-sm font-medium transition shadow-sm hover:shadow active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-moss" id="openEditProfileBtn" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="">
                  Edit Profile
                </span>
              </button>
            </div>
          </section>
          {/* END: UserIdentityHeaderCard */}
          {/* BEGIN: PersonalInformationCard */}
          <section className="bg-surface-paper rounded-xl border border-border-sage-mist p-6 sm:p-8 shadow-subtle" data-purpose="personal-information-card">
            {/* Section Header */}
            <div className="pb-6 border-b border-border-sage-mist/70">
              <h2 className="font-fraunces text-xl sm:text-2xl font-semibold text-text-charcoal">
                Personal Information
              </h2>
              <p className="text-sm text-text-stem-gray mt-1">
                Identity and contact information stored securely on your account
              </p>
            </div>
            {/* Information Fields Vertical Stack */}
            <div className="mt-6 space-y-4">
              {/* Field 1: Full Name */}
              <div className="p-4 rounded-lg bg-herb-white/50 border border-border-sage-mist/80 flex items-center justify-between hover:bg-herb-white transition-colors">
                <div className="space-y-0.5">
                  <p className="text-[13px] text-text-stem-gray font-normal">
                    Full Name
                  </p>
                  <p className="text-base font-semibold text-text-charcoal">{profile.displayName}</p>
                </div>
                <div className="text-text-stem-gray p-2">
                  <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
              {/* Field 2: Email Address */}
              <div className="p-4 rounded-lg bg-herb-white/50 border border-border-sage-mist/80 flex items-center justify-between hover:bg-herb-white transition-colors">
                <div className="space-y-0.5">
                  <p className="text-[13px] text-text-stem-gray font-normal">
                    Email
                  </p>
                  <p className="text-base font-semibold text-text-charcoal">{profile.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Verified Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-badge-green-bg text-badge-green-text text-xs font-medium border border-badge-green-text/20">
                    <span className="">
                      Verified
                    </span>
                  </span>
                  <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
              {/* Field 3: Phone Number */}
              <div className="p-4 rounded-lg bg-herb-white/50 border border-border-sage-mist/80 flex items-center justify-between hover:bg-herb-white transition-colors">
                <div className="space-y-0.5">
                  <p className="text-[13px] text-text-stem-gray font-normal">
                    Phone Number
                  </p>
                  <p className="text-base font-semibold text-text-charcoal">{profile.phoneNumber || "Not provided"}</p>
                </div>
                <div className="text-text-stem-gray p-2">
                  <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
              {/* Field 4: Biological Sex / Gender */}
              <div className="p-4 rounded-lg bg-herb-white/50 border border-border-sage-mist/80 flex items-center justify-between hover:bg-herb-white transition-colors">
                <div className="space-y-0.5">
                  <p className="text-[13px] text-text-stem-gray font-normal">
                    Biological Sex
                  </p>
                  <p className="text-base font-semibold text-text-charcoal">{profile.biologicalSex || "Not provided"}</p>
                </div>
                <div className="text-text-stem-gray p-2">
                  <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
              {/* Field 5: Date of Birth */}
              <div className="p-4 rounded-lg bg-herb-white/50 border border-border-sage-mist/80 flex items-center justify-between hover:bg-herb-white transition-colors">
                <div className="space-y-0.5">
                  <p className="text-[13px] text-text-stem-gray font-normal">
                    Date of Birth
                  </p>
                  <p className="text-base font-semibold text-text-charcoal">{profile.birthDate ? profile.birthDate.split("T")[0] : "Not provided"}</p>
                </div>
                <div className="text-text-stem-gray p-2">
                  <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-12 4.879m0 0a3 3 0 104.243 4.242 3 3 0 00-4.243-4.242zm12 0a3 3 0 104.243 4.242 3 3 0 00-4.243-4.242zM3.375 19.5h17.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>
            </div>

          </section>
          {/* BEGIN: LinkedAccountsCard */}
          <section className="bg-surface-paper rounded-xl border border-border-sage-mist p-6 sm:p-8 shadow-subtle mt-6">
            <div className="pb-6 border-b border-border-sage-mist/70">
              <h2 className="font-fraunces text-xl sm:text-2xl font-semibold text-text-charcoal">Security & Linked Accounts</h2>
              <p className="text-sm text-text-stem-gray mt-1">Manage your login methods and connected accounts</p>
            </div>
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-herb-white/50 border border-border-sage-mist/80 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[13px] text-text-stem-gray font-normal">Google Account</p>
                  <p className="text-sm font-semibold text-text-charcoal">Connect your Google account for quicker login</p>
                </div>
                <div>
                  <GoogleLogin
                    onSuccess={handleLinkGoogle}
                    onError={() => toast.error('Google login failed')}
                    text="continue_with"
                    shape="rectangular"
                  />
                  <div className="mt-2 text-right">
                    <button onClick={() => setIsUnlinkModalOpen(true)} className="text-xs text-accent-beetroot hover:underline font-medium">Unlink Google Account</button>
                  </div>
                </div>
              </div>
            </div>

          </section>
          {/* END: LinkedAccountsCard */}
        </div>
      </main>
      {/* END: MainContent */}
      {/* BEGIN: MainFooter */}
      <footer className="bg-herb-white border-t border-border-sage-mist py-8 px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-stem-gray">
          {/* Footer Brand & Mission */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-text-charcoal">
              Botanical Hearth
            </span>
            <span className="text-border-sage-mist">
              •
            </span>
            <span className="">
              Plant-based culinary & family nutrition platform
            </span>
          </div>
          {/* Footer Policy Links */}
          <nav className="flex items-center space-x-6">
            <a className="hover:text-primary-moss transition-colors" href="#">
              About Us
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Contact Support
            </a>
          </nav>
        </div>
      </footer>
      {/* END: MainFooter */}
      {/* BEGIN: ChatbotFloatingComponent */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" data-purpose="ai-assistant-container">
        {/* AI Nutrition Assistant Pop-up Widget */}
        <div className="hidden w-[380px] h-[520px] bg-surface-paper rounded-2xl shadow-popover border border-border-sage-mist flex flex-col mb-4 overflow-hidden origin-bottom-right transition-all animate-in fade-in zoom-in-95 duration-200" id="aiChatWidget">
          {/* Assistant Header */}
          <div className="bg-primary-moss text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                {/* 4-point Sparkle Icon */}
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-fraunces font-semibold text-base leading-tight">
                  AI Nutrition Assistant
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-white/80 font-normal">
                    Online & ready
                  </span>
                </div>
              </div>
            </div>
            <button className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition" id="closeAiChatBtn" type="button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-herb-white/40 text-sm">
            {/* Assistant Message Bubble */}
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-primary-moss/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary-moss">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"></path>
                </svg>
              </div>
              <div className="bg-surface-paper border border-border-sage-mist rounded-2xl rounded-tl-sm p-3 shadow-xs text-text-charcoal">
                <p className="">
                  Hello Linh! 👋 I'm your Botanical Hearth nutrition guide. How can I assist your plant-based meal planning today?
                </p>
              </div>
            </div>
            {/* Suggestion Chips Group */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-text-stem-gray uppercase tracking-wider mb-2">
                Quick inquiries
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button className="text-xs bg-surface-paper hover:bg-primary-moss hover:text-white text-text-charcoal px-3 py-1.5 rounded-full border border-border-sage-mist transition-colors shadow-2xs">
                  🌱 High Protein Dishes
                </button>
                <button className="text-xs bg-surface-paper hover:bg-primary-moss hover:text-white text-text-charcoal px-3 py-1.5 rounded-full border border-border-sage-mist transition-colors shadow-2xs">
                  🥣 Weight Loss Menu
                </button>
                <button className="text-xs bg-surface-paper hover:bg-primary-moss hover:text-white text-text-charcoal px-3 py-1.5 rounded-full border border-border-sage-mist transition-colors shadow-2xs">
                  🥦 Ingredient Swaps
                </button>
              </div>
            </div>
          </div>
          {/* Input Footer Area */}
          <div className="p-3 bg-surface-paper border-t border-border-sage-mist">
            <form className="flex items-center gap-2">
              <input className="flex-1 text-sm bg-herb-white/60 border border-border-sage-mist rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-moss/30 focus:border-primary-moss placeholder:text-text-stem-gray/70" placeholder="Ask AI nutrition assistant..." type="text" />
              <button className="w-9 h-9 rounded-full bg-primary-moss text-white flex items-center justify-center hover:bg-moss-hover transition shadow-sm flex-shrink-0" title="Send" type="submit">
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
        {/* 56px Floating Action Button (AI Assistant) */}
        <button aria-label="Toggle AI Nutrition Assistant" className="w-14 h-14 rounded-full bg-primary-moss text-white flex items-center justify-center shadow-float hover:bg-moss-hover hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary-moss/30" id="aiChatToggleBtn" type="button">
          {/* 4-point AI sparkle icon */}
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path>
          </svg>
        </button>
      </div>
      {/* END: ChatbotFloatingComponent */}
      {/* BEGIN: EditProfileModal */}
      <div className={`fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 ${isEditOpen ? "" : "hidden"}`} id="edit-profile-modal-overlay">
        {/* Sibling 1: Backdrop */}
        <div className="absolute inset-0 bg-[#2b2a25] bg-opacity-40" id="editModalBackdrop"></div>
        {/* Sibling 2: Modal Content Box */}
        <div className="relative z-10 bg-surface-paper border border-border-sage-mist rounded-xl w-full max-w-md p-6 sm:p-7 shadow-[0_2px_12px_rgba(43,42,37,0.12)] max-h-[90vh] overflow-y-auto" id="edit-profile-modal-container" style={{ boxShadow: '0 2px 12px rgba(43,42,37,0.12)' }}>
          {/* Modal Header */}
          <div className="flex items-start justify-between pb-4 border-b border-border-sage-mist">
            <div>
              <h2 className="font-caslon text-2xl font-bold text-text-charcoal tracking-tight">
                Edit Profile
              </h2>
              <p className="text-xs sm:text-sm text-text-stem-gray mt-1">
                Update your account identity and contact details.
              </p>
            </div>
            <button onClick={() => setIsEditOpen(false)} aria-label="Close modal" className="text-text-stem-gray hover:text-text-charcoal p-1.5 rounded-lg hover:bg-herb-white transition-colors duration-200" id="closeEditProfileBtn" type="button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          {/* Modal Content */}
          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 font-sans" id="editProfileForm">
            {/* Avatar Edit */}
            <div className="flex items-center gap-4 pb-2">
              <div className="relative w-16 h-16 rounded-full bg-[#EAEFE5] border border-border-sage-mist flex items-center justify-center text-text-stem-gray flex-shrink-0">
                <img src={currentAvatarPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary-moss text-white flex items-center justify-center ring-2 ring-surface-paper shadow-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"></path>
                    <path d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"></path>
                    <path d="M18.75 10.5h.008v.008h-.008V10.5z"></path>
                  </svg>
                </span>
              </div>
              <div>
                <button onClick={() => fileInputRef.current.click()} className="text-xs font-medium text-primary-moss hover:text-[#25401F] border border-border-sage-mist bg-white hover:bg-herb-white px-3 py-1.5 rounded-lg transition-colors duration-200 shadow-2xs" type="button"><input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} accept="image/png, image/jpeg" />
                  Change Photo
                </button>
                <p className="text-[11px] text-text-stem-gray mt-1">
                  Recommended: JPG, PNG at least 300x300px
                </p>
              </div>
            </div>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-[#2B2A25] mb-1" htmlFor="modalFullName">
                Full Name
              </label>
              <input className="w-full text-sm bg-white border border-border-sage-mist rounded-lg px-3 py-2 text-text-charcoal focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-[#2F5233] transition-colors duration-200" id="modalFullName" type="text" value={editForm.displayName} onChange={handleEditChange} />
            </div>
            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#2B2A25]" htmlFor="modalEmail">
                  Email
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-badge-green-bg text-badge-green-text text-[11px] font-medium border border-badge-green-text/20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                  </svg>
                  Verified
                </span>
              </div>
              <input className="w-full text-sm bg-white border border-border-sage-mist rounded-lg px-3 py-2 text-text-charcoal focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-[#2F5233] transition-colors duration-200" id="modalEmail" type="email" value={profile.email} readOnly disabled className="w-full text-sm bg-gray-100 border border-border-sage-mist rounded-lg px-3 py-2 text-text-stem-gray cursor-not-allowed" />
            </div>
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-[#2B2A25] mb-1" htmlFor="modalPhone">
                Phone Number
              </label>
              <input className="w-full text-sm bg-white border border-border-sage-mist rounded-lg px-3 py-2 text-text-charcoal focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-[#2F5233] transition-colors duration-200" id="modalPhone" type="tel" value={editForm.phoneNumber} onChange={handleEditChange} />
            </div>
            {/* 2-Column Grid: Sex & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#2B2A25] mb-1" htmlFor="modalSex">
                  Biological Sex
                </label>
                <select className="w-full text-sm bg-white border border-border-sage-mist rounded-lg px-3 py-2 text-text-charcoal focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-[#2F5233] transition-colors duration-200" id="modalSex" value={editForm.biologicalSex} onChange={handleEditChange}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2B2A25] mb-1" htmlFor="modalDob">
                  Date of Birth
                </label>
                <input className="w-full text-sm bg-white border border-border-sage-mist rounded-lg px-3 py-2 text-text-charcoal focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-[#2F5233] transition-colors duration-200" id="modalDob" type="date" value={editForm.birthDate} onChange={handleEditChange} />
              </div>
            </div>
            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-2">
              <button onClick={() => setIsEditOpen(false)} className="border border-[#2F5233] text-[#2F5233] hover:bg-[#F3F6EE] rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200" id="cancelEditProfileBtn" type="button">
                Cancel
              </button>
              <button className="bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 shadow-sm" id="saveEditProfileBtn" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* END: EditProfileModal */}

      {/* Set Password Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isPasswordModalOpen ? "" : "hidden"}`}>
        <div className="absolute inset-0 bg-[#2b2a25] bg-opacity-40" onClick={() => setIsPasswordModalOpen(false)}></div>
        <div className="relative z-10 bg-surface-paper rounded-xl p-6 max-w-sm w-full">
          <h3 className="font-caslon text-xl font-bold mb-4">Set Local Password</h3>
          <p className="text-sm text-text-stem-gray mb-4">You need to set a local password before unlinking your Google account.</p>
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label className="block text-xs mb-1">New Password</label>
              <input type="password" required className="w-full border rounded-lg px-3 py-2" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({...p, newPassword: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs mb-1">Confirm Password</label>
              <input type="password" required className="w-full border rounded-lg px-3 py-2" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-primary-moss text-white rounded-lg">Save Password</button>
            </div>
          </form>
        </div>
      </div>

      {/* Unlink Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isUnlinkModalOpen ? "" : "hidden"}`}>
        <div className="absolute inset-0 bg-[#2b2a25] bg-opacity-40" onClick={() => setIsUnlinkModalOpen(false)}></div>
        <div className="relative z-10 bg-surface-paper rounded-xl p-6 max-w-sm w-full">
          <h3 className="font-caslon text-xl font-bold mb-4">Unlink Google Account</h3>
          <p className="text-sm text-text-stem-gray mb-4">Please enter your password to confirm this action.</p>
          <form onSubmit={handleUnlinkGoogle} className="space-y-4">
            <div>
              <label className="block text-xs mb-1">Current Password</label>
              <input type="password" required className="w-full border rounded-lg px-3 py-2" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsUnlinkModalOpen(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-accent-beetroot text-white rounded-lg">Confirm Unlink</button>
            </div>
          </form>
        </div>
      </div>

      {/* BEGIN: InteractiveScripts */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* END: InteractiveScripts */}
    </>
  );
}

export default Profile;
