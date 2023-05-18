const rn = require("random-number");
const { AttachmentBuilder } = require("discord.js");
const expModel = require("../../../Model/exp.js");
const { build } = require("../../../Functions/build.js");
const { rankUp } = require("./rankup.js");

async function xp(message) {
  // Must be in Peachy! Server
  if (message.guild.id != "863149116062433339" && message.guild.id != "980559928911618090") return;

  // Find data for user who sent message
  let data = await expModel.findOne({
    memberID: message.author.id,
  });

  // Xp that user gets (Between 8 and 12)
  const randomNumber = rn({ min: 8, max: 12, integer: true });

  if (data) {
    // Add the number to their xp
    const addedXp = data.xp + randomNumber;
    data.xp = addedXp;

    // Get their level, xp, and how much xp they need to level up
    const level = data.level;
    const xp = data.xp;
    const xpNeeded = 5 * Math.pow(data.level, 2) + 60 * data.level + 100;

    // If they have enough xp to level up
    if (xpNeeded < xp) {
      // Add one to their level
      const newLevel = level + 1;
      data.level = newLevel;

      // Remove the xp needed to level up
      const newXp = data.xp - xpNeeded;
      data.xp = newXp;

      const permissions = message.channel.permissionsFor(message.client.user);
      if (permissions.has("AttachFiles") && permissions.has("SendMessages")) {
        // Build their card
        const image = await build(message.author, data);
        const attachment = new AttachmentBuilder(image, { name: "rank.png" });
        message.reply({ content: "You leveled up!", files: [attachment] });

        rankUp(message, newLevel);
      }
    }
    // Save everything we changed
    data.save();
  } else {
    // Make a new entry in the database and save
    await expModel.create({ guildID: message.guild.id, xp: randomNumber, memberID: message.author.id, level: 0 });
  }
}

module.exports = { xp };
