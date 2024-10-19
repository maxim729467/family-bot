const cron = require('node-cron');

const { getForecast } = require('../methods/helpers');
const { sendQuestion } = require('../methods/api');

const { CHAT_ID } = process.env;
const CITIES = ['Odesa', 'Chisinau'];

exports.scheduleGreetingSend = (bot) => {
  console.log('[CRON] ::: scheduling greeting/affirmation/forecast');
  cron.schedule('0 8 * * *', async () => {
    console.log(
      '[CRON] greeting/affirmation/forecast ::: running scheduled task'
    );

    try {
      const greeting = await sendQuestion(
        'Пожелай всем отличного дня и настроения оригинальным образом.',
        { ignoreError: false }
      );

      bot.telegram.sendMessage(CHAT_ID, greeting);
    } catch (error) {
      console.log('[SCHEDULE] ::: GREETING ERROR ==> ', error);
    }

    try {
      let affirmation = await sendQuestion(
        'Напиши одну аффирмацию в виде слогана на день',
        { ignoreError: false }
      );

      affirmation = `
      ❗️❗️❗️
      ${affirmation}
      `;

      bot.telegram.sendMessage(CHAT_ID, affirmation);
    } catch (error) {
      console.log('[SCHEDULE] ::: AFFIRMATION ERROR ==> ', error);
    }

    CITIES.forEach(async (city) => {
      try {
        const forecast = await getForecast(city, bot, CHAT_ID);
        bot.telegram.sendMessage(CHAT_ID, forecast);
      } catch (error) {
        console.log(`[FORECAST] ::: CITY ==> ${city}, ERROR ==>`, error);
      }
    });
  });
};

exports.scheduleFarewellSend = (bot) => {
  console.log('[CRON] ::: scheduling farewell');
  cron.schedule('0 22 * * *', async () => {
    console.log('[CRON] farewell ::: running scheduled task');

    try {
      const farewell = await sendQuestion(
        'Пожелай всем спокойной ночи и прекрасных снов оригинальным образом.',
        { ignoreError: false }
      );

      bot.telegram.sendMessage(CHAT_ID, farewell);
    } catch (error) {
      console.log('[SCHEDULE] ::: FAREWELL ERROR ==> ', error);
    }
  });
};
