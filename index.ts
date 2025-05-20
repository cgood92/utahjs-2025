const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'qwen3:8b';

async function main() {
  return fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: 'Why is the sky blue? Tell me in 25 words or less.',
        },
      ],
      stream: false,
    }),
  })
    .then((res) => res.json())
    .then(console.log);
}

main();
