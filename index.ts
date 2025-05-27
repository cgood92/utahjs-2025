import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const llm = new Ollama({
  model: 'qwen3:8b',
});
const embeddings = new OllamaEmbeddings();

async function loadDocuments() {
  const directoryDocs = await new DirectoryLoader('./documents', {
    '.pdf': (path: string) => new PDFLoader(path),
  }).load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const splitDocs = await textSplitter.splitDocuments(directoryDocs);
  return splitDocs;
}

const vectorStore = await MemoryVectorStore.fromDocuments(
  await loadDocuments(),
  embeddings
);

console.log(
  await vectorStore.similaritySearch(
    'How much money can come from chicken coops?'
  )
);

// async function main() {
//   const question = 'How much income can come from chicken coops?';
//   const promptTemplate = ChatPromptTemplate.fromMessages([
//     [
//       'system',
//       `Please answer the user's question using only the knowledge below:
// ---
// {knowledge}
// ---

// Do NOT use any other information other than the knowledge provided.  If the answer is not in the knowledge, say "I don't know".

// Do not mention the documents in your response, or your reasoning.  Just state the answer succinctly.`,
//     ],
//     ['user', '{question}'],
//   ]);

//   let totalResponse = '';

//   const prompt = await promptTemplate.invoke({
//     question,
//     knowledge: await vectorStore.similaritySearch(question),
//   });
//   const response = await llm.stream(prompt);

//   for await (const chunk of response) {
//     totalResponse += chunk;
//     console.clear();
//     console.log(totalResponse);
//   }
// }

// main();
