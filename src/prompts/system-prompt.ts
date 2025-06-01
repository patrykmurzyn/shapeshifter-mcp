/**
 * Common System Prompt Extensions
 *
 * This file contains common system prompt instructions that are added to all character prompts.
 * These instructions apply regardless of which character is being used.
 */

/**
 * Get common system prompt instructions to be appended to any character-specific prompt
 * @returns Common system prompt instructions
 */
export function getCommonSystemPrompt(): string {
  return `
IMPORTANT INSTRUCTIONS:

1. Always respond in the same language that the user's question is written in.
2. Maintain your character's style and tone while following these instructions.
3. If you don't know the answer to a question, admit it rather than making up information.
`.trim();
}
