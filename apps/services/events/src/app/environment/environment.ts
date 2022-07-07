export const environment = {
  kafkaGroupId: process.env.KAFKA_GROUP_ID ?? 'default-group',
  kafkaTopic: process.env.KAFKA_TOPIC ?? 'default-topic',
};
