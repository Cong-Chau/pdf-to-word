# 05 — Chất lượng, giới hạn 99% và nghiệm thu

## Không có một thước đo “99% giống” chung

Độ đúng chữ, hình thức trang và khả năng chỉnh sửa là ba tiêu chí riêng. SSIM 0.99 không có nghĩa 99% chữ đúng; ảnh trang giống hoàn hảo không có nghĩa DOCX sửa được. Không gộp các tiêu chí thành một con số marketing.

Mục tiêu “gần bản gốc nhất” phải kiểm chứng trên tài liệu người dùng thực sự xử lý. Trước khi có mẫu, các ngưỡng dưới đây là ngưỡng đề xuất cho dự án, không phải kết quả engine đã đạt.

## Tập mẫu tối thiểu 30 PDF có quyền sử dụng

| Nhóm | Số file | Trường hợp |
|---|---:|---|
| Văn bản số một cột | 6 | Tiếng Việt/Anh, serif/sans, danh sách |
| Bảng và biểu mẫu | 6 | Merge cell, hàng dài, bảng nhiều trang, đường viền |
| Layout phức tạp | 6 | Hai cột, ảnh xen chữ, header/footer, footnote |
| Scan | 6 | 300 dpi sạch, nghiêng, mờ, tiếng Việt, mixed text/scan |
| Đặc biệt | 6 | Font nhúng/subset, công thức, ký hiệu, xoay trang, trang khổ hỗn hợp, dài |

Tạo thêm file test lỗi riêng: password, damaged, fake extension, zero byte, dung lượng trên UI limit. Không đưa vào điểm chất lượng vì chúng không phải conversion hợp lệ.

## Quyền chạy kiểm thử

Theo [quy trình làm việc](../planning/WORKFLOW.md), luôn hỏi và chờ chủ dự án đồng ý trước mỗi lần chạy test, chạy lại, smoke test, thử provider hoặc benchmark trong tài liệu này. Nêu rõ phạm vi, môi trường và chi phí/tác động nếu có. Chưa được phép thì ghi `not run — chưa được cho phép`; các tiêu chí nghiệm thu vẫn được giữ nguyên. Checklist và kế hoạch không tự cấp quyền chạy test hoặc deploy.

## Quy trình đánh giá tái lập

1. Lưu mã định danh mẫu, SHA-256, số trang, loại PDF, ngôn ngữ, ngày và quyền dùng. Không commit tài liệu nhạy cảm.
2. Chạy provider với engine/options cụ thể; ghi phiên bản nếu có, thời gian và phí từ báo cáo thật. Không ước lượng phí bằng số trang nếu billing không tính theo trang.
3. Mở DOCX bằng Microsoft Word desktop mục tiêu. Kiểm tra không có repair warning, sửa đoạn, sửa ô bảng, tìm kiếm/copy chữ có dấu và lưu lại được.
4. Export DOCX → PDF bằng Word trên máy có bộ font mục tiêu và font được cấp phép. Giữ cố định Word version, OS, font, paper size, locale và DPI.
5. Render PDF nguồn và PDF xuất lại ở cùng 150–200 dpi; kiểm tra số trang và kích thước trước. So overlay/diff và SSIM từng trang sau căn chỉnh rất nhỏ nếu cần.
6. Không resize/crop mạnh để che sai bố cục. Nếu khác số trang, đánh dấu page-flow failure và so theo đoạn/trang tương ứng; không chỉ so N trang đầu rồi bỏ phần thừa.
7. Đối chiếu text với bản chuẩn đã được con người xác minh. Unicode NFC, giữ nguyên dấu, số và dấu thập phân. Báo riêng metric raw và normalized nếu bỏ line-break/hyphen do layout.
8. Hai lượt review trực quan cho trang khó; ghi lỗi, mức độ, trang, ảnh minh họa đã được phép và lựa chọn engine.

LibreOffice cục bộ/CI có thể dùng kiểm tra sơ bộ nếu có, nhưng kết quả không thay nghiệm thu trên Word khi Word là nơi người dùng mở file. Không triển khai Word/LibreOffice trong Vercel để benchmark.

## Ngưỡng đề xuất

| Tiêu chí | PDF số thông thường | PDF phức tạp / scan |
|---|---|---|
| File mở/lưu được | 100% mẫu hợp lệ | 100% mẫu hợp lệ |
| Mất trang/đoạn/số liệu | 0 lỗi nghiêm trọng | 0 lỗi nghiêm trọng nếu công bố hỗ trợ nhóm đó |
| CER trên text chuẩn | ≤0.1% | Scan sạch mục tiêu ≤1%; báo riêng tiếng Việt |
| Bảng chính | Số ô/merge/nội dung đúng, sửa được | Review từng bảng; không chấp nhận bảng bị biến thành ảnh |
| Bố cục | Không cắt chữ/chồng chữ, giữ số trang cho nhóm đơn giản | Báo lỗi page-flow và severity theo từng file |
| SSIM | Báo median, p10 và min; mục tiêu tham khảo median ≥0.98 | Theo dõi để so engine, không dùng riêng làm gate |
| Editability | Chữ là text; bảng cốt lõi là table; sửa và lưu được | Text box chấp nhận có ghi nhận; không phải một ảnh toàn trang |

CER = (substitution + deletion + insertion) / số ký tự chuẩn; metric có thể lớn hơn 100% khi sai rất nhiều. Text nguồn PDF trích xuất máy không mặc nhiên là ground truth, nhất là font mapping và scan.

Một sai số ở mã nhân viên, số tiền, ngày tháng hoặc dấu âm có thể là critical dù CER tổng rất thấp. Không cho điểm trung bình che lấp lỗi critical.

## Quyết định phát hành

- Đạt nhóm văn bản số nhưng scan chưa đạt: công bố đúng phạm vi; scan có cảnh báo hoặc chặn theo policy đã chọn.
- CloudConvert không đạt: thử Adobe cùng corpus và điều kiện; chọn theo bằng chứng chất lượng, hỗ trợ tiếng Việt, direct-upload compatibility, chi phí và dữ liệu.
- Cả hai không đạt: ghi chưa đạt, thu hẹp nhóm được hỗ trợ hoặc đề xuất bước chỉnh tay. Không đổi sang DOCX toàn ảnh để làm đẹp điểm.
- Nếu sau này muốn dùng số “99%”, phải định nghĩa metric, corpus, cỡ mẫu, phân phối lỗi, môi trường và ngày đo. Không suy rộng tới mọi tài liệu.

## Báo cáo đầu ra

`docs/quality/QUALITY-RESULTS.md` có bảng từng mẫu: ID, loại, engine/version/options, Word version, trang nguồn/kết quả, CER, SSIM, editable pass/fail, critical issues, latency, cost, verdict. Thiếu metric ghi `not measured`, không điền số giả. Chưa có key/mẫu thì ghi `not run` và không nghiệm thu chất lượng.
