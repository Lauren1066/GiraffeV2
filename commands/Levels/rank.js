const { AttachmentBuilder } = require("discord.js");
const expModel = require("../../Model/exp.js");
const { build } = require("../../Functions/build.js");

module.exports.run = async (client, message, args) => {
  const permissions = message.channel.permissionsFor(message.client.user);
  if (!permissions.has("AttachFiles") || !permissions.has("SendMessages")) {
    return message.channel.send("No permissions to send attachments!");
  }

  const member = message.mentions.members.first() || message.member;
  const data = await expModel.findOne({
    memberID: member.id,
  });
  if (!data) {
    return message.channel.send("No data for this user was found!");
  }
  const image = await build(member.user, data);
  const attachment = new AttachmentBuilder(image, { name: "rank.png" });
  message.reply({ files: [attachment] });
};

module.exports.help = {
  name: "rank",
  description: "Check your rank or someone else's rank",
  aliases: [],
  category: "Levels",
};
