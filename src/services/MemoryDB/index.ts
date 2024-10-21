import redis, { RedisClientType } from 'redis';
import moment from 'moment';

import { User, Message } from '../../models';

class MemoryDB {
  private static instance: MemoryDB;
  private client: RedisClientType;

  private constructor() {
    this.client = redis.createClient();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MemoryDB();
    }

    return this.instance;
  }

  addMessage = async (message: Message) => {
    try {
      await this.client.set('message', '123'); // SET UP
      // await db.Message.create({
      //   ...message,
      //   createdAt: new Date(),
      // });
    } catch (error) {
      console.log(error);
    }
  };

  getMessagesByUserId = async (userId: number, userName: string) => {
    const defaultSystemMessage = {
      role: 'system',
      content: 'You are a helpful assistant.',
    };
    try {
      const user = await this.client.get(''); // SET UP

      if (!user) {
        await this.client.set('user', '123'); // SET UP

        // await db.User.create({
        //   telegramId: userId,
        //   userName,
        // });

        const message = await this.client.set('message', '123'); // SET UP

        // const message = await db.Message.create({
        //   ...defaultSystemMessage,
        //   userId,
        //   createdAt: new Date(),
        // });

        return [{ role: message.role, content: message.content }];
      }

      const count = await this.client.get('messages'); // SET UP

      //   const count = await db.Message.count({ where: { userId: userId } });

      const messages = await this.client.get('messages'); // SET UP

      //   const messages = await db.Message.findAll({
      //     where: { userId },
      //     order: [['id', 'ASC']],
      //     limit: 10,
      //     offset: count > 10 ? count - 10 : 0,
      //     attributes: ['role', 'content'],
      //   });

      return messages;
    } catch (error) {
      console.log(error);
      return [defaultSystemMessage];
    }
  };

  cleanUpOldData = async () => {
    const threeDaysAgo = moment().subtract(3, 'days').valueOf();

    try {
      console.log(new Date());
      await this.client.del('message'); // SET UP

      // await db.Message.destroy({
      //   where: {
      //     createdAt: {
      //       [Op.lt]: threeDaysAgo,
      //     },
      //   },
      // });
    } catch (error) {
      console.log('[CRON] DELETING OLD MESSAGES ::: ERROR ---> ', error);
    }
  };
}

export default MemoryDB;
