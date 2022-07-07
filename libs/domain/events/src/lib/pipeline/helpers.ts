import { logger } from '@sherpa-backend/logger';
import { CreateEventPayload, UpdateEventPayload } from '@sherpa-backend/domain/events';
import { prisma } from '@sherpa-backend/prisma';
import { parseISO } from 'date-fns';
import { Prisma } from '@prisma/client';

export const handleCreateEvent = async (payload: CreateEventPayload) => {
  const { name, date, isOutside, organizer, attendees } = payload;

  // Check if event already exists.
  const event = await prisma.event.findUnique({
    where: {
      name,
    },
  });

  if (event) {
    logger.warn(`Received repeated event '${name}'.`);

    return;
  }

  const { name: organizerName } = organizer;
  const isoDate = parseISO(date);

  await prisma.event.create({
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

  logger.info(`Created event '${name}'.`);
};

export const handleUpdateEvent = async (payload: UpdateEventPayload) => {
  const { weather, eventName } = payload;
  const { chanceOfRain, temperatureInDegreesCelsius } = weather;

  // Check if event exists.
  const event = await prisma.event.findUnique({
    where: {
      name: eventName,
    },
    include: {
      weather: true,
    },
  });

  if (!event) {
    logger.error(`Event '${eventName}' does not exist!`);

    return;
  }

  const { id: eventId } = event;
  const { weather: eventWeather } = event;

  const weatherDataInput: Prisma.WeatherCreateInput = {
    event: {
      connect: {
        id: eventId,
      },
    },
    chanceOfRain,
    temperatureInDegreesCelsius,
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

  logger.info(`Update event '${eventName}'.`);
};
