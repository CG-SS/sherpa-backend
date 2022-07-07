# Weather service

This service utilizes [Weather API](https://www.weatherapi.com/) to hydrate the messages with the weather forecast if the event is happening within seven days. Since we're utilizing a microservice architecture, it does so on an event driven fashion.

In order to run it, it's necessary to have an account on [Weather API](https://www.weatherapi.com/). For the sake of simplicity, the API key is hardcoded (silly, I know).

If running without Docker and Kubernetes, you will need to set up the env vars on a `.env` file. The values for the `weather` service are:

```
# Env vars
ARG NODE_ENV
ARG DATABASE_URL
ARG PORT

# Weather API
ARG WEATHER_API_KEY
ARG WEATHER_API_BASE

# Kafka
ARG KAFKA_TOPIC
ARG KAFKA_GROUP_ID
ARG KAFKA_CLIENT_ID
ARG KAFKA_BROKERS
```
