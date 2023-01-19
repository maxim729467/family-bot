const weatherStates = require('../templates/weatherStates');
const greetings = require('../templates/greetings');
const farewells = require('../templates/firewells');
const { getForecastData } = require('./api');

const getRandomMessage = (messages) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

exports.getRandomMessage = getRandomMessage;

exports.sendForecast = async (city, bot, chatId) => {
    const data = await getForecastData(city);
    const info = getForecastInfo(data);
    const markup = generateForecastMarkup(info, city);
    bot.telegram.sendMessage(chatId, markup);
}

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
    case 'Mersin':
        cityName = 'Мерсине'
        break;

    case 'Chisinau':
        cityName = 'Кишиневе'
        break;

    default:
        cityName = 'Одессе';
        break;
}

return `
Прогноз погоды в ${cityName} на сегодня: 
${forecast.state ? forecast.state : ''}

🌡 Температура воздуха: ${forecast.temperature}
💨 Скорость ветра: ${forecast.wind}
🔆 Время заката: ${forecast.sunset}
`
}

exports.generateForecastErrorMsg = () => {
return `
С прогнозом погоды неполадочки, но мы это исправим 😅
`
};

exports.generateGreeting = () => {
return`
${getRandomMessage(greetings)}
`
}

exports.generateFarewell = () => {
return`
${getRandomMessage(farewells)}
`
}
