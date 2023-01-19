
const getRandomMessage = (messages) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

exports.getRandomMessage = getRandomMessage;
exports.cutQuestion = (str) => str.split(' ').slice(1).join(' ').trim();