export type WeatherApiContructorParams = {
  apiKey: string;
  baseUrl: string;
};

export type WeatherApiMeasurements = {
  date: Date;
  chanceOfRain: number;
  avgTemp: number;
};

export type WeatherResponseForecastDay = {
  date_epoch: number;
  day: {
    avgtemp_c: number;
  };
  hour: {
    chance_of_rain: number;
  }[];
};
