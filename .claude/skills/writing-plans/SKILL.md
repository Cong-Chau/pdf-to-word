---
name: writing-plans
description: Lập kế hoạch triển khai nhiều bước từ đặc tả hoặc thiết kế đã thống nhất, với trách nhiệm file, phụ thuộc và cách xác minh cụ thể.
---

# Writing Plans

Khi áp dụng skill, thông báo ngắn cho chủ dự án. Đọc `AGENTS.md`, `docs/planning/WORKFLOW.md` và đặc tả liên quan. Không lập lại kế hoạch cho thay đổi nhỏ đã rõ hoặc thiết kế đã đủ để thực hiện trực tiếp.

## Vị trí và nội dung

Lưu kế hoạch cần thiết tại `docs/planning/YYYY-MM-DD-<feature-name>.md`; cập nhật mục lục `docs/README.md`. Chỉ dùng Tracking ID nếu đã được cung cấp. Không tự commit tài liệu.

Mỗi kế hoạch ghi:

- Mục tiêu, phạm vi và link tới đặc tả đã thống nhất.
- Kiến trúc, stack và ràng buộc toàn dự án.
- File cần tạo/sửa và trách nhiệm của từng file.
- Task với phụ thuộc, interface đầu vào/đầu ra, nội dung thực hiện cụ thể và tiêu chí hoàn tất.
- Kiểm tra tĩnh, test cần chuẩn bị, đợt chạy dự kiến cần xin phép và các blocker như credential/mẫu PDF.

Chỉ ghi các task song song khi không sửa chung file hoặc phụ thuộc kết quả của nhau. Việc mô tả phụ thuộc không tự cho phép dùng subagent.

## Mẫu task

```markdown
### Task N: Tên phần việc

**Depends on:** task trước hoặc none
**Files:** đường dẫn cụ thể từ root và trách nhiệm
**Interfaces:** chữ ký/type trao đổi với phần khác nếu có

- [ ] Triển khai hành vi đã mô tả, gồm xử lý lỗi liên quan.
- [ ] Chuẩn bị test có giá trị trong phạm vi thay đổi.
- [ ] Đọc scripts/hooks, chạy kiểm tra tĩnh không chứa test.
- [ ] Hỏi và chờ chủ dự án đồng ý trước đợt test đã nêu lệnh/phạm vi/môi trường.
- [ ] Ghi kết quả thật hoặc not run cùng lý do; cập nhật trạng thái task/gate.
```

Task thực tế phải thay mô tả mẫu bằng đường dẫn, hành vi, interface và lệnh đã xác minh theo repo. Không bịa script hoặc version chưa tồn tại, không điền TODO/TBD thay thiết kế. Không cần chép toàn bộ mã ứng dụng vào kế hoạch nếu interface và tiêu chí đã đủ cụ thể.

## Báo cáo và quyền chạy

Tạo task cho báo cáo spike và chất lượng khi đặc tả yêu cầu: `docs/integrations/PROVIDER-SPIKE-RESULTS.md`, `docs/quality/QUALITY-RESULTS.md`. Không tạo thêm tài liệu handoff/review riêng nếu không cần; kết quả ngắn có thể báo trong chat hoặc kế hoạch.

Luôn hỏi và chờ đồng ý trước mỗi lần chạy test, kể cả chạy lại, smoke test, thử provider và benchmark. Liệt kê lệnh/thao tác, phạm vi, môi trường và phí/tác động. Không xếp test vào lệnh kiểm tra tĩnh để chạy tự động. Không mặc định thêm tests vào CI/hook, commit mỗi task, push hay deploy; các hành động này theo quyền trong `docs/planning/WORKFLOW.md`.

## Review và bàn giao

Tự rà coverage yêu cầu, nội dung còn thiếu, interface và phụ thuộc. [Mẫu review](plan-document-reviewer-prompt.md) có thể dùng trực tiếp; không tự dispatch subagent.

Bàn giao link kế hoạch, quyết định còn thiếu và bước tiếp theo. Khi người dùng đã yêu cầu thực hiện kế hoạch, dùng [executing-plans](../executing-plans/SKILL.md) trong phạm vi đó; không hỏi lại quyền triển khai đã có. Quyền chạy test vẫn phải hỏi riêng trước mỗi lần chạy.
