import dotenv from 'dotenv';

dotenv.config();

const { OPENAI_API_KEY = '', RAPID_API_KEY = '', TELEGRAM_TOKEN = '', BOT_ID = '', CHAT_ID = 0 } = process.env;

export default {
  OPENAI_API_KEY,
  RAPID_API_KEY,
  TELEGRAM_TOKEN,
  BOT_ID,
  CHAT_ID,
};
