const dailyMessagesModel = require("../../Model/dailyMessages");
const weeklyMessagesModel = require("../../Model/weeklyMessages");
const monthlyMessagesModel = require("../../Model/monthlyMessages");

module.exports.run = async (client, message, args) => {
  const memberId = message.mentions.members.first()?.id || message.author.id;
  const [dailyData, weeklyData, monthlyData] = await Promise.all([
    dailyMessagesModel.findOne({ memberID: memberId }),
    weeklyMessagesModel.findOne({ memberID: memberId }),
    monthlyMessagesModel.findOne({ memberID: memberId }),
  ]);
  const [dailyMessages, weeklyMessages, monthlyMessages] = [dailyData, weeklyData, monthlyData].map((data) => data?.messages ?? "0");
  message.channel.send(`Daily: ${dailyMessages}\nWeekly: ${weeklyMessages}\nMonthly: ${monthlyMessages}`);
};

module.exports.help = {
  name: "messages",
  description: "Check how many messages someone has",
  aliases: [],
  category: "Levels",
};
