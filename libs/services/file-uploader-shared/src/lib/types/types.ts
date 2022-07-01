import { AllowedSchema } from 'express-json-validator-middleware';

export const OrganizerInputSchema: AllowedSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
    },
  },
};

export type OrganizerInput = {
  name: string;
};

export const AttendeeInputSchema: AllowedSchema = {
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

export type AttendeeInput = {
  name: string;
  age: number;
};

export const EventInputSchema: AllowedSchema = {
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
      $schema: OrganizerInputSchema.$schema,
    },
    attendees: {
      type: 'array',
      $schema: AttendeeInputSchema.$schema,
    },
  },
};

export type EventInput = {
  name: string;
  date: string;
  isOutside: boolean;
  organizer: OrganizerInput;
  attendees: AttendeeInput[];
};
