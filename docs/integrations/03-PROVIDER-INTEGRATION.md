# 03 — Engine và tích hợp CloudConvert

## Quyết định có điều kiện

Chọn CloudConvert làm adapter MVP đầu tiên do có workflow chuyển đổi và upload browser trực tiếp. Đây là lựa chọn kỹ thuật để thử nghiệm, **chưa phải kết luận nó chính xác nhất**. Đánh giá Adobe PDF Services làm đối chứng nếu ngân sách cho phép. Chỉ thay provider mặc định sau benchmark và ghi ADR; không ngầm đổi provider theo từng lỗi.

## Quyền chạy kiểm thử

Theo [quy trình làm việc](../planning/WORKFLOW.md), luôn hỏi và chờ chủ dự án đồng ý trước mỗi lần chạy test, chạy lại, smoke test, thử provider hoặc benchmark trong tài liệu này. Nêu rõ phạm vi, môi trường và chi phí/tác động nếu có. Chưa được phép thì ghi `not run — chưa được cho phép`; các tiêu chí nghiệm thu vẫn được giữ nguyên. Checklist và kế hoạch không tự cấp quyền chạy test hoặc deploy.

## Spike bắt buộc trước triển khai đầy đủ

1. Xác thực tài khoản, quyền API tối thiểu cho create/read/delete task/job, PDF → DOCX availability và cách tính phí.
2. Dùng Job Builder hoặc endpoint capabilities hiện hành lấy engine, phiên bản và options hỗ trợ thật.
3. Chuyển thử PDF có text tiếng Việt, bảng nhiều trang và PDF scan có dấu.
4. Từ origin localhost **và Vercel preview**, upload PDF >4.5 MB trực tiếp; ghi CORS, method, fields, redirect, status và thời hạn form.
5. Xác minh export URL tải trực tiếp được, filename, thời hạn, hành vi trên Chrome/Edge/Safari.
6. Xác minh xóa job lúc waiting/processing/finished; quyền và điều kiện hủy task đang chạy.
7. Ghi báo cáo `docs/integrations/PROVIDER-SPIKE-RESULTS.md`: ngày, môi trường, options thật, kết quả, bằng chứng đã che secret, giới hạn và blockers.

Nếu XHR bị CORS, không sửa bằng `mode:no-cors` rồi giả báo upload thành công. Kiểm tra flow HTML form browser do provider hỗ trợ, callback/redirect cùng origin và polling có token được giữ ở sessionStorage. Callback chỉ điều hướng, không tin query để cấp quyền job. Nếu vẫn không khả thi, dừng adapter đó và đề xuất phương án đã kiểm chứng; không proxy bytes qua Vercel để né lỗi.

## Graph job minh họa

```json
{
  "tasks": {
    "upload-input": { "operation": "import/upload" },
    "convert-docx": {
      "operation": "convert",
      "input": "upload-input",
      "input_format": "pdf",
      "output_format": "docx"
    },
    "export-output": {
      "operation": "export/url",
      "input": "convert-docx"
    }
  }
}
```

Đây là graph cơ sở; phải thử bằng API thật. Chỉ thêm `engine`, `engine_version`, OCR/layout options sau khi capabilities xác nhận. Pin engine/version đã benchmark nếu provider cho phép; nếu không, lưu thông tin engine thực tế vào báo cáo đánh giá.

Đặt filename output an toàn theo option chính thức hoặc xử lý tên ở bước tải nếu provider hỗ trợ. Không tự tạo field filename ở operation không cho phép.

## Adapter nội bộ

```ts
interface ConversionProvider {
  create(input: ValidatedCreateInput): Promise<CreatedConversion>;
  getStatus(jobId: string): Promise<NormalizedConversion>;
  delete(jobId: string): Promise<DeleteOutcome>;
}
```

Các type trên là type ứng dụng phải định nghĩa theo `docs/architecture/04-API-CONTRACT.md`, không phải SDK có sẵn. Client không gọi adapter trực tiếp. HTTP base URL cố định phía server; tách sandbox/production bằng env đã validate.

## Upload

Dùng mọi field trong upload form provider trả về; append file cuối; không tự đặt multipart Content-Type. Không sửa `max_file_size`, `expires`, `signature` trong form đã ký. XHR có thể dùng cho upload progress nếu CORS hỗ trợ; tiến độ chỉ phản ánh bytes upload, không đại diện tiến độ convert.

**Khoảng trống giới hạn:** UI chặn 20 MiB không bảo vệ API khỏi client giả mạo. Metadata `fileSizeBytes` không chứng minh file thật. Spike phải xác nhận có thể yêu cầu provider ký policy giới hạn 20 MiB hoặc có ràng buộc tương đương không. Nếu không có, không ghi “server đảm bảo tối đa 20 MiB”. Graph đầy đủ có thể tự chạy conversion ngay khi upload xong; kiểm tra size sau đó không ngăn được phí đã phát sinh. Public launch cần bù bằng giới hạn provider, WAF và ngân sách; nếu chưa kiểm soát được, chỉ preview có bảo vệ.

## Trạng thái và kết quả

Map status provider dựa trên response thật: upload đang chờ → awaiting_upload; task convert waiting/processing → queued/converting; export processing → exporting; export finished có đúng DOCX → completed; task error/canceled → failed theo mã chuẩn hóa. Không coi job finished nhưng thiếu output là thành công.

Chỉ lấy file từ `export-output` thuộc đúng job. MVP kỳ vọng một DOCX; nhiều output bất thường phải báo lỗi, không âm thầm lấy file bất kỳ. URL HTTPS, không userinfo, kiểm tra hostname bằng allowlist xác minh tại spike; không dùng phép kiểm `includes("cloudconvert")`.

## Xóa và lỗi

Theo tài liệu API, `DELETE /v2/jobs/{ID}` xóa job và task/data liên quan; xác minh ngữ nghĩa đang chạy trước khi dùng. Nếu cần cancel task trước, adapter thực hiện thứ tự chính thức. Chỉ trả `deleted` khi đã xác nhận thành công hoặc upstream cho biết không còn tồn tại; lỗi delete phải hiện “Chưa xóa được”. Không nói abort XHR đồng nghĩa hủy job.

Chuẩn hóa lỗi thiếu credit, rate limit, file invalid, password, engine unsupported, timeout và provider unavailable. Log request ID nội bộ; không log raw body. Upstream 429/5xx ở status có thể retry; create không retry mù.
