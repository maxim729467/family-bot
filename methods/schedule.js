const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../db");

exports.scheduleDeleteOldMessages = () => {
  cron.schedule("0 0 * * *", async () => {
    const threeDaysAgo = new Date(new Date() - 3 * 24 * 60 * 60 * 1000);

    try {
      console.log("deleting messages that are older than 3 days...");
      console.log(new Date());

      await db.Message.destroy({
        where: {
          createdAt: {
            [Op.lt]: threeDaysAgo,
          },
        },
      });
    } catch (error) {
      console.log("ERROR DELETING OLD MESSAGES ---> ", error);
    }
  });
};
