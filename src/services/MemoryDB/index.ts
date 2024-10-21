import { RedisClientType, createClient } from 'redis';
import moment from 'moment';

import { User, Message } from '../../models';
import { Role } from '../../models/message';

interface WithCreatedAt {
  createdAt: number;
}

class MemoryDB {
  private static instance: MemoryDB;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient();
    this.client.connect();

    this.client.on('connect', () => {
      console.log('[REDIS] Connected');
    });

    this.client.on('error', (err) => {
      console.log('[REDIS] Connection Error --> ', err);
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MemoryDB();
    }

    return this.instance;
  }

  addMessage = async (message: Message) => {
    const messagesKey = `messages-${message.userId}`;
    const messages = await this.getDataArray<Message>(messagesKey);
    messages.push(message);
    await this.setDataArray(messagesKey, messages);
  };

  private getDataArray = async <T extends WithCreatedAt>(key: string): Promise<T[]> => {
    try {
      const cachedData = await this.client.get(key);
      if (!cachedData) return [];
      const data: T[] = JSON.parse(cachedData);

      return data.sort((a, b) => a.createdAt - b.createdAt);
    } catch (_) {
      return [];
    }
  };

  private setDataArray = async <T>(key: string, data: T[]): Promise<void> => {
    try {
      await this.client.set(key, JSON.stringify(data));
    } catch (_) {
      //
    }
  };

  getMessagesByUserId = async (userId: string): Promise<Message[]> => {
    const defaultSystemMessage = {
      role: Role.SYSTEM,
      content: 'You are a helpful assistant.',
      userId,
      createdAt: moment().valueOf(),
    };

    const messagesKey = `messages-${userId}`;

    const users = await this.getDataArray<User>('users');
    const user = users.find((u) => u.id === userId);

    if (!user) {
      users.push({ id: userId, createdAt: moment().valueOf() });
      this.setDataArray('users', users);

      const messages = [defaultSystemMessage];
      await this.setDataArray(messagesKey, messages);
      return messages;
    }

    const messages = await this.getDataArray<Message>(messagesKey);
    const count = messages.length;

    if (count >= 10) {
      const newestMessages = messages.slice(2);
      await this.setDataArray(messagesKey, newestMessages);
      return newestMessages;
    }

    return messages;
  };

  cleanUpOldData = async () => {
    const expTime = moment().subtract(3, 'days').valueOf();
    const users = await this.getDataArray<User>('users');

    users.forEach(async (user) => {
      const messagesKey = `messages-${user.id}`;
      const messages = await this.getDataArray<Message>(messagesKey);
      const filteredMessages = messages.filter((msg) => msg.createdAt >= expTime);
      await this.setDataArray(messagesKey, filteredMessages);
    });
  };
}

export default MemoryDB;
