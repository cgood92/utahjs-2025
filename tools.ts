const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'qwen3:8b';

async function main() {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: `The user has a query below.  I want to execute a function to complete the user\'s request.  Here is the request:

---
I want to get more information about an expedition.
---

Here is some context about the user:
---
My email address is clintg@adobe.com.
---`,
        },
      ],
      stream: false,
      tools: [
        {
          type: 'function',
          function: {
            name: 'donate',
            description: 'Donate to 100 humanitarians.',
            parameters: {
              type: 'object',
              properties: {
                amount: {
                  type: 'number',
                  description: 'The amount to donate.',
                },
              },
              required: ['amount'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'getExpeditionGuide',
            description: 'Get a guide for an expedition.',
            parameters: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'The email of the user.',
                },
              },
              required: ['email'],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'joinExpedition',
            description: 'Join an expedition.',
            parameters: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'The email of the user.',
                },
                startDate: {
                  type: 'string',
                  description: 'The start date of the expedition.',
                },
              },
              required: ['email', 'startDate'],
            },
          },
        },
      ],
    }),
  }).then((res) => res.json());

  console.log(JSON.stringify(response, null, 2));

  // const [toolCall] = response.message.tool_calls;
  // const { name, arguments: args } = toolCall.function;

  // const functionToCall = functions[name];
  // functionToCall(args);
}

main();

function donate(amount: number) {
  console.info('going to call donate API call...', amount);
}

function getExpeditionGuide(email: string) {
  console.info('going to call getExpeditionGuide API call...', email);
}

function joinExpedition(email: string, startDate: Date) {
  console.info('going to call joinExpedition API call...', email, startDate);
}

const functions = {
  donate,
  getExpeditionGuide,
  joinExpedition,
};
