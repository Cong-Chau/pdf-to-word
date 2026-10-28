# 10 — Prompt dùng với Codex

Các prompt dưới đây tuân thủ `AGENTS.md` và `docs/planning/WORKFLOW.md`. Không prompt nào tự cấp quyền chạy test, commit, push hoặc deploy.

## Prompt khởi động

Sao chép nguyên đoạn sau vào Codex tại repo đã có bộ tài liệu:

```text
Hãy triển khai website PDF → DOCX theo AGENTS.md và docs/README.md.
Đọc đủ 11 tài liệu theo mục "Thứ tự đọc" trong docs/README.md trước khi triển khai.
Tuân thủ docs/planning/WORKFLOW.md: luôn hỏi và chờ tôi đồng ý trước mỗi lần
chạy test, kể cả chạy lại, smoke test, spike provider hoặc benchmark. Nêu
lệnh/thao tác, phạm vi, môi trường và phí/tác động nếu có. Không tự commit,
push hoặc deploy khi chưa được tôi cho phép hành động đó.

Mục tiêu: DOCX sửa được, giữ bố cục và tiếng Việt tốt nhất trong phạm vi đã
được benchmark. Không DB/Redis/ORM, deploy ứng dụng bằng Vercel. Dùng Next.js,
TypeScript strict, Tailwind và provider adapter CloudConvert trước.

Bắt đầu bằng kiểm tra repo và spike provider/direct-upload, rồi thực hiện
kế hoạch theo các gate. Không viết engine PDF-to-Word thủ công, không ghép
text thành Word đơn giản, không nhúng nguyên ảnh trang để giả editability,
không chạy LibreOffice trong Vercel. Không tuyên bố giống 99% khi chưa đo.

PDF và DOCX đi trực tiếp browser ↔ provider; Vercel chỉ xử lý JSON metadata.
Dùng async job, capability JWE ngắn hạn, status polling và delete đã xác thực.
Không lưu job bằng Map để giả DB, không retry create mù sau timeout, không
đưa API key vào client, không bịa OCR/engine options.

Nếu thiếu API key hoặc PDF mẫu, xây UI/contracts, chuẩn bị mock tests và đánh dấu
rõ phần chưa kiểm chứng. Ghi thông tin cần cấu hình vào .env.example, không
yêu cầu tôi dán secret vào chat. Không production fallback sang mock.

Thực hiện từng giai đoạn, kiểm tra tĩnh phù hợp và cập nhật báo cáo thực tế.
Chuẩn bị test cần thiết; chỉ chạy sau khi đã hỏi và được tôi đồng ý.
Chưa được phép chạy thì ghi not run, không đánh dấu pass hoặc đã nghiệm thu.
Cuối cùng bàn giao code, hướng dẫn deploy, tests đã chạy, kết quả benchmark
hoặc not-run/blockers, và các giới hạn chất lượng/chi phí còn tồn tại.
```

## Prompt kiểm tra sau triển khai

```text
Review implementation theo bộ đặc tả, tập trung vào các lỗi làm bản demo
trông chạy được nhưng production sai:
1. File bytes/base64 có vô tình đi qua Vercel Functions không?
2. Upload field/signature/CORS đã thử từ preview thật chưa?
3. Token có ràng buộc đúng provider job ở status/delete và chống tamper không?
4. Reload, network timeout, double-click có tạo conversion trùng không?
5. Download URL có lấy đúng export task, validate host và không bị log không?
6. FileSize khai báo có bị nhầm là giới hạn server đã enforce không?
7. Xóa/hủy/TTL có phản ánh đúng provider behavior không?
8. OCR tiếng Việt và Word editability đã có mẫu thật hay mới giả định?
9. Chi phí có guardrail thực, WAF/challenge có verify server không?
10. Có claim 99%, phần trăm convert giả hoặc mock trong production không?

Tự sửa các lỗi trong phạm vi đã được yêu cầu, kiểm tra tĩnh bị ảnh hưởng.
Luôn hỏi và chờ tôi đồng ý trước mỗi lần chạy test hoặc chạy lại; nêu lệnh,
phạm vi, môi trường và tác động. Chưa được phép thì ghi not run.
Không tự commit, push hoặc deploy khi chưa được cho phép hành động đó.
Báo findings theo mức độ, dẫn file/line, bằng chứng và việc chưa xác minh.
```

## Prompt benchmark

```text
Đọc docs/quality/05-QUALITY-AND-BENCHMARK.md và chuẩn bị kế hoạch benchmark.
Trước mỗi lần chạy, kể cả chạy lại, hỏi và chờ tôi đồng ý; nêu bộ mẫu,
provider, môi trường, thao tác và chi phí/tác động dự kiến. Có credential
không thay thế quyền chạy. Chưa được phép thì ghi not run.
Sau khi được duyệt, thực hiện đúng phạm vi trên corpus được cung cấp có quyền
sử dụng. Không lấy PDF text extraction máy làm ground truth mặc định.
Ghi engine/version/options, môi trường Word/font và kết quả từng file.
Báo riêng text, visual fidelity, bảng và editability. Không dùng SSIM thay
độ đúng nội dung, không gộp score thành 99% marketing. Nếu không có Word,
credential hoặc corpus, ghi not measured/not run đúng cột và nêu blocker.
Đề xuất supported-scope dựa trên dữ liệu, không bịa số liệu.
```

## Thông tin chủ dự án cần chuẩn bị

API key provider trong môi trường chạy; Turnstile keys; tài khoản Vercel; khoảng 30 PDF đại diện có quyền dùng; máy Word/font để nghiệm thu; mức chi tiêu chấp nhận. Không phải điều kiện để bắt đầu scaffold, nhưng là điều kiện để kiểm chứng tích hợp, chất lượng và phát hành công khai.
