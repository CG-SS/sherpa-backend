import { kafkaClient } from '@sherpa-backend/kafka';
import { replicateEvent, validateMessage } from '@sherpa-backend/domain/events';
import { logger } from '@sherpa-backend/logger';
import stringify from 'json-stringify-safe';

const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID ?? 'default-group-id';
const KAFKA_TOPIC = process.env.KAFKA_TOPIC ?? 'default-topic';

const kafkaConsumer = kafkaClient.consumer({
  groupId: KAFKA_GROUP_ID,
});

export const startKafkaReplicator = async () => {
  await kafkaConsumer.connect();
  // We want to grab the messages from the beginning for event syncing.
  await kafkaConsumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      try {
        await replicateEvent(validateMessage(message));
      } catch (e) {
        // Ideally ,we would want to send the message back into the queue, so it gets retried later.
        // However, for the sake of simplicity, we don't do this here.
        logger.error(`Unexpected error while parsing message '${stringify(message)}'.`);
        logger.error(e);
      }
    },
  });
};
