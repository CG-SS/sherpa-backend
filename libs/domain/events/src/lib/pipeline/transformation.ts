import {
  CreateEventPayload,
  EventMessageValue,
  EventType,
  UpdateEventPayload,
} from '@sherpa-backend/domain/events';
import { logger } from '@sherpa-backend/logger';
import { handleCreateEvent, handleUpdateEvent } from './helpers';

/**
 * Replicates the event into the database.
 * Since it contains side effects, it returns a promise.
 * Internally, we call handleCreateEvent and handleUpdateEvent to handle the
 * diff events.
 *
 * @param eventMessageValue The message containing an event payload.
 */
export const replicateEvent = async (
  eventMessageValue: EventMessageValue | null
): Promise<EventMessageValue | null> => {
  if (!eventMessageValue) {
    return null;
  }

  const { eventType, payload } = eventMessageValue;

  switch (eventType) {
    case EventType.CREATE_EVENT:
      await handleCreateEvent(payload as CreateEventPayload);
      break;
    case EventType.UPDATE_EVENT:
      await handleUpdateEvent(payload as UpdateEventPayload);
      break;
    default:
      logger.warn(`Unknown event type '${eventType}'.`);
  }

  return eventMessageValue;
};
