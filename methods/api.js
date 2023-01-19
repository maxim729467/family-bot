const axios = require("axios");
const moment = require('moment');
const { Configuration, OpenAIApi } = require("openai");
const { Translate } = require('@google-cloud/translate').v2;

const openAIConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfiguration);
const translator = new Translate({key: process.env.GOOGLE_TRANSLATE_API_KEY});

exports.getForecastData = async (city) => {
const URL = `https://forecast9.p.rapidapi.com/rapidapi/forecast/${city}/summary/`;
const options = {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'forecast9.p.rapidapi.com'
      }
    };

try {
    const res = await axios.get(URL, options);
    const currentDate = moment().format('YYYY-MM-DD');
    const todayForecastData = res.data.forecast.items.find(item => item.date === currentDate);
    return todayForecastData;
} catch (e) {
    console.log(e.message);
    throw new Error();
}
}

const translate = async (text, target) => {
  const [translation] = await translator.translate(text, target);
  return translation;
}

exports.sendQuestion = async (question, ctx) => {
try {
  const questionInEng = await translate(question, 'en');
  const { data } = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: questionInEng,
    max_tokens: 2048,
  });

  let answer = 'Мне нечего сказать на это...';
  if (data.choices && data.choices.length) {
    answer = await translate(data.choices[0].text, 'ru');
  }

  ctx.reply(answer);
} catch (error) {
  console.log(error);
  ctx.reply('Чет пошло не по плану 🤔')
}
}
