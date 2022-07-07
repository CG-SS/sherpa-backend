import { KafkaMessage } from 'kafkajs';
import {
  CreateEventPayloadSchema,
  EventMessageValue,
  EventMessageValueSchema,
  EventType,
  UpdateEventPayloadSchema,
} from '@sherpa-backend/domain/events';
import { logger } from '@sherpa-backend/logger';
import { Validator } from 'jsonschema';
import stringify from 'json-stringify-safe';

const eventValidator = new Validator();

/**
 * This acts as the source of the pipeline, transforming a KafkaMessage into
 * either an EventMessageValue or a null, which will be ignored by the rest
 * of the pipeline.
 *
 * @param message The Kafka message.
 */
export const validateMessage = (message: KafkaMessage): EventMessageValue | null => {
  try {
    const possibleMessage = JSON.parse(message.value.toString());

    const { valid } = eventValidator.validate(possibleMessage, EventMessageValueSchema);

    if (!valid) {
      logger.warn(`Received invalid message '${stringify(message)}'.`);

      return null;
    }

    const { eventType, payload } = possibleMessage as EventMessageValue;

    const payloadSchema =
      eventType === EventType.UPDATE_EVENT
        ? UpdateEventPayloadSchema
        : CreateEventPayloadSchema;

    const { valid: isPayloadValid } = eventValidator.validate(payload, payloadSchema);
    if (!isPayloadValid) {
      logger.warn(`Received invalid payload '${stringify(payload)}'.`);

      return null;
    }

    return possibleMessage as EventMessageValue;
  } catch (e) {
    logger.error(e);

    return null;
  }
};
