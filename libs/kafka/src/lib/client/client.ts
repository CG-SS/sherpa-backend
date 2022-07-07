import { Kafka, logLevel } from 'kafkajs';
import { logger } from '@sherpa-backend/logger';

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID ?? 'default-client';
const KAFKA_BROKERS = process.env.KAFKA_BROKERS?.split(';') ?? [];

export const kafkaClient = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.NOTHING,
});

logger.info(
  `Kafka client started with client ID '${KAFKA_CLIENT_ID}' and brokers '${KAFKA_BROKERS.join(
    "','"
  )}'.`
);
