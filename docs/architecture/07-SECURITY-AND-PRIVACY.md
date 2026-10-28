# 07 — Bảo mật, dữ liệu và chống lạm dụng

## Threat model thực tế

Endpoint create sử dụng credit của chủ ứng dụng. Người dùng có thể sửa metadata, gọi API trực tiếp, upload file lớn hơn khai báo, lấy URL tải để chia sẻ, hoặc replay capability. Không DB làm giảm khả năng quota/idempotency/thu hồi ở tầng app; phải mô tả đúng giới hạn.

## Kiểm soát bắt buộc

- API key chỉ ở env server, module server-only, không có tiền tố NEXT_PUBLIC_. Preview và production dùng key tách biệt nếu tài khoản hỗ trợ.
- Capability dùng authenticated encryption đã kiểm chứng. Không tin job ID, task ID, URL, engine hoặc output do client gửi.
- Tất cả route metadata có schema và body limit; reject unknown fields, MIME JSON không phù hợp và method ngoài allowlist.
- Origin exact-match từ cấu hình đã kiểm soát. Không phản chiếu Origin bất kỳ vào CORS; không wildcard cho API ứng dụng.
- Create dùng Turnstile đã verify server-side: success, hostname, action. Token challenge mới cho mỗi lần tạo; không fake-verify trong production.
- Turnstile không phải quota người dùng và không bảo đảm chống bot tuyệt đối. WAF/rate rules chỉ ghi là hoạt động sau khi cấu hình và thử trên đúng plan.
- Provider account đặt hạn mức/credit cap hoặc spend alert theo tính năng thật. Nếu chỉ có alert thì đó không phải hard cap. Có `CONVERSIONS_ENABLED=false` để khóa create khẩn cấp.
- Với public launch, nếu chưa có giới hạn chi phí đủ tin cậy hoặc chưa kiểm soát direct-upload abuse, giữ deployment ở preview có bảo vệ của nền tảng; không coi captcha đơn lẻ là đủ.
- Không tự thêm Redis, KV hay DB để giải quyết quota trái yêu cầu.

## Validation file

Browser kiểm tra phần mở rộng, MIME khi có, `%PDF-` trong vùng header hợp lệ và thử parse bằng PDF.js. Đây là trải nghiệm và phòng lỗi thông thường, không là xác thực an ninh server. Provider phải kiểm tra PDF thực.

Filename: Unicode normalize, loại path separators/control chars, giới hạn độ dài, ngăn CRLF và XSS. Không log tên file. Không chạy executable, macro hoặc external-link content từ file. DOCX output không được render bằng HTML không sanitize.

Không hỗ trợ URL import do người dùng cung cấp để tránh mở rộng bề mặt SSRF. Server chỉ gọi API endpoint cố định. Download URL lấy từ provider response đúng job, kiểm HTTPS/host/scheme, không gọi fetch URL client đưa lên.

## Dữ liệu và thời hạn

Không lưu bytes trong app/DB/localStorage. sessionStorage chỉ token và metadata tối thiểu; xóa khi người dùng reset/delete/expire. Reload trước upload hoàn tất có thể phải chọn lại PDF; không giả định browser giữ File object.

Provider giữ file và metadata tạm theo chính sách của họ. Tài liệu export API hiện mô tả thời hạn 24 giờ; phải kiểm tra lại mốc tính cho task/output khi tích hợp. TTL capability 2 giờ là quy tắc app, **không chứng minh file đã bị xóa**. Không đặt banner “đã xóa” chỉ vì token hết hạn hoặc tab đóng.

Bấm xóa: server gọi thao tác xóa chính thức, xác minh kết quả. Nếu không hủy/xóa được task đang chạy, thông báo đúng và cho thử lại; dựa vào provider TTL như phương án dự phòng, không hứa xóa ngay.

## Logging và headers

Log allowlist: request ID tự sinh, operation nội bộ, status code, duration, error category. Không raw request/response, API key, capability, upload fields, file content, filename, download URL. Không đưa secret vào query string hoặc error tracking breadcrumbs.

Cấu hình no-store, Referrer-Policy: no-referrer; CSP ưu tiên self, khai báo chính xác hosts cần cho Turnstile, upload và worker. Không copy CSP nghiêm ngặt làm hỏng Next.js hydration; dùng nonce/hướng dẫn framework hiện hành rồi test production. Tắt third-party analytics quanh vùng chứa dữ liệu conversion.

## Kiểm tra cô lập quyền

Token A chỉ đọc/xóa job A. Thay đổi JWE làm request bị từ chối trước upstream call. Token hết hạn, sai audience/issuer/provider, khóa sai và token rỗng đều thất bại. Không có endpoint list toàn bộ jobs. Người không có capability không lấy kết quả chỉ bằng việc đoán ID.

Không DB nên không có per-user history, exact-once guarantee, global in-app counter hoặc revocation list. Không trình bày những tính năng đó là đã giải quyết bằng module singleton.
