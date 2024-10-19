const { Telegraf } = require('telegraf');
require('dotenv').config();

const {
  scheduleGreetingSend,
  scheduleFarewellSend,
} = require('./methods/schedule');

const { handleMessage } = require('./methods/helpers');
const { TELEGRAM_TOKEN } = process.env;

const bot = new Telegraf(TELEGRAM_TOKEN);

scheduleGreetingSend(bot);
scheduleFarewellSend(bot);

// bot.use((ctx, next) => {
// console.log(ctx.update.message.text);
// next();
// })

// bot.help(ctx => ctx.reply('Help command'));
// bot.settings(ctx => ctx.reply('Settings command'));

// bot.on('message', ctx => {
//     ctx.telegram.copyMessage(ctx.chat.id, ctx.message.from.id, ctx.message.message_id);
// })

bot.on('message', (ctx) => {
  handleMessage(ctx);
});

// bot.start(ctx => ctx.replyWithMarkdownV2('Hey, this is inline bot'))
// bot.on('inline_query', async ctx => {})

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
