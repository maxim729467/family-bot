import config from './src/constants';
import Bot from './src/services/Bot';
import { scheduleDeleteOldData } from './src/methods/schedule';

Bot.getInstance(config.TELEGRAM_TOKEN);
scheduleDeleteOldData();
