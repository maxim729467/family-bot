import dotenv from 'dotenv';
dotenv.config();

const { TELEGRAM_TOKEN = '', OPENAI_API_KEY = '', CHAT_ID = 0, BOT_ID = '' } = process.env;

export default {
  TELEGRAM_TOKEN,
  OPENAI_API_KEY,
  CHAT_ID,
  BOT_ID,
};
