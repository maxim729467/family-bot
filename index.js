const { Telegraf } = require('telegraf');
require('dotenv').config();
const { sendQuestion } = require('./methods/api')
const { cutQuestion } = require('./methods/helpers')
const { TELEGRAM_TOKEN } = process.env;

const bot = new Telegraf(TELEGRAM_TOKEN);

// bot.use((ctx, next) => {
    // console.log(ctx.update.message.text);
    // next();
// })

bot.help(ctx => ctx.reply('Этот бот использует OpenAI. Чтобы начать общение, напишите сообщение в чате. Приятного времяпрепровождения с незаурядным собеседником 😉'));
// bot.settings(ctx => ctx.reply('Settings command'));

// bot.on('message', ctx => {
//     ctx.telegram.copyMessage(ctx.chat.id, ctx.message.from.id, ctx.message.message_id);
// })

bot.on('message', async ctx => {
    const { message } = ctx.update;
    const msgContent = message.text ? message.text.trim() : '';

    if (msgContent.length && !msgContent.includes('/help')) {
        await sendQuestion(msgContent, ctx);
    }
})

// bot.start(ctx => ctx.replyWithMarkdownV2('Hey, this is inline bot'))
// bot.on('inline_query', async ctx => {})

bot.launch();
