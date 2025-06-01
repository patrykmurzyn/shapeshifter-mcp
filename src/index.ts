import "dotenv/config";
import express from "express";
import { setupRoutes } from "./routes/mcpRoutes.js";
import { config } from "./config.js";
import { availableCharacters } from "./characters.js";

// Initialize express app
const app = express();
app.use(express.json());

// Setup MCP routes
setupRoutes(app);

// Start the server
app.listen(config.port, () => {
  console.log(`ShapeShifter-MCP server listening on port ${config.port}`);
  console.log(`Available characters: ${availableCharacters.join(", ")}`);
});
