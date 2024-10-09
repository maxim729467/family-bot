const cron = require('node-cron');

const {
  sendForecast,
  generateFarewell,
  generateGreeting,
} = require('../methods/helpers');

const { sendQuestion } = require('../methods/api');

const { CHAT_ID } = process.env;

exports.scheduleForecastGreetingSend = (bot) => {
  console.log('[CRON] ::: scheduling greeting/forecast');
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] greeting/forecast ::: running scheduled task');

    try {
      // const greeting = generateGreeting();
      const greeting = await sendQuestion(
        'Пожелай всем отличного дня и настроения оригинальным образом.'
      );

      bot.telegram.sendMessage(CHAT_ID, greeting);
      await sendForecast('Odessa', bot, CHAT_ID);
      await sendForecast('Chisinau', bot, CHAT_ID);
    } catch (error) {
      console.log('[FORECAST] ::: ERROR \n', error);
    }
  });
};

exports.scheduleFarewell = (bot) => {
  console.log('[CRON] ::: scheduling farewell');
  cron.schedule('0 22 * * *', async () => {
    console.log('[CRON] farewell ::: running scheduled task');
    // const farewell = generateFarewell();
    const farewell = await sendQuestion(
      'Пожелай всем спокойной ночи и прекрасных снов оригинальным образом.'
    );
    bot.telegram.sendMessage(CHAT_ID, farewell);
  });
};
