const monthlyVoiceModel = require("../../Model/monthlyVoice.js");

module.exports.run = async (client, message, args) => {
  const memberId = message.mentions.members.first()?.id ?? message.author.id;
  const monthlyData = (await monthlyVoiceModel.findOne({ memberID: memberId })) || { minutes: 0 };

  message.channel.send(`${monthlyData.minutes} minutes this month!`);
};

module.exports.help = {
  name: "voice",
  description: "Check how many minutes in voice chat someone has",
  aliases: [],
  category: "Voice",
};
