/* eslint-disable */
// @ts-nocheck

import fs from "fs";
import path from "path";

const files = [
  "README.md",
  "package.json",
  "src/index.ts",
  "src/config.ts",
  "src/global.d.ts",
  "src/perplexity.ts",
  "src/routes/mcpRoutes.ts",
  "src/server/mcpServer.ts",
  "src/characters.ts",
  "src/config/characterConfig.ts",
  "src/config/modelConfig.ts",
];

describe("file existence", () => {
  files.forEach((file) => {
    it(file + " should exist", () => {
      const filePath = path.resolve(__dirname, "../", file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
