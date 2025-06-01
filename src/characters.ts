/**
 * Characters module
 *
 * This file provides the interface for accessing character configurations
 * defined in the config/characterConfig.ts file.
 */

import {
  CHARACTERS,
  AVAILABLE_CHARACTERS,
  CharacterKey,
  CharacterConfig,
  PromptFunction,
} from "./config/characterConfig.js";

// Export types and constants
export { CharacterKey, CharacterConfig, PromptFunction };
export const characters = CHARACTERS;
export const availableCharacters = AVAILABLE_CHARACTERS;

// For backward compatibility
export const characterPrompts: Record<CharacterKey, PromptFunction> =
  Object.entries(characters).reduce(
    (acc, [key, config]) => ({
      ...acc,
      [key]: (config as CharacterConfig).promptFn,
    }),
    {} as Record<CharacterKey, PromptFunction>
  );

/**
 * Retrieve the system prompt for a validated character key.
 */
export function getSystemPromptFor(
  character: CharacterKey,
  customizations?: string
): string {
  const characterConfig = characters[character];
  return characterConfig.promptFn(customizations);
}

// Helper to check if a character is valid
export function isValidCharacter(character: string): character is CharacterKey {
  return availableCharacters.includes(character.toLowerCase() as CharacterKey);
}
