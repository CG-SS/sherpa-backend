import watch from "node-watch";
import { logger } from "@sherpa-backend/logger";
import { environment } from "../environment";

const { unparsedFilesDir } = environment;

logger.info(`Starting watcher on dir '${unparsedFilesDir}'.`);

// We watch the unparsed files dir with 2 seconds delay for some flow control.
export const watcher = watch(unparsedFilesDir, { delay: 2 * 1000 }, (evt, name) => {
  if(evt === 'update'){
    logger.info(`Update on ${name}.`);
  }
});
