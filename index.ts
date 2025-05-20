const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'qwen3:8b';

async function main() {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      messages: [
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
      ],
      stream: true,
    }),
  });

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
}

main();
