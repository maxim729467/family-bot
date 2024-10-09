const weatherStates = require('../templates/weatherStates');
const greetings = require('../templates/greetings');
const farewells = require('../templates/firewells');
const { getForecastData } = require('./api');

const getRandomMessage = (messages) => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

exports.getRandomMessage = getRandomMessage;

exports.sendForecast = async (city, bot, chatId) => {
  const data = await getForecastData(city);
  const info = getForecastInfo(data);
  const markup = generateForecastMarkup(info, city);
  bot.telegram.sendMessage(chatId, markup);
};

function getForecastInfo(data) {
  const stateIdx = data.weather.state;
  const weatherData = {
    state: Number.isInteger(stateIdx) ? weatherStates[stateIdx] : null,
    temperature: `${data.temperature.min}° ― ${data.temperature.max}°`,
    wind: `${data.wind.min} ― ${data.wind.max} км/ч`,
    sunset: data.astronomy.sunset.slice(11, 19),
  };
  return weatherData;
}

function generateForecastMarkup(forecast, city) {
  let cityName;

  switch (city) {
    case 'Chisinau':
      cityName = 'Кишиневе';
      break;

    default:
      cityName = 'Одессе';
      break;
  }

  return `
Прогноз погоды в ${cityName}: 
${forecast.state ? forecast.state : ''}

🌡 Температура воздуха: ${forecast.temperature}
💨 Скорость ветра: ${forecast.wind}
🔆 Время заката: ${forecast.sunset}
`;
}

exports.generateGreeting = () => {
  return `
${getRandomMessage(greetings)}
`;
};

exports.generateFarewell = () => {
  return `
${getRandomMessage(farewells)}
`;
};

exports.cutQuestion = (str) => str.split(' ').slice(1).join(' ').trim();
