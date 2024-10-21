import axios from 'axios';
import { User } from 'telegraf/typings/core/types/typegram';

import MemoryDB from '../services/MemoryDB';
import config from '../constants';

const memoryDB = MemoryDB.getInstance();

interface Choice {
  message: {
    content: string;
  };
}

interface Completion {
  choices: Choice[];
}

export const sendMessage = async (message: string, userInfo: User) => {
  const { id: userId, username: userName } = userInfo;
  console.log(userInfo);

  try {
    const baseUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = await memoryDB.getMessagesByUserId(userId, userName);
    const newQuestion = { role: 'user', content: message };
    messages.push(newQuestion);

    const payload = {
      model: 'gpt-3.5-turbo',
      max_tokens: 2048,
      messages,
    };

    const conf = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
      },
    };

    const defaultReply = 'Мне нечего ответить на это.';

    const response = await axios.post<Completion>(baseUrl, payload, conf);
    if (!response?.data?.choices?.length) return defaultReply;

    const reply = response.data.choices[0].message.content;
    await memoryDB.addMessage({ ...newQuestion, userId });
    await memoryDB.addMessage({ role: 'assistant', content: reply, userId });
    return reply;
  } catch (error) {
    console.error('Error from OpenAI API ---> ', error);
    return 'Failed to send message to OpenAI API.';
  }
};
