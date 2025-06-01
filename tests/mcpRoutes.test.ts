/* eslint-disable */
// @ts-nocheck

import express from "express";
import request from "supertest";
import { setupRoutes } from "../src/routes/mcpRoutes";

describe("mcpRoutes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    setupRoutes(app);
  });

  it("should return 405 for GET /mcp", async () => {
    const res = await request(app).get("/mcp");
    expect(res.status).toBe(405);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 405 for DELETE /mcp", async () => {
    const res = await request(app).delete("/mcp");
    expect(res.status).toBe(405);
  });
});
