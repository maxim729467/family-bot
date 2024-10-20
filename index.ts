import dotenv from 'dotenv';
dotenv.config();

import Bot from './src/Bot';

const bot = Bot.instance;
bot.init();
