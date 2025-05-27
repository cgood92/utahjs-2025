import { OllamaEmbeddings } from '@langchain/ollama';

const embeddings = new OllamaEmbeddings({
  model: 'mxbai-embed-large',
});

let result = await embeddings.embedQuery('water');
console.log(result);
console.log(result.length);

// result = await embeddings.embedQuery('internet');
// console.log(result);
// console.log(result.length);

// result = await embeddings.embedQuery('space');
// console.log(result);
// console.log(result.length);

// result = await embeddings.embedQuery('joy');
// console.log(result);
// console.log(result.length);

// result = await embeddings.embedQuery('cookies');
// console.log(result);
// console.log(result.length);
