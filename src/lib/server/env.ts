import "server-only";
import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.string().min(1).optional(),
);

const envSchema = z.object({
  CONVERSIONS_ENABLED: z.enum(["true", "false"]).default("false"),
  APP_ORIGIN: z.url().refine((value) => {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username && !url.password && url.origin === value;
  }).optional(),
  CLOUDCONVERT_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  CLOUDCONVERT_API_KEY: optionalSecret,
  JOB_TOKEN_KEY: optionalSecret,
  TURNSTILE_SECRET_KEY: optionalSecret,
}).superRefine((env, context) => {
  if (env.JOB_TOKEN_KEY && (
    !/^[A-Za-z0-9_-]{43}$/.test(env.JOB_TOKEN_KEY) ||
    Buffer.from(env.JOB_TOKEN_KEY, "base64url").length !== 32
  )) {
    context.addIssue({ code: "custom", path: ["JOB_TOKEN_KEY"], message: "Invalid token key" });
  }
  if (env.CONVERSIONS_ENABLED === "true") {
    for (const key of ["APP_ORIGIN", "CLOUDCONVERT_API_KEY", "JOB_TOKEN_KEY", "TURNSTILE_SECRET_KEY"] as const) {
      if (!env[key]) context.addIssue({ code: "custom", path: [key], message: "Required when enabled" });
    }
  }
});

// Parse lazily so the UI can build without provider credentials. Never log the result.
export function readServerEnv() {
  return envSchema.safeParse({
    CONVERSIONS_ENABLED: process.env.CONVERSIONS_ENABLED,
    APP_ORIGIN: process.env.APP_ORIGIN,
    CLOUDCONVERT_ENV: process.env.CLOUDCONVERT_ENV,
    CLOUDCONVERT_API_KEY: process.env.CLOUDCONVERT_API_KEY,
    JOB_TOKEN_KEY: process.env.JOB_TOKEN_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  });
}
