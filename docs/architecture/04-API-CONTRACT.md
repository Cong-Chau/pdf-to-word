# 04 — Hợp đồng API ứng dụng

API same-origin, JSON UTF-8, schema strict, reject unknown fields. Body tối đa 16 KiB qua đọc stream có giới hạn; không chỉ tin Content-Length. Mọi response có `Cache-Control: no-store`; không cache status/download URL. Request chứa capability không được ghi vào logs.

## POST /api/conversions

Request:

```json
{
  "fileName": "tai-lieu.pdf",
  "fileSizeBytes": 1048576,
  "privacyAccepted": true,
  "turnstileToken": "browser-challenge-token"
}
```

`fileName`: 1–180 ký tự sau normalize/sanitize; `.pdf` không phân biệt hoa thường. Size integer 1..20971520 là khai báo dùng UX/validation, không chứng minh bytes thực. Không nhận arbitrary operation, URL, task graph hay engine từ client. OCR options chỉ thêm trong phiên bản contract sau spike; không nhận option chưa hỗ trợ.

Response 201:

```json
{
  "conversionToken": "opaque-jwe",
  "expiresAt": "2026-10-28T12:00:00.000Z",
  "status": "awaiting_upload",
  "upload": {
    "method": "POST",
    "url": "https://provider-upload-host.example/upload-path",
    "fields": { "providerField": "providerValue" }
  }
}
```

URL trong ví dụ là placeholder, không phải domain thực để đưa vào allowlist. Tên/số field upload lấy từ provider, không hardcode theo ví dụ. Không trả provider API key hoặc raw job response. Nếu timeout create, trả lỗi `CREATE_OUTCOME_UNKNOWN` và không tự tạo job khác. Không có idempotency guarantee nếu chưa chứng minh bằng API provider.

## POST /api/conversions/status

```json
{ "conversionToken": "opaque-jwe" }
```

Response 200 khi đang chạy:

```json
{ "status": "converting", "pollAfterMs": 5000 }
```

Response 200 hoàn tất:

```json
{
  "status": "completed",
  "download": {
    "url": "https://provider-output-host.example/output.docx",
    "fileName": "tai-lieu.docx"
  }
}
```

Không tự bịa `download.expiresAt`: chỉ thêm khi provider trả hoặc có quy tắc hết hạn đã xác minh. Capability có hạn riêng; thông tin UI phải phân biệt hạn ứng dụng và hạn file provider.

Business failure của job trả 200 với `status: failed`, object `error`; lỗi giao thức/quyền/provider transport trả HTTP phù hợp. Terminal state: completed, failed, deleted, expired. `expired` chỉ dùng khi có bằng chứng job/output hết hạn; capability hết hạn trả HTTP 401/TOKEN_EXPIRED.

## POST /api/conversions/delete

Body giống status. Dùng POST để giữ token khỏi URL và tránh vấn đề DELETE body giữa proxy. Response 200 `{ "status": "deleted" }` sau xác nhận. Lặp xóa cùng capability đã được xác thực mà upstream 404 thì coi đã không còn. Không dùng timeout xóa làm bằng chứng thành công.

## Danh sách trạng thái

`awaiting_upload | queued | converting | exporting | completed | failed | deleted | expired`.

State `uploading`, `preflighting`, `network_paused`, `create_uncertain` là state local UI, không ép provider phải cung cấp. Khi import đang xử lý chưa rõ conversion đã bắt đầu, map conservatively sang queued.

## Envelope lỗi

```json
{
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "Dịch vụ chuyển đổi đang bận. Bạn có thể kiểm tra lại sau.",
    "retryable": true,
    "requestId": "opaque-request-id"
  }
}
```

| HTTP | Code ví dụ | Hành vi client |
|---|---|---|
| 400 | INVALID_REQUEST, UNSUPPORTED_FILE | Sửa/chọn lại file |
| 401 | INVALID_TOKEN, TOKEN_EXPIRED | Dừng polling, giải thích hết phiên |
| 403 | ORIGIN_REJECTED, BOT_CHECK_FAILED | Không gọi provider; thử challenge mới nếu phù hợp |
| 404 | CONVERSION_NOT_FOUND | Không suy sang lỗi toàn dịch vụ |
| 413 | REQUEST_TOO_LARGE | Dừng gửi payload lớn |
| 429 | RATE_LIMITED | Tôn trọng Retry-After |
| 502/503 | PROVIDER_UNAVAILABLE, PROVIDER_QUOTA_EXCEEDED | Giữ job đã có, không tạo mới tự động |
| 504 | UPSTREAM_TIMEOUT, CREATE_OUTCOME_UNKNOWN | Status có thể thử lại; create cần giải thích nguy cơ trùng |

Mã job failure có thể gồm PASSWORD_PROTECTED, INVALID_PDF, CONVERSION_FAILED, OUTPUT_MISSING, UNSUPPORTED_OCR. Chỉ dùng mã cụ thể khi response upstream đủ chứng cứ, nếu không dùng CONVERSION_FAILED.

Status và delete yêu cầu Origin same-origin cho luồng browser. Tất cả route chống oversized body, validate token trước gọi provider. Test client CLI phải cung cấp Origin hợp lệ; Origin check không thay thế capability hoặc chống bot.
