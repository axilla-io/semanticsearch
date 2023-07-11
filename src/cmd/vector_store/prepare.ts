import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { prepare as prepareChroma } from '../../vector_stores/chroma';
import { prepare as preparePinecone } from '../../vector_stores/pinecone';
import { prepare as preparePg } from '../../vector_stores/pgvector';
import { SUPPORTED_VECTOR_STORES, type SupportedVectorStores } from '../../vector_stores';
import { getEnv, getEnvOrThrow } from '../../config';

const argv = yargs(hideBin(process.argv))
  .option('store', {
    choices: SUPPORTED_VECTOR_STORES,
    description: 'The vector store',
    demandOption: true,
  })
  .parseSync();

prepare(argv.store);

async function prepare(store: SupportedVectorStores) {
  switch (store) {
    case 'chroma':
      return await prepareChroma({
        path: getEnv('CHROMA_PATH'),
        collection: getEnvOrThrow('CHROMA_COLLECTION'),
      });
    case 'pinecone':
      return await preparePinecone({
        apiKey: getEnvOrThrow('PINECONE_API_KEY'),
        environment: getEnvOrThrow('PINECONE_ENVIRONMENT'),
        index: getEnvOrThrow('PINECONE_INDEX'),
        dimension: Number(getEnvOrThrow('PINECONE_INDEX_DIMENSION')),
      });
    case 'pgvector':
      return await preparePg({
        tableName: getEnvOrThrow('PG_TABLE_NAME'),
        dimension: Number(getEnvOrThrow('PG_VECTOR_DIMENSION')),
        dsn: getEnvOrThrow('PG_DSN'),
      });
    default:
      throw new Error(`Unrecognized store "${store}"`);
  }
}
