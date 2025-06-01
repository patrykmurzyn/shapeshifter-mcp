/* eslint-disable */
// @ts-nocheck

import { createServer } from "../src/server/mcpServer";

describe("mcpServer", () => {
  it("should export createServer function", () => {
    expect(typeof createServer).toBe("function");
  });

  it("createServer returns object with tool method", () => {
    const server = createServer();
    expect(server).toHaveProperty("tool");
    expect(typeof server.tool).toBe("function");
  });
});
