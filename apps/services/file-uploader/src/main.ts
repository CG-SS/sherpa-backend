import { app } from './app';
import { logger } from '@sherpa-backend/logger';
import { watcher } from './app/watcher';
import { startKafkaReplicator } from '@sherpa-backend/domain/events';

const port = process.env.PORT ?? 8081;

app.listen(port, () => {
  logger.info(`Listening to port '${port}'.`);
});

watcher.on('ready', () => logger.info('Watcher ready.'));

startKafkaReplicator()
  .then(() => logger.info('Started Kafka replicator.'))
  .catch((e) => {
    logger.error(e);

    process.exit(1);
  });
