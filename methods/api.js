const axios = require("axios");
const fs = require("fs");
const { STORIES_FILE } = require("../constants");
const { OPENAI_API_KEY } = process.env;

// CONTROL HISTORY FILE

async function getHistory(userId) {
  const defaultConversationHistory = [
    { role: "system", content: "You are a helpful assistant." },
  ];

  return new Promise((resolve) => {
    fs.readFile(STORIES_FILE, { encoding: "utf8" }, (err, data) => {
      if (err) {
        console.log({ err });
        resolve(defaultConversationHistory);
        return;
      }

      try {
        const stories = JSON.parse(data);
        if (!stories[userId]) {
          resolve(defaultConversationHistory);
          return;
        }

        resolve(stories[userId]);
      } catch (error) {
        console.log({ error });
        resolve(defaultConversationHistory);
      }
    });
  });
}

async function updateHistory(history, userId) {
  return new Promise((resolve) => {
    fs.readFile(STORIES_FILE, { encoding: "utf8" }, (err, data) => {
      if (err) {
        resolve();
        return;
      }

      try {
        const stories = JSON.parse(data);
        if (history.length > 10) stories[userId] = history.slice(2);
        else stories[userId] = history;
        fs.writeFileSync(STORIES_FILE, JSON.stringify(stories));
        resolve();
      } catch (error) {
        resolve();
      }
    });
  });
}

// SEND REQUEST

async function sendMessage(message, userId) {
  try {
    const baseUrl = "https://api.openai.com/v1/chat/completions";
    const history = [
      ...(await getHistory(userId)),
      { role: "user", content: message },
    ];

    const payload = {
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      messages: history,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const response = await axios.post(baseUrl, payload, config);
    const reply = response.data.choices[0].message.content;
    history.push({ role: "assistant", content: reply });
    await updateHistory(history, userId);

    return response.data.choices && response.data.choices.length ? reply : null;
  } catch (error) {
    console.error("Error from OpenAI API ---> ", error);
    throw new Error("Failed to send message to OpenAI API.");
  }
}

exports.sendQuestion = async (question, ctx) => {
  const userId = ctx.update.message.from.id;

  try {
    const defaultReply = "Мне нечего сказать на это...";
    const reply = await sendMessage(question, userId);
    ctx.reply(reply || defaultReply);
  } catch (error) {
    console.log(error);
    ctx.reply("Чет пошло не по плану 🤔");
  }
};
