# ShapeShifter-MCP

ShapeShifter-MCP is an MCP (Model Context Protocol) server that transforms responses from the Perplexity API into the style of a selected character. It allows you to interact with various AI characters through a standardized API.

## Features

- Character-based responses using Perplexity AI
- Support for multiple fictional characters (Rick, Yoda, Sherlock, Socrates)
- Multiple Perplexity models with model-specific timeouts
- MCP-compatible interface for easy integration with MCP clients
- Customizable character prompts
- Rate limiting and retry handling
- Easy configuration in separate config files

## Prerequisites

- Node.js (>=14)
- npm or yarn
- Perplexity API key

## Environment Variables

Create a `.env` file with the following variables:

```
PERPLEXITY_API_KEY=your_api_key_here
PORT=3000                     # Optional (default: 3000)
PERPLEXITY_MODEL=sonar        # Optional (default: sonar)
PERPLEXITY_TIMEOUT_MS=30000   # Optional (default: model-specific)
PERPLEXITY_MAX_RETRIES=3      # Optional (default: 3)
```

## Available Models

| Model               | Default Timeout | Capabilities                                                        |
| ------------------- | --------------- | ------------------------------------------------------------------- |
| sonar-deep-research | 30 minutes      | Related questions, structured outputs                               |
| sonar-reasoning-pro | 5 minutes       | Images, related questions, search domain filter, structured outputs |
| sonar-reasoning     | 5 minutes       | Images, related questions, search domain filter, structured outputs |
| sonar-pro           | 5 minutes       | Images, related questions, search domain filter, structured outputs |
| sonar               | 5 minutes       | Images, related questions, search domain filter, structured outputs |
| r1-1776             | 10 minutes      | Structured outputs                                                  |

## Setup

1. Install dependencies:

   ```bash
   npm install
   # or with yarn
   yarn install
   ```

2. Copy the example environment file and set your Perplexity API key:

   ```bash
   cp .env.example .env
   # Edit the .env file with your API key
   ```

3. Build the project:

   ```bash
   npm run build
   # or with yarn
   yarn build
   ```

4. Start in development mode:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

## API Endpoints

### POST /mcp

The main MCP endpoint that accepts MCP-formatted requests.

#### Example MCP request:

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.prompt",
  "params": {
    "name": "ask",
    "params": {
      "question": "What is the meaning of life?",
      "character": "rick"
    }
  },
  "id": "1"
}
```

#### Example tool call with model selection:

```json
{
  "jsonrpc": "2.0",
  "method": "mcp.tool",
  "params": {
    "name": "ask-perplexity",
    "params": {
      "question": "What is quantum physics?",
      "character": "yoda",
      "model": "sonar-deep-research"
    }
  },
  "id": "2"
}
```

## Available Characters

- `rick`: Rick Sanchez from Rick and Morty
- `yoda`: Yoda from Star Wars
- `sherlock`: Sherlock Holmes
- `socrates`: Socrates, the Greek philosopher

## Configuration

The application uses separate configuration files for easy maintenance:

- **Characters**: Add new characters in `src/config/characterConfig.ts`
- **Models**: Configure Perplexity models in `src/config/modelConfig.ts`
- **Server**: General server settings are in `src/config.ts`

## Development

### Adding a New Character

1. Create a system prompt file in `src/prompts/[character]-system-prompt.ts`
2. Add the character to `src/config/characterConfig.ts`:

```typescript
// Example adding a new character
export const CHARACTERS: Record<CharacterKey, CharacterConfig> = {
  // Existing characters...

  // New character
  batman: {
    name: "Batman",
    promptFn: getBatmanSystemPrompt,
    description: "Dark knight detective from Gotham City",
  },
};
```

3. Update the `CharacterKey` type with the new character name

### Adding a New Model

To add a new Perplexity model, edit `src/config/modelConfig.ts`:

```typescript
// Example adding a new model
export const PERPLEXITY_MODELS = {
  // Existing models...

  // New model
  "new-model-name": {
    timeoutMs: 15 * 60 * 1000, // 15 minutes
    capabilities: "Some capabilities",
    description: "Description of the new model",
  },
};
```

## License

MIT
