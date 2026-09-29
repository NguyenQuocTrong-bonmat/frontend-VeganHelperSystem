# Botanical Hearth — React project (converted from UI.zip)

Project Vite + React + JSX + Tailwind CSS, được convert tự động từ 26 file
HTML tĩnh trong `UI.zip` (mỗi file mockup → 1 component `.jsx`).

## Chạy thử

```bash
npm install
npm run dev
```

Build production: `npm run build` (đã test, build qua được không lỗi).

## Cấu trúc

```
src/
├── pages/
│   ├── guest/   # 9 màn hình: HomeGuest, Login, SignUp, ForgotPasswordResetPassword,
│   │             SearchResultsGuest, PostDetailGuest, WeeklyMenuGuestLocked,
│   │             FindVeganStoresGuestLocked, MyPostsGuestLocked
│   ├── member/  # 9 màn hình: Home, Profile, PublicUserProfile, MyPosts, PostDetail,
│   │             WeeklyMenu, FindVeganStores, SearchResults, AccountSuspended
│   └── admin/   # 8 màn hình admin
├── styles/index.css   # design tokens (CSS variables), font-caslon/fraunces/vietnam,
│                        hero-radius, modal-shadow — gộp từ các <style> rải rác
│                        trong từng file HTML gốc
├── App.jsx             # khai báo route cho toàn bộ 26 trang (react-router-dom)
└── main.jsx            # entry point
```

`tailwind.config.js` đã khai báo đủ màu token theo `DESIGN.md`
(`primary-moss`, `accent-beetroot`, `bg-herb-white`, `border-sage-mist`...)
để các class như `bg-primary-moss`, `text-accent-beetroot` hoạt động đúng.

## Những gì ĐÃ làm tự động

- HTML → JSX: `class`→`className`, `for`→`htmlFor`, tự đóng thẻ `<img>`/`<input>`,
  chuyển `style="..."` string → object, fix case `viewBox`/`preserveAspectRatio`.
- Đã kiểm tra cú pháp JSX bằng Babel (không lỗi) và build thử bằng Vite (thành công).

## Những gì CẦN làm thủ công tiếp theo

1. **Toàn bộ `onclick="..."` trong HTML gốc đã bị loại bỏ** (không tự động
   convert được sang logic React). Mỗi chỗ có tương tác (mở/đóng dropdown,
   toggle modal, submit form, tab chuyển ngày...) cần viết lại bằng
   `useState`/`useEffect` — trong code sẽ thấy comment
   `{/* TODO: script goc da bi loai bo... */}` đánh dấu vị trí có `<script>` gốc.
2. **Tách component dùng chung**: hiện tại mỗi trang là 1 file độc lập (copy y
   nguyên nội dung), Header/Footer/FAB/AdminSidebar đang bị lặp lại ở nhiều
   file. Nên tách theo cấu trúc `components/common`, `components/layout` như
   đã bàn trước đó để tránh trùng lặp.
3. **4 trang admin** (`AdminContentManagement`, `AdminMemberManagement`,
   `AdminCategoryManagement`, `AdminAiModelMonitoring`) trong file HTML gốc
   chỉ là khung skeleton — chưa có bảng dữ liệu thật, cần tự thiết kế thêm.
4. Ảnh minh hoạ trong bản gốc dùng `<img src="https://...">` placeholder —
   kiểm tra và thay bằng ảnh/API thật khi có backend.
5. React Router hiện dùng path tạm (`/home`, `/posts/:id`...) — điều chỉnh lại
   theo thiết kế route thật của nhóm, và thêm `PrivateRoute`/`AdminRoute` để
   chặn truy cập trái phép (guest vào trang member/admin).
