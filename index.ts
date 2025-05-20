import { HumanMessage } from '@langchain/core/messages';
import { Ollama } from '@langchain/ollama';

const llm = new Ollama({
  model: 'qwen3:8b',
});

async function main() {
  const messages = [new HumanMessage('What is 100 humanitarians?')];

  let totalResponse = '';
  const response = await llm.stream(messages);
  for await (const chunk of response) {
    totalResponse += chunk;
    console.clear();
    console.log(totalResponse);
  }
}

main();
