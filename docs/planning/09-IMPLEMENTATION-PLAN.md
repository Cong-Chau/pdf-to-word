# 09 — Kế hoạch thực hiện và Definition of Done

## Tiến độ hiện tại — 28/10/2026

Theo yêu cầu “dựng khung trước”, thực hiện phần khung ở giai đoạn 1; chưa vượt qua gate giai đoạn 0. Đã thêm cấu hình Next.js/TypeScript/Tailwind, UI chọn PDF, privacy, contracts, env validation và các route đóng HTTP 503. Chi tiết tại [hướng dẫn local](../development/LOCAL-DEVELOPMENT.md).

Kiểm tra tĩnh đã chạy: `pnpm lint`, `pnpm typecheck`, `pnpm build` đều pass. Build Turbopack trong sandbox lỗi tạo tiến trình xử lý CSS; chạy lại ngoài sandbox thành công. Không có test lồng trong các scripts này. Đã kiểm tra 39 liên kết nội bộ của tài liệu, không có link lỗi tại thời điểm dựng khung.

Tests chưa chạy vì chưa được cho phép. Provider spike, conversion thật, Vercel smoke test, benchmark và nghiệm thu trên trình duyệt/Word chưa chạy. Không đánh dấu giai đoạn 0 hoặc toàn bộ giai đoạn 1 đã nghiệm thu chỉ dựa trên việc dựng mã.

## Quyền chạy kiểm thử

Theo [quy trình làm việc](../planning/WORKFLOW.md), luôn hỏi và chờ chủ dự án đồng ý trước mỗi lần chạy test, chạy lại, smoke test, thử provider hoặc benchmark trong tài liệu này. Nêu rõ phạm vi, môi trường và chi phí/tác động nếu có. Chưa được phép thì ghi `not run — chưa được cho phép`; các tiêu chí nghiệm thu vẫn được giữ nguyên. Checklist và kế hoạch không tự cấp quyền chạy test hoặc deploy.

## Giai đoạn 0 — Spike quyết định tính khả thi

Deliverables: provider spike report, engine options verified, direct-upload preview test, mẫu DOCX thật, đánh giá ban đầu text Việt/bảng/scan, hạn mức chi phí và dữ liệu.

Gate: upload/download không qua Functions, async status hoạt động, Word mở/sửa được. Nếu thiếu key/mẫu: ghi blocked cho kiểm tra thật; vẫn được dựng app và mock, không công bố quality pass. Nếu engine cho scan Việt không phù hợp: ghi phạm vi hạn chế hoặc thử đối chứng có kiểm soát.

## Giai đoạn 1 — Khung ứng dụng

Tạo Next.js/TypeScript/Tailwind, env validation, contracts, error envelope, page upload và privacy, server-only boundaries. Thêm `.env.example`, README chạy local và deploy. Chưa gắn claim chất lượng.

Gate: app chạy, responsive, build/typecheck/lint pass; không có DB/ORM/secret client.

## Giai đoạn 2 — Luồng conversion thật

Cài adapter, create/upload/status/delete, JWE, polling controller, session resume, output validation. Tách preflight khỏi conversion. Mock rõ ràng chỉ test/dev opt-in; không production fallback.

Gate: một PDF text và một PDF >4.5 MB hoàn tất trên preview; không giữ request đến khi convert xong; token A không thao tác job B; timeout không tạo job trùng tự động.

## Giai đoạn 3 — Chất lượng và xử lý lỗi

Chạy corpus, so sánh Word export, test editability, chuẩn hóa lỗi scan/password/quota/network. Chỉ thêm OCR UI nếu đã chứng minh hỗ trợ. Hoàn thiện delete semantics và retention copy.

Gate: có `docs/quality/QUALITY-RESULTS.md` với dữ liệu thật, pass/fail theo nhóm và supported-scope rõ. Không có sample phải ghi not run, không được đánh dấu hoàn tất phần chất lượng.

## Giai đoạn 4 — Harden và phát hành

Turnstile production verify, origin rules, body limits, CSP, logs redaction, cost kill switch, WAF và smoke tests. Public launch theo guardrails thật; có thể chỉ giao protected preview nếu chưa đáp ứng.

## Kiểm thử có giá trị

| Lớp | Trường hợp quan trọng |
|---|---|
| Unit | JWE tamper/expiry/aud/iss/provider; sanitize tên Việt; schema strict; state normalization |
| Contract với mock upstream | fields upload bảo toàn/file cuối; missing output; malformed provider response; 429/quota; create timeout unknown |
| API integration | body quá lớn, Origin sai, challenge fail, token job isolation, no-store, delete 404/idempotent absence |
| Browser E2E | chọn file, trạng thái upload/convert, tải link, reload cùng tab, đổi tab visible, offline/recover, double-click |
| Real provider opt-in | upload từ Vercel, PDF >4.5 MB, output trực tiếp, delete, OCR sample, quota có kiểm soát |
| Manual Word quality | sửa đoạn/ô bảng và lưu, font Việt, page-flow, header/footer, review số liệu |

Real tests có thể tốn phí: không chạy trên mỗi PR không kiểm soát; dùng opt-in credential môi trường test và corpus đã được phép. Không commit file nhạy cảm/keys; mock tests phải ngăn accidental real network call.

## Điều kiện bàn giao

- Mã có hướng dẫn local/deploy, env example và dependency lock.
- Không DB, không file bytes qua API Vercel, không fake conversion output.
- Tests phù hợp và build/typecheck/lint pass, ghi rõ lệnh/kết quả thật.
- Bằng chứng real-provider và Vercel smoke test; nếu chưa chạy, liệt kê chính xác blocker.
- Quality report phân nhóm, không chỉ ảnh screenshot một file đẹp.
- Privacy copy khớp behavior xóa/TTL thực; secret không nằm trong bundle/logs.
- Chủ dự án hiểu chi phí bên thứ ba và phạm vi chưa đạt.
- Không mô tả “xong 100%” nếu mới có UI hoặc mock adapter.
