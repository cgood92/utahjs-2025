import { ChatOllama } from '@langchain/ollama';
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

async function main() {
  const model = new ChatOllama({
    model: 'qwen3:8b',
  }).bindTools([donateTool, getExpeditionGuideTool, joinExpeditionTool]);

  const result = await model.invoke([
    {
      role: 'user',
      content: `The user has a query below. I want to execute a function to complete the user's request. Here is the request:

---
I want to get more information about an expedition.
---

Here is some context about the user:
---
My email address is clintg@adobe.com.
---`,
    },
  ]);

  const [toolCall] = result.tool_calls!;
  const { name, args } = toolCall;

  const tool = tools[name];
  const functionResult = await tool.invoke(args);
  console.log(functionResult);
}

main().catch(console.error);
