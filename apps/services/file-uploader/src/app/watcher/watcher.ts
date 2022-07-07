import watch from 'node-watch';
import { logger } from '@sherpa-backend/logger';
import { environment } from '../environment';
import { parseJsonFile } from './helpers';

const { unparsedFilesDir } = environment;

logger.info(`Starting watcher on dir '${unparsedFilesDir}'.`);

// We watch the unparsed files dir with 2 seconds delay for some flow control.
export const watcher = watch(unparsedFilesDir, { delay: 2 * 1000 }, async (evt, name) => {
  if (evt === 'update') {
    await parseJsonFile(name);
  } else {
    logger.info(`Ignoring event '${evt}'.`);
  }
});
