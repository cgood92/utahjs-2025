import { fastify } from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const donateSchema = z.object({
  amount: z.number().describe('The amount to donate.'),
});
const donateTool = tool<typeof donateSchema>(
  async function ({ amount }) {
    console.info('going to call donate API call...', amount);
    return `Donation of ${amount} processed successfully`;
  },
  {
    name: 'donate',
    description: 'Donate to 100 humanitarians.',
    schema: donateSchema,
  }
);

const getExpeditionGuideSchema = z.object({
  email: z.string().describe('The email of the user.'),
});
const getExpeditionGuideTool = tool<typeof getExpeditionGuideSchema>(
  async function ({ email }) {
    console.info('going to call getExpeditionGuide API call...', email);
    return `Expedition guide sent to ${email}`;
  },
  {
    name: 'getExpeditionGuide',
    description: 'Get a guide for an expedition.',
    schema: getExpeditionGuideSchema,
  }
);

const joinExpeditionSchema = z.object({
  email: z.string().describe('The email of the user.'),
  startDate: z.string().describe('The start date of the expedition.'),
});
const joinExpeditionTool = tool<typeof joinExpeditionSchema>(
  async function ({ email, startDate }) {
    console.info('going to call joinExpedition API call...', email, startDate);
    return `Successfully joined expedition starting ${startDate}`;
  },
  {
    name: 'joinExpedition',
    description: 'Join an expedition.',
    schema: joinExpeditionSchema,
  }
);

const tools = {
  donate: donateTool,
  getExpeditionGuide: getExpeditionGuideTool,
  joinExpedition: joinExpeditionTool,
};

const server = new McpServer({
  name: '100 Humanitarians MCP',
  version: '1.0.0',
});

Object.keys(tools).forEach((toolName) => {
  const tool = tools[toolName];
  server.tool(toolName, tool.schema.shape, async (params) => ({
    content: [{ type: 'text', text: await tool.invoke(params) }],
  }));
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

/*
curl --request POST \
  --url http://localhost:3000/mcp \
  --header 'Accept: application/json, text/event-stream' \
  --header 'Content-Type: application/json' \
  --data '{"method":"tools/list","params":{"_meta":{"application":"workfront"}},"jsonrpc":"2.0","id":3}'
*/

/*
curl --request POST \
  --url http://localhost:3000/mcp \
  --header 'Accept: application/json, text/event-stream' \
  --header 'Content-Type: application/json' \
  --data '{"method":"tools/call","params":{"name":"donate","arguments":{"amount":546},"_meta":{"application":"workfront"}},"jsonrpc":"2.0","id":4}'
*/
