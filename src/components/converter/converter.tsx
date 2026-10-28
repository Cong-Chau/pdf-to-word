"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { preflightPdf } from "@/lib/client/preflight";

export function Converter() {
  const input = useRef<HTMLInputElement>(null);
  const selection = useRef(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [accepted, setAccepted] = useState(false);

  async function selectFiles(files: FileList | null) {
    const current = ++selection.current;
    setFile(null);
    setError(null);
    setAccepted(false);
    setChecking(false);
    if (!files?.length) return;
    if (files.length !== 1) {
      setError("Vui lòng chọn một file PDF mỗi lần.");
      return;
    }
    setChecking(true);
    try {
      const candidate = files[0];
      const issue = await preflightPdf(candidate);
      if (current !== selection.current) return;
      if (issue) setError(issue);
      else setFile(candidate);
    } catch {
      if (current === selection.current) setError("Không đọc được file. Vui lòng chọn lại tài liệu.");
    } finally {
      if (current === selection.current) setChecking(false);
    }
  }

  return <section className="converter-card" aria-label="Chọn tài liệu PDF">
    <div className="card-heading"><span className="eyebrow">TÀI LIỆU CỦA BẠN</span><span className="file-limit">PDF → DOCX</span></div>
    <div className={`dropzone ${dragging ? "is-dragging" : ""}`}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => { event.preventDefault(); setDragging(false); void selectFiles(event.dataTransfer.files); }}>
      <span className="upload-icon"><Icon name="upload" width="30" height="30" /></span>
      <h2>Kéo thả PDF vào đây</h2>
      <p>hoặc chọn tài liệu từ thiết bị của bạn</p>
      <input ref={input} id="pdf-file" type="file" accept=".pdf,application/pdf" className="sr-only" aria-label="Chọn file PDF" aria-describedby="file-hint" disabled={checking}
        onChange={(event) => { void selectFiles(event.target.files); event.target.value = ""; }} />
      <button type="button" className="primary-button" disabled={checking} onClick={() => input.current?.click()}>
        {checking ? "Đang đọc file…" : "Chọn file PDF"}<Icon name="arrow" width="18" height="18" />
      </button>
      <p id="file-hint" className="file-hint">Một file mỗi lần · Tối đa 20 MiB trong ứng dụng</p>
    </div>
    <div aria-live="polite" aria-atomic="true">
      {checking && <p className="status-message">Đang kiểm tra thông tin cơ bản của file…</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      {file && <div className="selected-file">
        <span className="file-symbol"><Icon name="document" /></span>
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{file.name}</p><p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} MiB · PDF</p></div>
        <button className="remove-button" type="button" aria-label="Bỏ file đã chọn" onClick={() => { selection.current++; setFile(null); setAccepted(false); }}><Icon name="close" width="18" height="18" /></button>
      </div>}
    </div>
    <label className="privacy-consent"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
      <span>Khi chuyển đổi, file sẽ được gửi tới CloudConvert để xử lý và lưu tạm. Tôi đồng ý và có quyền xử lý tài liệu này. <Link href="/privacy">Tìm hiểu thêm</Link></span>
    </label>
    <button type="button" className="convert-button" disabled aria-describedby="availability">Chuyển sang Word <Icon name="arrow" width="18" height="18" /></button>
    <p id="availability" className="availability">Chức năng chuyển đổi chưa sẵn sàng. Bạn có thể chọn file để xem thông tin; file chưa được tải lên.</p>
  </section>;
}
