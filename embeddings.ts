import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

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

export const retriever = vectorStore.asRetriever(1);
