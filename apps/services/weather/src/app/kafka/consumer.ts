import { kafkaClient } from '@sherpa-backend/kafka';
import { replicateEvent, validateMessage } from '@sherpa-backend/domain/events';
import { logger } from '@sherpa-backend/logger';
import stringify from 'json-stringify-safe';
import { environment } from '../../environments';
import { eventWeatherHydrate } from './hydrator';
import { getKafkaProducer } from './producer';

const kafkaConsumer = kafkaClient.consumer({
  groupId: environment.kafkaGroupId,
});

export const startKafkaConsumer = async () => {
  await kafkaConsumer.connect();
  // We want to grab the messages from the beginning for event syncing.
  await kafkaConsumer.subscribe({ topic: environment.kafkaTopic, fromBeginning: true });
  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      try {
        const kafkaProducer = await getKafkaProducer();

        await replicateEvent(validateMessage(message)).then((e) =>
          eventWeatherHydrate(e, kafkaProducer)
        );

        await kafkaProducer.disconnect();
      } catch (e) {
        // Ideally ,we would want to send the message back into the queue, so it gets retried later.
        // However, for the sake of simplicity, we don't do this here.
        logger.error(`Unexpected error while parsing message '${stringify(message)}'.`);
        logger.error(e?.message);
      }
    },
  });
};
