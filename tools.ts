import { ChatOllama } from '@langchain/ollama';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

import { fastify } from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

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
