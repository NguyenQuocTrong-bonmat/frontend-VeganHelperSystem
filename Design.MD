

#Cụ thể, trong commit vừa thực hiện đã ghi nhận sự thay đổi và thêm mới của các file giao diện sau:

##Các trang (Pages):

src/pages/guest/HomeGuest.jsx
src/pages/member/CreatePost.jsx
src/pages/member/EditPost.jsx
src/pages/member/Home.jsx
src/pages/member/MyPosts.jsx
src/pages/member/PostDetail.jsx
Các Components UI mới:

src/components/home/CategoryBar.jsx
src/components/home/FeaturedPost.jsx
src/components/home/PostList.jsx
src/components/home/SearchBar.jsx
Toàn bộ thư mục src/components/ui/ mới được tạo (chứa Button.jsx, CategoryChip.jsx, Input.jsx...)
##CSS & Cấu hình:

src/styles/index.css (Cập nhật các style mới)
tailwind.config.js (Cấu hình mã màu chuẩn)
Thư mục design-system/ và file Design.MD
Tất cả đã nằm an toàn trên nhánh redesignFE trên Github của bạn. Bạn có thể kiểm tra trực tiếp trên đó nhé!



# Hướng Dẫn Design & Nối Luồng UI - VeganHelper

Tài liệu này cung cấp cái nhìn tổng quan về hệ thống UI mới và hướng dẫn từng bước để các lập trình viên frontend thực hiện việc "nối luồng" (tích hợp logic, API, state) vào các file giao diện tĩnh đã được chuyển đổi.

---

## 1. Những thay đổi mới trong UI

Dự án đã trải qua quá trình chuyển đổi từ HTML/CSS tĩnh sang React/Vite. Dưới đây là những thay đổi cốt lõi trong hệ thống UI:

*   **Chuyển đổi sang JSX:** Toàn bộ HTML gốc đã được chuyển đổi hoàn toàn sang cú pháp JSX. Các thuộc tính như `class` đã thành `className`, `for` thành `htmlFor`, thẻ không tự đóng như `<img>`, `<input>` đã được sửa. Thuộc tính `style=".."` đã chuyển thành object của React.
*   **Design Tokens (Hệ thống màu sắc & Font):** 
    *   Tailwind CSS đã được cấu hình trong `tailwind.config.js` để tích hợp sẵn các mã màu thiết kế. 
    *   Các class hệ thống như `bg-primary-moss`, `text-accent-beetroot`, `bg-herb-white`, `border-sage-mist` đã hoạt động out-of-the-box.
    *   Font chữ chuẩn hóa (`font-caslon`, `font-fraunces`, `font-vietnam`).
*   **Loại bỏ Javascript Inline:** **Toàn bộ** các đoạn mã `onclick="..."` hay thẻ `<script>` điều khiển DOM (mở modal, đóng dropdown) trong HTML tĩnh **đã bị loại bỏ**. Mã nguồn hiện tại để lại các comment `{/* TODO: script goc da bi loai bo... */}` tại các vị trí cần xử lý lại bằng React State.

---

## 2. Hướng dẫn các bước nối luồng cho UI mới

Để biến các màn hình UI tĩnh này thành một ứng dụng React hoàn chỉnh, hãy tuân theo quy trình 4 bước sau cho mỗi trang:

### Bước 1: Tách và tái sử dụng Component
Hiện tại, nhiều file (như Login, SignUp, Home) đang chứa toàn bộ HTML từ đầu đến cuối (bao gồm cả Header, Footer).
*   **Công việc:** Xác định các khối giao diện lặp lại.
*   **Hành động:** Cắt phần Header (thanh điều hướng), Footer, Sidebar, Card bài viết... ra thành các Component độc lập trong thư mục `src/components/`.
*   **Lợi ích:** Giữ code trang (Page) ngắn gọn, dễ bảo trì, dễ nối luồng logic chung (ví dụ: hiển thị tên User trên Header).

### Bước 2: Khôi phục tương tác UI (UI State)
Thay vì dùng Vanilla JS để thao tác DOM như trước, giờ đây bạn cần dùng State của React.
*   **Công việc:** Tìm tất cả các comment `{/* TODO: script goc da bi loai bo... */}`.
*   **Hành động:** 
    *   Khai báo `const [isOpen, setIsOpen] = useState(false);`
    *   Gắn sự kiện `onClick={() => setIsOpen(!isOpen)}` vào các nút bấm.
    *   Dùng toán tử điều kiện trong JSX để ẩn/hiện element (ví dụ: `className={isOpen ? 'block' : 'hidden'}`).
*   *Các ví dụ phổ biến:* Dropdown menu, Modal/Popup, Tab chuyển đổi ngày, Nút ẩn/hiện Password.

### Bước 3: Nối luồng Form và Validation
Các form hiện tại chỉ là giao diện. Bạn cần thu thập dữ liệu người dùng nhập.
*   **Hành động:** 
    *   Sử dụng thư viện `react-hook-form` kết hợp `zod` để quản lý form.
    *   Áp dụng `register('fieldName')` vào các thẻ `<input>`.
    *   Ánh xạ các trường dữ liệu cho khớp với DTOs của Backend (Ví dụ: Chú ý key là `identifier` hay `email`, có cần `fullName` hay không).
    *   Hiển thị thông báo lỗi (errors) ngay dưới mỗi ô input.

### Bước 4: Tích hợp API và Data State (Nối luồng Backend)
*   **Công việc:** Gọi API khi submit form hoặc khi load trang.
*   **Hành động:**
    *   Sử dụng các service trong `src/services/` (như `authService.js`, `postService.js`).
    *   Sử dụng Hook `useAuth` để lấy thông tin đăng nhập từ Context.
    *   Quản lý trạng thái chờ (`isLoading`, `isSubmitting`) để hiển thị spinner trên các nút bấm (UX).
    *   Hiển thị thông báo (Toast/Alert) khi thành công hoặc thất bại.

---

## 3. Ví dụ minh họa: Khôi phục Modal / Dropdown

**Trước đây (HTML gốc):**
```html
<button onclick="document.getElementById('myModal').style.display='block'">Mở Modal</button>
<div id="myModal" style="display:none;">Nội dung</div>
```

**Bây giờ (React/JSX):**
```jsx
import { useState } from 'react';

function MyPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="bg-primary-moss text-white px-4 py-2 rounded">
        Mở Modal
      </button>

      {/* Hiển thị modal dựa vào state */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-modal-shadow">
            <h2>Nội dung Modal</h2>
            <button onClick={() => setShowModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </>
  );
}
```

---
**Lưu ý quan trọng:** Trước khi gọi API, hãy đảm bảo bạn kiểm tra cấu trúc Payload (DTO) ở Backend để tránh các lỗi HTTP 400 Bad Request không đáng có.
