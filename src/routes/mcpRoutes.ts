import { IncomingMessage, ServerResponse } from "http";
import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "../server/mcpServer.js";

export function setupRoutes(app: express.Application): void {
  app.post("/mcp", async (req: Request, res: Response) => {
    // In stateless mode, create a new instance of transport and server for each request
    // to ensure isolation
    try {
      console.log(
        "POST /mcp request received:",
        JSON.stringify(req.body, null, 2)
      );

      const server = createServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      const httpRes = res as unknown as ServerResponse;
      httpRes.on("close", () => {
        console.log("Request closed");
        transport.close();
        server.close();
      });

      await server.connect(transport);
      await transport.handleRequest(
        req as unknown as IncomingMessage,
        httpRes,
        req.body
      );
    } catch (error) {
      console.error("Error handling MCP request:", error);
      const httpRes = res as unknown as ServerResponse;
      if (!httpRes.headersSent) {
        httpRes.writeHead(500, { "Content-Type": "application/json" });
        httpRes.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: "Internal server error",
            },
            id: null,
          })
        );
      }
    }
  });

  app.get("/mcp", (_req: Request, res: Response) => {
    console.log("Received GET MCP request");
    const httpRes = res as unknown as ServerResponse;
    httpRes.writeHead(405, { "Content-Type": "application/json" });
    httpRes.end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      })
    );
  });

  app.delete("/mcp", (_req: Request, res: Response) => {
    console.log("Received DELETE MCP request");
    const httpRes = res as unknown as ServerResponse;
    httpRes.writeHead(405, { "Content-Type": "application/json" });
    httpRes.end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      })
    );
  });
}
