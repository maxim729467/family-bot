const cron = require('node-cron');

const {
  sendForecast,
  generateFarewell,
  generateGreeting,
} = require('../methods/helpers');

const { CHAT_ID } = process.env;

exports.scheduleForecastGreetingSend = (bot) => {
  console.log('[CRON] ::: scheduling greeting/forecast');
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] greeting/forecast ::: running scheduled task');

    try {
      bot.telegram.sendMessage(CHAT_ID, generateGreeting());
      await sendForecast('Odessa', bot, CHAT_ID);
      await sendForecast('Chisinau', bot, CHAT_ID);
    } catch (error) {
      console.log('[FORECAST] ::: ERROR \n', error);
    }
  });
};

exports.scheduleFarewell = (bot) => {
  console.log('[CRON] ::: scheduling farewell');
  cron.schedule('0 22 * * *', () => {
    console.log('[CRON] farewell ::: running scheduled task');
    bot.telegram.sendMessage(CHAT_ID, generateFarewell());
  });
};
