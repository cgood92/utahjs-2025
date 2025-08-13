# UtahJS 2025

## Step by step

### Step 1: Query the LLM

Start off with this code script

```typescript
const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'qwen3:8b';

async function main() {
  return fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      messages: [],
      stream: false,
    }),
  })
    .then((res) => res.json())
    .then(console.log);
}

main();
```

_LIVE: Come up with this prompt_

```typescript
      messages: [
        {
          role: 'user',
          content: 'Why is the sky blue? Tell me in 25 words or less.',
        },
      ],
```

### Step 2: Streaming

First, instead of returning `fetch`, change to:

```diff
+ const response = await fetch;

...
+ stream: true,
```

And remove:

```diff
-    .then((res) => res.json())
-    .then(console.log);
```

Copy these lines exactly.

```typescript
async function streamIt(response) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let generatedText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    const json = JSON.parse(text);
    generatedText += json.message.content;
    console.clear();
    console.log(generatedText);
  }

  return generatedText;
}
```

### Step 3: System prompt

_LIVE: Add this object to the messages prompt_

```typescript
        {
          role: 'system',
          content:
            'You are a heavily sarcastic, rude assistant.  You give snide comments and not helpful information.',
        },
```

### Step 4: Few shot examples

Copy this

```plaintext
You are a heavily sarcastic, rude assistant.  You give snide comments and not helpful information.
Here's 2 examples of the format you should follow:

User: Why is the sky blue?
Assistant:
# Response
I'm not sure, but my guess is that it has something to do with the fact that the sky is blue.
- Your friend

User: What is the capital of France?
Assistant:
# Response
Paris is the capital of France.  How dumb of you to not know.
- Your friend
```

### Step 5: Chat history

1. Pull out messages into it's own array `messages`
2. Come up with the next:

```typescript
messages.push({
  role: 'assistant',
  content: generatedText,
});

messages.push({
  role: 'user',
  content: 'Are you sure?',
});

const response2 = await fetch(`${OLLAMA_URL}/api/chat`, {
  method: 'POST',
  body: JSON.stringify({
    model: MODEL,
    messages,
    stream: true,
  }),
});

streamIt(response2);
```

### Step 6: Introducing LangChain.js

```typescript
import { Ollama } from '@langchain/ollama';

const llm = new Ollama({
  model: 'qwen3:8b',
});

...

  const response = await llm.invoke(messages);
  console.log(response);
```

### Step 7: Streaming LangChain.js

_LIVE: Come up with this live_

```typescript
let totalResponse = '';
const response = await llm.stream(messages);
for await (const chunk of response) {
  totalResponse += chunk;
  console.clear();
  console.log(totalResponse);
}
```

### Step 8: LangChain HumanMessage, introduce 100 Humanitarians

```typescript
import { HumanMessage } from '@langchain/core/messages';

...

  const messages = [new HumanMessage('What is 100 humanitarians?')];
```

### Step 9: In-context learning

```typescript
import { ChatPromptTemplate } from '@langchain/core/prompts';

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    `Please answer the user's question using only the knowledge below:
---
{knowledge}
---`,
  ],
  ['user', '{question}'],
]);

const prompt = await promptTemplate.invoke({
  question:
    "Explain what 100 humanitarians is like you're talking to a 5 year old",
  knowledge: '',
});
let totalResponse = '';
const response = await llm.stream(prompt);
```

```typescript
const knowledge = `
# 100 Humanitarians International – Organization Summary

[100 Humanitarians International](https://100humanitarians.org/) is a U.S.-based nonprofit organization founded in 2015 by Heidi Totten. Its mission is to mentor families globally through self-reliance, education, and entrepreneurship, aiming to eliminate physical, mental, spiritual, and emotional poverty.

The organization primarily operates in rural Kenya, focusing on sustainable development initiatives that empower communities to break the cycle of poverty.

---

## Core Programs

The organization's work is structured around four key pillars:

### 1. Sustainable Food
- Implements Garden Towers, chicken businesses, and goat farming.
- Over 20,000 Garden Towers built to enable year-round produce growth.

### 2. Clean Water
- Provides rainwater capture systems, spring protection, and boreholes.
- Reduces waterborne diseases and frees up time for women and girls.

### 3. Education
- Offers school fees, supplies, and skills training.
- Focuses on literacy, sewing, and computer skills for long-term success.

### 4. Health
- Supports dental clinics, menstrual health programs (HopeKits), and clean water initiatives.
- Improves family health and economic stability.

---

## Impact and Operations

Since its founding, 100 Humanitarians International has:

- Completed over **21,000** sustainable food projects  
- Implemented more than **1,675** clean water projects  
- Supported over **6,000** education initiatives  
- Conducted over **8,575** health projects

The organization runs **six expeditions to Kenya annually**, involving volunteers in both project work and cultural exchange. It is powered by a dedicated team of volunteers in the U.S. and Kenya.

---

## How to Get Involved

You can support 100 Humanitarians International in several ways:

- **Donations** (one-time, monthly, stock, or crypto)
- **Volunteering**
- **Participating in expeditions**

The organization emphasizes transparency and regularly shares updates on project progress and impact.

➡️ Visit the official website to learn more: [https://100humanitarians.org/](https://100humanitarians.org/)
`;
```

### Step 10: What is a vector embedding?

```typescript
// File: embeddings.ts

import { OllamaEmbeddings } from '@langchain/ollama';

const embeddings = new OllamaEmbeddings({
  model: 'mxbai-embed-large',
});

let result = await embeddings.embedQuery('water');
console.log(result);
console.log(result.length);
```

```typescript
result = await embeddings.embedQuery('internet');
console.log(result);
console.log(result.length);

result = await embeddings.embedQuery('space');
console.log(result);
console.log(result.length);

result = await embeddings.embedQuery('joy');
console.log(result);
console.log(result.length);

result = await embeddings.embedQuery('cookies');
console.log(result);
console.log(result.length);
```

### Step 11: Vector store (with documents)

```typescript
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const vectorStore = await MemoryVectorStore.fromDocuments(
  [
    { pageContent: 'water', metadata: { source: 'http://water.com' } },
    { pageContent: 'internet', metadata: { source: 'http://internet.com' } },
    { pageContent: 'space', metadata: { source: 'http://space.com' } },
    { pageContent: 'joy', metadata: { source: 'http://joy.com' } },
    { pageContent: 'cookies', metadata: { source: 'http://cookies.com' } },
  ],
  embeddings
);

...

const retriever = vectorStore.asRetriever(1);
console.log(await retriever.invoke('wet'));

console.log(await retriever.invoke('digital'));
console.log(await retriever.invoke('misery'));
console.log(await retriever.invoke('chocolate chip'));
```

### Step 12: Full sentence vectors

```typescript
const vectorStore = await MemoryVectorStore.fromDocuments(
  [
    {
      pageContent:
        'When clean water is out of reach, families are left to depend on unsafe sources, often leading to preventable illness. Children miss school, parents struggle to care for their homes, and dreams are put on hold. But together, we can offer the gift of health. Through clean water projects and education, we help families turn on a tap to safety, dignity, and brighter days ahead.',
      metadata: { source: 'https://100humanitarians.org/' },
    },
    {
      pageContent:
        'Without access to menstrual hygiene products and safe spaces, too many girls are forced to miss school—or leave entirely—putting their futures at risk. What should be a natural part of growing up becomes a barrier to education and opportunity. Together, we can change this. By providing essential supplies and education, we help girls stay in school, stay empowered, and boldly shape their own paths forward.',
      metadata: { source: 'https://100humanitarians.org/' },
    },
    {
      pageContent:
        'For many families, the cost of school fees stands between their children and a brighter future. Without access to education, young dreams are quietly set aside, and the cycle of poverty continues. Together, we can change the story. By helping cover school fees, we empower children to step into classrooms with confidence—and into lives filled with possibility.',
      metadata: { source: 'https://100humanitarians.org/' },
    },
  ],
  embeddings
);

const retriever = vectorStore.asRetriever(1);
console.log(await retriever.invoke('education'));

// Note that education is present in all documents
```

### Step 13: PDF Document loaders and chunking

```typescript
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const embeddings = new OllamaEmbeddings();

async function loadDocuments() {
  const directoryDocs = await new DirectoryLoader('./documents', {
    '.pdf': (path: string) => new PDFLoader(path),
  }).load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const splitDocs = await textSplitter.splitDocuments(directoryDocs);
  return splitDocs;
}

export const vectorStore = await MemoryVectorStore.fromDocuments(
  await loadDocuments(),
  embeddings
);

export const retriever = vectorStore.asRetriever(1);

console.log(
  await vectorStore.similaritySearch(
    'How much income can come from chicken coops?'
  )
);
```

### Step 14: RAG

```typescript
async function main() {
  const question = 'How much income can come from chicken coops?';

  ...

  const prompt = await promptTemplate.invoke({
    question,
    knowledge: await vectorStore.similaritySearch(question),
  });
}

main();
```

### Step 15: Prompting for function calls

```typescript
const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'qwen3:8b';

async function main() {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      messages: [],
      stream: false,
    }),
  }).then((res) => res.json());

  console.log(response);
}

main();
```

```typescript
// File: tools.ts
function createReport(name) {
  console.info(arguments);
  console.info('going to call the create report API endpoint...');
  return 'Report created';
}

function sendReport(email, onDate) {
  console.info(arguments);
  console.info('going to call sendReport API call...');
  return 'Report sent';
}

function deleteReport(name) {
  console.info(arguments);
  console.info('going to call deleteReport API call...');
  return 'Report deleted';
}
```

User message below:

```plaintext
The user has a query below.  I want to execute a function to complete the user's request.

Here are the functions, with a description of what they do:
- createReport: Create a report.  Arguments: {name: string}
- sendReport: Sends a report to an email on a date. Arguments: {email: string, onDate: Date}
- deleteReport: Deletes a report. Arguments: {name: string}

Tell me which function to call, and the arguments (as a JSON object).  Tell me the answer, and nothing else.
```

```plaintext
Send a report to clintg@adobe.com on 2025-10-10
```

```typescript
const functions = {
  createReport,
  sendReport,
  deleteReport,
};

...

const nonThinkingResponse = response.message.content.replace(
  /<think>[\s\S]*?<\/think>/gm,
  ''
);

const json = JSON.parse(nonThinkingResponse);
const { function: functionName, arguments } = json;

const functionToCall = functions[functionName];
functionToCall(arguments);
```

### Step 16: Tool calling

```diff
-Here are the functions, with a description of what they do:
-- createReport: Create a report.  Arguments: {name: string}
-- sendReport: Sends a report to an email on a date. Arguments: {email: string, onDate: Date}
-- deleteReport: Deletes a report. Arguments: {name: string}
-
-Tell me which function to call, and the arguments (as a JSON object).  Tell me the answer, and nothing else.
```

```typescript
      tools: [
        {
          type: 'function',
          function: {
            name: 'createReport',
            description: 'Create a new report.',
            parameters: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the report.',
                },
              },
              required: ['name'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'sendReport',
            description: 'Send a report to an email on a date.',
            parameters: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'The email address to send the report to.',
                },
                onDate: {
                  type: 'string',
                  description: 'The date to send the report.',
                },
              },
              required: ['email', 'onDate'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'deleteReport',
            description: 'Delete a report.',
            parameters: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the report to delete.',
                },
              },
              required: ['name'],
            },
          },
        },
      ],

...

  console.log(JSON.stringify(response, null, 2));
```

### Step 17: Tool calling with LangChain

```typescript
import { ChatOllama } from '@langchain/ollama';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const createReportSchema = z.object({
  name: z.string().describe('The name of the report.'),
});
const createReportTool = tool(
  async function ({ name }) {
    console.info('going to call createReport API call...', name);
    return `Report "${name}" created successfully`;
  },
  {
    name: 'createReport',
    description: 'Create a new report.',
    schema: createReportSchema,
  }
);

const sendReportSchema = z.object({
  email: z.string().describe('The email address to send the report to.'),
  onDate: z.string().describe('The date to send the report.'),
});
const sendReportTool = tool(
  async function ({ email, onDate }) {
    console.info('going to call sendReport API call...', email, onDate);
    return `Report scheduled to be sent to ${email} on ${onDate}`;
  },
  {
    name: 'sendReport',
    description: 'Send a report to an email on a date.',
    schema: sendReportSchema,
  }
);

const deleteReportSchema = z.object({
  name: z.string().describe('The name of the report to delete.'),
});
const deleteReportTool = tool(
  async function ({ name }) {
    console.info('going to call deleteReport API call...', name);
    return `Report "${name}" deleted successfully`;
  },
  {
    name: 'deleteReport',
    description: 'Delete a report.',
    schema: deleteReportSchema,
  }
);

const tools = {
  createReport: createReportTool,
  sendReport: sendReportTool,
  deleteReport: deleteReportTool,
};

async function main() {
  const model = new ChatOllama({
    model: 'qwen3:8b',
  }).bindTools([createReportTool, sendReportTool, deleteReportTool]);

  const result = await model.invoke([
    {
      role: 'system',
      content: `Pick a tool to call.`,
    },
    {
      role: 'user',
      content: 'Create a report called "Monthly Sales Report".',
    },
  ]);

  console.log(result);

  const [toolCall] = result.tool_calls;
  const { name, args } = toolCall;

  const tool = tools[name];
  const functionResult = await tool.invoke(args);
  console.log(functionResult);
}

main();
```

### Step 18: MCP

```typescript
import { fastify } from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
```

```typescript
const server = new McpServer({
  name: 'Reports MCP',
  version: '1.0.0',
});

Object.keys(tools).forEach((toolName) => {
  const tool = tools[toolName];
  server.tool(
    tool.name,
    tool.description,
    tool.schema.shape,
    async (params) => ({
      content: [{ type: 'text', text: await tool.invoke(params) }],
    })
  );
});

const app = fastify();

app.post('/mcp', async (req, reply) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  reply.raw.on('close', async () => {
    await transport.close();
    await server.server.close();
  });

  await server.server.connect(transport);
  await transport.handleRequest(req.raw, reply.raw, req.body);
});

app.listen({ port: 3000 });
```

```bash
curl --request POST \
  --url http://localhost:3000/mcp \
  --header 'Accept: application/json, text/event-stream' \
  --header 'Content-Type: application/json' \
  --data '{"method":"tools/list","params":{"_meta":{"application":"workfront"}},"jsonrpc":"2.0","id":3}'
```

```bash
curl --request POST \
  --url http://localhost:3000/mcp \
  --header 'Accept: application/json, text/event-stream' \
  --header 'Content-Type: application/json' \
  --data '{"method":"tools/call","params":{"name":"createReport","arguments":{"name":"Monthly Sales Report"},"_meta":{"application":"workfront"}},"jsonrpc":"2.0","id":4}'
```

```bash
npx @modelcontextprotocol/inspector
```

```typescript
// Filename: graphNodes/tools.ts

import { ToolNode } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const mcpClient = new MultiServerMCPClient({
  // Whether to prefix tool names with the server name (optional, default: true)
  prefixToolNameWithServerName: false,
  // Optional additional prefix for tool names (optional, default: "mcp")
  additionalToolNamePrefix: '',
  // Use standardized content block format in tool outputs
  useStandardContentBlocks: true,

  // Server configuration
  mcpServers: {
    reports: {
      type: 'http',
      url: 'http://localhost:3000/mcp',
      headers: {
        'x-howdy': 'partner',
      },
    },
  },
});

const localToolSchema = z.object({
  testing: z.string().describe('sample'),
});
const localTool = tool<typeof localToolSchema>(
  async function ({ testing }) {
    return 'Sample response';
  },
  {
    name: 'localTool',
    description: 'Some description',
    schema: localToolSchema,
  }
);

export const tools = [...(await mcpClient.getTools()), localTool];
export const toolNode = new ToolNode(tools);
```

### Step 19: LangGraph Agents

Checkout the correct code, it's the only way.
