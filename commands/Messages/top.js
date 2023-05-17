const { EmbedBuilder } = require("discord.js");
const weeklyMessages = require("../../Model/weeklyMessages.js");
const monthlyMessages = require("../../Model/monthlyMessages.js");
const dailyMessages = require("../../Model/dailyMessages.js");
const ordinal = (num) => `${num.toLocaleString("en-US")}${[, "st", "nd", "rd"][(num / 10) % 10 ^ 1 && num % 10] || "th"}`;
module.exports.run = async (client, message, args) => {
  let choice;
  if (!args[1] || args[1].toLowerCase() == "weekly") {
    choice = weeklyMessages;
  } else if (args[1].toLowerCase() == "monthly") {
    choice = monthlyMessages;
  } else {
    choice = dailyMessages;
  }
  const leaderboard = await choice.find({}).sort({ messages: -1 }).limit(10);
  if (leaderboard.length === 0) {
    message.reply("No Data!");
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "After Hours Message Leaderboard",
      iconURL: message.guild.iconURL({ extension: "png" }),
    })
    .setColor("#8ef1ec");

  for (let i = 0; i < leaderboard.length; i++) {
    const memberID = leaderboard[i].memberID;
    const name = await message.guild.members
      .fetch(memberID)
      .then((member) => member.user.username)
      .catch(() => null);
    if (name) {
      embed.addFields({ name: `${ordinal(i + 1)}. ${name}`, value: `**Messages:** ${leaderboard[i].messages}` });
    }
  }
  message.channel.send({
    embeds: [embed],
  });
};
module.exports.help = {
  name: "top",
  description: "Check the message leaderboard (monthly/weekly/daily)",
  aliases: [],
  category: "Messages",
};
