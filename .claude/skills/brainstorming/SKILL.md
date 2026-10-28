---
name: brainstorming
description: Làm rõ yêu cầu và thiết kế khi dự án có tính năng mới hoặc quyết định kiến trúc chưa thống nhất; không khởi động lại thiết kế đã được duyệt cho một bước tiếp theo rõ ràng.
---

# Brainstorming

Khi áp dụng skill, thông báo ngắn cho chủ dự án. Đọc `AGENTS.md`, `docs/README.md`, `docs/planning/WORKFLOW.md` từ root và đặc tả liên quan trước khi đề xuất.

## Chọn mức độ cần thiết

- Thay đổi nhỏ đã được yêu cầu rõ: mô tả cách thực hiện ngắn gọn và tiến hành trong phạm vi đó. Không cần thêm spec hay vòng duyệt lặp lại.
- Câu hỏi khả thi: làm rõ điều cần xác minh và bằng chứng cần có. Đọc tài liệu/code được; trước khi chạy thử provider, conversion hoặc test phải hỏi và chờ đồng ý.
- Tính năng hoặc kiến trúc chưa thống nhất: trình bày lựa chọn cùng đánh đổi, đề xuất phù hợp với ràng buộc hiện có. Hỏi về quyết định còn thiếu trước khi thực hiện phần phụ thuộc.

Không xem việc đọc tài liệu hoặc yêu cầu chỉnh tài liệu là quyền xây ứng dụng. Không tự mở rộng phạm vi từ một spike sang triển khai sản phẩm.

## Thiết kế

Đọc luồng có sẵn; xác định mục tiêu, phạm vi, thành phần, dữ liệu, lỗi và cách nghiệm thu. Tái sử dụng quyết định đã có; chỉ hỏi thông tin chưa thể suy ra. Nêu khác biệt nếu đề xuất thay đổi đặc tả.

Với thiết kế lớn cần lưu lại, đặt tại `docs/architecture/YYYY-MM-DD-<topic>-design.md`, thêm vào `docs/README.md`. Chỉ chuyển sang lập kế hoạch khi các quyết định chi phối triển khai đã được thống nhất. Có thể dùng [writing-plans](../writing-plans/SKILL.md) cho công việc cần kế hoạch.

Tự review tính đầy đủ, nhất quán, phạm vi và điểm còn mơ hồ. [Mẫu review](spec-document-reviewer-prompt.md) dùng để review trực tiếp; chỉ giao cho subagent khi người dùng yêu cầu hoặc cho phép riêng. Không tạo registry/tracking ID nếu dự án chưa có.

## Quyền thực thi

Tuân thủ `docs/planning/WORKFLOW.md`: luôn hỏi trước mỗi lần chạy test, kể cả chạy lại, smoke test, spike và benchmark; ghi đúng `not run` khi chưa được phép. Thiết kế có thể mô tả tests nhưng không cấp quyền chạy. Không tự commit, push hoặc deploy.

## Visual companion tùy chọn

Chỉ đề xuất khi mockup hoặc sơ đồ giúp làm rõ quyết định. Hỏi trước khi mở companion; nếu đồng ý, đọc [visual-companion.md](visual-companion.md). Không dùng companion để tự chạy E2E hay thử conversion khi chưa hỏi quyền test.
