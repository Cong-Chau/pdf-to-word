import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Quyền riêng tư" };

export default function PrivacyPage() {
  return <main id="main" className="privacy-page">
    <Link href="/" className="quiet-link">← Trở về trang chuyển đổi</Link>
    <span className="eyebrow mt-12 block">DỮ LIỆU CỦA BẠN</span>
    <h1>Quyền riêng tư.</h1>
    <p className="privacy-lead">Hiểu cách tài liệu được xử lý trước khi bạn tiếp tục.</p>
    <section><h2>Trạng thái hiện tại</h2><p>Chức năng chuyển đổi chưa hoạt động. File bạn chọn chỉ được đọc thông tin cơ bản trên thiết bị; ứng dụng chưa tải file lên hoặc gửi file tới CloudConvert.</p></section>
    <section><h2>Khi chuyển đổi được cung cấp</h2><p>File PDF sẽ được gửi trực tiếp từ trình duyệt tới CloudConvert. Nhà cung cấp xử lý và lưu file/job tạm thời theo chính sách của họ. File DOCX sẽ được tải trực tiếp từ nhà cung cấp. Chỉ gửi tài liệu bạn có quyền xử lý.</p><p>Ứng dụng được thiết kế để không lưu nội dung PDF/DOCX trên máy chủ ứng dụng. Việc không có database không có nghĩa nhà cung cấp không lưu dữ liệu tạm.</p></section>
    <section><h2>Phiên xử lý và thao tác xóa</h2><p>Khi tích hợp hoàn tất, trình duyệt dự kiến giữ token truy cập ngắn hạn trong phiên của tab để kiểm tra trạng thái và yêu cầu xóa. Token hết hạn hoặc đóng tab không đồng nghĩa file đã bị xóa tại nhà cung cấp. Thời hạn lưu trữ và thao tác xóa cần được xác minh trước khi bật chuyển đổi.</p></section>
    <section><h2>Thông tin kỹ thuật</h2><p>Không đưa nội dung, tên file, khóa API, token hoặc liên kết tải có chữ ký vào log/analytics của ứng dụng. Nền tảng lưu trữ có thể xử lý dữ liệu kết nối kỹ thuật theo chính sách riêng.</p><p>Đọc <a href="https://cloudconvert.com/privacy" target="_blank" rel="noreferrer noopener">chính sách quyền riêng tư của CloudConvert</a> trước khi sử dụng dịch vụ chuyển đổi khi chức năng được mở.</p></section>
  </main>;
}
