import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getPerplexityResponse } from "../perplexity.js";
import {
  PerplexityModel,
  PERPLEXITY_MODELS,
  AVAILABLE_MODELS,
} from "../config.js";
import {
  CharacterKey,
  characters,
  availableCharacters,
  CharacterConfig,
} from "../characters.js";

// Define types for request parameters
interface AskPerplexityParams {
  question: string;
  character?: CharacterKey;
  model?: PerplexityModel;
}

// Create a string enum schema for Zod to validate model selection
const perplexityModelEnum = z.enum(
  AVAILABLE_MODELS as [PerplexityModel, ...PerplexityModel[]]
);

// Create a string enum schema for Zod to validate character selection
// Dynamically generated from the characters object
const characterEnum = z.enum(
  availableCharacters as [CharacterKey, ...CharacterKey[]]
);

// Helper for generating character description
function getCharacterDescription(): string {
  return Object.entries(characters)
    .map(([key, config]) => {
      const typedConfig = config as CharacterConfig;
      return `${key} (${typedConfig.description})`;
    })
    .join(", ");
}

// Helper for generating model description
function getModelDescription(): string {
  return Object.entries(PERPLEXITY_MODELS)
    .map(([model, config]) => {
      const typedConfig = config as { description: string };
      return `${model} (${typedConfig.description})`;
    })
    .join(", ");
}

export function createServer() {
  const server = new McpServer({ name: "ShapeShifter-MCP", version: "1.0.0" });

  // Direct perplexity API access tool with model selection
  server.tool(
    "ask-perplexity",
    {
      question: z.string(),
      character: characterEnum
        .optional()
        .describe(
          `Character to style the response as. Options: ${getCharacterDescription()}`
        ),
      model: perplexityModelEnum
        .optional()
        .describe(
          `Model to use for the query. Options: ${getModelDescription()}`
        ),
    },
    async ({ question, character, model }: AskPerplexityParams) => {
      const selectedCharacter = character || "rick";
      console.log(
        `Direct ask-perplexity tool called with: "${question}" using model ${
          model || "default"
        }`
      );

      try {
        const options = model ? { model } : {};
        const answer = await getPerplexityResponse(
          question,
          selectedCharacter,
          options
        );

        console.log(
          `Returning answer from ask-perplexity: "${answer.substring(
            0,
            50
          )}..."`
        );

        return {
          content: [{ type: "text", text: answer }],
        };
      } catch (error) {
        console.error("Error in ask-perplexity tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error occurred while processing your request: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
