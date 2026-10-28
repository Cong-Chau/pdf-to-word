import { MAX_FILE_SIZE_BYTES } from "@/lib/contracts/conversion";

// Local advisory checks only; this does not prove PDF validity or count pages.
export async function preflightPdf(file: File): Promise<string | null> {
  if (!/\.pdf$/i.test(file.name)) return "Vui lòng chọn tài liệu có định dạng PDF.";
  if (file.size === 0) return "File đang trống. Vui lòng chọn tài liệu khác.";
  if (file.size > MAX_FILE_SIZE_BYTES) return "File vượt quá 20 MiB. Vui lòng chọn tài liệu nhỏ hơn.";
  const header = new TextDecoder("latin1").decode(await file.slice(0, 1024).arrayBuffer());
  if (!header.includes("%PDF-")) return "Chưa nhận diện được nội dung PDF. Vui lòng kiểm tra lại file.";
  return null;
}
