import { Telegraf, Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

import { sendQuestion } from '../methods/api';
import { schedule, getForecast } from '../methods/helpers';
import config from '../constants';

class Bot {
  static #instance: Bot;
  private bot: Telegraf<Context<Update>>;
  private initialized = false;

  private constructor() {
    this.bot = new Telegraf(config.TELEGRAM_TOKEN);
  }

  public static get instance(): Bot {
    if (!Bot.#instance) {
      Bot.#instance = new Bot();
    }

    return Bot.#instance;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    console.log('[TG_BOT] launched');
    this.setEventHandlers();
    schedule('0 8 * * *', this.scheduleGreetingSend);
    schedule('0 22 * * *', this.scheduleFarewellSend);
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

  private scheduleGreetingSend = async () => {
    console.log('[CRON] greeting/affirmation/forecast ::: running scheduled task');

    try {
      const greeting = await sendQuestion('Пожелай всем отличного дня и настроения оригинальным образом.', { ignoreError: false });
      this.bot.telegram.sendMessage(config.CHAT_ID, greeting);
    } catch (error) {
      console.log('[SCHEDULE] ::: GREETING ERROR ==> ', error);
    }

    try {
      let affirmation = await sendQuestion('Напиши одну аффирмацию в виде слогана на день', { ignoreError: false });

      affirmation = `
      ❗️❗️❗️
      ${affirmation}
      `;

      this.bot.telegram.sendMessage(config.CHAT_ID, affirmation);
    } catch (error) {
      console.log('[SCHEDULE] ::: AFFIRMATION ERROR ==> ', error);
    }

    Object.keys(config.LOCATIONS).forEach(async (city) => {
      try {
        const forecast = await getForecast(city);
        this.bot.telegram.sendMessage(config.CHAT_ID, forecast);
      } catch (error) {
        console.log(`[FORECAST] ::: CITY ==> ${city}, ERROR ==>`, error);
      }
    });
  };

  scheduleFarewellSend = async () => {
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
