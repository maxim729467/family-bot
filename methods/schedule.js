const cron = require('node-cron');

const { getForecast } = require('../methods/helpers');
const { sendQuestion } = require('../methods/api');

const { CHAT_ID } = process.env;
const CITIES = ['Odesa', 'Chisinau'];

exports.scheduleForecastGreetingSend = (bot) => {
  console.log('[CRON] ::: scheduling greeting/forecast');
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] greeting/forecast ::: running scheduled task');

    try {
      const greeting = await sendQuestion(
        'Пожелай всем отличного дня и настроения оригинальным образом.'
      );

      bot.telegram.sendMessage(CHAT_ID, greeting);

      CITIES.forEach(async (city) => {
        try {
          const forecast = await getForecast(city, bot, CHAT_ID);
          bot.telegram.sendMessage(CHAT_ID, forecast);
        } catch (error) {
          console.log(`[FORECAST] ::: CITY ==> ${city}, ERROR ==>`, error);
        }
      });
    } catch (error) {
      console.log('[SCHEDULE] ::: TASK ERROR ==> ', error);
    }
  });
};

exports.scheduleFarewellSend = (bot) => {
  console.log('[CRON] ::: scheduling farewell');
  cron.schedule('0 22 * * *', async () => {
    console.log('[CRON] farewell ::: running scheduled task');

    const farewell = await sendQuestion(
      'Пожелай всем спокойной ночи и прекрасных снов оригинальным образом.'
    );

    bot.telegram.sendMessage(CHAT_ID, farewell);
  });
};
