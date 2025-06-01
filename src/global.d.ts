declare module "@modelcontextprotocol/server";
// declare module "express"; // removed to allow @types/express to provide types
declare module "./perplexity.js";
declare module "./config";
declare module "./characters";
declare module "./prompts/rick-system-prompt";
declare module "./prompts/yoda-system-prompt";
declare module "./prompts/sherlock-system-prompt";
declare module "./prompts/socrates-system-prompt";

// External modules
declare module "@modelcontextprotocol/sdk/server/mcp.js";
declare module "@modelcontextprotocol/sdk/server/streamableHttp.js";

// MCP types
declare namespace MCP {
  interface Message {
    role: string;
    content: {
      type: string;
      text: string;
    };
  }

  interface ToolResponse {
    content: Array<{
      type: string;
      text: string;
    }>;
    isError?: boolean;
  }

  interface PromptResponse {
    messages: Message[];
  }
}

// Express extensions
declare namespace Express {
  interface Request {
    body: any;
  }

  interface Response {
    status(code: number): this;
    json(body: any): this;
    writeHead(statusCode: number, headers?: any): this;
    end(data?: any): this;
    headersSent: boolean;
  }
}

// Environment variables type definition
interface ProcessEnv {
  PERPLEXITY_API_KEY: string;
  PORT?: string;
  PERPLEXITY_MODEL?: string;
  PERPLEXITY_TIMEOUT_MS?: string;
  PERPLEXITY_MAX_RETRIES?: string;
}
