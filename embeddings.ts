import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const embeddings = new OllamaEmbeddings({
  model: 'mxbai-embed-large',
});

const vectorStore = await MemoryVectorStore.fromDocuments(
  [
    {
      pageContent:
        'When clean water is out of reach, families are left to depend on unsafe sources, often leading to preventable illness. Children miss school, parents struggle to care for their homes, and dreams are put on hold. But together, we can offer the gift of health. Through clean water projects and education, we help families turn on a tap to safety, dignity, and brighter days ahead.',
      metadata: { source: 'https://100humanitarians.org/' },
    },
    {
      pageContent:
        'Without access to menstrual hygiene products and safe spaces, too many girls are forced to miss school—or leave entirely—putting their futures at risk. What should be a natural part of growing up becomes a barrier to education and opportunity. Together, we can change this. By providing essential supplies and education, we help girls stay in school, stay empowered, and boldly shape their own paths forward.',
      metadata: { source: 'https://100humanitarians.org/' },
    },
    {
      pageContent:
        'For many families, the cost of school fees stands between their children and a brighter future. Without access to education, young dreams are quietly set aside, and the cycle of poverty continues. Together, we can change the story. By helping cover school fees, we empower children to step into classrooms with confidence—and into lives filled with possibility.',
      metadata: { source: 'https://100humanitarians.org/' },
    },
  ],
  embeddings
);

const retriever = vectorStore.asRetriever(1);
console.log(await retriever.invoke('education')); // Note that education is present in all documents
