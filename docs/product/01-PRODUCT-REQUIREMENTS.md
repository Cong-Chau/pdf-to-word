# 01 — Yêu cầu sản phẩm

## Đối tượng và đầu ra

Người dùng muốn lấy lại nội dung có thể sửa trong Microsoft Word, giữ hình thức gần PDF nhất có thể. Đầu ra duy nhất của MVP là `.docx`, không phải `.doc` cũ.

Ưu tiên: không mất/sai nội dung → cấu trúc bảng và thứ tự đọc → bố cục → thuận tiện chỉnh sửa → tốc độ. Khi hai mục tiêu xung đột, ghi nhận kết quả benchmark thay vì che giấu bằng ảnh trang.

## Chức năng MVP

- Kéo thả hoặc chọn một PDF; hỗ trợ thao tác bàn phím và mobile.
- Hiện tên, kích thước, số trang nếu đọc được; kiểm tra sơ bộ trước upload.
- Mặc định tối đa 20 MiB ở UI, một file, không batch. Đây là giới hạn ứng dụng dự kiến, chưa phải giới hạn an toàn đã được provider cưỡng chế.
- Mục tiêu trải nghiệm cho tài liệu ≤100 trang. Số trang kiểm tra tại browser là advisory, không phải cơ chế chống gian lận.
- PDF có mật khẩu: MVP từ chối và hướng dẫn người dùng cung cấp bản không khóa. Không nhận hoặc giữ mật khẩu.
- Hiện thông báo file được gửi tới đối tác xử lý và liên kết chính sách trước nút chuyển đổi.
- Tạo job, upload trực tiếp, theo dõi các giai đoạn thật, tải DOCX, xóa job/file qua thao tác rõ ràng.
- Reload cùng tab có thể tiếp tục polling bằng token còn hạn. Không phục hồi file local đã mất sau reload trước khi upload xong.
- Mất mạng: giữ thông tin job hiện tại và cho thử kiểm tra lại, không tự tạo conversion mới.
- Giao diện tiếng Việt, giữ Unicode và dấu trong nội dung/tên file sau sanitize.

## OCR

Nhận diện sơ bộ PDF scan/mixed chỉ giúp cảnh báo. Chỉ hiện lựa chọn OCR/ngôn ngữ khi adapter đã xác minh provider hỗ trợ đúng tính năng đó. Không thêm dropdown tiếng Việt nếu engine không hỗ trợ OCR tiếng Việt đã kiểm chứng.

PDF scan tiếng Việt là một nhóm nghiệm thu riêng. Nếu chưa đạt, ghi “PDF scan tiếng Việt chưa được hỗ trợ ổn định” trước chuyển đổi; không gắn nhãn chất lượng cao cho nhóm đó. Không suy từ khả năng đọc văn bản tiếng Việt sang hỗ trợ OCR tiếng Việt.

## Ngoài phạm vi

Không tài khoản, DB, lịch sử lâu dài, billing người dùng, chỉnh DOCX trong web, URL import tùy ý, email kết quả, API công khai cho bên thứ ba, file nén, PDF portfolio, chữ ký số tương đương pháp lý hoặc chuyển đổi hàng loạt.

Một chế độ DOCX chứa ảnh trang có thể đánh giá sau nếu có nhu cầu, phải ghi rõ không sửa được chữ. Không thay thế chế độ DOCX chỉnh sửa được trong MVP.

## Tiêu chí sản phẩm

- Người dùng hiểu khi nào file rời thiết bị, khi nào đang upload và khi nào đang chuyển đổi.
- Không có lời hứa “không lệch”, “chính xác 99%” hoặc “xóa ngay” thiếu bằng chứng.
- Lỗi phải có bước tiếp theo: chọn file khác, thử kiểm tra job, chờ hạn mức hoặc liên hệ hỗ trợ.
- Mỗi lần bấm tải dùng kết quả của chính job đã được xác thực.
- Không phụ thuộc một instance Vercel tồn tại lâu; đổi instance vẫn xem được trạng thái bằng token.
- Chưa có benchmark đạt và smoke test thật thì không tuyên bố production-ready.
