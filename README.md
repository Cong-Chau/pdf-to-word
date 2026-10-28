# PDF → Word

Ngôn ngữ tài liệu và giao diện: tiếng Việt. Ngày kiểm tra nguồn: 28/10/2026.

## Mục tiêu

Xây website chuyển PDF thành **DOCX chỉnh sửa được**, ưu tiên giữ bố cục, bảng, hình và tiếng Việt. Không database. Toàn bộ mã ứng dụng triển khai trên Vercel; công việc chuyển đổi chạy tại API bên thứ ba.

**“Giống 99%” là mong muốn về chất lượng, không phải khả năng đã được chứng minh hoặc cam kết với mọi PDF.** PDF lưu cách vẽ trang; DOCX lưu cấu trúc nội dung và quy tắc dàn trang. Tái tạo cấu trúc có thể làm đổi dòng, font, bảng và số trang. PDF scan còn phụ thuộc OCR. Xem `docs/quality/05-QUALITY-AND-BENCHMARK.md` để nghiệm thu có bằng chứng.

## Quyết định mặc định

| Hạng mục | Quyết định |
|---|---|
| Frontend và backend điều phối | Next.js App Router, TypeScript strict, Node.js runtime |
| Giao diện | Tailwind CSS, component có accessibility, responsive |
| Engine đầu tiên để đánh giá | CloudConvert PDF → DOCX; chọn engine qua API capabilities/Job Builder |
| Đối chứng chất lượng | Adobe PDF Services khi có tài khoản và ngân sách; không tích hợp kép trong MVP |
| Database, Redis, ORM, tài khoản người dùng | Không dùng |
| File | Trực tiếp browser ↔ nhà cung cấp; không đi qua Vercel Functions |
| Trạng thái | Nhà cung cấp giữ job; browser giữ capability token ngắn hạn trong sessionStorage |
| Tác vụ lâu | Bất đồng bộ, browser polling; không giữ request chờ chuyển đổi |
| Chi phí | Có thể tốn phí API và Vercel; không giả định miễn phí |
| Phạm vi đầu tiên | Một PDF mỗi lần, đầu ra .docx, không lịch sử lâu dài |

Không DB **không đồng nghĩa** không có lưu trữ ở đâu: nhà cung cấp xử lý và giữ file/job tạm thời theo chính sách của họ. Nếu yêu cầu là hoàn toàn không gửi file ra ngoài, kiến trúc này không đáp ứng; phải thiết kế lại và đánh giá lại chất lượng.

## Cấu trúc hiện tại

```text
pdf-to-word/
  README.md
  AGENTS.md
  package.json
  pnpm-lock.yaml
  src/
    app/            # Trang và route API
    components/     # Giao diện theo chức năng
    lib/            # Contracts, client và server
  docs/
    README.md
    product/        # Yêu cầu sản phẩm, UI/UX
    architecture/   # Kiến trúc, API, bảo mật
    integrations/   # Provider và báo cáo spike
    quality/        # Benchmark và kết quả nghiệm thu
    deployment/     # Vercel, môi trường và vận hành
    planning/       # Kế hoạch thực hiện và prompt
    references/     # Nguồn và nhật ký quyết định
    development/    # Hướng dẫn chạy local và tổ chức mã
```

Xem [mục lục và thứ tự đọc](docs/README.md). [AGENTS.md](AGENTS.md) là chỉ dẫn cho agent ở root dự án. Cấu trúc mã nguồn nằm trong [tài liệu kiến trúc](docs/architecture/02-ARCHITECTURE.md).

## Chạy local

Yêu cầu Node.js 20.19+, 22.13+ hoặc 24+ và pnpm 10.33.0 (xem `engines` trong `package.json`). Chạy tại thư mục gốc:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
Copy-Item .env.example .env.local
pnpm dev
```

Nếu `.env.local` đã tồn tại, giữ file hiện có, không sao chép đè. Mở [localhost:3000](http://localhost:3000). Chưa cần credential cho khung giao diện.

Các lệnh kiểm tra tĩnh, không chạy tests:

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

Xem [hướng dẫn phát triển](docs/development/LOCAL-DEVELOPMENT.md) cho cấu trúc mã và trạng thái tích hợp.

## Trạng thái triển khai

Đã có khung Next.js App Router, TypeScript strict, Tailwind, trang chọn PDF, trang riêng tư, contracts Zod và module cấu hình server. Người dùng có thể chọn/kéo thả một PDF và xem tên/dung lượng; kiểm tra local chỉ là sơ bộ, chưa đếm trang hoặc nhận diện PDF khóa/scan.

Nút chuyển đổi đang bị vô hiệu hóa. Ba route POST create/status/delete chỉ trả HTTP 503 `CONVERSIONS_UNAVAILABLE` với `no-store`; chưa đọc file/body, xác thực token, gọi provider, upload, polling hoặc tạo DOCX. Bật biến môi trường không mở tích hợp chưa hoàn tất. Chưa triển khai Turnstile/JWE/CSP production và chưa deploy Vercel.

## Quy trình làm việc

Tuân thủ [quy trình và quyền chạy test](docs/planning/WORKFLOW.md). **Luôn hỏi chủ dự án trước mỗi lần chạy test**, kể cả chạy lại, smoke test, provider spike và benchmark. Có thể chuẩn bị test; chỉ thực thi sau khi được đồng ý rõ ràng. Chưa chạy thì ghi đúng trạng thái, không công bố đã nghiệm thu. Commit, push và deploy cần quyền cho từng hành động.

## Cách dùng

Đọc bộ tài liệu theo [thứ tự trong mục lục](docs/README.md), rồi dùng [prompt khởi động](docs/planning/10-CODEX-PROMPTS.md). Thực hiện spike thật trước khi làm giao diện hoàn chỉnh. Chủ dự án cung cấp API key qua biến môi trường và tập PDF mẫu có quyền sử dụng; không dán khóa vào prompt hoặc commit.

Các tài liệu 01–11 là **đặc tả đích**, không phải bằng chứng các tính năng đều đã hoàn tất. Khung ứng dụng chưa có kết quả kiểm thử, tích hợp provider hoặc benchmark thật; chỉ chạy tests sau khi hỏi và được đồng ý. Việc có giao diện hoặc build thành công không thay thế nghiệm thu tích hợp/chất lượng.
