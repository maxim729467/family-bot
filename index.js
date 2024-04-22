require("dotenv").config();
require("./db/sync");

const express = require("express");
const { Telegraf } = require("telegraf");
const { sendQuestion } = require("./methods/api");
const { scheduleDeleteOldMessages } = require("./methods/schedule");
const { TELEGRAM_TOKEN } = process.env;

const app = express();
const PORT = process.env.PORT || 8080;
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.help((ctx) => ctx.reply("Этот бот использует OpenAI. Чтобы начать общение, напишите сообщение в чате. Приятного времяпрепровождения с незаурядным собеседником 😉"));

bot.on("message", async (ctx) => {
  const { message } = ctx.update;
  const msgContent = message.text ? message.text.trim() : "";
  if (msgContent.length && !msgContent.includes("/help")) {
    await sendQuestion(msgContent, ctx);
  }
});

app.listen(PORT, () => {
  console.log("Launching Rayan...");
  bot.launch();
});

scheduleDeleteOldMessages();
