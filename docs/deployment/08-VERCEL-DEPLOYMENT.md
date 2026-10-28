# 08 — Deploy và vận hành Vercel

## Stack và giới hạn

Chọn Next.js stable tương thích Vercel tại lúc triển khai; TypeScript strict, Node.js LTS mà Vercel hỗ trợ; giữ lockfile cùng mã và commit khi được phép. API routes dùng Node.js runtime và chỉ làm metadata orchestration. Không Edge-only assumption cho SDK/crypto chưa kiểm tra.

Tài liệu Vercel đã kiểm tra ngày 28/10/2026 vẫn ghi request/response payload của Function tối đa 4.5 MB. Dù giới hạn nền tảng đổi, kiến trúc vẫn upload/download trực tiếp. Không dùng base64, multipart route proxy hoặc “streaming sẽ tự né mọi limit”.

Chọn `maxDuration` khoảng 30 giây cho route API nếu plan hiện tại cho phép; upstream timeout 15 giây. Đây là budget điều phối, không phải thời gian convert. Không cần kéo duration lên hàng phút để chờ provider.

## Biến môi trường

| Tên | Phạm vi | Yêu cầu |
|---|---|---|
| CLOUDCONVERT_API_KEY | Server | Khóa API có quyền tối thiểu |
| CLOUDCONVERT_ENV | Server | `sandbox` hoặc `production`, không cho client quyết định |
| JOB_TOKEN_KEY | Server | 32 byte ngẫu nhiên, base64url, cho JWE A256GCM |
| APP_ORIGIN | Server | Origin chính xác của deployment được phép |
| TURNSTILE_SECRET_KEY | Server | Secret verify challenge |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Public | Site key đúng hostname |
| CONVERSIONS_ENABLED | Server | `true`/`false`; production mặc định fail-closed nếu thiếu |

Allowlist upload/output hosts lấy từ provider spike và cấu hình server đã review, không do request gửi lên. Nếu cần cấu hình engine/options, chỉ thêm biến sau capability validation; không tạo env giả định tên engine.

`.env.example` chỉ placeholder và giải thích; `.env.local` gitignored. Key production không dùng trong automated PR previews. Thiếu env production: build/UI có thể tải nếu thiết kế cho phép, API create trả lỗi configuration an toàn; tuyệt đối không âm thầm chạy mock.

## Quyền chạy kiểm thử

Theo [quy trình làm việc](../planning/WORKFLOW.md), luôn hỏi và chờ chủ dự án đồng ý trước mỗi lần chạy test, chạy lại, smoke test, thử provider hoặc benchmark trong tài liệu này. Nêu rõ phạm vi, môi trường và chi phí/tác động nếu có. Chưa được phép thì ghi `not run — chưa được cho phép`; các tiêu chí nghiệm thu vẫn được giữ nguyên. Checklist và kế hoạch không tự cấp quyền chạy test hoặc deploy.

## Checklist triển khai

1. Tạo project từ Git repo, xác nhận framework/build command và Node version tương thích.
2. Cài dependencies qua lockfile, kiểm tra scripts/hooks trước khi chạy lint/typecheck/build; hỏi trước khi chạy tests hoặc lệnh có chứa test.
3. Thiết lập env riêng Preview/Production. Deploy trước với conversions tắt nếu chưa có key/guardrails.
4. Đăng ký Turnstile host đúng. Với preview URL động, dùng origin cấu hình chặt hoặc môi trường preview ổn định; không chấp nhận mọi domain `vercel.app`.
5. Cấu hình WAF/rate rule thực sự có trên plan; ghi lại cách test. Nếu plan không hỗ trợ nhu cầu, giữ preview có bảo vệ hoặc chọn giải pháp nền tảng phù hợp, không tự thêm DB.
6. Smoke test direct-upload từ URL Vercel thật với PDF >4.5 MB, output DOCX có thể >4.5 MB và tải trực tiếp được.
7. Test reload/resume, mất mạng, provider 429, hết credit, token expired và delete.
8. Xem network/logs để xác nhận Functions không nhận/trả file bytes và không lộ key/token.
9. Mở DOCX bằng Word, kiểm text/bảng; lưu báo cáo quality. Preview deploy pass không thay được benchmark.
10. Chỉ bật public conversion sau khi integration, cost guardrails và phạm vi chất lượng được xác nhận.

## Vận hành

- Theo dõi error rate và latency metadata qua metric không chứa dữ liệu tài liệu; usage/cost thật qua dashboard provider/Vercel.
- Nâng engine/dependency phải rerun corpus có nguy cơ ảnh hưởng, không chỉ build.
- Khi sự cố phí/provider: tắt create qua env và redeploy theo semantics env Vercel; status/delete vẫn được phục vụ nếu có key và token hợp lệ.
- Rollback code không tự hoàn tiền hoặc xóa các provider job đã tạo. Duy trì key JWE khi rollback để tránh mất resume; xoay khi cần vô hiệu tất cả token và thông báo tác động.
- Nếu key bị lộ: revoke provider key, đổi secret, redeploy, kiểm tra usage. Không chỉ xóa key khỏi commit mới nhất.

Vercel deployable không đồng nghĩa zero cost hoặc mọi workload phù hợp Hobby; kiểm tra điều khoản và hạn mức plan dùng thật tại lúc phát hành.
