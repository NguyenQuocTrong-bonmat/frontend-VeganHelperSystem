import { Routes, Route } from 'react-router-dom'

// Guest / public pages
import HomeGuest from './pages/guest/HomeGuest.jsx'
import Login from './pages/guest/Login.jsx'
import SignUp from './pages/guest/SignUp.jsx'
import ForgotPasswordResetPassword from './pages/guest/ForgotPasswordResetPassword.jsx'
import SearchResultsGuest from './pages/guest/SearchResultsGuest.jsx'
import PostDetailGuest from './pages/guest/PostDetailGuest.jsx'
import WeeklyMenuGuestLocked from './pages/guest/WeeklyMenuGuestLocked.jsx'
import FindVeganStoresGuestLocked from './pages/guest/FindVeganStoresGuestLocked.jsx'
import MyPostsGuestLocked from './pages/guest/MyPostsGuestLocked.jsx'

// Member (logged-in) pages
import Home from './pages/member/Home.jsx'
import Profile from './pages/member/Profile.jsx'
import PublicUserProfile from './pages/member/PublicUserProfile.jsx'
import MyPosts from './pages/member/MyPosts.jsx'
import PostDetail from './pages/member/PostDetail.jsx'
import WeeklyMenu from './pages/member/WeeklyMenu.jsx'
import FindVeganStores from './pages/member/FindVeganStores.jsx'
import SearchResults from './pages/member/SearchResults.jsx'
import AccountSuspended from './pages/member/AccountSuspended.jsx'

// Admin pages
import AdminDashboardHomeOverview from './pages/admin/AdminDashboardHomeOverview.jsx'
import AdminContentManagement from './pages/admin/AdminContentManagement.jsx'
import AdminMemberManagement from './pages/admin/AdminMemberManagement.jsx'
import AdminCategoryManagement from './pages/admin/AdminCategoryManagement.jsx'
import AdminMealPlannerConfiguration from './pages/admin/AdminMealPlannerConfiguration.jsx'
import AdminAiModerationQueue from './pages/admin/AdminAiModerationQueue.jsx'
import AdminAiModelMonitoring from './pages/admin/AdminAiModelMonitoring.jsx'
import AdminVideoSummarizationQueue from './pages/admin/AdminVideoSummarizationQueue.jsx'

function App() {
  return (
    <Routes>
      {/* Guest */}
      <Route path="/" element={<HomeGuest />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPasswordResetPassword />} />
      <Route path="/search-guest" element={<SearchResultsGuest />} />
      <Route path="/posts/:id/guest" element={<PostDetailGuest />} />
      <Route path="/weekly-menu/locked" element={<WeeklyMenuGuestLocked />} />
      <Route path="/vegan-stores/locked" element={<FindVeganStoresGuestLocked />} />
      <Route path="/my-posts/locked" element={<MyPostsGuestLocked />} />

      {/* Member */}
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/users/:id" element={<PublicUserProfile />} />
      <Route path="/my-posts" element={<MyPosts />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/weekly-menu" element={<WeeklyMenu />} />
      <Route path="/vegan-stores" element={<FindVeganStores />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/account-suspended" element={<AccountSuspended />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboardHomeOverview />} />
      <Route path="/admin/content" element={<AdminContentManagement />} />
      <Route path="/admin/members" element={<AdminMemberManagement />} />
      <Route path="/admin/categories" element={<AdminCategoryManagement />} />
      <Route path="/admin/meal-planner-config" element={<AdminMealPlannerConfiguration />} />
      <Route path="/admin/ai-moderation" element={<AdminAiModerationQueue />} />
      <Route path="/admin/ai-monitoring" element={<AdminAiModelMonitoring />} />
      <Route path="/admin/video-summarization" element={<AdminVideoSummarizationQueue />} />
    </Routes>
  )
}

export default App
