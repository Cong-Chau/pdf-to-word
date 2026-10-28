import { Converter } from "@/components/converter/converter";

export default function Home() {
  return <main id="main">
    <section className="hero">
      <span className="intro-label"><span /> TỪ BẢN ĐỌC ĐẾN BẢN CHỈNH SỬA</span>
      <h1>Chuyển PDF<br />sang <span>Word.</span></h1>
      <p>Tài liệu của bạn, sẵn sàng cho bước tiếp theo.<br className="hidden sm:block" /> Tạo file Word có thể chỉnh sửa, ưu tiên giữ bố cục, bảng và hình ảnh.</p>
    </section>
    <Converter />
    <section className="steps" aria-label="Cách chuyển đổi">
      {[ ["01", "Chọn tài liệu", "Một file PDF từ thiết bị của bạn."], ["02", "Chuyển sang Word", "Theo dõi từng giai đoạn xử lý."], ["03", "Tiếp tục công việc", "Tải DOCX và chỉnh sửa trong Word."] ].map(([number, title, text]) =>
        <div key={number}><span className="step-number">{number}</span><h2>{title}</h2><p>{text}</p></div>)}
    </section>
    <section className="faq" aria-labelledby="faq-title"><div><span className="eyebrow">TRƯỚC KHI BẮT ĐẦU</span><h2 id="faq-title">Một vài điều cần biết.</h2></div>
      <div className="faq-items">
        <details><summary>File Word có giữ nguyên bố cục không?</summary><p>Mức độ giữ bố cục phụ thuộc từng tài liệu. PDF scan, font đặc biệt và bảng phức tạp có thể cần chỉnh lại. Hãy kiểm tra nội dung, số liệu và dấu tiếng Việt sau khi chuyển.</p></details>
        <details><summary>File được xử lý ở đâu?</summary><p>Khi chức năng chuyển đổi sẵn sàng, CloudConvert sẽ xử lý và lưu file tạm thời theo chính sách của dịch vụ. Hiện tại, chọn file chỉ đọc thông tin trên thiết bị của bạn.</p></details>
        <details><summary>Có thể chuyển PDF có mật khẩu không?</summary><p>Phiên bản đầu tiên không hỗ trợ PDF có mật khẩu. Vui lòng chuẩn bị bản PDF không khóa mà bạn có quyền xử lý.</p></details>
      </div>
    </section>
  </main>;
}
