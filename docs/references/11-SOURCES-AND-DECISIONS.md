# 11 — Nguồn và nhật ký quyết định

Kiểm tra nguồn công khai ngày 28/10/2026. Tính năng/gói/engine có thể đổi; Codex phải mở tài liệu chính thức hiện hành khi tích hợp. Các URL bên dưới là nguồn kỹ thuật, không phải kết quả benchmark sản phẩm này.

## Nguồn chính thức

1. Vercel Functions Limits: https://vercel.com/docs/functions/limitations
   - Bản đã đọc ghi payload request/response Function 4.5 MB; runtime/plan có giới hạn duration riêng. Không cần dựa vào max duration dài cho kiến trúc async này.
2. Hướng dẫn bypass body size limit: https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions
3. CloudConvert API introduction: https://cloudconvert.com/docs/getting-started/introduction
4. CloudConvert import files: https://cloudconvert.com/docs/import-export/import-files
   - Hỗ trợ import/upload cho browser trực tiếp, trả form URL/parameters. Phải giữ fields và đặt file cuối. Ví dụ policy ký không chứng minh app được tùy ý sửa max_file_size.
5. CloudConvert jobs: https://cloudconvert.com/docs/api-reference/jobs
6. CloudConvert convert files: https://cloudconvert.com/docs/operations/convert-files
7. CloudConvert export files: https://cloudconvert.com/docs/import-export/export-files
   - Export URL có tính tạm thời; tài liệu mô tả thu hồi tự động sau 24 giờ. Xác minh lại mốc task/output trước khi viết privacy copy cuối.
8. CloudConvert tasks: https://cloudconvert.com/docs/api-reference/tasks
9. CloudConvert PDF to Office: https://cloudconvert.com/apis/pdf-to-office
   - Nhà cung cấp mô tả giữ layout/text/tables và hợp tác Apryse. Đây là mô tả từ nhà cung cấp, không là chứng nhận đạt 99% cho corpus tiếng Việt.
10. Adobe Export PDF: https://developer.adobe.com/document-services/docs/overview/pdf-services-api/howtos/export-pdf
   - Có workflow Export PDF và OCR. Cần kiểm chứng locale, upload architecture, limits và kết quả nếu dùng làm đối chứng.

## Quyết định kiến trúc

| ID | Quyết định | Lý do | Khi xem xét lại |
|---|---|---|---|
| ADR-001 | Không database ứng dụng | Yêu cầu chủ dự án; dùng provider job + capability | Khi cần account/history/quota chính xác |
| ADR-002 | Direct upload/download | Tránh giới hạn file/payload và duration Vercel | Nếu provider không hỗ trợ browser flow cần thiết |
| ADR-003 | CloudConvert là adapter thử đầu tiên | Async workflow và direct browser upload phù hợp | Benchmark hoặc privacy/cost không đạt |
| ADR-004 | DOCX chỉnh sửa được là đầu ra chính | Ý nghĩa thực tế của chuyển sang Word | Chỉ thêm ảnh trang thành chế độ riêng nếu được yêu cầu |
| ADR-005 | Không cam kết 99% đại trà | Chưa có corpus/metric; layout và OCR khác nhau | Có dữ liệu đo với scope cụ thể |
| ADR-006 | Không webhook MVP | Polling không cần persistent callback state | Khi phát triển kiến trúc có state được chấp thuận |
| ADR-007 | Protected preview khi guardrails chưa đủ | Endpoint công khai có thể tiêu credit | Public safeguards được cấu hình và kiểm thử |

## Quyết định về quy trình làm việc

Theo chỉ dẫn trực tiếp của chủ dự án ngày 28/10/2026: **luôn hỏi trước mỗi lần chạy test**. Quy định bao gồm chạy lại, smoke test, provider spike và benchmark; chi tiết tại [WORKFLOW.md](../planning/WORKFLOW.md). Đây là quy tắc thực thi của dự án, không phải thông tin từ tài liệu nhà cung cấp. Tests và báo cáo nghiệm thu vẫn cần thiết; chưa được phép chạy thì ghi `not run`, không đánh dấu pass. Skill cục bộ phải tuân thủ quy trình này.

## Phải xác minh bằng spike / chưa biết

- Engine/version PDF → DOCX thật, options giữ layout, hỗ trợ OCR và locale tiếng Việt.
- XHR upload CORS từ origin deploy; upload form lifetime, field types, maximum file policy.
- Giới hạn size/page cưỡng chế được ở provider trước conversion; không suy từ browser validation.
- Cách tính phí, credit cap thực, retry/cancel semantics và delete khi task đang chạy.
- Domains xuất file, Content-Disposition, thời hạn URL và phản hồi khi xóa.
- Chất lượng từng nhóm mẫu, thời gian và chi phí thật; chưa có số đo trong bộ tài liệu này.

## Điều chỉnh khi có dữ liệu mới

Cập nhật đồng thời PRD, API, adapter, UI copy, tests và README khi thay phạm vi/provider. Ghi ADR mới cùng bằng chứng. Không để tài liệu yêu cầu OCR nhưng UI/backend thực tế chỉ hỗ trợ text PDF.
