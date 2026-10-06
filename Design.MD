# VeganHelper Design System & Product Structure

## 1. Product Vision

VeganHelper has transitioned from static HTML/CSS to a modern React/Vite architecture. This document serves as the single source of truth for the product structure, implemented pages, user flows, visual system, and current implementation status.

**Tổng quan về Hệ thống UI (Từ Sprint 1):**
*   **Chuyển đổi sang JSX:** Toàn bộ HTML gốc đã được chuyển đổi hoàn toàn sang cú pháp JSX.
*   **Loại bỏ Javascript Inline:** Toàn bộ các đoạn mã `onclick` hay thẻ `<script>` điều khiển DOM cũ đã bị loại bỏ và thay thế bằng React State.
*   **Kết nối Form & API:** Sử dụng `react-hook-form` + `zod` để quản lý form, gọi API qua `axiosInstance` với Interceptor bắt lỗi 401 tự động refresh token.

## 2. Visual Design System

The project strictly follows the **Botanical Glassmorphism & Cream** visual system:

*   **Design Tokens (Hệ thống màu sắc):**
    *   Primary: `bg-primary-moss` (#2F5233)
    *   Background: Cream `bg-[#FDFBF6]`, `bg-herb-white`
    *   Accents: `text-accent-beetroot`, Turmeric for ratings
    *   Borders: `border-sage-mist`, `#DCE3D5`
*   **Typography:** Standardized fonts including `font-caslon`, `font-fraunces`, `font-vietnam`.
*   **Component Language:**
    *   Rounded cards with soft shadows or clean 1px borders.
    *   Subtle hover and motion interactions.
*   **English Localization:** All visible UI text and toast notifications are fully localized in English.

## 3. Sprint 1 — Core Product Structure

Sprint 1 thiết lập nền tảng cơ bản cho hệ thống:

*   **Authentication (Xác thực):** Đăng nhập, Đăng ký (đòi hỏi `fullName`), Quản lý OTP, Đổi mật khẩu.
*   **Home / Discovery (Trang chủ):** Trang chủ dành cho Guest (`/guest`) và Member (`/`), hiển thị danh sách bài viết nổi bật.
*   **Content / Posts (Bài viết):** 
    *   Tạo bài viết (`/create-post`) và Chỉnh sửa bài viết (`/edit-post/:id`).
    *   Hỗ trợ Multi-media Upload UI (chọn nhiều ảnh/video cùng lúc, preview).
*   **Profile (Cá nhân):** Quản lý tài khoản, Bảo mật (`/security`).
*   **Sprint 1 User Flows:**
    *   Guest → Đăng nhập / Đăng ký → Member Home
    *   Member → Tạo bài viết → Tải ảnh/video → Đăng bài
    *   Member → Quản lý bảo mật → Đổi mật khẩu / Liên kết Google

## 4. Sprint 2 — Extended Features

Sprint 2 mở rộng các tính năng tương tác và khám phá:

*   **Search:** Tìm kiếm bài viết (Recipes) và người dùng (People).
*   **Post Interaction:** Thích (Like), Lưu (Save), và Bình luận (Comment).
*   **Saved Recipes:** Xem danh sách các bài viết đã lưu.
*   **Public Profile:** Xem trang cá nhân công khai của người dùng khác.
*   **Health:** Hồ sơ sức khỏe và Dị ứng thức ăn.
*   **BMI:** Bảng điều khiển BMI hiện tại và Lịch sử BMI.
*   **Weekly Menu:** Lên thực đơn tuần chay (Chờ API).
*   **Vegan Stores:** Tìm kiếm và xem chi tiết cửa hàng chay lân cận (Chờ API).

## 5. Current Information Architecture

```text
VEGANHELPER
│
├── HOME / DISCOVERY
│   ├── Search Recipes
│   └── Search People
│
├── CONTENT
│   ├── Post Detail
│   │   ├── Like
│   │   ├── Save
│   │   └── Comments
│   │
│   └── Public User Profile
│       └── Published Posts
│
├── MY POSTS
│   ├── My Authored Posts
│   └── Saved Recipes
│
├── WEEKLY MENU
│   ├── Meal Planner
│   ├── Health Profile (Health Info & Food Allergies)
│   └── BMI Dashboard (Current BMI & History)
│
├── MEMBER PROFILE
│   └── Private Profile / Security
│
└── VEGAN STORES
    ├── MapTiler Integration (Outdoor v4 & Geolocation)
    ├── Store Search / Nearby Stores
    └── Store Detail
```


## 6. Current Pages & Routes

| Page | Route | Purpose |
| :--- | :--- | :--- |
| **Home** | `/` (Member) / `/guest` | Landing page |
| **Login / Register** | `/login`, `/register` | Authentication |
| **Security** | `/security` | Account security & OTP |
| **Create / Edit Post**| `/create-post`, `/edit-post/:id` | Content creation |
| **Search** | `/search` | Search Posts & People |
| **Post Detail** | `/posts/:id` | View post content |
| **My Posts** | `/my-posts` | Tabbed view for My Posts & Saved Recipes |
| **Weekly Menu** | `/weekly-menu` | Tabbed view for Menu, Health Profile, and BMI |
| **Public Profile** | `/users/:username` | View another user's profile |
| **Vegan Stores** | `/vegan-stores` | Discover nearby stores (MapTiler Enabled) |
| **Store Detail** | `/vegan-stores/:id` | View store info (Blocked) |

## 7. Sprint 1 Function Status

*   **Authentication (Login/Register/Logout):** IMPLEMENTED
*   **Token Refresh Handling (Axios Interceptors):** IMPLEMENTED
*   **Create / Edit Post:** IMPLEMENTED (Including Multi-media Upload UI)
*   **Security Page (Password / Google OTP):** IMPLEMENTED
*   **Guest Home & Member Home:** IMPLEMENTED

## 8. Sprint 2 Function Status

| FN Code | Feature | Status | Notes |
| :--- | :--- | :--- | :--- |
| **FN09** | Search Posts | IMPLEMENTED | Tab-based UI |
| **FN10** | Search Users | IMPLEMENTED | Tab-based UI |
| **FN17** | Comments | UI IMPLEMENTED / BACKEND BLOCKED | |
| **FN18** | Like Post | IMPLEMENTED | Optimistic UI support |
| **FN19** | Save Post | IMPLEMENTED | |
| **FN20** | Saved Posts | IMPLEMENTED | Integrated inside My Posts |
| **FN21** | Public User Profile | IMPLEMENTED | *Protected route due to BE authorization constraints.* |
| **FN22** | Health Profile | IMPLEMENTED | Integrated inside Weekly Menu |
| **FN23** | Food Allergies | PARTIALLY IMPLEMENTED | *Custom allergies work. No BE master-list.* |
| **FN24** | Current BMI | IMPLEMENTED | Integrated inside Weekly Menu |
| **FN25** | BMI History | IMPLEMENTED | Integrated inside Weekly Menu |
| **FN26** | Weekly Menu | UI FOUNDATION / BACKEND BLOCKED | Houses Health & BMI tabs. Menu API is missing. |
| **FN27** | Find Nearby Stores | UI FOUNDATION / BACKEND BLOCKED | MapTiler SDK & Geolocation working. Store API missing. |
| **FN28** | Search Vegan Stores | UI FOUNDATION / BACKEND BLOCKED | Search UI built, API missing. |
| **FN29** | Vegan Store Detail | UI FOUNDATION / BACKEND BLOCKED | Skeleton layout built, API missing. |

## 9. Current User Flows

### A. SPRINT 1 FLOWS (Core & Auth)

**FLOW S1.1 — Authentication & Onboarding**
1. Guest → Login Page (`/login`) → Enter Credentials → Member Home (`/`)
2. Guest → Register Page (`/register`) → Enter Details & Full Name → Success → Login Page

**FLOW S1.2 — Content Creation (Create / Edit Post)**
1. Member → Click "Create Post" → Enter Title, Description, Ingredients, Steps
2. Upload Media → Select multiple images/videos → Preview active
3. Submit → Success → Redirect to My Posts / Post Detail
4. Edit Flow: My Posts → Edit Post (`/edit-post/:id`) → View Existing Media & New Media → Update → Save

**FLOW S1.3 — Account Security**
1. Member → Profile Menu → Security (`/security`)
2. Change Password: Enter Current Password + New Password → Save
3. Link/Unlink Google: Authenticate via OTP/OAuth → Success

### B. SPRINT 2 FLOWS (Extended Features)

**FLOW S2.1 — Recipe Discovery & Interaction**
1. User → Search (`/search`) → Search Recipes Tab → Select Recipe → Post Detail (`/posts/:id`)
2. From Post Detail → Click Like / Click Save 
3. *Comment Flow is currently BLOCKED by Backend API.*

**FLOW S2.2 — User Discovery**
1. User → Search (`/search`) → People Tab → Select User → Public User Profile (`/users/:username`)
2. Public Profile → View Published Posts → Post Detail

**FLOW S2.3 — Saved Recipes Management**
1. User → Post Detail → Save Recipe
2. User → Profile Menu → Saved Recipes (`/saved-posts`) → View List
3. User → Click Unsave → Recipe removed from saved list

**FLOW S2.4 — Health Profile Management**
1. Member → Profile Menu → Health (`/health`) → View Health Information
2. Edit Height, Weight, Activity Level → Save
3. Switch to Food Allergies Tab → Manage Custom Allergies → Save

**FLOW S2.5 — BMI Dashboard**
1. Member → Health Profile Menu → BMI Dashboard (`/health/bmi`)
2. View Current BMI → View BMI Category → View BMI History Chart
3. *Edge Case:* If Height/Weight are missing → Displays "Insufficient Health Data" → Button to update Health Profile.

**FLOW S2.6 — Vegan Store Discovery (BLOCKED)**
*Intended Flow:* User → Vegan Stores (`/vegan-stores`) → Search / View Nearby → Select Store → Store Detail (`/vegan-stores/:id`) → Get Directions.
*Current State:* UI structure exists, but flow stops at Empty/Blocked state due to missing Backend APIs (No Store Data, No Coordinates).

## 10. Navigation Map

Currently verified navigation relationships:
*   `Header` → `Home`
*   `Search` → `Recipe` → `Post Detail`
*   `Search` → `People` → `Public Profile`
*   `Profile Dropdown` → `Saved Recipes`
*   `Profile Dropdown` → `Health`
*   `Profile Dropdown` → `BMI Dashboard`
*   `Vegan Stores` → `Store Detail` (Layout verified)

## 11. Page Design Rules

All new pages must follow the existing VeganHelper visual system.
*   **General Rules:** Existing cream background, botanical green palette, consistent typography, card language, border radii.
*   **Health-related Pages:** Calm, clear, information-focused. Avoid excessive decoration and prioritize readability.
*   **Search/Content Pages:** Discovery-focused, strong recipe imagery, clear author/content hierarchy.
*   **Vegan Stores Pages:** Local discovery, clear map/list relationship, clear location information.

## 12. Loading / Empty / Error / Blocked States

Every data-driven page must support Loading, Empty, Error, Success, and Backend Blocked states where applicable.
*   **Public Profile:** User not found, No posts yet.
*   **Health:** Empty health profile, API error, Saving state.
*   **BMI:** Insufficient Health Data, No BMI history.
*   **Vegan Store Detail:** Store not found / API BLOCKED.

## 13. Data Integrity Rules

**NO MOCK DATA FOR BACKEND-DRIVEN FEATURES.**

The frontend must never fabricate:
*   Recipes / Users / Health data / BMI history
*   Store names / ratings / addresses / coordinates / opening hours / images
*   Allergy ingredient master lists

When backend functionality does not exist, the UI must:
1. Show a real empty state
2. Show a blocked state
3. Or leave the feature pending

Never simulate successful backend data.

## 14. Backend Dependencies / Blockers

1.  **Comments:** FN17 backend support is missing.
2.  **Food Allergy Ingredient Master List:** FN23 can use custom allergies, but dynamic ingredient IDs require a backend ingredient/allergy endpoint.
3.  **Public Profile Guest Access:** Current backend authorization prevents unauthenticated access to the user controller.
4.  **Vegan Stores:** Store controller/API is currently missing. FN27/FN28/FN29 cannot be considered fully integrated.
5.  **Weekly Menu:** Meal planner/menu endpoints are missing.

## 15. Remaining Sprint Scope

*(To be updated as the sprint progresses and backend APIs are unblocked).*
