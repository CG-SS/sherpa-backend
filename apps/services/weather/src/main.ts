import { logger } from '@sherpa-backend/logger';
import { startKafkaConsumer } from './app/';

startKafkaConsumer().then(() => logger.info('Started Kafka consumer.'));
