import { kafkaClient } from '@sherpa-backend/kafka';

export const getKafkaProducer = async () => {
  const producer = kafkaClient.producer({
    // If we fail to produce, we retry at maximum 7 times, with a multiplier
    // of 2, that is, we wait twice to try it again.
    retry: {
      maxRetryTime: 7,
      multiplier: 2,
    },
  });

  await producer.connect();

  return producer;
};
