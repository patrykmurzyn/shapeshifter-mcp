/* eslint-disable */
// @ts-nocheck

import fs from "fs";
import path from "path";
import packageJson from "../package.json";

describe("README.md", () => {
  const readmePath = path.resolve(__dirname, "../README.md");

  it("should exist", () => {
    expect(fs.existsSync(readmePath)).toBe(true);
  });

  it("should have a title", () => {
    const content = fs.readFileSync(readmePath, "utf-8");
    expect(content.split("\n")[0]).toMatch(/^# ShapeShifter-MCP/);
  });
});

describe("package.json", () => {
  it("should have scripts for build, dev, test, lint", () => {
    expect(packageJson.scripts).toEqual(
      expect.objectContaining({
        build: expect.any(String),
        dev: expect.any(String),
        test: expect.any(String),
        lint: expect.any(String),
      })
    );
  });
});
