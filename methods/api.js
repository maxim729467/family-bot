const axios = require('axios');
const moment = require('moment');
// const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, RAPID_API_KEY } = process.env;

// const openAIConfiguration = new Configuration({
//   apiKey: OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(openAIConfiguration);

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
    const baseUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = [{ role: 'user', content: question }];
    let answer = 'Мне нечего сказать на это.';

    const payload = {
      model: 'gpt-3.5-turbo',
      max_tokens: 2048,
      messages,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const response = await axios.post(baseUrl, payload, config);
    if (response?.data?.choices?.length) {
      answer = response.data.choices[0].message.content;
    }

    ctx.reply(answer);
  } catch (error) {
    console.error('[OPENAI] ERROR \n', error);
    ctx.reply('Open AI временно недоступен.');
  }
};
