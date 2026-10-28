# 06 — Giao diện và nội dung

## Thiết kế

Một trang đơn giản, sáng, nền xám nhạt, nội dung tối đa khoảng 960 px, một điểm nhấn xanh. Không dashboard, sidebar, tài khoản hoặc biểu đồ không cần thiết. Typography hỗ trợ đầy đủ dấu tiếng Việt.

Thứ tự: tiêu đề → mô tả → vùng chọn file → thông tin PDF → thông báo dữ liệu → nút chuyển đổi → tiến trình/kết quả → FAQ và privacy link.

## Nội dung đề xuất

- H1: “Chuyển PDF sang Word”
- Mô tả: “Tạo file Word có thể chỉnh sửa, ưu tiên giữ bố cục, bảng và hình ảnh của tài liệu.”
- Dropzone: “Kéo thả PDF vào đây” / “Chọn file PDF”.
- Giới hạn: “Một file mỗi lần · Tối đa 20 MiB trong ứng dụng”. Chỉ ghi giới hạn server nếu đã cưỡng chế thật.
- Thông báo: “File sẽ được gửi tới CloudConvert để chuyển đổi và lưu tạm theo chính sách của dịch vụ. Chỉ tiếp tục nếu bạn đồng ý và có quyền xử lý tài liệu này.”
- CTA: “Chuyển sang Word”.
- Cảnh báo chất lượng: “PDF scan, font đặc biệt hoặc bố cục phức tạp có thể cần chỉnh lại sau khi chuyển.”
- Kết quả: “File Word đã sẵn sàng” / “Tải file .docx” / “Xóa file đã xử lý”.
- Chú thích: “Hãy kiểm tra lại số liệu, dấu tiếng Việt và bảng trước khi sử dụng.”

Không đặt badge “99%”, “miễn phí vô hạn”, “không rời thiết bị”, “không lưu file” hoặc “xóa tức thì” khi không đúng.

## Các state cần thiết

| State | Hiển thị và thao tác |
|---|---|
| idle | Chọn file |
| preflighting | Đọc thông tin; có thể đổi file |
| ready | Metadata, privacy acceptance, CTA |
| creating | Disable CTA để chống double-click |
| create_uncertain | Giải thích chưa xác nhận job; không retry tự động |
| uploading | Phần trăm bytes nếu đo được; nhãn rõ là upload |
| queued/converting/exporting | Stepper và spinner; không phần trăm convert giả |
| network_paused | Giữ token; “Kiểm tra lại” |
| completed | Tải DOCX, xóa; không xóa trước khi người dùng tải |
| failed | Thông điệp theo lỗi, bước xử lý |
| deleting | Chờ xác nhận; khóa thao tác liên quan |
| delete_failed | “Chưa xóa được”, nút thử lại |
| deleted/expired | Không còn link tải; cho chọn file mới |

Bấm “Dừng tải lên” chỉ abort upload và thử cleanup job, thông báo riêng nếu cleanup thất bại. Không hứa hủy conversion khi provider chưa xác nhận.

## Preview và tải xuống

Preview PDF là tùy chọn sau MVP: render local bằng PDF.js, worker self-hosted cùng version package; giới hạn số trang render để tránh tốn RAM. Không cần DOCX preview để hoàn thành MVP; preview HTML không chứng minh Word layout đúng.

Dùng link trực tiếp tới output HTTPS đã validate, `rel=noreferrer noopener` nếu mở tab mới và Referrer-Policy phù hợp. Không dựa vào thuộc tính `download` để đổi tên cross-origin; xác minh Content-Disposition của provider. Tên file chỉ render như text, không innerHTML.

## Accessibility và mobile

Input file có label; dropzone bấm và dùng bàn phím được; aria-live thông báo đổi giai đoạn nhưng không đọc phần trăm quá dày. Focus tới lỗi hoặc kết quả phù hợp, contrast đủ, reduced-motion, nút chạm dễ dùng. Không để màu là cách duy nhất phân biệt trạng thái. Kiểm tra rộng 375 px và desktop, tên file dài và tiếng Việt có dấu.

## Privacy page

Nêu loại dữ liệu, bên xử lý, lưu tạm, hạn capability khác hạn file, nút xóa, trường hợp xóa thất bại, log tối thiểu và liên kết chính sách provider. Không nhận là tư vấn pháp lý hoặc tự gắn chứng nhận bảo mật chưa có.
