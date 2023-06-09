const axios = require("axios");
const { OPENAI_API_KEY } = process.env;
const { getMessagesByUserId, addMessage } = require("./dbRequests");

async function sendMessage(message, userId) {
  try {
    const baseUrl = "https://api.openai.com/v1/chat/completions";
    const messages = await getMessagesByUserId(userId);
    const newQuestion = { role: "user", content: message };
    messages.push(newQuestion);

    const payload = {
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      messages,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const response = await axios.post(baseUrl, payload, config);
    if (!response?.data?.choices?.length) return null;

    const reply = response.data.choices[0].message.content;
    await addMessage({ ...newQuestion, userId });
    await addMessage({ role: "assistant", content: reply, userId });
    return reply;
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
    console.log(error.message);
    ctx.reply("Чет пошло не по плану 🤔");
  }
};
