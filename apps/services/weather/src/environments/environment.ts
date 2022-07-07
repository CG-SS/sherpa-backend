export const environment = {
  weatherApiKey: process.env.WEATHER_API_KEY ?? '',
  weatherApiBase:
    process.env.WEATHER_API_BASE ?? 'https://api.weatherapi.com/v1/forecast.json',
  kafkaGroupId: process.env.KAFKA_GROUP_ID ?? 'weather-group-id',
  kafkaTopic: process.env.KAFKA_TOPIC ?? 'default-topic',
};
