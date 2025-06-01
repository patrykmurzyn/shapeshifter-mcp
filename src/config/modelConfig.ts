/**
 * Model Configuration File
 *
 * This file contains all model definitions and can be easily modified
 * to add new models without changing the core application logic.
 */

// Define all available models with their properties in one place
export const PERPLEXITY_MODELS = {
  "sonar-deep-research": {
    timeoutMs: 30 * 60 * 1000, // 30 minutes
    capabilities: "Related questions, structured outputs",
    description: "Deep research model with extensive search capabilities",
  },
  "sonar-reasoning-pro": {
    timeoutMs: 5 * 60 * 1000, // 5 minutes
    capabilities:
      "Images, related questions, search domain filter, structured outputs",
    description: "Advanced reasoning with professional features",
  },
  "sonar-reasoning": {
    timeoutMs: 5 * 60 * 1000, // 5 minutes
    capabilities:
      "Images, related questions, search domain filter, structured outputs",
    description: "Standard reasoning model",
  },
  "sonar-pro": {
    timeoutMs: 5 * 60 * 1000, // 5 minutes
    capabilities:
      "Images, related questions, search domain filter, structured outputs",
    description: "Professional features for general use",
  },
  sonar: {
    timeoutMs: 5 * 60 * 1000, // 5 minutes
    capabilities:
      "Images, related questions, search domain filter, structured outputs",
    description: "Standard model for general use",
  },
  "r1-1776": {
    timeoutMs: 10 * 60 * 1000, // 10 minutes
    capabilities: "Structured outputs",
    description: "Specialized model for structured outputs",
  },
};

export type PerplexityModel = keyof typeof PERPLEXITY_MODELS;

// Generate MODEL_TIMEOUTS and MODEL_CAPABILITIES from PERPLEXITY_MODELS
export const MODEL_TIMEOUTS: Record<PerplexityModel, number> = Object.entries(
  PERPLEXITY_MODELS
).reduce(
  (acc, [model, config]) => ({
    ...acc,
    [model]: config.timeoutMs,
  }),
  {} as Record<PerplexityModel, number>
);

export const MODEL_CAPABILITIES: Record<PerplexityModel, string> =
  Object.entries(PERPLEXITY_MODELS).reduce(
    (acc, [model, config]) => ({
      ...acc,
      [model]: config.capabilities,
    }),
    {} as Record<PerplexityModel, string>
  );

// Get list of available models
export const AVAILABLE_MODELS: PerplexityModel[] = Object.keys(
  PERPLEXITY_MODELS
) as PerplexityModel[];
