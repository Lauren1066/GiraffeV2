const { EmbedBuilder } = require("discord.js");
const expModel = require("../../Model/exp.js");
const ordinal = (num) => `${num.toLocaleString("en-US")}${[, "st", "nd", "rd"][(num / 10) % 10 ^ 1 && num % 10] || "th"}`;

module.exports.run = async (client, message, args) => {
  const leaderboard = await expModel.find({}).sort({ level: -1, xp: -1 }).limit(10);
  if (leaderboard.length === 0) {
    return message.reply("No Data!");
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Peachy XP Leaderboard",
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
      embed.addFields({ name: `${ordinal(i + 1)}. ${name}`, value: `**Level:** ${leaderboard[i].level}` });
    }
  }

  return message.reply({ embeds: [embed] });
};
module.exports.help = {
  name: "lb",
  description: "Show the Level Leaderboard",
  category: "levels",
  aliases: [],
};
