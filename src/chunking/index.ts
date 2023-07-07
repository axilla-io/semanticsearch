import * as fs from 'node:fs/promises';
import * as Path from 'node:path';

import chunkMarkdown from './markdown';
import chunkWikipediaExtract from './wikipedia';

type FileChunkOptions = {
  type: 'file';
  filePath: string;
};

type WikipediaExtractChunkOptions = {
  type: 'wikipediaExtract';
  content: string;
};

type ChunkOptions = FileChunkOptions | WikipediaExtractChunkOptions;

export default async function chunk(options: ChunkOptions): Promise<string[]> {
  switch (options.type) {
    case 'file':
      return chunkFile(options.filePath);
    case 'wikipediaExtract':
      return chunkWikipediaExtract(options.content);
  }
}

async function chunkFile(filePath: string): Promise<string[]> {
  const extname = Path.extname(filePath);
  const contents = await fs.readFile(filePath, { encoding: 'utf8' });

  switch (extname) {
    case '.md':
      return chunkMarkdown(contents);
    default:
      throw new Error(`Cannot chunk file with unrecognized extension "${extname}"`);
  }
}
