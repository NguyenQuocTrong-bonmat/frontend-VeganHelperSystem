import { Routes, Route } from 'react-router-dom'

// Guest / public pages
import HomeGuest from './pages/guest/HomeGuest.jsx'
import Login from './pages/guest/Login.jsx'
import SignUp from './pages/guest/SignUp.jsx'
import VerifyOTP from './pages/guest/VerifyOTP.jsx'
import ForgotPasswordResetPassword from './pages/guest/ForgotPasswordResetPassword.jsx'
import SearchResultsGuest from './pages/guest/SearchResultsGuest.jsx'
import PostDetailGuest from './pages/guest/PostDetailGuest.jsx'
import WeeklyMenuGuestLocked from './pages/guest/WeeklyMenuGuestLocked.jsx'
import FindVeganStoresGuestLocked from './pages/guest/FindVeganStoresGuestLocked.jsx'
import MyPostsGuestLocked from './pages/guest/MyPostsGuestLocked.jsx'

// Member (logged-in) pages
import Home from './pages/member/Home.jsx'
import Profile from './pages/member/Profile.jsx'
import Security from './pages/member/Security.jsx'
import ChangeEmail from './pages/member/ChangeEmail.jsx'
import PublicUserProfile from './pages/member/PublicUserProfile.jsx'
import MyPosts from './pages/member/MyPosts.jsx'
import PostDetail from './pages/member/PostDetail.jsx'
import WeeklyMenu from './pages/member/WeeklyMenu.jsx'
import FindVeganStores from './pages/member/FindVeganStores.jsx'
import StoreDetail from './pages/member/StoreDetail.jsx'
import SearchResults from './pages/member/SearchResults.jsx'
import SavedPosts from './pages/member/SavedPosts.jsx'
import HealthAndWellness from './pages/member/HealthAndWellness.jsx'
import HealthProfile from './pages/member/HealthProfile.jsx'
import BmiDashboard from './pages/member/BmiDashboard.jsx'
import AccountSuspended from './pages/member/AccountSuspended.jsx'
import CreatePost from './pages/member/CreatePost.jsx'
import EditPost from './pages/member/EditPost.jsx'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminContentManagement from './pages/admin/AdminContentManagement.jsx'
import AdminMemberManagement from './pages/admin/AdminMemberManagement.jsx'
import AdminCategoryManagement from './pages/admin/AdminCategoryManagement.jsx'
import AdminAuditLogs from './pages/admin/AdminAuditLogs.jsx'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import GuestRoute from './components/layout/GuestRoute'
import { Toaster } from 'react-hot-toast'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Guest */}
        <Route path="/" element={<GuestRoute><HomeGuest /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPasswordResetPassword />} />
        <Route path="/search-guest" element={<SearchResultsGuest />} />
        <Route path="/posts/:id/guest" element={<PostDetailGuest />} />
        <Route path="/weekly-menu/locked" element={<WeeklyMenuGuestLocked />} />
        <Route path="/vegan-stores/locked" element={<FindVeganStoresGuestLocked />} />
        <Route path="/my-posts/locked" element={<MyPostsGuestLocked />} />

        {/* Member */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
        <Route path="/security/change-email" element={<ProtectedRoute><ChangeEmail /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><PublicUserProfile /></ProtectedRoute>} />
        <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
        <Route path="/posts/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/posts/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="/weekly-menu" element={<ProtectedRoute><WeeklyMenu /></ProtectedRoute>} />
        <Route path="/vegan-stores" element={<ProtectedRoute><FindVeganStores /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
        <Route path="/saved-posts" element={<ProtectedRoute><SavedPosts /></ProtectedRoute>} />
        <Route path="/health" element={<ProtectedRoute><HealthAndWellness /></ProtectedRoute>} />
        <Route path="/health/bmi" element={<ProtectedRoute><HealthAndWellness /></ProtectedRoute>} />
        <Route path="/vegan-stores/:id" element={<ProtectedRoute><StoreDetail /></ProtectedRoute>} />
        <Route path="/account-suspended" element={<ProtectedRoute><AccountSuspended /></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute requireAdmin={true}><AdminContentManagement /></ProtectedRoute>} />
        <Route path="/admin/members" element={<ProtectedRoute requireAdmin={true}><AdminMemberManagement /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute requireAdmin={true}><AdminCategoryManagement /></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute requireAdmin={true}><AdminAuditLogs /></ProtectedRoute>} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
