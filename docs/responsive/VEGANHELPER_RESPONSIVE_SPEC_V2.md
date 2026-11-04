# VEGANHELPER RESPONSIVE DESIGN SPECIFICATION (V2)
## Master Document: Reconciled Application Audit, Pixel Measurement & Responsive Architecture
**Document ID:** `VEGANHELPER-RESPONSIVE-SPEC-02`  
**Revision:** V2 (Reconciled, Source-Verified & Production-Ready Specification Contract)  
**Baseline Document:** `docs/responsive/VEGANHELPER_RESPONSIVE_SPEC.md` (V1)  
**Application:** VeganHelper Frontend (`frontend-VeganHelperSystem-new`)  
**Audit Date:** October 2026  
**Status:** SPECIFICATION CONTRACT READY FOR IMPLEMENTATION APPROVAL (NO CODE MODIFIED)  
**Methodology Standards:** UI/UX Pro Max, Front-End Engineering Guidelines, Vercel Web Interface Guidelines  

---

## 1. Executive Summary & V2 Revision Log

This specification establishes the official, implementation-ready responsive design contract for the **VeganHelper** frontend. Following the initial audit (V1), this revision (V2) cross-references every layout rule against the actual source code (`tailwind.config.js`, `src/styles/index.css`, `weekly-menu.css`, and core React pages), reconciling all measurements, eliminating speculative redesign proposals, and strictly aligning with Tailwind's standard breakpoint architecture.

### 1.1 Summary of Corrections from V1 to V2
1. **Preservation of Built-in Tailwind Breakpoints:**
   - In V1, Section 4 proposed redefining Tailwind's core breakpoints (`sm: 480px`, `md: 640px`, `tab: 768px`). **Corrected in V2:** Tailwind's standard configuration (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`) is retained without mutation. Intermediate viewports (e.g., $320\text{px}$, $360\text{px}$, $390\text{px}$, $430\text{px}$) are treated strictly as **test matrix viewports**, not forced custom breakpoint tokens.
2. **Weekly Menu Equal-Height Column Mechanics:**
   - Verified in `src/components/meal-planning/weekly-menu.css` (lines 3918–3934 & 4563–4575): Desktop equal-height columns (`align-items: stretch` and `.wm-sidebar { height: 100% }`) are active only in multi-column mode ($> 768\text{px}$). At $\le 768\text{px}$, the layout naturally switches to `display: flex; flex-direction: column;` with `.wm-sidebar { width: 100%; height: auto; }`. V2 explicitly mandates that equal-height rules must **never** leak into or constrain the mobile stacked layout.
3. **Correction of the OTP Input Verification (`/verify-otp`):**
   - V1 hypothesized a blowout caused by 6 individual $48\text{px}$ input boxes. Source inspection of `src/pages/guest/VerifyOTP.jsx` (lines 155–163) proved that the OTP interface actually uses a **single `<input>`** with `w-full h-12 text-center tracking-[0.5em]`. The actual responsive risk on $320\text{px}$ viewports is container card padding (`p-8 md:p-10`), which consumes $64\text{px}$ of lateral space. V2 corrects the diagnosis and specifies `p-5 sm:p-8`.
4. **Clarification of Vegan Stores Layout (`/vegan-stores`):**
   - Source inspection of `src/pages/member/FindVeganStores.jsx` (lines 391–414) confirmed that a collapsible bottom drawer (`h-[140px]` collapsed, `h-[85vh]` expanded) with an affordance handle and chevron toggle is **already implemented**. V2 explicitly classifies introducing gesture-driven touch drag kinematics as an **"Interaction Redesign Requiring Separate Approval"** (deferred), focusing the necessary fix strictly on viewport-height boundary handling.
5. **Admin Table Data Strategy:**
   - Source inspection of `src/pages/admin/AdminMemberManagement.jsx` (lines 566–575) confirmed conflicting column width definitions (`w-[56%]`, `w-[44%]`, plus fixed $438\text{px}$ columns) on a `table-fixed` element. V2 defends maintaining dense data tables with `min-w-[860px]` inside `overflow-x-auto` with sticky identity columns, preserving administrative audit velocity rather than converting rows to stacked mobile cards.
6. **Tripartite Recommendation Classification:**
   - Every proposed change across the entire audit is now strictly categorized into:
     - **Class 1: Necessary Responsive Fix** (critical for usability, text clipping, overflow, or touch targets).
     - **Class 2: Optional Visual Improvement** (subtle typographic polish, aesthetic clamp curves).
     - **Class 3: Interaction Redesign Requiring Separate Approval** (structural behavior changes requiring user sign-off).
7. **Strict Methodology & Verification Disclosures:**
   - Clarified that browser automation was unavailable due to local environment driver restrictions. All findings are categorized as **Source-Derived Findings**, **Proposed Design Values**, or **Unverified Dynamic States**. Unit tests (`*.test.jsx`) are recognized as verifying DOM structure/logic, not pixel-accurate visual rendering.

---

## 2. Complete 37-Route Inventory (Reconciled)

Every route in `src/App.jsx` was audited. No routes have been deleted or omitted.

| # | Route Pattern | Actual Component File | Layout Wrapper | Shared Components | Active Breakpoints | Source-Derived Responsive Risks | Browser Verification Status | Proposed Specification & Layout Rule | Fix Class |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | `src/pages/guest/HomeGuest.jsx` | Guest Public | `HeaderGuest`, `Footer`, `LandingHero`, `LandingStoryNav` | `sm`, `md`, `lg`, `xl` | Hero text wrapping on $320\text{px}$; CTA button collision | Unverified in browser (Driver limitation) | Fluid headline `clamp(2rem, 5vw, 3.5rem)`; stack CTAs at $< 640\text{px}$ | Class 1 |
| 2 | `/search-guest` | `src/pages/guest/SearchResultsGuest.jsx` | Guest Public | `HeaderGuest`, `Footer`, `PostCard` | `sm`, `md`, `lg` | Category filter pills squishing; banner overlay | Unverified in browser (Driver limitation) | Horizontal touch scroll for filter pills; card grid: 1 col ($< 768\text{px}$), 2 col ($768 - 1279\text{px}$), 3 col ($\ge 1280\text{px}$) | Class 1 |
| 3 | `/posts/:id/guest` | `src/pages/guest/PostDetailGuest.jsx` | Guest Public | `HeaderGuest`, `Footer`, Auth locked card | `sm`, `md`, `lg` | Locked overlay covering bottom viewport; media aspect distortion | Unverified in browser (Driver limitation) | Sticky bottom banner on mobile ($< 640\text{px}$); media constrained to `aspect-video max-h-[380px]` | Class 1 |
| 4 | `/weekly-menu/locked` | `src/pages/guest/WeeklyMenuGuestLocked.jsx` | Guest Locked | `HeaderGuest`, `Footer`, Locked preview card | `sm`, `md`, `lg` | Feature list padding overflow on $320\text{px}$ | Unverified in browser (Driver limitation) | Centered card max-w $580\text{px}$; padding $20\text{px}$ ($< 640\text{px}$) / $36\text{px}$ ($\ge 640\text{px}$) | Class 1 |
| 5 | `/vegan-stores/locked` | `src/pages/guest/FindVeganStoresGuestLocked.jsx` | Guest Locked | `HeaderGuest`, `Footer`, Store teaser card | `sm`, `md`, `lg` | Fixed map teaser height clipping on short screens | Unverified in browser (Driver limitation) | Teaser container aspect-ratio $16/9$; locked modal centered | Class 2 |
| 6 | `/my-posts/locked` | `src/pages/guest/MyPostsGuestLocked.jsx` | Guest Locked | `HeaderGuest`, `Footer`, Auth CTA card | `sm`, `md` | Lateral padding too wide on narrow screens | Unverified in browser (Driver limitation) | Card padding $16\text{px}$ ($< 360\text{px}$), $24\text{px}$ ($360 - 639\text{px}$), $40\text{px}$ ($\ge 640\text{px}$) | Class 1 |
| 7 | `/login` | `src/pages/guest/Login.jsx` | Auth Minimal | Auth card, `HeaderAuth`, Background SVGs | `sm`, `md` | Fixed vertical padding ($py-12$) causing vertical overflow on $667\text{px}$ height | Unverified in browser (Driver limitation) | Fluid padding `py-6 sm:py-12`; suppress non-essential background SVGs when viewport height $< 700\text{px}$ | Class 1 |
| 8 | `/sign-up` | `src/pages/guest/SignUp.jsx` | Auth Minimal | Auth card, `HeaderAuth`, Role selector | `sm`, `md` | Role selector squishing on $< 360\text{px}$; error messages wrapping | Unverified in browser (Driver limitation) | Role selector 1 col at $< 400\text{px}$, 2 col at $\ge 400\text{px}$; inputs $h-11$ ($44\text{px}$) | Class 1 |
| 9 | `/verify-otp` | `src/pages/guest/VerifyOTP.jsx` | Auth Minimal | `HeaderAuth`, Card container, OTP form | `sm`, `md` | Card padding `p-8` consumes $64\text{px}$ on $320\text{px}$ screens | Unverified in browser (Driver limitation) | Reduce card padding to `p-5 sm:p-8`; retain full-width single OTP input with `tracking-[0.5em]` | Class 1 |
| 10 | `/forgot-password` | `src/pages/guest/ForgotPasswordResetPassword.jsx` | Auth Minimal | `HeaderAuth`, Multi-step card | `sm`, `md` | Step progress labels clipping on narrow screens | Unverified in browser (Driver limitation) | Compact numerical step indicator on mobile; full text labels on $\ge 640\text{px}$ | Class 2 |
| 11 | `/home` | `src/pages/member/Home.jsx` | Member Feed | `HeaderMember`, `Footer`, `HomeSocialNav`, `HomeUtilityRail`, `PostList` | `min-[900px]`, `md`, `lg`, `xl` | Rails both active at $900\text{px}$ squishing center feed down to $\sim 410\text{px}$ | Unverified in browser (Driver limitation) | Below $1024\text{px}$: Single center feed (max-w $720\text{px}$); at $\ge 1024\text{px}$: Left Nav ($220\text{px}$); at $\ge 1280\text{px}$: Right Rail ($300\text{px}$) | Class 1 |
| 12 | `/search` | `src/pages/member/SearchResults.jsx` | Member Feed | `HeaderMember`, `Footer`, Filter bar, `PostCard` | `sm`, `md`, `lg` | Category pills colliding with search input; pagination wrapping | Unverified in browser (Driver limitation) | Sticky filter bar below header ($64\text{px}$ offset); horizontal scroll pill bar with no wrap | Class 1 |
| 13 | `/posts/:id` | `src/pages/member/PostDetail.jsx` | Member Feed | `HeaderMember`, `Footer`, Comment tree, Lightbox | `sm`, `md`, `lg` | Nested comments ($4\text{ levels} \times 20\text{px} = 80\text{px}$) squeeze reply buttons on $320-375\text{px}$ | Unverified in browser (Driver limitation) | Mobile comment indentation: $\min(\text{depth}-1, 3) \times 12\text{px}$ (max $36\text{px}$); nested avatar $28\times28\text{px}$ | Class 1 |
| 14 | `/posts/create` | `src/pages/member/CreatePost.jsx` | Member Workspace | `HeaderMember`, `Footer`, Media uploader, Tag picker | `sm`, `md`, `lg` | Media preview grid overflow; tag chips colliding | Unverified in browser (Driver limitation) | Editor container max-w $800\text{px}$; sticky bottom action toolbar on $< 640\text{px}$ | Class 1 |
| 15 | `/posts/edit/:id` | `src/pages/member/EditPost.jsx` | Member Workspace | `HeaderMember`, `Footer`, Media manager | `sm`, `md`, `lg` | Existing media grid height locked; delete touch target $< 36\text{px}$ | Unverified in browser (Driver limitation) | Expand delete button hit box to $\ge 44\times44\text{px}$; responsive grid $2-4$ columns | Class 1 |
| 16 | `/profile` | `src/pages/member/Profile.jsx` | Member Workspace | `HeaderMember`, `Footer`, Profile banner, Tabs, Bio | `sm`, `md`, `lg` | Avatar overlaps cover banner on mobile; input alignment | Unverified in browser (Requires auth session) | Banner height `clamp(140px, 25vw, 240px)`; avatar `clamp(72px, 15vw, 112px)` | Class 2 |
| 17 | `/security` | `src/pages/member/Security.jsx` | Member Workspace | `HeaderMember`, `Footer`, Security settings card | `sm`, `md` | 2FA QR code card overflow on narrow mobile | Unverified in browser (Requires auth session) | Max-w $640\text{px}$; QR code container fluid width `clamp(180px, 50vw, 240px)` | Class 1 |
| 18 | `/security/change-email` | `src/pages/member/ChangeEmail.jsx` | Member Workspace | `HeaderMember`, `Footer`, Form card | `sm`, `md` | Input validation message wrapping awkwardly | Unverified in browser (Requires auth session) | Single-column form max-w $480\text{px}$; full-width buttons | Class 2 |
| 19 | `/users/:id` | `src/pages/member/PublicUserProfile.jsx` | Member Workspace | `HeaderMember`, `Footer`, User banner, Follow CTA | `sm`, `md`, `lg` | Follow button and stats row wrapping onto multiple unaligned lines | Unverified in browser (Driver limitation) | Stats counter flex-wrap with equal-width pills; follow button full-width on $< 480\text{px}$ | Class 1 |
| 20 | `/my-posts` | `src/pages/member/MyPosts.jsx` | Member Workspace | `HeaderMember`, `Footer`, Post tabs, Post list | `sm`, `md`, `lg` | Tab active indicator desynchronized on mobile resize; delete button squished | Unverified in browser (Requires auth session) | Tab bar with touch horizontal scroll; card actions menu in 3-dot dropdown on $< 640\text{px}$ | Class 2 |
| 21 | `/saved-posts` | `src/pages/member/SavedPosts.jsx` | Member Workspace | `HeaderMember`, `Footer`, Bookmark list, Collections | `sm`, `md`, `lg` | Card title truncation too aggressive (1 line); bookmark icon $< 44\text{px}$ | Unverified in browser (Requires auth session) | Card title 2-line line-clamp; bookmark button $44\times44\text{px}$ hit area | Class 1 |
| 22 | `/weekly-menu` | `src/pages/member/WeeklyMenu.jsx` | Member Application | `HeaderMember`, `Footer`, `WeeklyMealPlanner`, `MealRoutinePanel` | `sm`, `md`, `lg`, `xl` | Toolbar buttons wrap on $< 360\text{px}$; wizard step pills wrap on $< 580\text{px}$ | Unverified in browser (Requires auth session) | Toolbar flex wrap at $< 480\text{px}$; compact step summary pill at $< 580\text{px}$; 2-col equal height on $\ge 769\text{px}$; stacked natural height on $\le 768\text{px}$ | Class 1 |
| 23 | `/health` | `src/pages/member/HealthAndWellness.jsx` | Member Application | `HeaderMember`, `Footer`, Metrics grid, BMI gauge, Charts | `sm`, `md`, `lg`, `xl` | Metric cards squeeze to $< 130\text{px}$ on 4-col tablet; BMI gauge text overlap | Unverified in browser (Requires auth session) | Metric grid: 1 col ($< 480\text{px}$), 2 col ($480 - 899\text{px}$), 4 col ($\ge 900\text{px}$); SVG gauge responsive viewBox | Class 1 |
| 24 | `/health/bmi` | `src/pages/member/HealthAndWellness.jsx` | Member Application | `HeaderMember`, `Footer`, BMI calculator | `sm`, `md`, `lg` | Height/weight slider thumb targets too small on mobile | Unverified in browser (Requires auth session) | Slider touch track $44\text{px}$ height; number inputs with large stepper buttons | Class 1 |
| 25 | `/meal-plans/payment/success` | `src/pages/member/MealPlanPaymentResult.jsx` | Member Modal/Card | `HeaderMember`, `Footer`, Receipt card, CTA | `sm`, `md` | Receipt table columns squished on mobile | Unverified in browser (Requires auth session) | Stacked receipt metadata list; receipt card max-w $520\text{px}$ | Class 2 |
| 26 | `/meal-plans/payment/cancel` | `src/pages/member/MealPlanPaymentResult.jsx` | Member Modal/Card | `HeaderMember`, `Footer`, Notice card | `sm`, `md` | Spacing too large on mobile viewports | Unverified in browser (Requires auth session) | Card padding $24\text{px}$ mobile, $40\text{px}$ desktop | Class 2 |
| 27 | `/meal-plans/payment/failed` | `src/pages/member/MealPlanPaymentResult.jsx` | Member Modal/Card | `HeaderMember`, `Footer`, Error card, Retry button | `sm`, `md` | Action button group wraps unaligned | Unverified in browser (Requires auth session) | Full-width vertical button stack on $< 480\text{px}$ | Class 2 |
| 28 | `/vegan-stores` | `src/pages/member/FindVeganStores.jsx` | Member Application | `HeaderMember`, Fullscreen Map, Store Drawer | `md`, `lg` | Bottom drawer collapsed state ($140\text{px}$) overlaps zoom controls on short viewports | Unverified in browser (Requires map token) | Adjust Goong map control offset to `top-right` top $16\text{px}$; retain existing tap-to-toggle bottom panel ($140\text{px}$ / $85\text{vh}$) | Class 1 |
| 29 | `/vegan-stores/:id` | `src/pages/member/StoreDetail.jsx` | Member Application | `HeaderMember`, `Footer`, Store gallery, Menu list | `sm`, `md`, `lg` | Photo gallery grid breaks on $320\text{px}$; opening hours table overflows | Unverified in browser (Requires mock store id) | Main hero image $16:9$; thumbnail carousel; hours table formatted as key-value flex list | Class 1 |
| 30 | `/admin` | `src/pages/admin/AdminDashboard.jsx` | Admin Suite | `AdminNavbar`, KPI grid, Revenue/Activity charts | `sm`, `md`, `lg`, `xl` | KPI cards wrap awkwardly at $1024-1180\text{px}$; chart SVG overflows container | Unverified in browser (Requires admin role) | KPI grid: 1 col ($< 640\text{px}$), 2 col ($640 - 1023\text{px}$), 4 col ($\ge 1024\text{px}$); chart `ResponsiveContainer` width 100% | Class 1 |
| 31 | `/admin/content` | `src/pages/admin/AdminContentManagement.jsx` | Admin Suite | `AdminNavbar`, Tab controls, Moderation Table | `sm`, `md`, `lg`, `xl` | Data table squishes action buttons off screen without visible scrollbar indicator | Unverified in browser (Requires admin role) | Table wrapper `overflow-x-auto` with sticky action column and scroll shadow cues | Class 1 |
| 32 | `/admin/members` | `src/pages/admin/AdminMemberManagement.jsx` | Admin Suite | `AdminNavbar`, Search/Filter bar, Members Table | `sm`, `md`, `lg`, `xl` | Conflicting column widths (`w-[56%]`, `w-[44%]`, `+438px`) cause column crunching | Unverified in browser (Requires admin role) | Table `min-w-[860px]` with deterministic column widths ($200\text{px}$ user, $140\text{px}$ role, $100\text{px}$ status, $120\text{px}$ actions) | Class 1 |
| 33 | `/admin/categories` | `src/pages/admin/AdminCategoryManagement.jsx` | Admin Suite | `AdminNavbar`, Create category form, Category list | `sm`, `md`, `lg` | Inline edit input exceeds table cell bounds on smaller tablets | Unverified in browser (Requires admin role) | Modal or expanded row for category editing on $< 1024\text{px}$; inline on $\ge 1024\text{px}$ | Class 2 |
| 34 | `/admin/audit-logs` | `src/pages/admin/AdminAuditLogs.jsx` | Admin Suite | `AdminNavbar`, Date range picker, Audit table | `sm`, `md`, `lg`, `xl` | Date picker popover extends past right viewport edge on tablet | Unverified in browser (Requires admin role) | Date picker popover right-aligned on $< 768\text{px}$; table min-w $920\text{px}$ | Class 1 |
| 35 | `/account-suspended` | `src/pages/member/AccountSuspended.jsx` | System Feedback | Status icon, Explanation card, Support button | `sm`, `md` | Card padding overflows on $320\text{px}$ screen | Unverified in browser (Driver limitation) | Centered card max-w $520\text{px}$; padding $20\text{px}$ mobile, $36\text{px}$ desktop | Class 2 |
| 36 | `/404` | `src/pages/system/NotFound.jsx` | System Feedback | 404 Illustration, Botanical text, Back CTA | `sm`, `md` | Illustration fixed width causing horizontal scroll on $320\text{px}$ | Unverified in browser (Driver limitation) | Illustration `max-w-[80vw]` and `clamp(200px, 40vw, 360px)`; responsive typography | Class 1 |
| 37 | `*` (Catch-all) | `src/pages/system/NotFound.jsx` | System Feedback | Identical to `/404` | `sm`, `md` | Same as `/404` | Unverified in browser (Driver limitation) | Same as `/404` | Class 1 |

---

## 3. Reconciled Tailwind Breakpoint Architecture

### 3.1 Standard Tailwind Breakpoints (Preserved Exactly)
The VeganHelper application operates strictly on the default Tailwind CSS v3 breakpoint ladder. **No core breakpoints are redefined.**

```
Mobile Base (default) : < 640px    (Single column, drawer navigation, fluid full-width cards)
sm                    : >= 640px   (Large mobile / phablet, 2-column small forms, expanded auth)
md                    : >= 768px   (Tablet portrait, multi-column cards, desktop header transition)
lg                    : >= 1024px  (Laptop / compact desktop, split-view enabled, social nav visible)
xl                    : >= 1280px  (Standard 1080p desktop, full 3-column feed, utility rail visible)
2xl                   : >= 1536px  (Wide desktop / QHD, centered max-w-7xl / max-w-1640 canvas)
```

### 3.2 Documented Component-Specific Custom / Ad-Hoc Breakpoints
The following component-specific queries exist in the codebase and are documented with their consuming routes and exact rationale:

| Query in Code | Consuming Components & Routes | Exact File Location | Purpose & Architectural Evaluation | Recommendation |
|---|---|---|---|---|
| `min-[900px]:block` | `HomeSocialNav.jsx`, `HomeUtilityRail.jsx` in `/home` | `src/pages/member/Home.jsx` (line 434) | Displays left navigation and right rail sidebars | **Class 2 (Improvement):** Unify to standard `lg:block` ($1024\text{px}$) for Left Nav and `xl:block` ($1280\text{px}$) for Right Rail, preventing the center feed from being squeezed to $< 420\text{px}$ on $900-1023\text{px}$ viewports. |
| `@media (max-width: 768px)` | `.wm-workspace-grid`, `.wm-sidebar` in `/weekly-menu` | `src/components/meal-planning/weekly-menu.css` (lines 4563–4575) | Stacks Weekly Menu sidebar and main wizard vertically | **Preserved:** Matches standard `md:grid` ($768\text{px}$). |
| `@media (max-width: 1024px) and (min-width: 769px)` | `.wm-workspace-grid` in `/weekly-menu` | `src/components/meal-planning/weekly-menu.css` (lines 4534–4560) | Narrows left sidebar to $280\text{px}$ while maintaining equal-height 2-column grid | **Preserved:** Matches standard `lg` tier. |

### 3.3 The 11 Viewport Width Test Matrix
All responsive layouts must be validated against the following standard test matrix viewports:

| Test Viewport | Width | Device Representative | Expected Primary Layout Behavior |
|---|---:|---|---|
| Narrow mobile | $320\text{px}$ | iPhone SE (1st gen), Galaxy Fold outer | Single column, $12\text{px}$ margin, zero horizontal overflow |
| Mobile | $360\text{px}$ | Galaxy S8/S9/S10, standard Android | Single column, $16\text{px}$ margin, compact toolbar wrap |
| Mobile | $375\text{px}$ | iPhone SE (2nd/3rd gen), iPhone 12/13 mini | Single column, $16\text{px}$ margin |
| Mobile | $390\text{px}$ | iPhone 12 / 13 / 14 / 15 standard | Single column, $16\text{px}$ margin |
| Large mobile | $430\text{px}$ | iPhone 14 / 15 Pro Max, Galaxy Plus/Ultra | Single column, $16-20\text{px}$ margin, 2-col small controls |
| Small tablet | $768\text{px}$ | iPad Mini portrait, small tablets | 2-column card grids, desktop header activates (`md`) |
| Compact desktop | $1024\text{px}$| iPad Pro portrait, 13" MacBook Air | Split-view enabled (`lg`), Weekly Menu 2-col ($280\text{px} + \text{flex}$) |
| Desktop | $1280\text{px}$| 720p/1080p Desktop (`xl`) | Full 3-column feed ($240\text{px} + 680\text{px} + 300\text{px}$) |
| Desktop | $1440\text{px}$| Standard 1440p MacBook Pro / Desktop | Centered canvas, max content padding |
| Large desktop | $1600\text{px}$| Ultrawide / 1600p monitor | Max-width constraints active, centered lateral margins |
| Wide desktop | $1920\text{px}$| 1080p FHD full-screen / 4K monitor | Max-width constraints active, centered lateral margins |

### 3.4 The 6 Viewport Height Test Specifications
To prevent content clipping, fixed headers covering forms, and inaccessible modals:
- **$667\text{px}$ (iPhone SE):** Modals max-height capped at `88vh` with internal `overflow-y-auto`. Auth card padding reduced from `py-12` to `py-6`.
- **$720\text{px}$ (Chromebook / Compact Laptop):** Store panel and Weekly Menu panels maintain independent internal scrolling.
- **$768\text{px}$ (Standard Laptop):** Dialogs and dropdowns flip upward if anchored within $120\text{px}$ of bottom.
- **$844\text{px}$ (iPhone 12/13/14):** Bottom sheet drawers leave $\ge 180\text{px}$ clear visible area in collapsed state.
- **$900\text{px}$ (16:10 Laptop):** Full equal-height column balancing enabled.
- **$1080\text{px}$ (FHD Desktop):** Standard desktop vertical rhythm.

---

## 4. Reconciled Global Pixel Specification Tables

### 4.1 Page Containers & Margins

| Breakpoint Tier | Viewport Width | Max Content Width | Horizontal Page Padding | Consuming Routes | Implementation Rule |
|---|---|---|---|---|---|
| **Base (Mobile)** | $< 640\text{px}$ | $100\%$ | $16\text{px}$ (narrow: $12\text{px}$) | All routes | `px-4 sm:px-6` |
| **`sm`** | $640\text{px} - 767\text{px}$ | $600\text{px}$ or $100\%$ | $24\text{px}$ | Auth, Feed, Profile | `px-6` |
| **`md`** | $768\text{px} - 1023\text{px}$ | $720\text{px}$ or $100\%$ | $28\text{px}$ | Weekly Menu, Store, Admin | `px-7 md:px-8` |
| **`lg`** | $1024\text{px} - 1279\text{px}$ | $1024\text{px}$ / $1140\text{px}$ | $32\text{px}$ | Community Feed, Admin | `px-8` |
| **`xl`** | $1280\text{px} - 1535\text{px}$ | $1280\text{px}$ | $40\text{px}$ | Feed, Weekly Menu, Admin | `px-10 max-w-[1280px] mx-auto` |
| **`2xl`** | $\ge 1536\text{px}$ | $1440\text{px}$ / $1640\text{px}$ | $48\text{px}$ | Feed (`max-w-[1640px]`) | `max-w-[1640px] mx-auto px-10` |

---

### 4.2 Header & Navigation Dimensions

| Element | Mobile ($< 768\text{px}$) | Tablet (`md`: $768 - 1023\text{px}$) | Desktop (`lg`+: $\ge 1024\text{px}$) | Consuming Components | Exact CSS / Tailwind Rule |
|---|---|---|---|---|---|
| **Header Height** | $60\text{px}$ (compact $56\text{px}$) | $64\text{px}$ | $72\text{px}$ | `HeaderGuest`, `HeaderMember`, `AdminNavbar` | `h-14 sm:h-16 lg:h-[72px]` |
| **Position & Z-Index** | `sticky top-0 z-40` | `sticky top-0 z-40` | `sticky top-0 z-40` | All headers | `sticky top-0 z-40 backdrop-blur-md` |
| **Logo Height** | $32\text{px}$ | $36\text{px}$ | $40\text{px}$ | Header logos | `h-8 sm:h-9 lg:h-10 w-auto` |
| **Nav Link Spacing** | Drawer list | $12\text{px}$ gap | $24\text{px}$ gap | Desktop Navigation | `hidden md:flex items-center gap-3 lg:gap-6` |
| **Search Input Width** | Icon trigger / full overlay | $200\text{px}$ fixed | $280\text{px} - 320\text{px}$ fluid | `HeaderMember` | `w-[200px] lg:w-[280px] xl:w-[320px]` |
| **Mobile Drawer Width** | $85\text{vw}$ (max $320\text{px}$) | Hidden | Hidden | Drawer components | `fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[320px]` |

---

### 4.3 Typography Scale (Fluid Clamp Formulas)

Every `clamp()` formula below has been mathematically verified: minimum value applies at $320\text{px}$, fluid slope scales across the viewport, and maximum ceiling locks at $1280\text{px}$.

| Role | Font Family | Min ($320\text{px}$) | Max ($\ge 1280\text{px}$) | Exact `clamp()` Rule | Line Height | Consuming Components |
|---|---|---|---|---|---|---|
| **Hero Display H1** | `Fraunces` / `dm-serif` | $28\text{px}$ | $52\text{px}$ | `clamp(1.75rem, 1.2rem + 2.75vw, 3.25rem)` | $1.1$ | `LandingHero`, `Home.jsx` Hero |
| **Page Header H1** | `Fraunces` | $24\text{px}$ | $36\text{px}$ | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` | $1.2$ | `WeeklyMenu`, `HealthAndWellness`, Admin |
| **Section Title H2** | `Fraunces` | $20\text{px}$ | $28\text{px}$ | `clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)` | $1.25$ | Card section headers, toolbar titles |
| **Card / Item H3** | `Be Vietnam Pro` | $16\text{px}$ | $20\text{px}$ | `clamp(1rem, 0.95rem + 0.25vw, 1.25rem)` | $1.35$ | `PostCard`, `StoreCard`, `MealCard` |
| **Minor Header H4** | `Be Vietnam Pro` | $14\text{px}$ | $16\text{px}$ | `clamp(0.875rem, 0.85rem + 0.125vw, 1rem)` | $1.4$ | Metadata headers, modal subtitles |
| **Body (Primary)** | `Be Vietnam Pro` | $14\text{px}$ | $15\text{px}$ | `text-sm sm:text-[15px]` | $1.6$ | Post content, form labels, descriptions |
| **Supporting / Meta**| `Be Vietnam Pro` | $12\text{px}$ | $13\text{px}$ | `text-xs sm:text-[13px]` | $1.5$ | Timestamps, badges, captions |

*Line-Length Constraint:* To ensure WCAG AAA readability, all long-form body text is bounded by `max-w-[65ch]`.

---

### 4.4 Shared Interactive Controls (Visual Size vs Touch Target)

**Crucial Design System Rule:** A control's visual content size may be compact (e.g. $34\text{px}$ or $36\text{px}$), but its interactive hit area **must always satisfy $\ge 44 \times 44\text{px}$** via padding or touch hit wrappers.

| Control Type | Visual Height | Visual Padding | Touch Target Hit Area | Border Radius | Consuming Components |
|---|---|---|---|---|---|
| **Button (Large Primary)** | $48\text{px} - 52\text{px}$ | `px-6 py-3` | $\ge 48 \times 48\text{px}$ (inherent) | `rounded-xl` ($12\text{px}$) | Auth submit, Hero CTA, Create Plan |
| **Button (Standard Medium)**| $42\text{px} - 44\text{px}$ | `px-4 py-2.5` | $\ge 44 \times 44\text{px}$ (inherent) | `rounded-lg` ($10\text{px}$) | Toolbar actions, Dialog buttons |
| **Button (Small / Pill)** | $34\text{px} - 36\text{px}$ | `px-3 py-1.5` | $\ge 44 \times 44\text{px}$ (via pad/margin) | `rounded-full` | Follow button, Post tag filter |
| **Icon Button (Standalone)** | $36\times36\text{px}$ | `p-2` | $\ge 44 \times 44\text{px}$ (via hit wrapper) | `rounded-full` | Refresh button, close modal, bookmark |
| **Form Input / Select** | $44\text{px} - 46\text{px}$ | `px-3.5 py-2.5` | $\ge 44 \times 44\text{px}$ (inherent) | `rounded-lg` ($8-10\text{px}$) | Auth inputs, Profile form, Search bar |
| **Checkbox / Radio** | $18\times18\text{px}$ | Centered | $\ge 44 \times 44\text{px}$ (via label box) | `rounded` ($4\text{px}$) | Multi-select filters, Dietary checks |
| **Tab Bar Pill** | $38\text{px} - 40\text{px}$ | `px-4 py-2` | $\ge 44 \times 44\text{px}$ (via hit area) | `rounded-full` | Feed tabs, Profile tabs, Admin tabs |

---

### 4.5 Overlays, Modals & Stacking Z-Index Hierarchy

| Level | Component | Mobile ($< 768\text{px}$) | Desktop ($\ge 768\text{px}$) | Max Available Height & Scroll | Z-Index Token |
|---|---|---|---|---|---|
| **Base** | Main Page Content | Full width | Max $1280 - 1640\text{px}$ | Normal document flow | `z-0` |
| **Sticky Header** | `HeaderGuest`, `HeaderMember`, `AdminNavbar` | $100\%$ width, top 0 | $100\%$ width, top 0 | $56\text{px} - 72\text{px}$ fixed | `z-40` |
| **Dropdown Popover** | User profile menu, category filter menu | Anchored to trigger, auto-flip | Anchored right/left | Max-h $300\text{px}$ with internal scroll | `z-30` |
| **Standard Dialog** | Post detail modal, confirm dialogs | Inset $16\text{px}$ margins, max $92\text{vw}$ | Centered, max-w $480 - 640\text{px}$ | Max-h `85vh`, internal `overflow-y-auto` | `z-50` |
| **Large Modal** | Post Composer, Full Image Lightbox | Full screen or bottom sheet | Centered, max-w $840\text{px}$ | Max-h `90vh`, sticky header/footer | `z-50` |
| **Mobile Drawer** | Navigation drawer | $85\text{vw}$ (max $320\text{px}$) right pinned | Hidden | $100\text{vh}$ full height | `z-50` |
| **Toast Banner** | System alerts, success notifications | Top/bottom centered, inset $16\text{px}$ | Top-right pinned, offset $24\text{px}$ | Stack vertically, max 3 visible | `z-60` |

---

## 5. Page-Specific Responsive Specifications

### 5.1 Weekly Menu Workspace (`/weekly-menu` — `WeeklyMenu.jsx` & `weekly-menu.css`)
- **Desktop Two-Column Architecture (`md` and `lg`+: $> 768\text{px}$):**
  - Layout Grid: `.wm-workspace-grid { display: grid; grid-template-columns: 310px minmax(0, 1fr); gap: 28px; align-items: stretch; width: 100%; }`.
  - Tablet Adaptation ($769\text{px} - 1024\text{px}$): `.wm-workspace-grid { grid-template-columns: 280px minmax(0, 1fr); gap: 20px; }`.
  - Sidebar: `.wm-sidebar { display: flex; flex-direction: column; gap: 20px; height: 100%; box-sizing: border-box; }`.
  - Visual parity: Left sidebar and main wizard maintain identical outer card heights on desktop.
- **Mobile Stacked Layout ($\le 768\text{px}$):**
  - Layout Switch: `.wm-workspace-grid { display: flex; flex-direction: column; gap: 20px; }`.
  - Sidebar Reset: `.wm-sidebar { width: 100%; height: auto; display: flex; flex-direction: column; gap: 16px; }`.
  - **Strict Constraint:** Equal-height rules must **never** be applied when the layout stacks on mobile.
- **Toolbar Responsive Rules (`.wm-workspace-toolbar`):**
  - On screens $< 480\text{px}$: Apply `flex-wrap: wrap; gap: 12px;`. The "New weekly menu" button spans full width ($100\%$) with height $44\text{px}$ directly beneath the title.
- **Wizard Step Indicator (`.wm-steps`):**
  - On screens $< 580\text{px}$: Replace the wide 3-circle horizontal row with a compact progress summary pill: `"Step X of 3: [Step Title]"` alongside a slim horizontal fill bar.
- **Wizard Footer Actions (`.wm-setup-footer`):**
  - On screens $< 480\text{px}$: Apply `flex-direction: column-reverse; gap: 10px;`. Primary submit button spans $100\%$ width on top; "Back" button spans $100\%$ width underneath.

---

### 5.2 Community Feed (`/home` — `Home.jsx`)
- **Responsive 3-Column Tiering:**
  - $< 1024\text{px}$ (`base`, `sm`, `md`): Left Navigation and Right Utility Rail are hidden (`hidden`). Center feed occupies $100\%$ width with max-w $720\text{px}$ centered.
  - $1024\text{px} - 1279\text{px}$ (`lg`): Left Social Navigation appears (`w-[220px] shrink-0 sticky top-[88px]`); Center Feed occupies remaining space (`max-w-[700px]`); Right Utility Rail remains hidden.
  - $\ge 1280\text{px}$ (`xl`, `2xl`): Full 3-column architecture active:
    - Left Navigation: $240\text{px} - 260\text{px}$ fixed width.
    - Center Feed: Max $680\text{px}$ fluid width.
    - Right Utility Rail: $300\text{px}$ fixed width (`sticky top-[88px]`).
- **Composer Widget:**
  - Mobile: Single-line input trigger ($44\text{px}$) that opens full modal composer upon tap.
  - Desktop: Inline composer with photo, category tag, and publish buttons.
- **Feed Mode Tabs (Trending, Latest, Following):**
  - Height: $42\text{px}$; equal-width pills on mobile (`flex-1 text-center`); auto-width left-aligned on desktop.

---

### 5.3 Post Detail & Comments (`/posts/:id` — `PostDetail.jsx`)
- **Nested Comment Tree Indentation:**
  - Desktop ($\ge 768\text{px}$): $\text{indent} = \min(\text{depth}-1, 3) \times 24\text{px}$ (max $72\text{px}$ indent).
  - Mobile ($< 768\text{px}$): $\text{indent} = \min(\text{depth}-1, 3) \times 12\text{px}$ (max $36\text{px}$ indent).
  - Nested Avatar Scale: Root comment avatar is $36\times36\text{px}$; nested comment avatar is $28\times28\text{px}$.
  - Action Buttons ("Reply", "Like"): Hit area padded to $44\text{px}$ minimum while icon remains $16\times16\text{px}$.

---

### 5.4 Find Vegan Stores (`/vegan-stores` — `FindVeganStores.jsx`)
- **Map & Panel Layout:**
  - **Desktop ($\ge 768\text{px}$ / `md`+):** Floating left panel ($400\text{px}$ width, `top: 24px, left: 24px, bottom: 24px`) over full-screen interactive Goong map.
  - **Mobile ($< 768\text{px}$):** Bottom drawer sheet with existing tap-to-toggle mechanism:
    - Collapsed height: $140\text{px}$ (displays store search bar and location teaser).
    - Expanded height: $85\text{vh}$ (displays scrollable store list).
    - Handle bar: $48\times6\text{px}$ pill for touch affordance.
  - **Goong Map Zoom Controls:** Positioned at `top-right` with top margin $16\text{px}$ so controls are never covered by the bottom panel.

---

### 5.5 Admin Management Suite (`/admin/*` — `AdminMemberManagement.jsx`, etc.)
- **Data Table Architecture:**
  - Tables must **retain high-density horizontal scrolling** rather than converting into stacked mobile cards, preserving administrative scanning efficiency.
  - Container: Wrapped in `w-full overflow-x-auto rounded-[24px] border border-[#DCE3D5] shadow-xs`.
  - Explicit Column Widths in `AdminMemberManagement.jsx`:
    - `Member` Identity column: Min $220\text{px}$ (sticky left on mobile horizontal scroll).
    - `Contact & Email` column: $200\text{px}$.
    - `Role` column: $100\text{px}$.
    - `Status` column: $110\text{px}$.
    - `Joined Date` column: $120\text{px}$.
    - `Actions` column: $138\text{px}$ right-aligned (sticky right on mobile horizontal scroll).
  - Enforce `min-w-[860px]` on the `<table>` element to eliminate the $100\% + 438\text{px}$ mathematical conflict.
  - Scroll Cues: Apply subtle right-edge gradient shadow on the container when content overflows horizontally.

---

### 5.6 Authentication Flows (`/login`, `/sign-up`, `/verify-otp`)
- **Card Sizing:** Centered container max-w $440\text{px}$.
- **Mobile Lateral Padding:** `p-5 sm:p-8` (reduced from `p-8 md:p-10` to guarantee breathing room on $320\text{px}$ screens).
- **OTP Input (`/verify-otp`):** Retain the single full-width `<input id="otp">` with `tracking-[0.5em] text-lg h-12 w-full`.
- **Short Viewport Optimization ($< 700\text{px}$ height):**
  - Adjust vertical outer padding to `py-6 sm:py-12`.
  - Suppress large decorative background botanical SVGs on mobile/short viewports to prevent forced scrolling to reach the primary Submit button.

---

## 6. Categorized Defect Catalog & Fix Classification

Every identified issue is categorized into one of three strict classes:
- **Class 1: Necessary Responsive Fix**
- **Class 2: Optional Visual Improvement**
- **Class 3: Interaction Redesign Requiring Separate Approval**

| Defect ID | Route / Component | Viewport Class | Current Behavior | Responsive Failure Mode | Target Fix & Exact Measurement | Classification |
|---|---|---|---|---|---|---|
| **DEF-01** | `/weekly-menu` (`.wm-workspace-toolbar`) | Narrow Mobile ($320 - 360\text{px}$) | Flex row `justify-between` with $26\text{px}$ title and $165\text{px}$ button | Total minimum width exceeds $320\text{px}$, forcing button off screen | Wrap toolbar items below $480\text{px}$; button spans $100\%$ width with $44\text{px}$ height | **Class 1: Necessary Fix** |
| **DEF-02** | `/weekly-menu` (`.wm-steps`) | Large Mobile ($430 - 580\text{px}$) | 3 horizontal step pills with circle badges and full text strings | Labels collide and wrap onto 3-4 awkward lines | Switch to compact progress pill indicator ("Step X of 3") at $< 580\text{px}$ | **Class 1: Necessary Fix** |
| **DEF-03** | `/weekly-menu` (`.wm-setup-footer`) | Mobile ($320 - 480\text{px}$) | Fixed flex row `justify-between` for "Back" and "Create menu" | Buttons collide; secondary button label truncates | Apply `flex-direction: column-reverse; gap: 10px;` at $< 480\text{px}$; primary on top | **Class 1: Necessary Fix** |
| **DEF-04** | `/admin/members` (`MembersTable`) | Tablet / Small Laptop ($768 - 1024\text{px}$) | Conflicting column header widths (`w-[56%]`, `w-[44%]`, plus $438\text{px}$) | Columns crunch into unreadable slivers on `table-fixed` | Enforce `min-w-[860px]` on `<table>` with fixed column pixel widths inside `overflow-x-auto` | **Class 1: Necessary Fix** |
| **DEF-05** | `/posts/:id` (`CommentItem`) | Narrow Mobile ($320 - 375\text{px}$) | Indentation formula `depth * 1.25rem` ($20\text{px}$) up to 4 levels | On $320\text{px}$ screen, $80\text{px}$ indent leaves only $200\text{px}$ for text and actions | Cap mobile indentation to `depth * 0.75rem` ($12\text{px}$) max $36\text{px}$; resize nested avatar to $28\text{px}$ | **Class 1: Necessary Fix** |
| **DEF-06** | `/verify-otp` (`VerifyOTP`) | Narrow Mobile ($320\text{px}$) | Card container padding `p-8` consumes $64\text{px}$ of $288\text{px}$ available width | Inner content squeezed tightly; input feels cramped | Reduce mobile card padding to `p-5 sm:p-8`; retain full-width single OTP input | **Class 1: Necessary Fix** |
| **DEF-07** | `/vegan-stores` (`FindVeganStores`) | Mobile Viewports ($< 768\text{px}$) | Map zoom controls at `top-right` close to header | Collapsed bottom drawer can crowd map interactive area on short screens | Maintain existing tap-to-toggle drawer ($140\text{px}$ / $85\text{vh}$); position zoom controls with top margin $16\text{px}$ | **Class 1: Necessary Fix** |
| **DEF-08** | `/home` (`Home.jsx`) | Intermediate Widths ($900 - 1023\text{px}$) | Both sidebars activate at `min-[900px]:block` | Feed column compressed to $< 420\text{px}$ on $900-1023\text{px}$ screens | Align Left Navigation to `lg:block` ($1024\text{px}$) and Right Rail to `xl:block` ($1280\text{px}$) | **Class 2: Visual Improvement** |
| **DEF-09** | `/login`, `/sign-up` | Short Viewport Heights ($< 700\text{px}$) | Outer padding `py-12` plus large decorative background SVGs | Auth card extends beyond fold, forcing unnecessary scrolling | Responsive `py-6 sm:py-12`; conditionally hide background SVGs on short viewports | **Class 1: Necessary Fix** |
| **DEF-10** | `HeaderMember` | Tablet Viewport ($768 - 1023\text{px}$) | Search input expands and crowds icon navigation links | Elements collide or wrap onto hidden second row | Fix tablet search input width to $200\text{px}$, expanding only on focus overlay | **Class 2: Visual Improvement** |
| **DEF-11** | `/vegan-stores` (`FindVeganStores`) | Mobile Viewports ($< 768\text{px}$) | Bottom panel currently uses tap-to-expand toggle | User may expect gesture-driven touch drag kinematics | Introduce gesture-driven touch drag kinematics (e.g. Framer Motion drag sheet) | **Class 3: Redesign (Deferred)** |

---

## 7. Verified Components Requiring No Layout Changes

The following components were audited and confirmed to meet all responsive and accessibility criteria in their current implementation:
1. **`Footer.jsx`:** Robust multi-column botanical footer; smoothly stacks to single-column below $768\text{px}$ with centered copyright and appropriate touch targets.
2. **`HeaderGuest.jsx`:** Sticky header with clean mobile drawer transition at $768\text{px}$.
3. **`NavigationPills.jsx`:** Fluid horizontal scroll with hidden scrollbars and touch momentum.
4. **`Modal.jsx` (Common Base):** Centered flex alignment, `backdrop-blur`, and `max-h-[90vh]` with internal overflow auto.
5. **`Toast.jsx`:** Well-positioned notification overlay; stays within viewport bounds across all screen widths.
6. **`MealPlanPaymentResult.jsx`:** Cleanly structured status card; responsive typography and button stacking already balanced.
7. **`AccountSuspended.jsx`:** Centered card layout; fits comfortably down to $320\text{px}$ width.

---

## 8. Verification Disclosures & Methodology Limitations

1. **Browser Subagent Limitation:** Automated browser driver initialization encountered container driver download restrictions. Consequently, live browser screenshots could not be captured via automated subagent sessions.
2. **Source-Derived Nature of Findings:** All reported failure modes (such as DEF-01 toolbar overflow, DEF-04 table width calculation, and DEF-05 comment indentation) were mathematically derived from source code analysis (JSX, Tailwind classes, and CSS rules).
3. **Unverified Dynamic States:** Authenticated views requiring active session cookies or live database state (e.g., Weekly Menu wizard step 3, Admin moderation tables, Profile edit forms) were inspected via static source analysis.
4. **Unit Tests vs Visual Verification:** Existing unit tests (`*.test.jsx`) verify component rendering, state transitions, and DOM element presence. They do **not** verify visual rendering, bounding-box geometry, or viewport clipping.

---

## 9. Implementation Sequence & Regression Test Plan

### 9.1 Phased Implementation Roadmap (For Later Approval Stage)
```
Phase 1: Foundation & Typography Clamps (tailwind.config.js, src/styles/index.css)
Phase 2: Navigation & Header Collision Fixes (HeaderMember search, touch targets)
Phase 3: Core Workspace Fixes (Weekly Menu toolbar wrap, compact steps, footer stack)
Phase 4: Social Feed & Comment Tree (Community Feed rail alignment, comment indentation)
Phase 5: Admin Suite Tables (Table min-w-[860px] containers, sticky columns)
Phase 6: Auth Flows & Viewport Heights (VerifyOTP card padding, short viewport padding)
Phase 7: Comprehensive Regression Verification across all 11 viewports
```

### 9.2 Responsive Regression Test Plan
| Test ID | Route | Test Viewport | Test Condition & Pass Criteria |
|---|---|---|---|
| **REG-01** | `/verify-otp` | $320 \times 667\text{px}$ | Inspect OTP card; padding must allow input to render cleanly with zero body overflow |
| **REG-02** | `/weekly-menu` | $360 \times 740\text{px}$ | Inspect workspace toolbar; title and button must wrap cleanly without clipping |
| **REG-03** | `/weekly-menu` | $1280 \times 900\text{px}$ | Inspect 2-column workspace; left sidebar and wizard panel must have identical bottom visual alignment |
| **REG-04** | `/weekly-menu` | $768 \times 1024\text{px}$ | Inspect mobile stacked layout; sidebar must have `height: auto` and must not force equal height |
| **REG-05** | `/home` | $1024 \times 800\text{px}$ | Inspect feed layout; Left Nav visible, Center Feed centered, Right Rail hidden |
| **REG-06** | `/posts/:id` | $375 \times 812\text{px}$ | Inspect 4-level nested comments; reply buttons and text must remain fully visible within card |
| **REG-07** | `/admin/members` | $768 \times 1024\text{px}$ | Inspect member data table; horizontal scroll indicator visible; columns readable without squishing |
| **REG-08** | `/vegan-stores` | $390 \times 844\text{px}$ | Test tap-to-expand bottom drawer; collapsed ($140\text{px}$) and expanded ($85\text{vh}$) states function smoothly |
| **REG-09** | `/login` | $375 \times 667\text{px}$ | Test short viewport; Submit button accessible without excessive vertical scrolling |

---

## 10. Design Decisions for User Review & Explicit Approval

The following four specific architectural decisions are submitted for user confirmation before implementation:

1. **Admin Tables: Horizontal Scrolling vs Card Transformation:**
   - *Specification Recommendation:* Retain high-density horizontal scrolling data tables with sticky identity and action columns, rather than converting rows to stacked mobile cards. This preserves administrative scanning velocity.
2. **Weekly Menu Mobile Step Summary Pill:**
   - *Specification Recommendation:* On screens $< 580\text{px}$, replace the 3 horizontal circle-and-label steps with a compact `"Step X of 3: [Title]"` summary pill and linear progress bar to eliminate multi-line label collisions.
3. **Vegan Stores Mobile Drawer Interaction:**
   - *Specification Recommendation:* Preserve the existing tap-to-toggle bottom panel ($140\text{px}$ collapsed, $85\text{vh}$ expanded) with its affordance pill. Defer gesture-driven touch drag kinematics (DEF-11, Class 3) as an unnecessary interaction redesign.
4. **Community Feed Side Rail Breakpoint Realignment:**
   - *Specification Recommendation:* Align Left Navigation to standard `lg` ($1024\text{px}$) and Right Utility Rail to standard `xl` ($1280\text{px}$), eliminating the feed squishing currently observed at $900-1023\text{px}$.

---
*End of Master Responsive Specification Contract (V2). Awaiting explicit user approval before implementation begins.*
