# Chi tiết các Luồng Hoạt Động (Workflows) trên Frontend

Tài liệu này mô tả chi tiết các bước (step-by-step) của các luồng chức năng quan trọng đang được triển khai trên dự án Frontend `VeganHelperSystem-new`.

## 1. Luồng Xác thực (Authentication)

### 1.1. Luồng Đăng nhập (Local Login)
1. Người dùng truy cập trang Đăng nhập (`/login`).
2. Điền `Username`, `Password`, và tùy chọn `Remember Me`.
3. Bấm submit. Frontend gọi API `POST /auth/login`.
4. **Thành công**: 
   - Backend trả về `accessToken` và `refreshToken`.
   - Frontend lưu vào `localStorage` (nếu chọn Remember Me) hoặc `sessionStorage` (nếu không chọn).
   - Gọi tiếp API `GET /users/me` để lấy thông tin Profile. Cập nhật state Global (qua AuthContext).
   - Redirect người dùng về trang `/home` (hoặc trang trước đó).
5. **Thất bại**: 
   - Nếu `403`: Redirect sang trang Xác minh OTP (`/verify-otp`).
   - Lỗi khác: Hiển thị lỗi ngay trên form nhập liệu.

### 1.2. Luồng Đăng nhập Google (OAuth)
1. Người dùng bấm nút "Sign in with Google" (được cung cấp bởi thư viện `@react-oauth/google`).
2. Popup Google hiện lên, người dùng chọn tài khoản và cho phép truy cập.
3. Google trả về `credential` (idToken) cho Frontend.
4. Frontend gọi API `POST /auth/google` kèm idToken.
5. Backend xác thực token, trả về hệ thống Auth bình thường (`accessToken`, `refreshToken`).
6. Redirect người dùng về `/home`.

### 1.3. Luồng Đăng ký & Xác minh
1. Người dùng truy cập `/sign-up`, nhập thông tin (username, email, password...).
2. Bấm submit. Frontend gọi `POST /auth/register`.
3. Đăng ký thành công, hệ thống chuyển hướng tự động sang `/verify-otp`.
4. Tại `/verify-otp`, người dùng nhập mã 6 số được gửi qua email.
5. Gọi API `POST /auth/verify-email`. Nếu thành công, có thể chuyển sang `/login` hoặc tự động đăng nhập (tùy logic BE).

### 1.4. Luồng Quên & Đặt lại mật khẩu (`/forgot-password`)
1. Người dùng nhập email và bấm gửi yêu cầu.
2. Gọi API `POST /auth/forgot-password`.
3. OTP được gửi về mail. Giao diện chuyển sang bước nhập OTP và Mật khẩu mới.
4. Bấm submit, gọi API `POST /auth/reset-password` kèm OTP. Thành công chuyển về `/login`.

---

## 2. Luồng Bảo mật (Security & Linking)

### 2.1. Luồng Hủy liên kết Google (`/profile`)
1. Nếu tài khoản đang liên kết Google, người dùng bấm **Unlink Google**.
2. **Kiểm tra mật khẩu cục bộ**:
   - Gọi API `POST /auth/google/unlink/request`.
   - Nếu lỗi `400` do chưa có mật khẩu cục bộ: Frontend mở modal yêu cầu nhập mật khẩu mới -> Gọi API `POST /auth/set-password` -> Thành công thì mở modal Unlink.
3. Frontend yêu cầu người dùng nhập mật khẩu hiện tại.
4. Xác nhận thành công, Backend gửi OTP về email. Frontend chuyển sang form nhập OTP.
5. Nhập OTP, gọi API `POST /auth/google/unlink/confirm`.
6. Hủy liên kết thành công, tải lại thông tin Profile.

### 2.2. Luồng Đổi Email (`/security/change-email`) - *(Đang chờ API BE)*
1. **Bước 1**: Hiển thị email hiện tại (bị che mờ). Người dùng bấm gửi OTP xác thực. Nhập OTP và xác nhận.
2. **Bước 2**: Chuyển sang form nhập Email mới. Xác thực logic frontend định dạng email.
3. **Bước 3**: Backend gửi OTP về Email mới. Nhập OTP và gọi API cập nhật. Thành công sẽ tự động redirect về trang Security.

---

## 3. Luồng Nội dung Cộng đồng (Posts)

### 3.1. Luồng Tạo bài viết (`/posts/create`)
1. Người dùng bấm "Create Post" từ thanh điều hướng.
2. Nhập tiêu đề, nội dung (Rich Text Editor), chọn Category và tải ảnh bìa.
3. Bấm Submit. Frontend chuẩn bị dữ liệu dạng `FormData` (chứa cả text và file ảnh).
4. Gọi API `POST /posts`.
5. Tạo thành công, chuyển hướng người dùng thẳng về trang Chi tiết bài viết đó (`/posts/:id`) để xem kết quả.

### 3.2. Luồng Xem Chi tiết & Bình luận (`/posts/:id`)
1. Truy cập URL, Frontend lấy `id` trên tham số route.
2. Gửi API `GET /posts/:id` để tải nội dung bài viết và `GET /posts/:id/comments` để tải bình luận.
3. Bấm Like bài viết -> Gọi API toggle Like -> Cập nhật UI ngay lập tức.
4. Gửi bình luận -> Gọi API `POST /posts/:id/comments` -> Append bình luận mới vào danh sách đang hiển thị.

---

## 4. Luồng Chạy ngầm (Background / Core System)

### 4.1. Luồng Đánh chặn Token (Axios Request & Response Interceptors)
1. **Request Interceptor**: Trước khi gửi API bất kỳ, Axios kiểm tra `localStorage`/`sessionStorage`. Nếu có `accessToken`, tự động gắn vào Header `Authorization: Bearer <token>`.
2. **Response Interceptor (Cấp lại Token)**:
   - Khi API trả về lỗi `401 Unauthorized`.
   - Hệ thống chặn lỗi lại, tạm dừng (queue) tất cả các API call khác đang diễn ra.
   - Gọi ngầm API `POST /auth/refresh` kèm `refreshToken`.
   - **Thành công**: Lưu `accessToken` mới, gắn lại vào các API đang bị treo và gửi tiếp tục (người dùng không hề hay biết).
   - **Thất bại** (Refresh Token hết hạn / Lỗi API): Xóa toàn bộ token dưới local, force redirect (`window.location.href`) về trang `/login`. *(Ngoại trừ endpoint `/auth/login` thì không kích hoạt luồng này để tránh reload vòng lặp).*

### 4.2. Luồng Kiểm tra Quyền Truy Cập (Protected Route)
1. Bất cứ khi nào user chuyển trang, Component `<ProtectedRoute>` sẽ chạy trước.
2. Nó kiểm tra Context `isAuthenticated`.
3. Nếu `false` (và quá trình fetch init auth đã xong): Chuyển hướng người dùng về `/login`, đồng thời lưu lại URL họ vừa muốn truy cập vào tham số `state`.
4. Nếu yêu cầu quyền Admin (`requireAdmin={true}`): Kiểm tra Role của `user`. Nếu không phải Admin, chặn và chuyển hướng về `/home`.
5. Sau khi login thành công ở bước sau đó, Router lấy lại `state` cũ và tự động đưa user quay lại chính xác trang bị chặn lúc đầu.
