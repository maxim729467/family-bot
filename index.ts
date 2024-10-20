require('dotenv').config();
import Bot from './src/Bot';

const bot = Bot.instance;
bot.init();
