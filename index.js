const express = require("express");
const fs = require("fs");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const { sendQuestion } = require("./methods/api");
const { TELEGRAM_TOKEN } = process.env;
const { STORIES_FILE } = require("./constants");

const app = express();
const PORT = process.env.PORT || 8080;

if (!fs.existsSync(STORIES_FILE)) {
  fs.appendFile(STORIES_FILE, JSON.stringify({}), (err) => {
    if (err) console.log(err);
    else console.log("Created stories file!");
  });
}
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.help((ctx) =>
  ctx.reply(
    "Этот бот использует OpenAI. Чтобы начать общение, напишите сообщение в чате. Приятного времяпрепровождения с незаурядным собеседником 😉"
  )
);

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
