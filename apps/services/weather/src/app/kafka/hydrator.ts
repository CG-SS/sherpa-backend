import {
  CreateEventPayload,
  EventMessageValue,
  EventType,
  UpdateEventPayload,
} from '@sherpa-backend/domain/events';
import { weatherApiClient } from '../weatherapi';
import { closestIndexTo, parseISO } from 'date-fns';
import { logger } from '@sherpa-backend/logger';
import stringify from 'json-stringify-safe';
import { Producer } from 'kafkajs';
import { prisma } from '@sherpa-backend/prisma';
import { environment } from '../../environments';
import { Prisma } from '@prisma/client';
import { isWithinSevenDays } from './helpers';

/**
 * Hydrates the message with a weather forecast if the event is within 7 days
 * from the current date.
 * We utilize Weather API (https://www.weatherapi.com/) for it.
 *
 * @param eventMessageValue The message containing an event payload.
 * @param kafkaProducer A kafka producer for sending the update events.
 */
export const eventWeatherHydrate = async (
  eventMessageValue: EventMessageValue | null,
  kafkaProducer: Producer
): Promise<EventMessageValue | null> => {
  if (!eventMessageValue) {
    return null;
  }

  const { eventType, payload } = eventMessageValue;
  if (eventType !== EventType.CREATE_EVENT) {
    return eventMessageValue;
  }
  const { date: eventDate, name } = payload as CreateEventPayload;

  const eventIsoDate = parseISO(eventDate);

  if (!isWithinSevenDays(eventIsoDate)) {
    logger.info(`Event '${name}' is not within the next seven days. Do nothing.`);

    return eventMessageValue;
  }

  // Check if event exists.
  const event = await prisma.event.findUnique({
    where: {
      name,
    },
    include: {
      weather: true,
    },
  });

  if (!event) {
    logger.warn(`Event '${name}' does not exist.`);

    return eventMessageValue;
  }

  // We default the location to Toronto.
  // This could be the event location or the current machine location, however,
  // we don't have that in our model.
  const measurements = await weatherApiClient.getMeasurements('Toronto', 7);
  // Depending on the subscription model, we might not have the forecast for the
  // exact date of the event, therefore we grab the closest one.
  const dates = measurements.map((m) => m.date);
  const closestIndex = closestIndexTo(eventIsoDate, dates);

  const eventWeatherForecast = measurements[closestIndex];

  logger.info(`Got forecast '${stringify(eventWeatherForecast)}' for event '${name}'.`);

  const { chanceOfRain, avgTemp } = eventWeatherForecast;
  const { id: eventId, weather: eventWeather } = event;

  const truncTemp = Math.trunc(avgTemp);

  const weatherDataInput: Prisma.WeatherCreateInput = {
    event: {
      connect: {
        id: eventId,
      },
    },
    chanceOfRain,
    temperatureInDegreesCelsius: truncTemp,
  };

  // If there's already a weather, we must delete it first.
  if (eventWeather) {
    const { id: weatherId } = eventWeather;

    await prisma.$transaction([
      prisma.weather.delete({
        where: {
          id: weatherId,
        },
      }),
      prisma.weather.create({
        data: weatherDataInput,
      }),
    ]);
    // Else, we just create the weather.
  } else {
    await prisma.weather.create({
      data: weatherDataInput,
    });
  }

  logger.info(`Updated event '${name}'.`);

  const updatePayload: UpdateEventPayload = {
    weather: {
      chanceOfRain,
      temperatureInDegreesCelsius: truncTemp,
    },
    eventName: name,
  };

  const eventMessage: EventMessageValue = {
    eventType: EventType.UPDATE_EVENT,
    payload: updatePayload,
  };

  await kafkaProducer.send({
    topic: environment.kafkaTopic,
    messages: [{ value: JSON.stringify(eventMessage) }],
  });

  logger.info(`Sent updated event '${name}' to Kafka.`);

  return eventMessageValue;
};
