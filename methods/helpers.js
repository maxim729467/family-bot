const { getForecastData, sendQuestion } = require('./api');

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

const cutQuestion = (str) => str.split(' ').slice(1).join(' ').trim();

exports.handleMessage = async (ctx) => {
  const { message } = ctx.update;
  const msgContent = message.text ? message.text.toLowerCase() : '';

  const isReplyToBot =
    message.reply_to_message && message.reply_to_message.from.is_bot;

  const isBotMentioned =
    cutQuestion(msgContent).length &&
    msgContent.startsWith(process.env.BOT_ID) &&
    !msgContent.includes('/start');

  if (isReplyToBot || isBotMentioned) {
    const question = isBotMentioned ? cutQuestion(msgContent) : msgContent;
    const answer = await sendQuestion(question);
    ctx.reply(answer);
  }
};
