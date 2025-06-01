/* eslint-disable */
// @ts-nocheck

import {
  characters,
  availableCharacters,
  getSystemPromptFor,
  isValidCharacter,
} from "../src/characters";
import { AVAILABLE_CHARACTERS } from "../src/config/characterConfig";

describe("characters", () => {
  it("availableCharacters matches keys of characters", () => {
    expect(availableCharacters).toEqual(AVAILABLE_CHARACTERS);
    availableCharacters.forEach((key) => {
      expect(characters).toHaveProperty(key);
    });
  });

  it("getSystemPromptFor returns a non-empty string", () => {
    availableCharacters.forEach((key) => {
      const prompt = getSystemPromptFor(key);
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  it("isValidCharacter recognizes valid and invalid keys", () => {
    expect(isValidCharacter(availableCharacters[0])).toBe(true);
    expect(isValidCharacter("invalid")).toBe(false);
  });
});
