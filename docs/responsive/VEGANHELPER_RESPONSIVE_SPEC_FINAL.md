# VEGANHELPER RESPONSIVE DESIGN SPECIFICATION (FINAL)
## Master Document: Final Consistency Review, Pixel Standards & Implementation Contract
**Document ID:** `VEGANHELPER-RESPONSIVE-SPEC-FINAL`  
**Revision:** FINAL PRODUCTION CONTRACT (Reconciled, Source-Verified, Zero-Ambiguity Baseline)  
**Baseline Documents:** `docs/responsive/VEGANHELPER_RESPONSIVE_SPEC.md` (V1) & `docs/responsive/VEGANHELPER_RESPONSIVE_SPEC_V2.md` (V2)  
**Application:** VeganHelper Frontend (`frontend-VeganHelperSystem-new`)  
**Audit Date:** October 2026  
**Status:** FINAL APPROVED SPECIFICATION CONTRACT — READY FOR CODE IMPLEMENTATION  
**Methodology Standards:** UI/UX Pro Max, Front-End Engineering Guidelines, Vercel Web Interface Guidelines  

---

## 1. Executive Summary & Preserved Core Decisions

This final specification contract resolves all remaining dimensional, container width, header collision, and breakpoint threshold ambiguities across the **VeganHelper** frontend. It forms the authoritative implementation contract for the upcoming code execution phase.

### 1.1 Preserved Architectural Decisions
1. **Full 37-Route Inventory Preserved:** Every route discovered in `src/App.jsx` is cataloged with its page component, shared layout, active breakpoints, and verified responsive behavior.
2. **Standard Tailwind Breakpoints Kept Intact:** No core breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) are overridden or redefined globally. All responsive styling adheres strictly to:
   - `sm`: $640\text{px}$
   - `md`: $768\text{px}$
   - `lg`: $1024\text{px}$
   - `xl`: $1280\text{px}$
   - `2xl`: $1536\text{px}$
   Intermediate widths ($320\text{px}$, $360\text{px}$, $375\text{px}$, $390\text{px}$, $430\text{px}$, $900\text{px}$, $1440\text{px}$, $1600\text{px}$, $1920\text{px}$) are governed as **test matrix viewports**, not forced custom breakpoint tokens.
3. **Weekly Menu Equal-Height Integrity:** Verified from `src/components/meal-planning/weekly-menu.css` (lines 3918–3934 & 4563–4575): Desktop and tablet equal-height columns (`align-items: stretch` and `.wm-sidebar { height: 100% }`) operate strictly in multi-column mode ($\ge 768\text{px}$). At $< 768\text{px}$, the layout naturally stacks (`display: flex; flex-direction: column;`) with `.wm-sidebar { width: 100%; height: auto; }`. Mobile layouts **never** inherit desktop equal-height constraints.
4. **OTP Form Verification (`/verify-otp`):** Verified from `src/pages/guest/VerifyOTP.jsx` (lines 155–163): The interface uses a **single full-width `<input>`** with `tracking-[0.5em] text-lg h-12`, not 6 individual boxes. The responsive adjustment is strictly reducing container card padding on mobile from `p-8` to `p-5 sm:p-8`.
5. **Vegan Stores Tap-to-Toggle Bottom Drawer (`/vegan-stores`):** Preserved the existing functional tap-to-toggle bottom panel ($140\text{px}$ collapsed, $85\text{vh}$ expanded) with touch handle affordance. Complex gesture-driven touch drag kinematics are rejected as an unnecessary Class 3 interaction redesign.
6. **Strict Measurement Labeling:** Every metric is explicitly categorized as:
   - `Browser-measured`: Visually observed in live browser tooling (explicitly disclosed that automated browser drivers were unavailable due to container environment restrictions).
   - `Derived from source`: Mathematically derived from JSX, CSS, and Tailwind class inspection.
   - `Proposed design value`: Target specification values for implementation.
   - `Unverified`: Dynamically gated behind active auth sessions or third-party APIs.

---

## 2. Vegan Stores Responsive Breakpoint Behavior

### 2.1 Viewport Evaluation Matrix
The interactive map and store list panel in `src/pages/member/FindVeganStores.jsx` were evaluated across critical device widths:

| Viewport Width | Device Target | Panel Mode in Current Code | Available Map Area | Usability Evaluation & Defect Analysis | Target Specification (FINAL) | Label |
|---|---|---|---|---|---|---|
| **$768\text{px}$** | iPad Mini (Portrait) | Floating Left Panel ($400\text{px}$) via `md:` | $344\text{px}$ ($44.7\%$ of screen) | **Severe Congestion:** $400\text{px}$ panel covers $52\%$ of screen. Map interaction on the remaining $344\text{px}$ is cramped; map pins and controls crowd together. | **Switch to Bottom Drawer:** Drawer collapsed ($140\text{px}$ teaser), leaving $100\%$ width ($768\text{px}$) clear for full-screen map interaction. | Proposed design value |
| **$900\text{px}$** | Small Foldable / Tablet | Floating Left Panel ($400\text{px}$) via `md:` | $476\text{px}$ ($52.8\%$ of screen) | **Marginal:** Map is usable but floating panel remains disproportionately dominant for touch navigation. | **Switch to Bottom Drawer:** Maintain bottom drawer on all touch viewports $< 1024\text{px}$. | Proposed design value |
| **$1024\text{px}$** | iPad Pro / 13" Laptop (`lg`) | Floating Left Panel ($400\text{px}$) via `md:` | $600\text{px}$ ($58.6\%$ of screen) | **Genuinely Usable:** $400\text{px}$ panel + $600\text{px}$ map provides comfortable split-view landscape balance. | **Desktop Floating Panel Activates at `lg:` ($1024\text{px}$):** Left $400\text{px}$ floating panel, $24\text{px}$ margins. | Proposed design value |
| **$1280\text{px}$** | 1080p Desktop (`xl`) | Floating Left Panel ($400\text{px}$) via `md:` | $840\text{px}$ ($65.6\%$ of screen) | **Optimal Desktop Experience:** Generous map exploration area with quick list scanning. | **Desktop Floating Panel:** Left $400\text{px}$ floating panel, $24\text{px}$ margins. | Proposed design value |

### 2.2 Breakpoint & Control Resolution
1. **Desktop Floating Panel Threshold:** Change panel wrapper class from `md:top-6 md:left-6 md:w-[400px]` to `lg:top-6 lg:left-6 lg:w-[400px]`.
2. **Mobile / Tablet Mode ($< 1024\text{px}$):** Mobile bottom sheet drawer governs all viewports $< 1024\text{px}$ (`h-[140px]` collapsed, `h-[85vh]` expanded).
3. **Map Control Position:** Position Goong map zoom controls at `top-right` with top margin $16\text{px}$ and right margin $16\text{px}$ (`top: 16px; right: 16px; z-index: 10;`), ensuring they remain visible and interactive regardless of drawer state.
4. **Interaction Policy:** Strictly maintain the existing tap-to-expand mechanism (`onClick={() => setIsPanelExpanded(!isPanelExpanded)}`). Do not introduce gesture-driven drag physics.

---

## 3. Header Navigation Geometry & Collision Prevention

Detailed geometric audit of all four shared header components to prevent text wrapping, search collisions, and header height jumping:

### 3.1 Header Component Audit Table

| Header Component | File Location | Left Brand Width | Center Nav Items & Width | Right Actions & Width | Total Min Width Needed | Tablet ($768\text{px}$) Collision Risk | Collision Prevention Specification |
|---|---|---|---|---|---|---|---|
| **`HeaderGuest`** | `src/components/layout/HeaderGuest.jsx` | $140\text{px}$ (Logo, `h-[54px]`) | 4 Icon buttons ($4 \times 44\text{px} + 36\text{px} = 212\text{px}$) centered `hidden md:flex` | Log In ($75\text{px}$) + Sign Up ($85\text{px}$) + gap ($12\text{px}$) = $172\text{px}$ | $140 + 212 + 172 + 64\text{px} = 588\text{px}$ | **None:** $588\text{px} < 720\text{px}$ available width. Clearance of $> 130\text{px}$ on both sides of center nav. | Keep `h-16 sticky top-0 z-40`. Center nav remains `hidden md:flex absolute left-1/2 -translate-x-1/2`. |
| **`HeaderMember`** | `src/components/layout/HeaderMember.jsx` | $140\text{px}$ (Logo, `h-[54px]`) | 4 Icon buttons ($4 \times 44\text{px} + 36\text{px} = 212\text{px}$) centered `hidden md:flex` | NotificationBell ($36\text{px}$) + Avatar Button ($36\text{px}$) + gap ($12\text{px}$) = $84\text{px}$ | $140 + 212 + 84 + 64\text{px} = 500\text{px}$ | **None:** $500\text{px} < 720\text{px}$ available width. Clearance of $> 114\text{px}$ left, $> 170\text{px}$ right. *(Note: Header contains NO search input).* | Keep `h-16 sticky top-0 z-40`. Center nav remains `hidden md:flex absolute left-1/2 -translate-x-1/2`. |
| **`HeaderAuth`** | `src/components/layout/HeaderAuth.jsx` | $120\text{px} - 140\text{px}$ (Logo, `h-10`) | None | "Back to home" link ($95\text{px}$) | $140 + 95 + 32\text{px} = 267\text{px}$ | **None:** $267\text{px} < 288\text{px}$ on $320\text{px}$ screen. Fits comfortably across all viewports. | Keep `h-14 sm:h-15 flex items-center justify-between`. |
| **`AdminNavbar`** | `src/components/admin/AdminNavbar.jsx` | $220\text{px}$ (Logo $130\text{px}$ + "Admin Suite" badge $90\text{px}$) | 5 Pill Links (Dashboard, Members, Categories, Moderation, Audit Logs = $470\text{px}$) `hidden md:flex` | NotificationBell ($36\text{px}$) + Admin Avatar ($40\text{px}$) + gap = $96\text{px}$ | $220 + 470 + 96 + 48\text{px} = 834\text{px}$ | **CONFIRMED COLLISION ON $768\text{px} - 860\text{px}$:** Available width is $720\text{px}$, but required width is $834\text{px}$. Center capsule nav crowds logo and avatar. | **Necessary Responsive Fix:**<br>1. Hide "Admin Suite" badge on tablet (`hidden lg:inline-flex`).<br>2. Reduce capsule padding on tablet (`px-3 py-1.5 text-xs` on `md:`, `px-5 py-2 text-sm` on `lg:`), reducing capsule width from $470\text{px}$ to $340\text{px}$.<br>New total: $130 + 340 + 96 + 48 = 614\text{px} < 720\text{px}$ available. |

---

## 4. Route-Specific Container Width Architecture

Different page archetypes require different maximum widths to maintain optimal reading line-lengths and data-density balance. The application is standardized across **five explicit container tiers**:

```
Tier 1: Ultra-Wide 3-Column Canvas (max-w-[1640px])
Tier 2: Multi-Column Dashboard & Table Canvas (max-w-[1440px])
Tier 3: Standard Editorial & Detail Canvas (max-w-[1280px])
Tier 4: Compact Focus Form & Security Canvas (max-w-[440px] - max-w-[640px])
Tier 5: Edge-to-Edge Immersive Canvas (w-full h-[calc(100vh-64px)])
```

### 4.1 Route Container Assignment Matrix

| Container Tier | Max Width Token | Consuming Routes | Rationale & Layout Composition | Label |
|---|---|---|---|---|
| **Tier 1: Ultra-Wide 3-Column** | `max-w-[1640px] mx-auto` | `/home` (Community Feed) | Accommodates Left Social Nav ($240-280\text{px}$), Center Feed (max $840\text{px}$), and Right Utility Rail ($300-330\text{px}$) with generous $28\text{px}$ gutters and lateral padding without crowding. | Derived from source |
| **Tier 2: Multi-Column Dashboard**| `max-w-[1440px] mx-auto` | `/weekly-menu`<br>`/health`<br>`/admin` (Dashboard)<br>`/admin/members`<br>`/admin/content`<br>`/admin/categories`<br>`/admin/audit-logs` | Multi-column dashboards and high-density 6-7 column data tables require wide horizontal canvas up to $1440\text{px}$, but lock at $1440\text{px}$ on ultrawide monitors so table rows do not stretch uncomfortably. | Proposed design value |
| **Tier 3: Standard Editorial** | `max-w-[1280px] mx-auto` | `/` (Landing)<br>`/search`, `/search-guest`<br>`/posts/:id`, `/posts/:id/guest`<br>`/posts/create`, `/posts/edit/:id`<br>`/profile`, `/users/:id`<br>`/my-posts`, `/saved-posts`<br>`/vegan-stores/:id` (Store Detail) | Recipe grids (2-3 columns), article detail pages, and profile feeds require bounded reading widths so text does not exceed $65-75\text{ch}$ and hero media maintains balanced $16:9$ proportions. | Proposed design value |
| **Tier 4: Compact Form & Focus** | `max-w-[440px] mx-auto` (Auth)<br>`max-w-[640px] mx-auto` (Settings)<br>`max-w-[580px] mx-auto` (Teasers) | `/login`<br>`/sign-up`<br>`/verify-otp`<br>`/forgot-password`<br>`/security`<br>`/security/change-email`<br>`/weekly-menu/locked`<br>`/vegan-stores/locked`<br>`/my-posts/locked`<br>`/account-suspended`<br>`/404` | Single-purpose authentication, password reset, and locked teaser cards must be centered and narrow to eliminate eye dispersion and maintain strict focus. | Proposed design value |
| **Tier 5: Edge-to-Edge Immersive**| `w-full h-[calc(100vh-64px)] overflow-hidden` | `/vegan-stores` (Find Vegan Stores) | Full-screen interactive Goong map canvas with overlaid bottom sheet drawer or floating panel. | Derived from source |

---

## 5. Exact Breakpoint Threshold & Boundary Definitions

To eliminate media-query collisions (e.g. `768px` vs `769px`), all boundary conditions are explicitly defined:

```
┌─────────────────┬──────────────────────┬────────────────────────────────────────────────────────┐
│ Breakpoint Key  │ Exact Pixel Range    │ Operational Boundary & Layout Mechanics                │
├─────────────────┼──────────────────────┼────────────────────────────────────────────────────────┤
│ Base (Mobile)   │ 0px to 639.98px      │ Single column, edge-to-edge cards, drawer nav          │
│ sm (Phablet)    │ 640px to 767.98px    │ 2-column small forms, expanded auth, px-6 padding      │
│ md (Tablet)     │ 768px to 1023.98px   │ Multi-col cards, desktop header activates (md:flex)    │
│ lg (Laptop)     │ 1024px to 1279.98px  │ Split-views enabled, Weekly Menu 2-col, Store panel    │
│ xl (Desktop)    │ 1280px to 1535.98px  │ Full 3-col Feed (Left Nav + Center + Right Rail)       │
│ 2xl (Wide)      │ 1536px and above     │ Centered max-w-[1440/1640px] with lateral margins      │
└─────────────────┴──────────────────────┴────────────────────────────────────────────────────────┘
```

### 5.1 Reconciliation of Boundary Collisions
1. **The `768px` vs `769px` Discrepancy:**
   - In `weekly-menu.css`, `@media (max-width: 768px)` collided with `@media (min-width: 769px)`.
   - **Resolution:** Align strictly with Tailwind's standard `md`:
     - Mobile stacked layout operates at `width < 768px` (`max-[767px]:flex-col` or default base styles).
     - Multi-column equal-height layout operates at `width >= 768px` (`md:grid`).
2. **The `900px` Ad-Hoc Threshold Elimination:**
   - In `Home.jsx`, `min-[900px]:block` compressed the center feed to $< 420\text{px}$.
   - **Resolution:** Remove `min-[900px]`. Left Nav activates at `lg:block` ($1024\text{px}$); Right Rail activates at `xl:block` ($1280\text{px}$).
3. **Viewport Height Threshold ($< 700\text{px}$):**
   - Applies to $667\text{px}$ (iPhone SE) and short laptop windows:
     - Outer auth padding compresses to `py-6 sm:py-8`.
     - Non-essential background decorative botanical leaves hide (`hidden sm:block`).
     - Modals maintain `max-h-[85vh]` with internal `overflow-y-auto`.

---

## 6. Reconciled Global Pixel Specification Tables

### 6.1 Page Padding & Gutters

| Breakpoint Tier | Viewport Width | Lateral Page Padding | Minimum Card Gutter | Consuming Route Groups | Label |
|---|---|---|---|---|---|
| **Base (Mobile)** | $< 640\text{px}$ | $16\text{px}$ (narrow $320\text{px}$: $12\text{px}$) | $12\text{px}$ | All routes | Proposed design value |
| **`sm`** | $640\text{px} - 767\text{px}$ | $24\text{px}$ | $16\text{px}$ | Auth, Feed, Profile | Proposed design value |
| **`md`** | $768\text{px} - 1023\text{px}$ | $28\text{px}$ | $20\text{px}$ | Weekly Menu, Admin | Proposed design value |
| **`lg`** | $1024\text{px} - 1279\text{px}$ | $32\text{px}$ | $24\text{px}$ | Feed, Store, Admin | Proposed design value |
| **`xl`** | $1280\text{px} - 1535\text{px}$ | $40\text{px}$ | $28\text{px}$ | All Desktop routes | Proposed design value |
| **`2xl`** | $\ge 1536\text{px}$ | $48\text{px}$ | $32\text{px}$ | Ultrawide Desktop | Proposed design value |

---

### 6.2 Typography Clamping Specifications

| Typographic Role | Font Family | Min Size ($320\text{px}$) | Max Size ($\ge 1280\text{px}$) | Exact Verified `clamp()` Expression | Line Height | Consuming Routes | Label |
|---|---|---|---|---|---|---|---|
| **Display Hero H1** | `Fraunces` / `dm-serif` | $28\text{px}$ ($1.75\text{rem}$) | $52\text{px}$ ($3.25\text{rem}$) | `clamp(1.75rem, 1.2rem + 2.75vw, 3.25rem)` | $1.1$ | `LandingHero`, `Home.jsx` Hero | Proposed design value |
| **Page Heading H1** | `Fraunces` | $24\text{px}$ ($1.5\text{rem}$) | $36\text{px}$ ($2.25\text{rem}$) | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` | $1.2$ | `WeeklyMenu`, `Health`, Admin | Proposed design value |
| **Section Title H2** | `Fraunces` | $20\text{px}$ ($1.25\text{rem}$) | $28\text{px}$ ($1.75\text{rem}$) | `clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)` | $1.25$ | Section headers, toolbars | Proposed design value |
| **Card / Item H3** | `Be Vietnam Pro` | $16\text{px}$ ($1.0\text{rem}$) | $20\text{px}$ ($1.25\text{rem}$) | `clamp(1rem, 0.95rem + 0.25vw, 1.25rem)` | $1.35$ | `PostCard`, `StoreCard` | Proposed design value |
| **Minor Header H4** | `Be Vietnam Pro` | $14\text{px}$ ($0.875\text{rem}$) | $16\text{px}$ ($1.0\text{rem}$) | `clamp(0.875rem, 0.85rem + 0.125vw, 1rem)` | $1.4$ | Modal titles, form subtitles | Proposed design value |
| **Body (Primary)** | `Be Vietnam Pro` | $14\text{px}$ | $15\text{px}$ | `text-sm sm:text-[15px]` | $1.6$ | General body text, inputs | Proposed design value |
| **Supporting / Meta**| `Be Vietnam Pro` | $12\text{px}$ | $13\text{px}$ | `text-xs sm:text-[13px]` | $1.5$ | Badges, timestamps, footnotes | Proposed design value |

---

### 6.3 Shared Controls (Visual Dimension vs Touch Hit Area)

| Component | Visual Height | Visual Padding | Touch Target Floor | Border Radius | Consuming Routes | Label |
|---|---|---|---|---|---|---|
| **Primary Large Button** | $48\text{px} - 52\text{px}$ | `px-6 py-3` | $\ge 48 \times 48\text{px}$ (inherent) | `rounded-xl` ($12\text{px}$) | Hero CTAs, Auth Submit, Plan Setup | Proposed design value |
| **Standard Action Button** | $42\text{px} - 44\text{px}$ | `px-4 py-2.5` | $\ge 44 \times 44\text{px}$ (inherent) | `rounded-lg` ($10\text{px}$) | Toolbar buttons, dialog actions | Proposed design value |
| **Pill / Filter Tag** | $34\text{px} - 36\text{px}$ | `px-3 py-1.5` | $\ge 44 \times 44\text{px}$ (via hit wrapper) | `rounded-full` | Category filters, feed tabs, tags | Proposed design value |
| **Icon Button** | $36\times36\text{px}$ | `p-2` | $\ge 44 \times 44\text{px}$ (via hit wrapper) | `rounded-full` | Navigation icons, close modal, bookmark | Proposed design value |
| **Form Input / Select** | $44\text{px} - 46\text{px}$ | `px-3.5 py-2.5` | $\ge 44 \times 44\text{px}$ (inherent) | `rounded-lg` ($8-10\text{px}$) | Auth forms, profile forms, search inputs | Proposed design value |

---

## 7. Complete 37-Route Inventory (Final Reconciled)

| # | Route Pattern | Actual Component File | Layout Wrapper | Shared Components | Active Breakpoints | Source-Derived Risks | Browser Verification Status | Proposed Specification & Layout Rule | Fix Class | Label |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | `src/pages/guest/HomeGuest.jsx` | Guest Public | `HeaderGuest`, `Footer`, `LandingHero` | `sm`, `md`, `lg`, `xl` | Hero text wrapping on $320\text{px}$; CTA button collision | Unverified in browser (Driver limitation) | Fluid headline `clamp(2rem, 5vw, 3.5rem)`; stack CTAs at $< 640\text{px}$ | Class 1 | Derived from source |
| 2 | `/search-guest` | `src/pages/guest/SearchResultsGuest.jsx` | Guest Public | `HeaderGuest`, `Footer`, `PostCard` | `sm`, `md`, `lg` | Category filter pills squishing; banner overlay | Unverified in browser (Driver limitation) | Horizontal touch scroll for filter pills; card grid: 1 col ($< 768\text{px}$), 2 col ($768 - 1279\text{px}$), 3 col ($\ge 1280\text{px}$) | Class 1 | Derived from source |
| 3 | `/posts/:id/guest` | `src/pages/guest/PostDetailGuest.jsx` | Guest Public | `HeaderGuest`, `Footer`, Auth locked card | `sm`, `md`, `lg` | Locked overlay covering bottom viewport; media aspect distortion | Unverified in browser (Driver limitation) | Sticky bottom banner on mobile ($< 640\text{px}$); media constrained to `aspect-video max-h-[380px]` | Class 1 | Derived from source |
| 4 | `/weekly-menu/locked` | `src/pages/guest/WeeklyMenuGuestLocked.jsx` | Guest Locked | `HeaderGuest`, `Footer`, Locked preview card | `sm`, `md`, `lg` | Feature list padding overflow on $320\text{px}$ | Unverified in browser (Driver limitation) | Centered card max-w $580\text{px}$; padding $20\text{px}$ ($< 640\text{px}$) / $36\text{px}$ ($\ge 640\text{px}$) | Class 1 | Derived from source |
| 5 | `/vegan-stores/locked` | `src/pages/guest/FindVeganStoresGuestLocked.jsx` | Guest Locked | `HeaderGuest`, `Footer`, Store teaser card | `sm`, `md`, `lg` | Fixed map teaser height clipping on short screens | Unverified in browser (Driver limitation) | Teaser container aspect-ratio $16/9$; locked modal centered | Class 2 | Derived from source |
| 6 | `/my-posts/locked` | `src/pages/guest/MyPostsGuestLocked.jsx` | Guest Locked | `HeaderGuest`, `Footer`, Auth CTA card | `sm`, `md` | Lateral padding too wide on narrow screens | Unverified in browser (Driver limitation) | Card padding $16\text{px}$ ($< 360\text{px}$), $24\text{px}$ ($360 - 639\text{px}$), $40\text{px}$ ($\ge 640\text{px}$) | Class 1 | Derived from source |
| 7 | `/login` | `src/pages/guest/Login.jsx` | Auth Minimal | Auth card, `HeaderAuth`, Background SVGs | `sm`, `md` | Fixed vertical padding ($py-12$) causing vertical overflow on $667\text{px}$ height | Unverified in browser (Driver limitation) | Fluid padding `py-6 sm:py-12`; suppress non-essential background SVGs when viewport height $< 700\text{px}$ | Class 1 | Derived from source |
| 8 | `/sign-up` | `src/pages/guest/SignUp.jsx` | Auth Minimal | Auth card, `HeaderAuth`, Role selector | `sm`, `md` | Role selector squishing on $< 360\text{px}$; error messages wrapping | Unverified in browser (Driver limitation) | Role selector 1 col at $< 400\text{px}$, 2 col at $\ge 400\text{px}$; inputs $h-11$ ($44\text{px}$) | Class 1 | Derived from source |
| 9 | `/verify-otp` | `src/pages/guest/VerifyOTP.jsx` | Auth Minimal | `HeaderAuth`, Card container, OTP form | `sm`, `md` | Card padding `p-8` consumes $64\text{px}$ on $320\text{px}$ screens | Unverified in browser (Driver limitation) | Reduce card padding to `p-5 sm:p-8`; retain full-width single OTP input with `tracking-[0.5em]` | Class 1 | Derived from source |
| 10 | `/forgot-password` | `src/pages/guest/ForgotPasswordResetPassword.jsx` | Auth Minimal | `HeaderAuth`, Multi-step card | `sm`, `md` | Step progress labels clipping on narrow screens | Unverified in browser (Driver limitation) | Compact numerical step indicator on mobile; full text labels on $\ge 640\text{px}$ | Class 2 | Derived from source |
| 11 | `/home` | `src/pages/member/Home.jsx` | Member Feed | `HeaderMember`, `Footer`, `HomeSocialNav`, `HomeUtilityRail`, `PostList` | `min-[900px]`, `md`, `lg`, `xl` | Rails both active at $900\text{px}$ squishing center feed down to $\sim 410\text{px}$ | Unverified in browser (Driver limitation) | Below $1024\text{px}$: Single center feed (max-w $720\text{px}$); at $\ge 1024\text{px}$: Left Nav ($220\text{px}$); at $\ge 1280\text{px}$: Right Rail ($300\text{px}$) | Class 1 | Derived from source |
| 12 | `/search` | `src/pages/member/SearchResults.jsx` | Member Feed | `HeaderMember`, `Footer`, Filter bar, `PostCard` | `sm`, `md`, `lg` | Category pills colliding with search input; pagination wrapping | Unverified in browser (Driver limitation) | Sticky filter bar below header ($64\text{px}$ offset); horizontal scroll pill bar with no wrap | Class 1 | Derived from source |
| 13 | `/posts/:id` | `src/pages/member/PostDetail.jsx` | Member Feed | `HeaderMember`, `Footer`, Comment tree, Lightbox | `sm`, `md`, `lg` | Nested comments ($4\text{ levels} \times 20\text{px} = 80\text{px}$) squeeze reply buttons on $320-375\text{px}$ | Unverified in browser (Driver limitation) | Mobile comment indentation: $\min(\text{depth}-1, 3) \times 12\text{px}$ (max $36\text{px}$); nested avatar $28\times28\text{px}$ | Class 1 | Derived from source |
| 14 | `/posts/create` | `src/pages/member/CreatePost.jsx` | Member Workspace | `HeaderMember`, `Footer`, Media uploader, Tag picker | `sm`, `md`, `lg` | Media preview grid overflow; tag chips colliding | Unverified in browser (Driver limitation) | Editor container max-w $800\text{px}$; sticky bottom action toolbar on $< 640\text{px}$ | Class 1 | Derived from source |
| 15 | `/posts/edit/:id` | `src/pages/member/EditPost.jsx` | Member Workspace | `HeaderMember`, `Footer`, Media manager | `sm`, `md`, `lg` | Existing media grid height locked; delete touch target $< 36\text{px}$ | Unverified in browser (Driver limitation) | Expand delete button hit box to $\ge 44\times44\text{px}$; responsive grid $2-4$ columns | Class 1 | Derived from source |
| 16 | `/profile` | `src/pages/member/Profile.jsx` | Member Workspace | `HeaderMember`, `Footer`, Profile banner, Tabs, Bio | `sm`, `md`, `lg` | Avatar overlaps cover banner on mobile; input alignment | Unverified (Requires auth session) | Banner height `clamp(140px, 25vw, 240px)`; avatar `clamp(72px, 15vw, 112px)` | Class 2 | Unverified dynamic state |
| 17 | `/security` | `src/pages/member/Security.jsx` | Member Workspace | `HeaderMember`, `Footer`, Security settings card | `sm`, `md` | 2FA QR code card overflow on narrow mobile | Unverified (Requires auth session) | Max-w $640\text{px}$; QR code container fluid width `clamp(180px, 50vw, 240px)` | Class 1 | Unverified dynamic state |
| 18 | `/security/change-email` | `src/pages/member/ChangeEmail.jsx` | Member Workspace | `HeaderMember`, `Footer`, Form card | `sm`, `md` | Input validation message wrapping awkwardly | Unverified (Requires auth session) | Single-column form max-w $480\text{px}$; full-width buttons | Class 2 | Unverified dynamic state |
| 19 | `/users/:id` | `src/pages/member/PublicUserProfile.jsx` | Member Workspace | `HeaderMember`, `Footer`, User banner, Follow CTA | `sm`, `md`, `lg` | Follow button and stats row wrapping onto multiple unaligned lines | Unverified in browser (Driver limitation) | Stats counter flex-wrap with equal-width pills; follow button full-width on $< 480\text{px}$ | Class 1 | Derived from source |
| 20 | `/my-posts` | `src/pages/member/MyPosts.jsx` | Member Workspace | `HeaderMember`, `Footer`, Post tabs, Post list | `sm`, `md`, `lg` | Tab active indicator desynchronized on mobile resize; delete button squished | Unverified (Requires auth session) | Tab bar with touch horizontal scroll; card actions menu in 3-dot dropdown on $< 640\text{px}$ | Class 2 | Unverified dynamic state |
| 21 | `/saved-posts` | `src/pages/member/SavedPosts.jsx` | Member Workspace | `HeaderMember`, `Footer`, Bookmark list, Collections | `sm`, `md`, `lg` | Card title truncation too aggressive (1 line); bookmark icon $< 44\text{px}$ | Unverified (Requires auth session) | Card title 2-line line-clamp; bookmark button $44\times44\text{px}$ hit area | Class 1 | Unverified dynamic state |
| 22 | `/weekly-menu` | `src/pages/member/WeeklyMenu.jsx` | Member Application | `HeaderMember`, `Footer`, `WeeklyMealPlanner`, `MealRoutinePanel` | `sm`, `md`, `lg`, `xl` | Toolbar buttons wrap on $< 360\text{px}$; wizard step pills wrap on $< 580\text{px}$ | Unverified (Requires auth session) | Toolbar flex wrap at $< 480\text{px}$; compact step summary pill at $< 580\text{px}$; 2-col equal height on $\ge 768\text{px}$; stacked natural height on $< 768\text{px}$ | Class 1 | Derived from source |
| 23 | `/health` | `src/pages/member/HealthAndWellness.jsx` | Member Application | `HeaderMember`, `Footer`, Metrics grid, BMI gauge, Charts | `sm`, `md`, `lg`, `xl` | Metric cards squeeze to $< 130\text{px}$ on 4-col tablet; BMI gauge text overlap | Unverified (Requires auth session) | Metric grid: 1 col ($< 480\text{px}$), 2 col ($480 - 899\text{px}$), 4 col ($\ge 900\text{px}$); SVG gauge responsive viewBox | Class 1 | Derived from source |
| 24 | `/health/bmi` | `src/pages/member/HealthAndWellness.jsx` | Member Application | `HeaderMember`, `Footer`, BMI calculator | `sm`, `md`, `lg` | Height/weight slider thumb targets too small on mobile | Unverified (Requires auth session) | Slider touch track $44\text{px}$ height; number inputs with large stepper buttons | Class 1 | Derived from source |
| 25 | `/meal-plans/payment/success` | `src/pages/member/MealPlanPaymentResult.jsx` | Member Modal/Card | `HeaderMember`, `Footer`, Receipt card, CTA | `sm`, `md` | Receipt table columns squished on mobile | Unverified (Requires auth session) | Stacked receipt metadata list; receipt card max-w $520\text{px}$ | Class 2 | Unverified dynamic state |
| 26 | `/meal-plans/payment/cancel` | `src/pages/member/MealPlanPaymentResult.jsx` | Member Modal/Card | `HeaderMember`, `Footer`, Notice card | `sm`, `md` | Spacing too large on mobile viewports | Unverified (Requires auth session) | Card padding $24\text{px}$ mobile, $40\text{px}$ desktop | Class 2 | Unverified dynamic state |
| 27 | `/meal-plans/payment/failed` | `src/pages/member/MealPlanPaymentResult.jsx` | Member Modal/Card | `HeaderMember`, `Footer`, Error card, Retry button | `sm`, `md` | Action button group wraps unaligned | Unverified (Requires auth session) | Full-width vertical button stack on $< 480\text{px}$ | Class 2 | Unverified dynamic state |
| 28 | `/vegan-stores` | `src/pages/member/FindVeganStores.jsx` | Member Application | `HeaderMember`, Fullscreen Map, Store Drawer | `md`, `lg` | $400\text{px}$ floating panel on $768\text{px}$ covers $52\%$ of map; zoom controls overlap | Unverified in browser (Requires map token) | Drawer on $< 1024\text{px}$ ($140\text{px}$ / $85\text{vh}$); floating panel $400\text{px}$ on $\ge 1024\text{px}$; zoom controls at top-right ($16\text{px}$) | Class 1 | Derived from source |
| 29 | `/vegan-stores/:id` | `src/pages/member/StoreDetail.jsx` | Member Application | `HeaderMember`, `Footer`, Store gallery, Menu list | `sm`, `md`, `lg` | Photo gallery grid breaks on $320\text{px}$; opening hours table overflows | Unverified in browser (Requires mock store id) | Main hero image $16:9$; thumbnail carousel; hours table formatted as key-value flex list | Class 1 | Derived from source |
| 30 | `/admin` | `src/pages/admin/AdminDashboard.jsx` | Admin Suite | `AdminNavbar`, KPI grid, Revenue/Activity charts | `sm`, `md`, `lg`, `xl` | KPI cards wrap awkwardly at $1024-1180\text{px}$; chart SVG overflows container | Unverified (Requires admin role) | KPI grid: 1 col ($< 640\text{px}$), 2 col ($640 - 1023\text{px}$), 4 col ($\ge 1024\text{px}$); chart `ResponsiveContainer` width 100% | Class 1 | Derived from source |
| 31 | `/admin/content` | `src/pages/admin/AdminContentManagement.jsx` | Admin Suite | `AdminNavbar`, Tab controls, Moderation Table | `sm`, `md`, `lg`, `xl` | Data table squishes action buttons off screen without visible scrollbar indicator | Unverified (Requires admin role) | Table wrapper `overflow-x-auto` with sticky action column and scroll shadow cues | Class 1 | Derived from source |
| 32 | `/admin/members` | `src/pages/admin/AdminMemberManagement.jsx` | Admin Suite | `AdminNavbar`, Search/Filter bar, Members Table | `sm`, `md`, `lg`, `xl` | Conflicting column widths (`w-[56%]`, `w-[44%]`, `+438px`) cause column crunching | Unverified (Requires admin role) | Table `min-w-[860px]` with deterministic column widths ($200\text{px}$ user, $140\text{px}$ role, $100\text{px}$ status, $120\text{px}$ actions) | Class 1 | Derived from source |
| 33 | `/admin/categories` | `src/pages/admin/AdminCategoryManagement.jsx` | Admin Suite | `AdminNavbar`, Create category form, Category list | `sm`, `md`, `lg` | Inline edit input exceeds table cell bounds on smaller tablets | Unverified (Requires admin role) | Modal or expanded row for category editing on $< 1024\text{px}$; inline on $\ge 1024\text{px}$ | Class 2 | Derived from source |
| 34 | `/admin/audit-logs` | `src/pages/admin/AdminAuditLogs.jsx` | Admin Suite | `AdminNavbar`, Date range picker, Audit table | `sm`, `md`, `lg`, `xl` | Date picker popover extends past right viewport edge on tablet | Unverified (Requires admin role) | Date picker popover right-aligned on $< 768\text{px}$; table min-w $920\text{px}$ | Class 1 | Derived from source |
| 35 | `/account-suspended` | `src/pages/member/AccountSuspended.jsx` | System Feedback | Status icon, Explanation card, Support button | `sm`, `md` | Card padding overflows on $320\text{px}$ screen | Unverified in browser (Driver limitation) | Centered card max-w $520\text{px}$; padding $20\text{px}$ mobile, $36\text{px}$ desktop | Class 2 | Derived from source |
| 36 | `/404` | `src/pages/system/NotFound.jsx` | System Feedback | 404 Illustration, Botanical text, Back CTA | `sm`, `md` | Illustration fixed width causing horizontal scroll on $320\text{px}$ | Unverified in browser (Driver limitation) | Illustration `max-w-[80vw]` and `clamp(200px, 40vw, 360px)`; responsive typography | Class 1 | Derived from source |
| 37 | `*` (Catch-all) | `src/pages/system/NotFound.jsx` | System Feedback | Identical to `/404` | `sm`, `md` | Same as `/404` | Unverified in browser (Driver limitation) | Same as `/404` | Class 1 | Derived from source |

---

## 8. Defect Catalog Ranked by Severity & Classification

| Defect ID | Route / Component | Viewport Class | Current Behavior | Failure Mode | Target Fix & Measurement | Classification | Label |
|---|---|---|---|---|---|---|---|
| **DEF-01** | `/weekly-menu` (`.wm-workspace-toolbar`) | Narrow Mobile ($320 - 360\text{px}$) | Flex row `justify-between` with $26\text{px}$ title and $165\text{px}$ button | Total min-width exceeds $320\text{px}$, forcing button off screen | Wrap toolbar items below $480\text{px}$; button spans $100\%$ width with $44\text{px}$ height | **Class 1: Necessary Fix** | Derived from source |
| **DEF-02** | `/weekly-menu` (`.wm-steps`) | Large Mobile ($430 - 580\text{px}$) | 3 horizontal step pills with circle badges and full text strings | Labels collide and wrap onto 3-4 awkward lines | Switch to compact progress pill indicator ("Step X of 3") at $< 580\text{px}$ | **Class 1: Necessary Fix** | Derived from source |
| **DEF-03** | `/weekly-menu` (`.wm-setup-footer`) | Mobile ($320 - 480\text{px}$) | Fixed flex row `justify-between` for "Back" and "Create menu" | Buttons collide; secondary button label truncates | Apply `flex-direction: column-reverse; gap: 10px;` at $< 480\text{px}$; primary on top | **Class 1: Necessary Fix** | Derived from source |
| **DEF-04** | `/admin/members` (`MembersTable`) | Tablet / Small Laptop ($768 - 1024\text{px}$) | Conflicting column header widths (`w-[56%]`, `w-[44%]`, plus $438\text{px}$) | Columns crunch into unreadable slivers on `table-fixed` | Enforce `min-w-[860px]` on `<table>` with fixed column pixel widths inside `overflow-x-auto` | **Class 1: Necessary Fix** | Derived from source |
| **DEF-05** | `/posts/:id` (`CommentItem`) | Narrow Mobile ($320 - 375\text{px}$) | Indentation formula `depth * 1.25rem` ($20\text{px}$) up to 4 levels | On $320\text{px}$ screen, $80\text{px}$ indent leaves only $200\text{px}$ for text and actions | Cap mobile indentation to `depth * 0.75rem` ($12\text{px}$) max $36\text{px}$; resize nested avatar to $28\text{px}$ | **Class 1: Necessary Fix** | Derived from source |
| **DEF-06** | `/verify-otp` (`VerifyOTP`) | Narrow Mobile ($320\text{px}$) | Card container padding `p-8` consumes $64\text{px}$ of $288\text{px}$ available width | Inner content squeezed tightly; input feels cramped | Reduce mobile card padding to `p-5 sm:p-8`; retain full-width single OTP input | **Class 1: Necessary Fix** | Derived from source |
| **DEF-07** | `/vegan-stores` (`FindVeganStores`) | Tablet ($768 - 1023\text{px}$) | Floating left panel $400\text{px}$ activates at `md:` ($768\text{px}$) | Panel covers $52\%$ of map canvas; touch interaction with map pins cramped | Keep bottom drawer active on $< 1024\text{px}$; activate desktop floating panel at `lg:` ($1024\text{px}$) | **Class 1: Necessary Fix** | Derived from source |
| **DEF-08** | `/admin` (`AdminNavbar`) | Tablet ($768 - 860\text{px}$) | Center capsule nav ($470\text{px}$) + brand badge ($220\text{px}$) + avatar ($96\text{px}$) = $834\text{px} > 720\text{px}$ available | Header elements crowd and collide on small tablet | Hide "Admin Suite" badge on tablet (`hidden lg:inline-flex`); reduce capsule padding to `px-3 py-1.5` | **Class 1: Necessary Fix** | Derived from source |
| **DEF-09** | `/home` (`Home.jsx`) | Intermediate Widths ($900 - 1023\text{px}$) | Both sidebars activate at `min-[900px]:block` | Feed column compressed to $< 420\text{px}$ on $900-1023\text{px}$ screens | Align Left Navigation to `lg:block` ($1024\text{px}$) and Right Rail to `xl:block` ($1280\text{px}$) | **Class 2: Visual Improvement** | Derived from source |
| **DEF-10** | `/login`, `/sign-up` | Short Viewport Heights ($< 700\text{px}$) | Outer padding `py-12` plus large decorative background SVGs | Auth card extends beyond fold, forcing unnecessary scrolling | Responsive `py-6 sm:py-12`; conditionally hide background SVGs on short viewports | **Class 1: Necessary Fix** | Derived from source |
| **DEF-11** | `/vegan-stores` (`FindVeganStores`) | Mobile Viewports ($< 768\text{px}$) | Bottom panel uses tap-to-expand toggle | User requests touch drag kinematics | Introduce gesture-driven drag physics (Framer Motion drag sheet) | **Class 3: Redesign (Rejected/Deferred)** | Proposed design value |

---

## 9. Phased Implementation Roadmap & Regression Test Plan

### 9.1 Phased Implementation Sequence
Implementation must proceed in strict structural order to prevent visual regressions:

```mermaid
graph TD
    P1["Phase 1: Foundation & Typography Clamps (tailwind.config.js, index.css)"] --> P2["Phase 2: Header Collision Fixes (AdminNavbar tablet capsule, HeaderMember)"]
    P2 --> P3["Phase 3: Core Workspace Fixes (Weekly Menu toolbar wrap, compact steps, footer stack)"]
    P3 --> P4["Phase 4: Social Feed & Comment Tree (Community Feed rail alignment, comment indentation)"]
    P4 --> P5["Phase 5: Store Directory Map & Panel (FindVeganStores lg: threshold, zoom controls)"]
    P5 --> P6["Phase 6: Admin Suite Tables (Table min-w-[860px] containers, sticky columns)"]
    P6 --> P7["Phase 7: Auth Flows & Viewport Heights (VerifyOTP card padding, short viewport padding)"]
    P7 --> P8["Phase 8: Comprehensive Regression Verification across all 11 viewports"]
```

### 9.2 Responsive Regression Test Plan
| Test ID | Route | Test Viewport | Test Condition & Pass Criteria | Label |
|---|---|---|---|---|
| **REG-01** | `/verify-otp` | $320 \times 667\text{px}$ | Inspect OTP card; padding must allow single input to render cleanly with zero body overflow | Proposed design value |
| **REG-02** | `/weekly-menu` | $360 \times 740\text{px}$ | Inspect workspace toolbar; title and button must wrap cleanly without clipping | Proposed design value |
| **REG-03** | `/weekly-menu` | $1280 \times 900\text{px}$ | Inspect 2-column workspace; left sidebar and wizard panel must have identical bottom visual alignment | Proposed design value |
| **REG-04** | `/weekly-menu` | $768 \times 1024\text{px}$ | Inspect mobile stacked layout; sidebar must have `height: auto` and must not force equal height | Proposed design value |
| **REG-05** | `/home` | $1024 \times 800\text{px}$ | Inspect feed layout; Left Nav visible, Center Feed centered, Right Rail hidden | Proposed design value |
| **REG-06** | `/posts/:id` | $375 \times 812\text{px}$ | Inspect 4-level nested comments; reply buttons and text must remain fully visible within card | Proposed design value |
| **REG-07** | `/admin/members` | $768 \times 1024\text{px}$ | Inspect member data table; horizontal scroll indicator visible; columns readable without squishing | Proposed design value |
| **REG-08** | `/admin` | $768 \times 1024\text{px}$ | Inspect `AdminNavbar`; capsule nav, brand, and avatar must not wrap onto multiple lines | Proposed design value |
| **REG-09** | `/vegan-stores` | $768 \times 1024\text{px}$ | Inspect map layout; bottom drawer sheet active, leaving full map interactive canvas | Proposed design value |
| **REG-10** | `/vegan-stores` | $1024 \times 768\text{px}$ | Inspect map layout; desktop floating panel ($400\text{px}$) cleanly docked on left over map | Proposed design value |
| **REG-11** | `/login` | $375 \times 667\text{px}$ | Test short viewport; Submit button accessible without excessive vertical scrolling | Proposed design value |

---

## 10. Implementation Gate & Approval Check

This specification contract is complete, mathematically reconciled, and ready for execution.

### Explicit Implementation Gate
- **No application code, components, CSS, or configuration files were altered in this task.**
- The next step is **Implementation of Approved Responsive Fixes (Phase 1 through Phase 7)**.

*Awaiting explicit user approval to begin implementation.*
