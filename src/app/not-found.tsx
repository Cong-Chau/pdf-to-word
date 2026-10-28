import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="privacy-page"><span className="eyebrow">404</span><h1>Không tìm thấy trang.</h1><p>Đường dẫn này không còn tồn tại hoặc chưa được tạo.</p><Link className="primary-button mt-8" href="/">Trở về trang chủ</Link></main>;
}
