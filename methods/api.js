const axios = require('axios');
const { OPENAI_API_KEY, RAPID_API_KEY } = process.env;

exports.getForecastData = async (city) => {
  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=1&lang=ru`;
  const options = {
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
    },
  };

  try {
    const res = await axios.get(url, options);
    return res.data;
  } catch (e) {
    throw new Error(e);
  }
};

exports.sendQuestion = async (question) => {
  try {
    const baseUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = [{ role: 'user', content: question }];
    let answer = 'Я - рюкзак, я - рюкзак 🎒';

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

    return answer;
  } catch (error) {
    console.error('[OPENAI] ERROR \n', error);
    return 'Open AI временно недоступен.';
  }
};
