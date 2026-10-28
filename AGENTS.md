# Chỉ dẫn cho Codex

Đọc `README.md`, sau đó `docs/README.md` và đủ 11 tài liệu theo mục "Thứ tự đọc" trong đó trước khi triển khai. Mọi đường dẫn dạng `docs/...` trong chỉ dẫn và prompt được tính từ root dự án.

## Quy trình và quyền thực thi

- Tuân thủ `docs/planning/WORKFLOW.md`; chỉ dẫn trực tiếp của chủ dự án có ưu tiên cao nhất.
- **Luôn hỏi và chờ chủ dự án đồng ý trước mỗi lần chạy test**, kể cả chạy lại, smoke test, provider spike và benchmark. Nêu rõ lệnh/thao tác, phạm vi, môi trường và chi phí/tác động nếu có. Không tự mở rộng phạm vi đã duyệt.
- Được chuẩn bị test; chưa được duyệt chạy thì ghi `not run — chưa được cho phép`, không đánh dấu pass. Kiểm tra tĩnh tài liệu/lint/typecheck/build chỉ chạy nếu không gọi test hoặc dịch vụ thật qua script/hook.
- Không tự commit, push hoặc deploy. Xin quyền riêng cho hành động tương ứng; không xem kế hoạch hoặc skill là quyền thực thi.
- Skill cục bộ nằm tại `.claude/skills/`; đọc skill phù hợp khi cần, không tự khởi động workflow ngoài yêu cầu.

## Tổ chức tài liệu

- Root chỉ giữ README tổng quan và AGENTS; tài liệu chi tiết nằm trong các thư mục theo chủ đề tại `docs/`.
- `product/`: yêu cầu và UI/UX; `architecture/`: kiến trúc, API và bảo mật.
- `integrations/`: provider và báo cáo spike; `quality/`: benchmark và kết quả nghiệm thu.
- `deployment/`: triển khai và vận hành; `planning/`: kế hoạch và prompt; `references/`: nguồn và quyết định.
- Khi thêm hoặc chuyển tài liệu, cập nhật `docs/README.md` và mọi tham chiếu liên quan. Không gom tài liệu mới vào một thư mục phẳng.
- Báo cáo thực tế chỉ tạo khi có công việc tương ứng; không tạo kết quả giả để lấp cấu trúc.

## Ràng buộc bắt buộc

- Không DB, Redis, ORM, persistent job store, đăng nhập, subscription hoặc lịch sử server.
- Deploy code ứng dụng lên Vercel. Engine PDF → DOCX qua nhà cung cấp chuyên dụng.
- PDF/DOCX không được proxy qua Functions, kể cả base64. API chỉ trao metadata nhỏ.
- Không dùng pdf-parse/pdf.js + ghép đoạn văn DOCX làm engine chính. PDF.js chỉ preflight/preview.
- Không nhúng ảnh toàn trang vào DOCX để giả vờ có Word chỉnh sửa được.
- Không tự viết lại engine layout/OCR; không dùng LLM viết lại nội dung tài liệu.
- Không quảng cáo 99% khi chưa có dữ liệu. Không tính phần trăm tiến trình chuyển đổi giả.
- Không cài hoặc chạy LibreOffice/headless office trong Vercel MVP.
- API key server-only, token job được xác thực ở mọi thao tác; không chỉ tin job ID từ client.
- Không lưu file, raw provider response, capability token hay signed URL vào logs/analytics.
- Không tự động fallback sang nhà cung cấp khác vì có thể phát sinh phí và gửi dữ liệu sang bên khác.
- Không tự động tạo lại job sau timeout không rõ kết quả.
- Không coi rate limit trong Map/in-memory là bảo vệ phân tán.

## Cách làm

1. Spike upload trực tiếp từ origin Vercel và convert một PDF thật trước.
2. Kiểm chứng capabilities/engine/OCR đang có; không bịa tên option.
3. Tách adapter server, chuẩn hóa status/error, dùng schema validation.
4. Viết kiểm thử có giá trị cho token isolation, upload/polling contract, lỗi và luồng thật.
5. Mỗi giai đoạn phải báo thay đổi, kiểm tra đã chạy, blocker, bằng chứng chưa có.
6. Không tạo test chỉ để phản chiếu hằng số hoặc tăng coverage.
7. Lock dependencies phiên bản stable tương thích đang dùng; giữ lockfile cùng mã và đưa vào commit khi được phép commit. Không sao chép số version chưa kiểm tra.
8. Không đưa thông tin triển khai nội bộ vào luồng sản phẩm nếu người dùng không cần biết.

Hoàn tất: lint/typecheck/build và tests phù hợp được duyệt chạy, có kết quả pass; Vercel smoke test được duyệt chạy và pass; không lộ key; chuyển PDF >4.5 MB qua direct upload thành công; DOCX mở được, chỉnh sửa được; có báo cáo chất lượng thật hoặc đánh dấu rõ chưa được nghiệm thu.
