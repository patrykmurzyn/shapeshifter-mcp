/* eslint-disable */
// @ts-nocheck

import { config } from "../src/config";

describe("config", () => {
  it("should have default port and valid perplexity config", () => {
    expect(typeof config.port).toBe("number");
    expect(config.perplexity.apiKey).toBe("test-key");
    expect(typeof config.perplexity.model).toBe("string");
    expect(typeof config.perplexity.timeoutMs).toBe("number");
    expect(typeof config.perplexity.maxRetries).toBe("number");
  });
});
