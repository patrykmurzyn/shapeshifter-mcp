import { z } from "zod";
import {
  MODEL_TIMEOUTS,
  PerplexityModel,
  AVAILABLE_MODELS,
} from "./config/modelConfig.js";

// Re-export model types and constants
export {
  PERPLEXITY_MODELS,
  MODEL_TIMEOUTS,
  PerplexityModel,
  MODEL_CAPABILITIES,
  AVAILABLE_MODELS,
} from "./config/modelConfig.js";

const envSchema = z.object({
  PERPLEXITY_API_KEY: z.string().nonempty(),
  PORT: z
    .preprocess((v) => {
      if (typeof v === "string" && v.trim() !== "") return Number(v);
      if (typeof v === "number") return v;
      return undefined;
    }, z.number().int().positive())
    .optional(),
  PERPLEXITY_MODEL: z.string().optional(),
  PERPLEXITY_TIMEOUT_MS: z
    .preprocess((v) => {
      if (typeof v === "string" && v.trim() !== "") return Number(v);
      if (typeof v === "number") return v;
      return undefined;
    }, z.number().int().positive())
    .optional(),
  PERPLEXITY_MAX_RETRIES: z
    .preprocess((v) => {
      if (typeof v === "string" && v.trim() !== "") return Number(v);
      if (typeof v === "number") return v;
      return undefined;
    }, z.number().int().positive())
    .optional(),
});

const env = envSchema.parse(process.env);

// Validate model from environment or use default
const defaultModel = env.PERPLEXITY_MODEL || "sonar";
const validModel = AVAILABLE_MODELS.includes(defaultModel as PerplexityModel)
  ? (defaultModel as PerplexityModel)
  : "sonar";

export const config = {
  port: env.PORT ?? 3000,
  perplexity: {
    apiKey: env.PERPLEXITY_API_KEY,
    apiUrl: "https://api.perplexity.ai/chat/completions",
    model: validModel,
    // Allow env override, otherwise use model-specific timeout
    timeoutMs: env.PERPLEXITY_TIMEOUT_MS ?? MODEL_TIMEOUTS[validModel],
    maxRetries: env.PERPLEXITY_MAX_RETRIES ?? 3,
  },
};
