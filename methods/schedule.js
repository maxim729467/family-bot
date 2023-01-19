const cron = require('node-cron');
const { 
     sendForecast,
     generateForecastErrorMsg,
     generateFarewell,
     generateGreeting,
     } = require('../methods/helpers');

exports.scheduleForecastSend = (bot) => {
    console.log('scheduling forecast');
    cron.schedule('0 9 * * *', async () => {
    console.log('running scheduled task...');

    try {
        const chatId = process.env.CHAT_ID;
        bot.telegram.sendMessage(process.env.CHAT_ID, generateGreeting());
        await sendForecast('Odessa', bot, chatId);
        await sendForecast('Chisinau', bot, chatId);
        await sendForecast('Mersin', bot, chatId);
        
    } catch (error) {
        console.log(error);
        bot.telegram.sendMessage(process.env.CHAT_ID, generateForecastErrorMsg());
    }
      }); 
}

exports.scheduleFarewell = (bot) => {
    console.log('scheduling farewell');
    cron.schedule('0 22 * * *', () => {
    console.log('running scheduled task...');
    bot.telegram.sendMessage(process.env.CHAT_ID, generateFarewell());
      }); 
}