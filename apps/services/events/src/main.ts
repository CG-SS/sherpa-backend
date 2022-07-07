import { app } from './app';
import { logger } from '@sherpa-backend/logger';
import { startKafkaReplicator } from '@sherpa-backend/domain/events';

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  logger.info(`Listening to port '${port}'.`);
});

startKafkaReplicator()
  .then(() => logger.info('Started Kafka replicator.'))
  .catch((e) => {
    logger.error(e);

    process.exit(1);
  });
