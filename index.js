const { Telegraf } = require('telegraf');
require('dotenv').config();

const {
  scheduleForecastGreetingSend,
  scheduleFarewell,
} = require('./methods/schedule');

const { sendQuestion } = require('./methods/api');
const { cutQuestion } = require('./methods/helpers');
const { TELEGRAM_TOKEN, BOT_ID } = process.env;

const bot = new Telegraf(TELEGRAM_TOKEN);

scheduleForecastGreetingSend(bot);
scheduleFarewell(bot);

// bot.use((ctx, next) => {
// console.log(ctx.update.message.text);
// next();
// })

// bot.help(ctx => ctx.reply('Help command'));
// bot.settings(ctx => ctx.reply('Settings command'));

// bot.on('message', ctx => {
//     ctx.telegram.copyMessage(ctx.chat.id, ctx.message.from.id, ctx.message.message_id);
// })

bot.on('message', async (ctx) => {
  console.log(ctx);
  const { message } = ctx.update;
  const msgContent = message.text ? message.text.toLowerCase() : '';

  const isReplyToBot =
    message.reply_to_message && message.reply_to_message.from.is_bot;

  const isBotMentioned =
    cutQuestion(msgContent).length &&
    msgContent.startsWith(BOT_ID) &&
    !msgContent.includes('/start');

  if (isReplyToBot || isBotMentioned) {
    const question = isBotMentioned ? cutQuestion(msgContent) : msgContent;
    const answer = await sendQuestion(question);
    ctx.reply(answer);
  }
});

// bot.start(ctx => ctx.replyWithMarkdownV2('Hey, this is inline bot'))
// bot.on('inline_query', async ctx => {})

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
