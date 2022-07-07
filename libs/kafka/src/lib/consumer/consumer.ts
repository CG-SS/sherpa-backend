import { kafkaClient } from '@sherpa-backend/kafka';
import { KafkaConsumerParams } from './types';
import { Consumer } from 'kafkajs';

/**
 * Helper function to define and run a Kafka consumer.
 * It wraps the process of creating and connecting a Kafka consumer.
 *
 * @param subscriptionParams The parameters for the subscription.
 * @param runParams The parameters for running the consumer.
 * @param consumerParams The parameters for the consumer itself.
 * @return The Kafka consumer with the specified params.
 */
export const startKafkaConsumer = async ({
  subscriptionParams,
  runParams,
  consumerParams,
}: KafkaConsumerParams): Promise<Consumer> => {
  const consumer = kafkaClient.consumer(consumerParams);
  await consumer.connect();
  await consumer.subscribe(subscriptionParams);
  await consumer.run(runParams);

  return consumer;
};
