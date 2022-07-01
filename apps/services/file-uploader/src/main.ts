import { app } from './app';
import { logger } from '@sherpa-backend/logger';
import { watcher } from "./app/watcher/watcher";

const port = process.env.PORT ?? 8081;

app.listen(port, () => {
  logger.info(`Listening to port '${port}'.`);
});

watcher.on('ready', () => logger.info('Watcher ready.'));
