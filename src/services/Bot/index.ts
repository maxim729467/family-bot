import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { sendMessage } from '../../methods/api';

class Bot {
  private static instance: Bot;
  private bot: Telegraf<Context<Update>>;

  private constructor(telegramToken: string) {
    this.bot = new Telegraf(telegramToken);
    this.init();
  }

  public static getInstance(telegramToken: string): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot(telegramToken);
    }

    return Bot.instance;
  }

  init() {
    console.log('[TG_BOT] Rayan launched');
    this.setEventHandlers();
    this.bot.launch();
  }

  private setEventHandlers() {
    this.bot.help((ctx) => ctx.reply('Этот бот использует OpenAI. Чтобы начать общение, напишите сообщение в чате. Приятного времяпрепровождения с незаурядным собеседником 😉'));

    this.bot.on('message', async (ctx) => {
      const { message } = ctx.update;
      if ('text' in message) {
        const msgContent = message.text ? message.text.trim() : '';
        if (msgContent.length && !msgContent.includes('/help')) {
          const replyMsg = await sendMessage(msgContent, ctx.update.message.from);
          ctx.reply(replyMsg);
        }
      }
    });
  }
}

export default Bot;
