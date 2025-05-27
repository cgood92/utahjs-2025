import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const embeddings = new OllamaEmbeddings({
  model: 'mxbai-embed-large',
});

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

const retriever = vectorStore.asRetriever(1);

console.log(await retriever.invoke('wet'));
// console.log(await retriever.invoke('technology'));
// console.log(await retriever.invoke('misery'));
