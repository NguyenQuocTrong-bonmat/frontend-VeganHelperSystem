# FN20 / FN21 — bàn giao

## Thay đổi

- FN20 `/saved-posts`: Blog/Video từ API thật, phân trang 12 bài, loading/empty/error riêng, retry, mở chi tiết qua `postId`, bỏ lưu theo response `isSaved` và tải lại danh sách. Tự quay lại trang trước nếu trang hiện tại hết bài.
- FN21 `/users/:id`: chỉ hiển thị thông tin public, danh sách bài qua `id`, thống kê tổng từ API, loading/empty/401/403/404/error/retry. Kiểm tra ID số nguyên dương trong khoảng Int64 trước khi gửi request. Ngày null/sai định dạng không hiển thị, ảnh lỗi có fallback.
- Dùng chung `PostCard`, `SafeImage`, `PageState`. Link bàn phím được cho bài viết và tác giả.
- Menu tài khoản có Saved Posts; tác giả ở chi tiết bài có link profile cho member. Search dùng UserCard hiện có, bỏ dữ liệu dietType không thuộc DTO search và dịch vụ avatar ngoài.
- Không dùng mock trong UI. Fixture chỉ nằm trong test. Không thay AuthContext hay backend; không commit/push.

## API contract (xác minh qua source backend đính kèm)

| Chức năng | Request | DTO |
|---|---|---|
| FN20 | GET `/api/users/me/saved-posts?pageIndex=1&pageSize=12` | PagedResult: items, totalPages, pageIndex, pageSize, totalItems, totalCount |
| Bỏ lưu | POST `/api/posts/{postId}/save` | postId, isSaved (toggle, chỉ reload khi false) |
| FN21 | GET `/api/users/{userId}/profile` | id, username, displayName, avatarUrl, dietType, joinedAt, publishedPostCount, receivedLikeCount, posts |

SavedPostItemDto: postId, title, postType, thumbnailUrl, authorName, avatarUrl, viewCount, createdAt, savedAt.
PostFeedItemDto: id, title, postType, thumbnailUrl, authorName, avatarUrl, viewCount, createdAt.
Không hiển thị categoryName/dietType/likeCount trên card vì feed không trả những field này.
Hai controller đều `[Authorize]`; profile public nghĩa là thông tin public cho người dùng đăng nhập. Dùng ProtectedRoute và interceptor JWT/refresh hiện tại. Không mở public route trái contract.

## Chạy tại máy nhóm

```bash
npm ci
npm start
npm run build
CI=true npx react-scripts test --watchAll=false --runInBand
```

Tạo `.env` theo `.env.example`, cấu hình `REACT_APP_API_BASE_URL` tới backend nhóm; tin cậy HTTPS development certificate nếu dùng localhost. Không đưa token/secret vào source.

## Kiểm tra tích hợp và giao diện cần thực hiện với backend thật

1. Login → menu Saved Posts → mở Blog/Video → Back → Unsave → danh sách cập nhật.
2. Dữ liệu 0/1/12/>12 bài; chuyển trang, xóa bài cuối trang cuối.
3. Search → tác giả → profile → bài viết → Back; bấm tác giả tại chi tiết bài. Xem chính mình vẫn dùng trang public.
4. Network kiểm tra method, URL, pageIndex/pageSize, Authorization và response đúng DTO; không sửa token thủ công.
5. 401: refresh hiện tại hoặc redirect login. 403: thông báo quyền. 404 profile: không tìm thấy. 500/mất mạng: thông báo và retry, không giả thành empty.
6. Avatar/thumbnail null và URL hỏng; title/username/displayName rất dài; joinedAt null/sai định dạng. Kiểm tra ở 320px, 768px, 1280px, keyboard Tab/Enter.
7. Regression Home, Login, Profile, Search, Post Detail; kiểm tra Console/Network.

## Giới hạn

Không có .NET SDK trong môi trường thực hiện; chưa chạy backend/Swagger hoặc xác minh HTTP thực tế với database/tài khoản của nhóm. Test tự động dùng service mocks để kiểm tra trạng thái FE, không thay cho integration hay visual browser testing.

## Kết quả thực hiện

- Cài sạch lại bằng `npm ci` với lockfile mới: PASS (1353 packages).
- Production build: PASS (`Compiled successfully`). Có thông báo bundle lớn từ CRA.
- Jest: 2 suites, 23 tests PASS. Kiểm tra FE với service mocks: empty/error/retry, 401/403/404/500, pagination, unsave và trang cuối, ảnh lỗi, dữ liệu dài, ngày lỗi, mapping id/postId, giới hạn Int64, không hiển thị private fields.
- Có cảnh báo Future Flag của React Router trong test và deprecation Node 24; không có test failure.
- Sau lần cài theo lockfile gốc bị thiếu module, đã tạo lại package-lock.json từ dependency tree cài sạch; package.json không đổi dependency.
- Integration/backend thật và visual/responsive trên browser: CHƯA CHẠY, không đánh dấu PASS.

## Cập nhật: giữ trạng thái Saved sau reload

- `useSavedPosts.js`: tải toàn bộ các trang saved posts từ API khi mount, chuẩn hóa postId để so với feed id. Không dùng localStorage làm nguồn trạng thái. Không gọi API cho guest; bỏ qua response cũ khi unmount. Khóa thao tác lặp trên cùng bài, chỉ cập nhật theo response isSaved và giữ trạng thái khi mutation lỗi.
- `SaveButton.jsx`: Saved/Save recipe, checking/updating và retry khi trạng thái chưa tải được.
- Home chia sẻ trạng thái cho FeaturedPost và PostList, hiển thị nút Save bên ngoài link mở bài.
- PostDetailCore đọc lại trạng thái từ backend khi mở/reload, thay cho state false mặc định.
- Thêm 5 test cho reload, bài ở trang thứ hai, unsave rồi remount, retry, mutation lỗi và guest; tổng 28 tests.
- Kiểm thử backend thật vẫn chưa thực hiện. Nhóm cần xác nhận: Save trên Home → F5 → Saved; Unsave → F5 → Save recipe; lưu từ chi tiết → quay Home; lỗi API → retry.
