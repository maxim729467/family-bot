import cron from 'node-cron';

import { getForecastData, ForecastData } from './api';
import config from '../constants';

export const schedule = (time: string, callback: () => {}) => {
  cron.schedule(time, callback);
};

export const getForecast = async (city: string) => {
  const data = await getForecastData(city);
  const markup = generateForecastMarkup(data, city);
  return markup;
};

const generateForecastMarkup = (data: ForecastData, city: string) => {
  let cityName;

  switch (city) {
    case config.LOCATIONS.CHISINAU:
      cityName = 'Кишиневе';
      break;

    case config.LOCATIONS.ODESSA:
      cityName = 'Одессе';
      break;

    default:
      break;
  }

  if (!data?.forecast?.forecastday?.length) {
    throw new Error('Unknown weather info');
  }

  const {
    day: {
      mintemp_c,
      maxtemp_c,
      condition: { text },
      maxwind_kph,
    },
    astro: { sunset },
  } = data.forecast.forecastday[0];

  return `
Прогноз погоды в ${cityName}: 
${text}

🌡 Температура воздуха: ${Math.round(mintemp_c)}° - ${Math.round(maxtemp_c)}°
💨 Максимальная скорость ветра: ${Math.round(maxwind_kph)} км/ч
🔆 Время заката: ${sunset.slice(0, sunset.length - 3)}
`;
};
