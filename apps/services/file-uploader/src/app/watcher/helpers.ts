import * as fs from 'fs';
import { logger } from '@sherpa-backend/logger';
import { Schema, Validator } from 'jsonschema';
import {
  EventInput,
  EventInputSchema,
} from '@sherpa-backend/services/file-uploader-shared';
import { prisma } from '@sherpa-backend/prisma';
import { parseISO, formatISO } from 'date-fns';
import { getKafkaProducer } from '../producer';
import { environment } from '../environment';
import {
  CreateEventPayload,
  EventMessageValue,
  EventType,
} from '@sherpa-backend/domain/events';
import { Message } from 'kafkajs';
import { promisify } from 'util';
import path from 'path';

// Input validator for the json file.
const inputValidator = new Validator();

const moveFile = promisify(fs.rename);

export const parseJsonFile = async (filePath: string) => {
  try {
    const kafkaProducer = await getKafkaProducer();

    // We might want to stream the file instead of loading it all on memory.
    // But for the sake of simplicity, we just load it on memory.
    const inputJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(inputJson)) {
      logger.error(`File '${filePath}' not an array. Expected array of JSONs.`);

      return;
    }
    const arJson = inputJson as any[];

    let kafkaBatch: Message[] = [];

    for (const o of arJson) {
      if (typeof o !== 'object') {
        logger.warn(`Not a JSON object: '${JSON.stringify(o)}'.`);
        continue;
      }

      const { valid } = inputValidator.validate(o, EventInputSchema as Schema);
      if (!valid) {
        logger.warn(`Not a valid EventInputSchema entry: '${JSON.stringify(o)}'.`);
        continue;
      }

      const eventInput = o as EventInput;
      const { date, organizer, attendees, isOutside, name } = eventInput;
      const { name: organizerName } = organizer;

      const isoDate = parseISO(date);

      // Check if an event with the same already exists.
      const existingEvent = await prisma.event.findUnique({
        where: {
          name,
        },
      });
      // Since we only accept new events (that is, creates), if the event already
      // exists, we ignore this entry.
      if (existingEvent) {
        logger.warn(`Event '${name}' already exists.`);

        continue;
      }

      const createdEvent = await prisma.event.create({
        data: {
          name,
          date: isoDate,
          isOutside,
          organizer: {
            create: {
              name: organizerName,
            },
          },
          attendees: {
            create: attendees,
          },
        },
      });

      logger.info(`Created event '${JSON.stringify(createdEvent)}'.`);

      const payload: CreateEventPayload = {
        attendees: attendees,
        date: formatISO(isoDate),
        isOutside,
        name,
        organizer: {
          name: organizerName,
        },
      };

      const eventMessage: EventMessageValue = {
        eventType: EventType.CREATE_EVENT,
        payload,
      };

      kafkaBatch.push({ value: JSON.stringify(eventMessage) });

      if (kafkaBatch.length >= environment.fileParserBatchSize) {
        await kafkaProducer.send({
          topic: environment.kafkaTopic,
          messages: kafkaBatch,
        });

        kafkaBatch = [];
      }
    }

    // If there are remaining messages, send them all.
    if (kafkaBatch.length) {
      await kafkaProducer.send({
        topic: environment.kafkaTopic,
        messages: kafkaBatch,
      });
    }

    logger.info(`Finished parsing file '${filePath}'.`);

    const newPath = path.join(environment.parsedFilesDir, path.basename(filePath));

    await moveFile(filePath, newPath);

    logger.info(`Moved file to '${newPath}'.`);

    await kafkaProducer.disconnect();
  } catch (e) {
    logger.error(`Error while parsing file '${filePath}'.`);
    logger.error(e);
  }
};
