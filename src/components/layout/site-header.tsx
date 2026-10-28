import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function SiteHeader() {
  return <header className="site-header">
    <Link href="/" className="brand" aria-label="PDF sang Word — Trang chủ">
      <span className="brand-mark"><Icon name="document" /></span>
      <span>pdf<span className="text-blue-700">toword</span><span className="brand-dot">.</span></span>
    </Link>
    <Link className="quiet-link" href="/privacy">Quyền riêng tư <Icon name="shield" width="16" height="16" /></Link>
  </header>;
}
