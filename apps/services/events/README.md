# Events service

This service defines a query service for the `events` domain.

It provides the following endpoints:

- `GET /events?cursorId={id}`: Returns the first 100 events, based on the current cursor. Accept as an arg the value `cursorId` that defines the current cursor.
- `GET /events/{eventId}`: Returns an event by ID.

If running without Docker and Kubernetes, you will need to set up the env vars on a `.env` file. The values for the `events` service are:

```
# App env vars
ARG NODE_ENV
ARG DATABASE_URL
ARG PORT

# Kafka
ARG KAFKA_TOPIC
ARG KAFKA_GROUP_ID
ARG KAFKA_CLIENT_ID
ARG KAFKA_BROKERS
```
