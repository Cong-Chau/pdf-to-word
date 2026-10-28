import { z } from "zod";

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export const createConversionSchema = z.strictObject({
  fileName: z.string().trim().min(1).max(180)
    .regex(/\.pdf$/i)
    .refine((value) => !/[/\\]/.test(value) &&
      Array.from(value).every((character) => character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127)),
  fileSizeBytes: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES),
  privacyAccepted: z.literal(true),
  turnstileToken: z.string().min(1).max(2048),
});

export const conversionTokenSchema = z.strictObject({
  conversionToken: z.string().min(1).max(8192),
});

export type CreateConversionInput = z.infer<typeof createConversionSchema>;
export type ConversionStatus =
  | "awaiting_upload" | "queued" | "converting" | "exporting"
  | "completed" | "failed" | "deleted" | "expired";

export type ApiErrorCode =
  | "INVALID_REQUEST" | "REQUEST_TOO_LARGE" | "ORIGIN_REJECTED"
  | "UNSUPPORTED_MEDIA_TYPE" | "CONVERSIONS_UNAVAILABLE";

export interface ApiErrorResponse {
  error: { code: ApiErrorCode; message: string; retryable: boolean; requestId: string };
}
