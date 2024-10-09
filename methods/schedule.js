const cron = require('node-cron');
const {
  sendForecast,
  generateForecastErrorMsg,
  generateFarewell,
  generateGreeting,
} = require('../methods/helpers');

exports.scheduleForecastGreetingSend = (bot) => {
  console.log('[CRON] ::: scheduling greeting/forecast');
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] greeting/forecast ::: running scheduled task');

    try {
      const chatId = process.env.CHAT_ID;
      bot.telegram.sendMessage(process.env.CHAT_ID, generateGreeting());
      await sendForecast('Odessa', bot, chatId);
      await sendForecast('Chisinau', bot, chatId);
      await sendForecast('Mersin', bot, chatId);
    } catch (error) {
      console.log('[FORECAST] ::: error ==> ', error);
      // bot.telegram.sendMessage(process.env.CHAT_ID, generateForecastErrorMsg());
    }
  });
};

exports.scheduleFarewell = (bot) => {
  console.log('[CRON] scheduling farewell');
  cron.schedule('0 22 * * *', () => {
    console.log('[CRON] farewell ::: running scheduled task');
    bot.telegram.sendMessage(process.env.CHAT_ID, generateFarewell());
  });
};
