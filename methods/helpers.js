const { getForecastData } = require('./api');

exports.getForecast = async (city) => {
  const data = await getForecastData(city);
  const markup = generateForecastMarkup(data, city);
  return markup;
};

function generateForecastMarkup(data, city) {
  let cityName;

  switch (city) {
    case 'Chisinau':
      cityName = 'Кишиневе';
      break;

    case 'Odesa':
      cityName = 'Одессе';
      break;

    default:
      break;
  }

  if (!data.forecast || !data.forecast.forecastday.length) {
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
}

exports.cutQuestion = (str) => str.split(' ').slice(1).join(' ').trim();
