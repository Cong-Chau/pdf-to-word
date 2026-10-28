import "server-only";
import { apiError } from "@/lib/server/http";

// Reserved routes: no body/file processing, provider calls, tokens or mock jobs.
// Keep fail-closed even if CONVERSIONS_ENABLED is set before integration is ready.
export function conversionUnavailable() {
  return apiError(503, "CONVERSIONS_UNAVAILABLE", "Chức năng chuyển đổi hiện chưa sẵn sàng. Vui lòng quay lại sau.");
}
