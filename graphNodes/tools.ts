import { ToolNode } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { retriever } from '../embeddings.ts';

const mcpClient = new MultiServerMCPClient({
  // Whether to prefix tool names with the server name (optional, default: true)
  prefixToolNameWithServerName: false,
  // Optional additional prefix for tool names (optional, default: "mcp")
  additionalToolNamePrefix: '',
  // Use standardized content block format in tool outputs
  useStandardContentBlocks: true,

  // Server configuration
  mcpServers: {
    '100-humanitarians': {
      type: 'http',
      url: 'http://localhost:3000/mcp',
      headers: {
        'x-howdy': 'partner',
      },
    },
  },
});

const getInformationSchema = z.object({
  questionOrSearchQuery: z
    .string()
    .describe(
      'A question, or semantic search query, that can be answered from a vector store of embedded information regarding 100 humanitarians.'
    ),
});
const getInformationTool = tool<typeof getInformationSchema>(
  async function ({ questionOrSearchQuery }) {
    const [result] = await retriever.invoke(questionOrSearchQuery);
    return `${result.pageContent}\n\nSource: ${result.metadata.source}`;
  },
  {
    name: 'getInformation',
    description:
      'Gets information regarding a question, or semantic search query, that can be answered from a vector store of embedded information regarding 100 humanitarians.',
    schema: getInformationSchema,
  }
);

export const tools = [...(await mcpClient.getTools()), getInformationTool];
export const toolNode = new ToolNode(tools);
