---
name: executing-plans
description: Thực hiện kế hoạch đã được giao ngay trong phiên hiện tại, ghi tiến độ và bằng chứng; hỏi trước mỗi lần chạy test.
---

# Executing Plans

Khi áp dụng skill, thông báo ngắn cho chủ dự án. Đọc `AGENTS.md`, `docs/planning/WORKFLOW.md`, kế hoạch và đặc tả được tham chiếu. Thực hiện trong phiên hiện tại; không tự dùng subagent.

## Chuẩn bị

- Xác nhận checkout, branch và thay đổi có sẵn nếu có Git; giữ thay đổi không liên quan.
- Dùng checkout/worktree phù hợp khi cần cách ly, không bắt buộc worktree cho mọi thay đổi. Nếu chưa có Git, không tự init chỉ để đáp ứng skill.
- Đánh dấu các task và phụ thuộc. Sửa mơ hồ nhỏ theo đặc tả; hỏi khi thiếu quyết định làm thay đổi phạm vi hoặc kiến trúc chưa được thống nhất.

## Thực hiện

1. Thực hiện task theo phụ thuộc; gộp các chỉnh sửa nhỏ liên quan. Chuẩn bị tests có giá trị, tránh test phản chiếu hằng số hoặc tăng coverage hình thức.
2. Đọc scripts/hooks trước khi chạy lint/typecheck/build. Chỉ chạy tự động khi lệnh không chứa test, không gọi dịch vụ thật và nằm trong phạm vi công việc.
3. **Trước mỗi lần chạy test, hỏi chủ dự án và chờ đồng ý rõ ràng.** Nêu lệnh/thao tác, phạm vi, môi trường, dữ liệu và phí/tác động. Áp dụng cho unit/integration/contract/E2E, test trình duyệt, smoke test, provider spike, benchmark và mỗi lần chạy lại.
4. Chỉ chạy đúng đợt được duyệt. Sau lỗi có thể sửa mã trong phạm vi đã giao, nhưng phải hỏi lại trước lần chạy test tiếp theo. Không xem quyền triển khai, credential hoặc lần test trước là quyền cho lần tiếp theo.
5. Chưa được duyệt chạy thì ghi `not run — chưa được cho phép`, tiếp tục phần độc lập và giữ gate kiểm thử ở trạng thái chưa nghiệm thu. Không báo pass nếu chỉ qua kiểm tra tĩnh.
6. Cập nhật kế hoạch và báo cáo spike/chất lượng tại vị trí đặc tả quy định khi có công việc tương ứng; không lưu secrets hoặc tạo kết quả giả.

Không tự commit theo task. Commit, push, merge và deploy/publish chỉ thực hiện khi được chủ dự án cho phép hành động tương ứng. Nếu thiếu credential hoặc PDF mẫu, triển khai phần độc lập được giao và nêu rõ phần tích hợp/chất lượng chưa xác minh; không fallback production sang mock.

## Bàn giao

Nêu thay đổi, kiểm tra tĩnh đã chạy, đợt test được duyệt và kết quả thật, test chưa chạy cùng lý do, blocker, giới hạn và quyết định đã điều chỉnh. Đánh dấu task/gate dựa trên bằng chứng; không công bố hoàn tất phát hành khi còn thiếu smoke test hoặc benchmark bắt buộc.
