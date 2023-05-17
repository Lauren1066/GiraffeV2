const { AttachmentBuilder } = require("discord.js");
const canvacord = require("canvacord");
const expModel = require("../../Model/exp.js");
const constants = require("../../Storage/constants.js");

async function getRankCard(user, data, i) {
  const xpNeeded = 5 * Math.pow(data.level, 2) + 60 * data.level + 100;
  const rank = new canvacord.Rank()
    .setAvatar(user.displayAvatarURL({ extension: "png" }))
    .setCurrentXP(data.xp, "#ffffff")
    .setRequiredXP(xpNeeded, "#ffffff")
    .setCustomStatusColor("#ffffff")
    .setProgressBar("#ffffff", "COLOR")
    .setUsername(user.user.username, "#ffffff")
    .setLevel(data.level)
    .setFontSize("13")
    .setLevelColor("#ffffff", "#ffffff")
    .setRank(i)
    .setRankColor("#ffffff", "#ffffff")
    .setOverlay("#ffffff", 0, false)
    .setBackground("COLOR", "#000001")
    .setDiscriminator(user.user.discriminator, "#ffffff");
  const rankData = await rank.build();
  const attachment = new AttachmentBuilder(rankData, "RankCard.png");
  return attachment;
}

module.exports.run = async (client, message, args) => {
  const permissions = message.channel.permissionsFor(message.client.user);
  if (!permissions.has("AttachFiles") || !permissions.has("SendMessages")) {
    return message.channel.send("No permissions to send attachments!");
  }

  const user = message.mentions.members.first() || message.member;
  const data = await expModel.findOne({
    memberID: user.id,
  });
  if (!data) {
    return message.channel.send("No data for this user was found!");
  }

  const res = await expModel.find({}).sort({ level: -1, xp: -1 });

  let i = 1;
  for (const member of res) {
    if (member.memberID === data.memberID) {
      const attachment = await getRankCard(user, data, i);
      message.channel.send({ files: [attachment] });
      return;
    }
    i++;
  }
};

module.exports.help = {
  name: "rank",
  description: "Check your rank or someone else's rank",
  aliases: [],
  category: "Levels",
};
