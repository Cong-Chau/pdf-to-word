import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PDF sang Word — Tài liệu, tiếp tục chỉnh sửa", template: "%s | PDF sang Word" },
  description: "Chuyển PDF thành tài liệu Word có thể chỉnh sửa, ưu tiên giữ nội dung, bảng và bố cục.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>
    <a className="skip-link" href="#main">Đến nội dung chính</a>
    <div className="site-shell"><SiteHeader />{children}
      <footer className="site-footer"><span>pdftoword. <span className="footer-divider">/</span> Tài liệu, tiếp tục chỉnh sửa.</span><span>Được làm để đơn giản hơn.</span></footer>
    </div>
  </body></html>;
}
