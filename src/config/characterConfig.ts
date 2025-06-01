/**
 * Character Configuration File
 *
 * This file contains all character definitions and can be easily modified
 * to add new characters without changing the core application logic.
 */

import { getRickSystemPrompt } from "../prompts/rick-system-prompt.js";
import { getYodaSystemPrompt } from "../prompts/yoda-system-prompt.js";
import { getSherlockSystemPrompt } from "../prompts/sherlock-system-prompt.js";
import { getSocratesSystemPrompt } from "../prompts/socrates-system-prompt.js";

// Character type definitions
export type CharacterKey = "rick" | "yoda" | "sherlock" | "socrates";

export type PromptFunction = (customizations?: string) => string;

export interface CharacterConfig {
  name: string;
  promptFn: PromptFunction;
  description: string;
}

// Define all available characters with their properties in one place
export const CHARACTERS: Record<CharacterKey, CharacterConfig> = {
  rick: {
    name: "Rick Sanchez",
    promptFn: getRickSystemPrompt,
    description: "Genius scientist with attitude from Rick and Morty",
  },
  yoda: {
    name: "Yoda",
    promptFn: getYodaSystemPrompt,
    description: "Wise Jedi Master from Star Wars",
  },
  sherlock: {
    name: "Sherlock Holmes",
    promptFn: getSherlockSystemPrompt,
    description: "Brilliant detective with deductive reasoning",
  },
  socrates: {
    name: "Socrates",
    promptFn: getSocratesSystemPrompt,
    description: "Ancient Greek philosopher known for Socratic method",
  },
};

// Get list of available characters
export const AVAILABLE_CHARACTERS: CharacterKey[] = Object.keys(
  CHARACTERS
) as CharacterKey[];
