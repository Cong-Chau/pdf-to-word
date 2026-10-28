import "server-only";
import type { CreateConversionInput, ConversionStatus } from "@/lib/contracts/conversion";

export interface CreatedProviderConversion {
  jobId: string;
  upload: { method: "POST"; url: string; fields: Record<string, string> };
}

export interface ProviderConversion {
  status: ConversionStatus;
  download?: { url: string; fileName: string };
  error?: { code: string; message: string };
}

// The real adapter and its engine/options are added after the provider spike.
export interface ConversionProvider {
  create(input: CreateConversionInput): Promise<CreatedProviderConversion>;
  getStatus(jobId: string): Promise<ProviderConversion>;
  delete(jobId: string): Promise<{ status: "deleted" }>;
}
