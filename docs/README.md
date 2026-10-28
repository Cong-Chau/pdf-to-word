# Tài liệu dự án PDF → Word

[Tổng quan dự án](../README.md) · [Chỉ dẫn cho agent](../AGENTS.md)

Tài liệu được chia theo mục đích. Các số 01–11 giữ thứ tự đọc xuyên suốt các nhóm, không phải thứ tự thư mục. Đường dẫn `docs/...` trong nội dung và prompt được tính từ root dự án.

## Thứ tự đọc

| Thứ tự | Tài liệu | Nội dung |
|---|---|---|
| 01 | [01-PRODUCT-REQUIREMENTS.md](product/01-PRODUCT-REQUIREMENTS.md) | Phạm vi và hành vi sản phẩm |
| 02 | [02-ARCHITECTURE.md](architecture/02-ARCHITECTURE.md) | Luồng stateless, upload trực tiếp, capability token |
| 03 | [03-PROVIDER-INTEGRATION.md](integrations/03-PROVIDER-INTEGRATION.md) | Spike và adapter CloudConvert |
| 04 | [04-API-CONTRACT.md](architecture/04-API-CONTRACT.md) | Hợp đồng API ứng dụng |
| 05 | [05-QUALITY-AND-BENCHMARK.md](quality/05-QUALITY-AND-BENCHMARK.md) | Chất lượng, editability, OCR và nghiệm thu |
| 06 | [06-UI-UX.md](product/06-UI-UX.md) | Giao diện và nội dung tiếng Việt |
| 07 | [07-SECURITY-AND-PRIVACY.md](architecture/07-SECURITY-AND-PRIVACY.md) | Quyền truy cập job, dữ liệu và chống lạm dụng |
| 08 | [08-VERCEL-DEPLOYMENT.md](deployment/08-VERCEL-DEPLOYMENT.md) | Môi trường, triển khai và vận hành Vercel |
| 09 | [09-IMPLEMENTATION-PLAN.md](planning/09-IMPLEMENTATION-PLAN.md) | Các giai đoạn và điều kiện hoàn tất |
| 10 | [10-CODEX-PROMPTS.md](planning/10-CODEX-PROMPTS.md) | Prompt triển khai, review và benchmark |
| 11 | [11-SOURCES-AND-DECISIONS.md](references/11-SOURCES-AND-DECISIONS.md) | Nguồn chính thức và nhật ký quyết định |

## Quy trình và skill cục bộ

[Phát triển local và cấu trúc mã](development/LOCAL-DEVELOPMENT.md): cài đặt, chạy ứng dụng và giới hạn của khung hiện tại.

Đọc [quy trình làm việc và quyền chạy test](planning/WORKFLOW.md) trước khi thực thi. Mọi lần chạy test, kể cả chạy lại hoặc benchmark, đều phải hỏi và chờ chủ dự án đồng ý.

Skill hỗ trợ tại root dự án:

- [Brainstorming](../.claude/skills/brainstorming/SKILL.md): làm rõ thiết kế khi có quyết định chưa thống nhất.
- [Writing plans](../.claude/skills/writing-plans/SKILL.md): lập kế hoạch triển khai theo đặc tả.
- [Executing plans](../.claude/skills/executing-plans/SKILL.md): thực hiện kế hoạch trong phạm vi được giao.

## Nơi đặt tài liệu mới

- `product/`: yêu cầu, phạm vi và trải nghiệm người dùng.
- `architecture/`: thiết kế hệ thống, hợp đồng API và bảo mật.
- `integrations/`: tích hợp nhà cung cấp; báo cáo spike dự kiến tại `docs/integrations/PROVIDER-SPIKE-RESULTS.md`.
- `quality/`: quy trình benchmark; báo cáo thực tế dự kiến tại `docs/quality/QUALITY-RESULTS.md`.
- `deployment/`: cấu hình môi trường, triển khai và vận hành.
- `planning/`: kế hoạch công việc và prompt cho agent.
- `references/`: nguồn và các quyết định cùng bằng chứng.
- `development/`: cài đặt, chạy local và hướng dẫn tổ chức mã nguồn.

Hai báo cáo dự kiến chưa được tạo vì chưa chạy spike hoặc benchmark. Khi thêm tài liệu, bổ sung liên kết vào mục lục này và cập nhật các tham chiếu liên quan. Không đặt file PDF/DOCX nhạy cảm, credentials hoặc raw provider response trong tài liệu.
