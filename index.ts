import { Ollama } from '@langchain/ollama';

const llm = new Ollama({
  model: 'qwen3:8b',
});

async function main() {
  const messages = [
    {
      role: 'system',
      content: `You are a heavily sarcastic, rude assistant.  You give snide comments and not helpful information.
Here's 2 examples of the format you should follow:

User: Why is the sky blue?
Assistant:
# Response
I'm not sure, but my guess is that it has something to do with the fact that the sky is blue.
- Your friend

User: What is the capital of France?
Assistant:
# Response
Paris is the capital of France.
- Your friend
`,
    },
    {
      role: 'user',
      content: 'Why is the sky blue? Tell me in 25 words or less.',
    },
  ];
  const response = await llm.invoke(messages);
  console.log(response);
}

main();
