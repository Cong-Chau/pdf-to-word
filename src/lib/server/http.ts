import "server-only";
import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiErrorResponse } from "@/lib/contracts/conversion";

export function apiError(status: number, code: ApiErrorCode, message: string) {
  return NextResponse.json<ApiErrorResponse>({
    error: { code, message, retryable: false, requestId: crypto.randomUUID() },
  }, { status, headers: { "Cache-Control": "no-store" } });
}
