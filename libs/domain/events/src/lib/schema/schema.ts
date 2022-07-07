import { Schema } from 'jsonschema';

export enum EventType {
  CREATE_EVENT = 'create-event',
  UPDATE_EVENT = 'update-event',
}

export const CreateEventPayloadOrganizerSchema: Schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
    },
  },
};

export type CreateEventPayloadOrganizer = {
  name: string;
};

export const CreateEventPayloadAttendeeSchema: Schema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
      exclusiveMinimum: 0,
    },
  },
};

export type CreateEventPayloadAttendee = {
  name: string;
  age: number;
};

export const CreateEventPayloadSchema: Schema = {
  type: 'object',
  required: ['name', 'date', 'isOutside', 'organizer', 'attendees'],
  properties: {
    name: {
      type: 'string',
    },
    date: {
      type: 'string',
      // This regex only matches ISO 8601 dates.
      pattern: /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/.source,
    },
    isOutside: {
      type: 'boolean',
    },
    organizer: {
      type: 'object',
      $schema: CreateEventPayloadOrganizerSchema.$schema,
    },
    attendees: {
      type: 'array',
      $schema: CreateEventPayloadAttendeeSchema.$schema,
    },
  },
};

export type CreateEventPayload = {
  name: string;
  date: string;
  isOutside: boolean;
  organizer: CreateEventPayloadOrganizer;
  attendees: CreateEventPayloadAttendee[];
};

export const UpdateEventPayloadWeatherSchema: Schema = {
  type: 'object',
  required: ['chanceOfRain', 'temperatureInDegreesCelsius'],
  properties: {
    temperatureInDegreesCelsius: {
      type: 'number',
    },
    chanceOfRain: {
      type: 'number',
      exclusiveMinimum: 0,
      exclusiveMaximum: 100,
    },
  },
};

export type UpdateEventPayloadWeather = {
  chanceOfRain: number;
  temperatureInDegreesCelsius: number;
};

export const UpdateEventPayloadSchema: Schema = {
  type: 'object',
  required: ['weather', 'eventName'],
  properties: {
    weather: {
      type: 'object',
      $schema: UpdateEventPayloadWeatherSchema.$schema,
    },
    eventName: {
      type: 'string',
    },
  },
};

export type UpdateEventPayload = {
  eventName: string;
  weather: UpdateEventPayloadWeather;
};

export type EventPayload = CreateEventPayload | UpdateEventPayload;

export const EventMessageValueSchema: Schema = {
  type: 'object',
  required: ['eventType', 'payload'],
  properties: {
    eventType: {
      enum: ['create-event', 'update-event'],
    },
    payload: {
      type: 'object',
    },
  },
  if: {
    properties: { eventType: { const: 'create-event' } },
  },
  then: {
    properties: { payload: { $schema: CreateEventPayloadSchema.$schema } },
  },
  else: {
    properties: { payload: { $schema: UpdateEventPayloadSchema.$schema } },
  },
};

export type EventMessageValue = {
  eventType: EventType;
  payload: EventPayload;
};
