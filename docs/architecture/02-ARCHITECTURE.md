# 02 — Kiến trúc không database

## Các thành phần

- Next.js UI: chọn PDF, preflight với PDF.js worker nếu cần, upload, polling và download.
- Route Handlers Node.js: kiểm tra request, chống bot, gọi provider, cấp capability, chuẩn hóa trạng thái.
- CloudConvert: lưu file/job tạm, chuyển đổi, xuất URL DOCX.
- Browser sessionStorage: chỉ giữ một capability còn hạn và metadata tối thiểu để resume; không giữ bytes PDF/DOCX.
- Bảo vệ lưu lượng tại nền tảng: WAF/rate rules nếu gói hỗ trợ; không thêm Redis để lách yêu cầu không DB.

## Trình tự chuẩn

1. Browser preflight PDF local, xác nhận thông báo xử lý bên thứ ba.
2. `POST /api/conversions`: JSON metadata và Turnstile token. Server tạo graph `import/upload → convert → export/url` qua API bất đồng bộ.
3. Server trả capability mã hóa và upload form có chữ ký do provider cấp.
4. Browser gửi FormData thẳng tới URL upload; giữ nguyên mọi field provider trả về, append `file` cuối cùng.
5. Browser gọi `POST /api/conversions/status` với capability. Server giải mã, tra đúng job provider, trả trạng thái chuẩn hóa.
6. Khi export hoàn tất, server chỉ trả URL tải hợp lệ từ đúng export task của job đó.
7. Browser mở link tải trực tiếp. Không fetch DOCX qua API ứng dụng.
8. Người dùng có thể bấm “Xóa file đã xử lý”; server xác thực capability rồi xóa job, xử lý race/not-found theo adapter.

Không webhook hoặc worker nền trong MVP. Provider tiếp tục chạy khi tab đóng; ứng dụng không phải tự giữ tiến trình. Tác vụ mồ côi được provider thu hồi theo TTL của họ, không có cron nội bộ giả định chạy được khi không có danh sách job.

## Capability không cần DB

Dùng `jose` với compact JWE, `alg=dir`, `enc=A256GCM`, khóa server 32 byte ngẫu nhiên base64url. Không tự chế crypto. Payload nội bộ: `v`, `provider`, `jobId`, `iat`, `exp`, `aud`, `iss`; TTL dự kiến 2 giờ. Job ID chỉ lấy từ provider response khi server tạo job.

Mọi endpoint status/delete đều kiểm tra version, thuật toán allowlist, issuer, audience, expiry, provider và schema. Không nhận job ID hoặc provider base URL độc lập từ client. Không chứa API key trong capability. Không cấp quyền liệt kê job tài khoản.

Capability là bearer secret: ai có nó có thể xem/xóa kết quả job. SessionStorage cho resume cùng tab nhưng vẫn bị đọc nếu XSS; cần CSP, tránh third-party scripts, không lưu vào URL, localStorage hay analytics. Không có thu hồi từng token ở tầng app khi không DB: xóa job sẽ vô hiệu quyền truy cập dữ liệu đó; xoay khóa làm hết hiệu lực mọi capability cũ.

## Timeout và polling

Server chỉ gọi API ngắn, timeout upstream 15 giây, route budget dự kiến 30 giây. Không dùng synchronous conversion API. Browser poll sau khoảng 2 giây, backoff 2/3/5 giây rồi tối đa 10 giây, jitter, một request đang chạy mỗi job, tôn trọng Retry-After. Chậm polling khi tab hidden, tiếp tục khi visible/online.

Sau 15 phút có thể hiện “Đang xử lý lâu hơn dự kiến” và nút kiểm tra lại; không gán provider error chỉ vì hết thời gian UI. Sau capability hết hạn không âm thầm cấp token mới bằng job ID client đưa lên.

Retry status với backoff được; retry create tự động sau network timeout bị cấm vì job đầu có thể đã phát sinh phí. Không hứa exactly-once/idempotency phân tán nếu chưa có hỗ trợ chính thức của provider.

## Cấu trúc repo dự kiến

```text
README.md
AGENTS.md
docs/
  README.md
  product/
  architecture/
  integrations/
  quality/
  deployment/
  planning/
  references/
src/app/page.tsx
src/app/privacy/page.tsx
src/app/api/conversions/route.ts
src/app/api/conversions/status/route.ts
src/app/api/conversions/delete/route.ts
src/components/converter/
src/lib/server/provider/cloudconvert.ts
src/lib/server/provider/types.ts
src/lib/server/capability.ts
src/lib/server/env.ts
src/lib/server/security.ts
src/lib/contracts/conversion.ts
src/lib/client/preflight.ts
src/lib/client/upload.ts
src/lib/client/polling.ts
tests/unit/
tests/integration/
tests/e2e/
.env.example
```

`server-only` bảo vệ module dùng secrets. Không serialize raw provider job sang client. Chỉ server chọn operation, định dạng, engine và tên task.
