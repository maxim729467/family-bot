const cron = require('node-cron');

const { getForecast } = require('../methods/helpers');
const { sendQuestion } = require('../methods/api');

const { CHAT_ID } = process.env;
const CITIES = ['Odesa', 'Chisinau'];

exports.scheduleGreetingSend = (bot) => {
  console.log('[CRON] ::: scheduling greeting');
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] greeting ::: running scheduled task');

    try {
      const greeting = await sendQuestion(
        'Пожелай всем отличного дня и настроения оригинальным образом.',
        { ignoreError: false }
      );

      bot.telegram.sendMessage(CHAT_ID, greeting);
    } catch (error) {
      console.log('[SCHEDULE] ::: GREETING ERROR ==> ', error);
    }
  });
};

exports.scheduleForecastSend = (bot) => {
  console.log('[CRON] ::: scheduling forecast');
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] forecast ::: running scheduled task');

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

exports.scheduleAffirmationSend = (bot) => {
  console.log('[CRON] ::: scheduling affirmation');
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] greeting/forecast ::: running scheduled task');

    try {
      let affirmation = await sendQuestion(
        'Напиши одну аффирмацию в виде слогана на день',
        { ignoreError: false }
      );

      affirmation = `❗️ ${affirmation}`;

      bot.telegram.sendMessage(CHAT_ID, affirmation);
    } catch (error) {
      console.log('[SCHEDULE] ::: AFFIRMATION ERROR ==> ', error);
    }
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
