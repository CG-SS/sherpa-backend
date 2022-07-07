import {
  WeatherApiContructorParams,
  WeatherApiMeasurements,
  WeatherResponseForecastDay,
} from './types';
import { logger } from '@sherpa-backend/logger';
import stringify from 'json-stringify-safe';
import { environment } from '../../environments';
import axios from 'axios';
import { fromUnixTime } from 'date-fns';

class WeatherApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor({ apiKey, baseUrl }: WeatherApiContructorParams) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getMeasurements(city: string, days: number): Promise<WeatherApiMeasurements[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('q', city);
    url.searchParams.append('days', days.toString());
    url.searchParams.append('aqi', 'no');
    url.searchParams.append('alerts', 'no');

    logger.info(`Calling with URL '${url.href}'.`);

    const { data, status } = await axios.get(url.href);

    if (status !== 200) {
      throw new Error(`Response status not '200', got '${status}'.`);
    }

    const forecastDayAr: WeatherResponseForecastDay[] = data?.forecast?.forecastday;
    if (!forecastDayAr) {
      throw new Error("Response missing field 'data.forecast.forecastday'.");
    }

    logger.info(`Got response '${stringify(data)}'`);

    return forecastDayAr.map((o) => {
      const avgTemp = o.day.avgtemp_c;
      const date = fromUnixTime(o.date_epoch);
      // We grab the highest chance of rain.
      const chanceOfRain = o.hour.reduce(
        (cur, prev) => (cur < prev.chance_of_rain ? prev.chance_of_rain : cur),
        0
      );

      return {
        avgTemp,
        date,
        chanceOfRain,
      };
    });
  }
}

export const weatherApiClient = new WeatherApiClient({
  apiKey: environment.weatherApiKey,
  baseUrl: environment.weatherApiBase,
});
