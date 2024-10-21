import axios from 'axios';
import moment from 'moment';
import { User } from 'telegraf/typings/core/types/typegram';

import MemoryDB from '../services/MemoryDB';
import config from '../constants';
import { Role } from '../models/message';

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
  const { id } = userInfo;
  const userId = id.toString();

  try {
    const baseUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = await memoryDB.getMessagesByUserId(userId);
    const newQuestion = { role: Role.USER, content: message, createdAt: moment().valueOf(), userId };
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
    const assistantReplyMsg = { role: Role.ASSISTANT, content: reply, userId, createdAt: moment().valueOf() };
    await memoryDB.addMessage(newQuestion);
    await memoryDB.addMessage(assistantReplyMsg);
    return reply;
  } catch (error) {
    console.error('Error from OpenAI API ---> ', error);
    return 'Failed to send request to OpenAI API.';
  }
};
