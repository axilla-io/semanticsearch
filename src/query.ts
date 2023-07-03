import pinecone from './pinecone';
import { createCompletion, createEmbedding } from './openai';

type QueryOptions = {
  query: string;
  model: string;
};

export async function query(options: QueryOptions) {
  await pinecone.init();

  const query = options.query;
  const model = options.model;

  const embedding = await createEmbedding({ input: query });

  const { matches } = await pinecone.query({
    topK: 3,
    vector: embedding.data[0].embedding,
    includeMetadata: true,
  });

  const context = matches
    ?.map((match) => {
      const metadata = match.metadata as any;
      return metadata.text;
    })
    .join('\n\n---\n\n');

  const prompt = [
    'Answer the question based on the markdown context below.\n\n',
    'Context:\n',
    context,
    `\n\nQuestion: ${query}`,
    `\nAnswer:`,
  ].join('');

  const results = await createCompletion({ model, prompt });

  console.log(results[0].text?.trim());
}
