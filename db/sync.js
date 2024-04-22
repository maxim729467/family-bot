const sequelize = require("./connect");
const Message = require("./models/message");
const User = require("./models/user");

async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Models synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

syncModels();
