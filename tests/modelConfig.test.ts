/* eslint-disable */
// @ts-nocheck

import {
  PERPLEXITY_MODELS,
  MODEL_TIMEOUTS,
  MODEL_CAPABILITIES,
  AVAILABLE_MODELS,
} from "../src/config/modelConfig";

describe("modelConfig", () => {
  it("has matching timeouts and capabilities for each model", () => {
    AVAILABLE_MODELS.forEach((model) => {
      expect(PERPLEXITY_MODELS).toHaveProperty(model);
      expect(MODEL_TIMEOUTS).toHaveProperty(model);
      expect(MODEL_CAPABILITIES).toHaveProperty(model);
      expect(typeof MODEL_TIMEOUTS[model]).toBe("number");
      expect(typeof MODEL_CAPABILITIES[model]).toBe("string");
    });
  });
});
