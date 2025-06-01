/* eslint-disable */
// @ts-nocheck

import { vi } from "vitest";
import axios, { AxiosError } from "axios";
import {
  getPerplexityResponse,
  PerplexityAPIError,
  PerplexityTimeoutError,
} from "../src/perplexity";

describe("getPerplexityResponse", () => {
  beforeEach(() => {
    process.env.PERPLEXITY_API_KEY = "test-key";
  });

  it("returns the answer when axios responds", async () => {
    axios.post = vi.fn().mockResolvedValue({
      data: { choices: [{ message: { content: "Hello" } }] },
    });
    const answer = await getPerplexityResponse("Q?", "rick");
    expect(answer).toBe("Hello");
  });

  it("throws PerplexityAPIError when empty response", async () => {
    axios.post = vi.fn().mockResolvedValue({ data: { choices: [] } });
    await expect(getPerplexityResponse("Q?", "rick")).rejects.toBeInstanceOf(
      PerplexityAPIError
    );
  });

  it("throws PerplexityTimeoutError on timeout", async () => {
    const timeoutError = new AxiosError("timeout", "ECONNABORTED");
    axios.post = vi.fn().mockRejectedValue(timeoutError);
    await expect(getPerplexityResponse("Q?", "rick")).rejects.toBeInstanceOf(
      PerplexityTimeoutError
    );
  });
});
