import axios from 'axios';

import config from '../constants';

interface Hour {
  time: string;
  temp_c: number;
  is_day: boolean;
  condition: {
    text: string;
  };
  wind_kph: string;
  humidity: number;
  feelslike_c: number;
}

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    maxwind_kph: number;
    avghumidity: number;
    condition: {
      text: string;
    };
  };
  astro: { sunset: string };
  hour: Hour[];
}

export interface ForecastData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    wind_kph: number;
    humidity: number;
    condition: { text: string };
    maxwind_kph: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

const weatherApiClient = axios.create({
  baseURL: 'http://api.weatherapi.com/v1',
  params: {
    key: config.WEATHER_API_KEY,
  },
});

export const getForecastData = async (city: string) => {
  try {
    const { data } = await weatherApiClient.get<ForecastData>('/forecast.json', {
      params: {
        lang: 'ru',
        q: city,
        days: 1,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Forecast error');
  }
};

interface Choice {
  message: {
    content: string;
  };
}

interface Completion {
  choices: Choice[];
}

interface Opts {
  ignoreError?: boolean;
}

export const sendQuestion = async (question = 'string', options: Opts = { ignoreError: true }) => {
  try {
    const baseUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = [{ role: 'user', content: question }];
    let answer = 'Я - рюкзак, я - рюкзак 🎒';

    const payload = {
      model: 'gpt-3.5-turbo',
      max_tokens: 2048,
      messages,
    };

    const conf = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      },
    };

    const response = await axios.post<Completion>(baseUrl, payload, conf);

    if (response?.data?.choices?.length) {
      const [choice] = response.data.choices;
      answer = choice.message.content;
    }

    return answer;
  } catch (error) {
    console.error('[OPENAI] ERROR \n', error);
    if (!options.ignoreError) throw new Error('Open AI временно недоступен.');
    return 'Open AI временно недоступен.';
  }
};
