# Phát triển local

## Công cụ và lệnh

Node.js 20.19+, 22.13+ hoặc 24+ (theo `engines` trong `package.json`); pnpm 10.33.0; phiên bản dependencies cố định tại `package.json` và `pnpm-lock.yaml`. Không cần API key để dựng UI.

ESLint tạm pin 9.39.5 vì các plugin import/react/accessibility của `eslint-config-next` chưa khai báo hỗ trợ ESLint 10. Registry đánh dấu ESLint 9 hết hỗ trợ; cần nâng đồng bộ khi các plugin tương thích, không bỏ qua peer dependencies để ép nâng major. TypeScript pin 5.9.3 cho bộ công cụ này.

1. Chạy `pnpm install --frozen-lockfile --ignore-scripts`.
2. Sao chép `.env.example` thành `.env.local` nếu chưa có; không đưa secret vào chat hoặc commit.
3. Chạy `pnpm dev`, mở `http://localhost:3000`.

`pnpm lint`, `pnpm typecheck`, `pnpm build` chỉ lint/kiểm tra kiểu/build. Chưa cấu hình test runner hoặc scripts/hook/CI tự chạy test. Trước khi thêm hoặc chạy kiểm thử, tuân thủ [WORKFLOW.md](../planning/WORKFLOW.md): luôn hỏi trước mỗi lần chạy, kể cả chạy lại, smoke test, thử provider và benchmark.

## Cấu trúc mã

```text
src/
  app/
    layout.tsx, page.tsx, globals.css, not-found.tsx
    privacy/page.tsx
    api/conversions/route.ts
    api/conversions/status/route.ts
    api/conversions/delete/route.ts
  components/
    converter/converter.tsx    # Chọn file, trạng thái local và thông báo
    layout/site-header.tsx    # Điều hướng chung
    ui/icon.tsx               # Icon SVG dùng chung
  lib/
    client/preflight.ts       # Kiểm tra sơ bộ file local, không gửi bytes
    contracts/conversion.ts   # Schema request và kiểu dữ liệu dùng chung
    server/env.ts             # Validate env lazily, không log secrets
    server/http.ts            # Error envelope và no-store
    server/conversion-unavailable.ts
    server/provider/types.ts  # Interface cho adapter tương lai
```

Module server có `server-only`, không import vào component client. Không có DB, job store, mock conversion hoặc SDK provider trong khung này. Không dùng font tải từ mạng trong build.

## Giới hạn hiện tại

- Kiểm tra sơ bộ: phần mở rộng, file rỗng, giới hạn UI 20 MiB và dấu `%PDF-` trong 1024 byte đầu. Không chứng minh PDF hợp lệ, không phát hiện password/scan hay đếm trang. Provider phải xác thực file khi tích hợp.
- Không gửi file hoặc metadata tới API khi chọn file; nút chuyển đổi bị vô hiệu hóa.
- Ba route POST dự phòng trả HTTP 503, không đọc body, không gọi provider và không cấp/nhận quyền thao tác job. Schema request đã có nhưng chưa nối vào routes; origin validation, body limit, Turnstile và JWE là phần tích hợp tiếp theo.
- `CONVERSIONS_ENABLED` mặc định false. Bật flag cũng không bật provider hoặc mock. Env validation được chuẩn bị và chưa nối vào handler đang đóng.
- Privacy copy mô tả trạng thái hiện tại và luồng dự kiến; phải cập nhật theo bằng chứng về xóa/TTL trước khi phát hành.
- Chưa có tests chạy, smoke test, benchmark hoặc kết quả DOCX thật. Chưa nghiệm thu responsive trên browser/thiết bị.

## Bước tiếp theo

Theo [kế hoạch](../planning/09-IMPLEMENTATION-PLAN.md), chuẩn bị spike provider/direct-upload và hỏi chủ dự án trước khi chạy. Sau khi có bằng chứng, nối adapter, token, contracts và luồng conversion. Không nhận khung giao diện là conversion đã hoạt động.

Triển khai dùng [hướng dẫn Vercel](../deployment/08-VERCEL-DEPLOYMENT.md); thao tác deploy cần được cho phép riêng. Chưa có Git repo hoặc Vercel project được tạo trong bước dựng khung.
