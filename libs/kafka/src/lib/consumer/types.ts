import { ConsumerConfig, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs';

export type KafkaConsumerParams = {
  subscriptionParams: ConsumerSubscribeTopics;
  consumerParams: ConsumerConfig;
  runParams: ConsumerRunConfig;
};
