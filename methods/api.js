const axios = require('axios');
const moment = require('moment');
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, RAPID_API_KEY } = process.env;

const openAIConfiguration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfiguration);

exports.getForecastData = async (city) => {
  const URL = `https://forecast9.p.rapidapi.com/rapidapi/forecast/${city}/summary/`;
  const options = {
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'forecast9.p.rapidapi.com',
    },
  };

  try {
    const res = await axios.get(URL, options);
    const currentDate = moment().format('YYYY-MM-DD');
    const todayForecastData = res.data.forecast.items.find(
      (item) => item.date === currentDate
    );
    return todayForecastData;
  } catch (e) {
    throw new Error(e);
  }
};

exports.sendQuestion = async (question, ctx) => {
  try {
    const { data } = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 2048,
    });

    let answer = 'Мне нечего сказать на это...';
    if (data.choices && data.choices.length) {
      answer = data.choices[0].text;
    }

    ctx.reply(answer);
  } catch (error) {
    console.log('[OPENAI] ERROR \n', error);
    ctx.reply('');
  }
};
