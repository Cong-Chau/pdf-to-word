# Quy trình làm việc và quyền chạy test

## Thứ tự áp dụng

Chỉ dẫn trực tiếp của chủ dự án được ưu tiên; tiếp theo là `AGENTS.md`, quy trình này và đặc tả liên quan. Skill trong `.claude/skills/` hỗ trợ công việc, không tự cấp quyền chạy test, commit, push hoặc deploy. Khi tài liệu mâu thuẫn, nêu rõ điểm cần thống nhất; không âm thầm bỏ yêu cầu sản phẩm hoặc nghiệm thu.

## Luôn hỏi trước khi chạy test

- Có thể đọc mã, viết hoặc cập nhật test trong phạm vi công việc đã giao.
- Trước **mỗi lần chạy test**, phải hỏi chủ dự án và chờ câu trả lời đồng ý rõ ràng. Nêu lệnh hoặc thao tác, phạm vi, môi trường, dữ liệu sử dụng và khả năng phát sinh phí hay thay đổi dữ liệu nếu có.
- Áp dụng cho unit, integration, contract, E2E, test qua trình duyệt, smoke test, thử conversion/provider, benchmark và chạy lại sau khi sửa lỗi. Một lần đồng ý không tự cho phép lần chạy sau.
- Có thể đề xuất một đợt gồm nhiều lệnh, nhưng phải liệt kê toàn bộ trước khi hỏi; chỉ chạy đúng đợt được duyệt. Không tự mở rộng sang full suite.
- Không xem yêu cầu triển khai, sửa lỗi, hoàn tất dự án, API key có sẵn hoặc gate nghiệm thu là đồng ý chạy test. Không tự cấu hình CI/hook chạy tests nếu chưa được duyệt cơ chế đó.
- Nếu chưa có câu trả lời hoặc bị từ chối, tiếp tục các phần độc lập và ghi `not run — chưa được cho phép` cho phần kiểm thử. Không đánh dấu pass hoặc hoàn tất gate phụ thuộc vào test đó.

## Kiểm tra không chạy test

Được đọc/so sánh file, rà liên kết và kiểm tra định dạng tài liệu. Lint, typecheck và build có thể chạy trong phạm vi công việc khi không chạy test hoặc gọi dịch vụ thật. Trước khi chạy, đọc script và hook liên quan; nếu có test lồng bên trong, tách lệnh an toàn hoặc hỏi quyền cho toàn bộ lệnh. Không dùng tên “kiểm tra”, “spike” hoặc “validation” để né quy định chạy test.

## Thiết kế, kế hoạch và tài liệu

- Đọc tài liệu hiện có trước khi đề xuất; tận dụng thiết kế đã được chủ dự án chấp thuận. Không bắt đầu lại brainstorming chỉ vì nhận một bước tiếp theo đã rõ.
- Với thay đổi nhỏ đã được yêu cầu rõ, tiến hành trong phạm vi đó. Với quyết định kiến trúc chưa rõ hoặc mở rộng phạm vi, trình bày phương án cụ thể và hỏi về quyết định còn thiếu.
- Đặt thiết kế mới tại `docs/architecture/`, kế hoạch tại `docs/planning/`; chỉ tạo khi công việc cần. Thêm liên kết vào `docs/README.md`.
- Báo cáo spike đặt tại `docs/integrations/PROVIDER-SPIKE-RESULTS.md`; báo cáo chất lượng đặt tại `docs/quality/QUALITY-RESULTS.md`. Tạo hoặc cập nhật khi thực hiện công việc tương ứng; phân biệt kết quả thật, chưa chạy và blocker. Không tạo báo cáo pass giả.
- Giữ tiêu chí nghiệm thu trong đặc tả: việc chưa được phép chạy test không có nghĩa được miễn nghiệm thu hoặc được công bố production-ready.

## Git và bàn giao

Kiểm tra repo/branch/trạng thái trước khi sửa; giữ thay đổi không liên quan. Nếu chưa có Git, không giả định worktree hoặc commit tồn tại. Chỉ commit khi chủ dự án cho phép; push và deploy/publish cần quyền riêng cho hành động tương ứng. Kế hoạch không được mặc định tự commit mỗi task.

Bàn giao gồm thay đổi, kiểm tra tĩnh đã chạy, tests đã được duyệt và thực sự chạy, tests chưa chạy cùng lý do, blocker và giới hạn còn lại. Không lưu secrets, tài liệu nhạy cảm hoặc raw provider response vào báo cáo.
