import axios, { AxiosError } from "axios";
import { config, PerplexityModel, MODEL_TIMEOUTS } from "./config.js";
import { getSystemPromptFor, CharacterKey } from "./characters.js";
import { getCommonSystemPrompt } from "./prompts/system-prompt.js";

// Define specific error types for better error handling
export class PerplexityAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = "PerplexityAPIError";
  }
}

export class PerplexityTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PerplexityTimeoutError";
  }
}

export interface PerplexityOptions {
  model?: PerplexityModel;
  timeout?: number;
}

export async function getPerplexityResponse(
  question: string,
  character: CharacterKey = "rick",
  options: PerplexityOptions = {},
  retryCount: number = 0
): Promise<string> {
  const apiKey = config.perplexity.apiKey;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not defined");
  }

  // Use provided model or default from config
  const model = options.model || config.perplexity.model;

  // Use provided timeout, or model-specific timeout, or default config timeout
  const timeoutMs =
    options.timeout ||
    MODEL_TIMEOUTS[model as PerplexityModel] ||
    config.perplexity.timeoutMs;

  try {
    console.log(
      `Sending question to Perplexity using model "${model}" with timeout ${
        timeoutMs / 1000
      }s: "${question.slice(0, 50)}${question.length > 50 ? "..." : ""}"`
    );

    // Get character's system prompt
    let systemPrompt = getSystemPromptFor(character);

    // Add common system prompt instructions
    systemPrompt += "\n\n" + getCommonSystemPrompt();

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ];

    const response = await axios.post(
      config.perplexity.apiUrl,
      {
        model: model,
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: timeoutMs,
      }
    );

    const answer = response.data.choices?.[0]?.message?.content;
    if (!answer) {
      throw new PerplexityAPIError("Empty response from Perplexity API");
    }

    console.log(`Received answer from Perplexity (${answer.length} chars)`);
    return answer;
  } catch (error) {
    // Rethrow custom errors without wrapping
    if (
      error instanceof PerplexityAPIError ||
      error instanceof PerplexityTimeoutError
    ) {
      throw error;
    }
    // Handle specific error types
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === "ECONNABORTED") {
        throw new PerplexityTimeoutError(
          `Perplexity API request timed out after ${
            timeoutMs / 1000
          } seconds (model: ${model})`
        );
      }

      // Handle rate limiting
      if (
        axiosError.response?.status === 429 &&
        retryCount < config.perplexity.maxRetries
      ) {
        const retryAfter = parseInt(
          axiosError.response.headers["retry-after"] || "1000",
          10
        );
        console.log(
          `Rate limited. Retrying after ${retryAfter}ms (attempt ${
            retryCount + 1
          }/${config.perplexity.maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return getPerplexityResponse(
          question,
          character,
          options,
          retryCount + 1
        );
      }

      throw new PerplexityAPIError(
        `Perplexity API error: ${axiosError.message}`,
        axiosError.response?.status,
        axiosError.response?.data
      );
    }

    console.error("Perplexity API error:", error);
    throw new Error(
      `Error calling Perplexity API: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function getPerplexityStream(
  question: string,
  character: CharacterKey = "rick",
  options: PerplexityOptions = {},
  onChunk: (chunk: string) => void
): Promise<void> {
  const apiKey = config.perplexity.apiKey;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not defined");
  }
  const model = options.model || config.perplexity.model;
  const timeoutMs =
    options.timeout ||
    MODEL_TIMEOUTS[model as PerplexityModel] ||
    config.perplexity.timeoutMs;

  console.log(
    `Streaming question to Perplexity using model "${model}" with timeout ${
      timeoutMs / 1000
    }s: "${question.slice(0, 50)}${question.length > 50 ? "..." : ""}"`
  );

  let systemPrompt = getSystemPromptFor(character);
  systemPrompt += "\n\n" + getCommonSystemPrompt();
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: question },
  ];

  const response = await axios.post(
    config.perplexity.apiUrl,
    { model: model, messages: messages, stream: true },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: timeoutMs,
      responseType: "stream",
    }
  );

  const stream = response.data as import("stream").Readable;
  return new Promise((resolve, reject) => {
    let buffer = "";
    stream.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      // Split on SSE event delimiter (CRLF or LF) indicating end of event
      const parts = buffer.split(/\r?\n\r?\n/);
      buffer = parts.pop() || "";
      for (const part of parts) {
        const lines = part.split(/\r?\n/);
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.replace(/^data:\s*/, "");
          if (data === "[DONE]") continue;
          try {
            const payload = JSON.parse(data);
            // Only emit streaming delta content; skip full message content
            const content = payload.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          } catch {
            // ignore parse errors
          }
        }
      }
    });
    stream.on("end", () => resolve());
    stream.on("error", (err: Error) => reject(err));
  });
}
