const { Telegraf } = require('telegraf');
require('dotenv').config();
const { scheduleForecastSend, scheduleFarewell } = require('./methods/schedule');
const { sendQuestion } = require('./methods/api')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// bot.use((ctx, next) => {
    // console.log(ctx.update.message.text);
    // next();
// })

bot.start(ctx => {
    if (global.isInitiated) {
        ctx.reply('Tasks have been already scheduled.');
        return;
    }

    ctx.reply('Scheduling tasks...');
    scheduleForecastSend(bot);
    scheduleFarewell(bot);
    global.isInitiated = true;
});

// bot.help(ctx => ctx.reply('Help command'));
// bot.settings(ctx => ctx.reply('Settings command'));

// bot.on('message', ctx => {
//     ctx.telegram.copyMessage(ctx.chat.id, ctx.message.from.id, ctx.message.message_id);
// })

bot.on('message', async ctx => {
    let msgContent = ctx.update.message.text || '';
    msgContent = msgContent.toLowerCase();
    const isReplyToBot = ctx.update.message.reply_to_message && ctx.update.message.reply_to_message.from.is_bot;
    const isBotMentioned = msgContent.split(' ').slice(1).join(' ').trim(' ').length && msgContent.startsWith(process.env.BOT_ID) && !msgContent.includes('/start');

    if (isReplyToBot || isBotMentioned) {
        const question = msgContent.split(' ').slice(1).join(' ').trim();
        await sendQuestion(question, ctx);
    }
})

// bot.start(ctx => ctx.replyWithMarkdownV2('Hey, this is inline bot'))
// bot.on('inline_query', async ctx => {})

bot.launch();
