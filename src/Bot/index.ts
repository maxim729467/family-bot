import { Telegraf, Context, NarrowedContext } from 'telegraf';
import { schedule } from 'node-cron';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

import { sendQuestion } from '../methods/api';
import { getForecast } from '../methods/helpers';
import config from '../constants';

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
    console.log('[TG_BOT] launched');
    this.setEventHandlers();
    schedule('0 8 * * *', this.sendGreeting);
    schedule('0 22 * * *', this.sendFarewell);
    this.bot.launch();
  }

  private setEventHandlers() {
    // this.bot.use((ctx, next) => {
    // console.log(ctx.update.message.text);
    // next();
    // })

    // this.bot.help(ctx => ctx.reply('Help command'));

    // this.bot.settings(ctx => ctx.reply('Settings command'));

    // this.bot.on('message', ctx => {
    //     ctx.telegram.copyMessage(ctx.chat.id, ctx.message.from.id, ctx.message.message_id);
    // })

    // this.bot.start(ctx => ctx.replyWithMarkdownV2('This is inline bot'))

    // this.bot.on('inline_query', async ctx => {})

    this.bot.on('message', async (ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) => {
      const { message } = ctx.update;

      if ('text' in message) {
        const lowercaseMsg = message.text.toLowerCase() || '';

        const isReplyToBot = message?.reply_to_message?.from?.is_bot;
        const msg = lowercaseMsg.split(' ').slice(1).join(' ').trim();
        const isBotMentioned = msg.length && lowercaseMsg.startsWith(config.BOT_ID);

        if (isReplyToBot || isBotMentioned) {
          const question = isBotMentioned ? msg : lowercaseMsg;
          const answer = await sendQuestion(question);
          ctx.reply(answer);
        }
      }
    });
  }

  private sendGreeting = async () => {
    console.log('[CRON] greeting/affirmation/forecast ::: running scheduled task');

    try {
      const greeting = await sendQuestion('Пожелай всем отличного дня и настроения оригинальным образом.', { ignoreError: false });
      this.bot.telegram.sendMessage(config.CHAT_ID, greeting);
    } catch (error) {
      console.log('[SCHEDULE] ::: GREETING ERROR ==> ', error);
    }

    try {
      let affirmation = await sendQuestion('Напиши одну аффирмацию в виде слогана на день', { ignoreError: false });
      affirmation = `\n❗️❗️❗️\n${affirmation}`;
      this.bot.telegram.sendMessage(config.CHAT_ID, affirmation);
    } catch (error) {
      console.log('[SCHEDULE] ::: AFFIRMATION ERROR ==> ', error);
    }

    Object.values(config.LOCATIONS).forEach(async (city) => {
      try {
        const forecast = await getForecast(city);
        this.bot.telegram.sendMessage(config.CHAT_ID, forecast);
      } catch (error) {
        console.log(`[FORECAST] ::: CITY ==> ${city}, ERROR ==>`, error);
      }
    });
  };

  sendFarewell = async () => {
    console.log('[CRON] farewell ::: running scheduled task');

    try {
      const farewell = await sendQuestion('Пожелай всем спокойной ночи и прекрасных снов оригинальным образом.', { ignoreError: false });

      this.bot.telegram.sendMessage(config.CHAT_ID, farewell);
    } catch (error) {
      console.log('[SCHEDULE] ::: FAREWELL ERROR ==> ', error);
    }
  };
}

export default Bot;
