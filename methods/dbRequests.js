const db = require("../db");

exports.getMessagesByUserId = async (userId, userName = null) => {
  const defaultSystemMessage = {
    role: "system",
    content: "You are a helpful assistant.",
  };
  try {
    const user = await db.User.findOne({ where: { telegramId: userId } });
    if (!user) {
      await db.User.create({
        telegramId: userId,
        userName,
      });

      const message = await db.Message.create({
        ...defaultSystemMessage,
        userId,
        createdAt: new Date(),
      });

      return [{ role: message.role, content: message.content }];
    }

    const count = await db.Message.count({ where: { userId: userId } });

    const messages = await db.Message.findAll({
      where: { userId },
      order: [["id", "ASC"]],
      limit: 10,
      offset: count > 10 ? count - 10 : 0,
      attributes: ["role", "content"],
    });

    return messages;
  } catch (error) {
    console.log(error.message);
    return [defaultSystemMessage];
  }
};

exports.addMessage = async (message) => {
  try {
    await db.Message.create({
      ...message,
      createdAt: new Date(),
    });
  } catch (error) {
    console.log(error);
  }
};
