const constants = require("../../../Storage/constants.js");
const rn = require("random-number");
const { AttachmentBuilder } = require("discord.js");
const expModel = require("../../../Model/exp.js");
const { client } = require("../../../index.js");
const { build } = require("../../../Functions/build.js");

async function xp(message) {
  // Must be in Peachy! Server
  if (message.guild.id != "863149116062433339" && message.guild.id != "980559928911618090") return;

  // Find data for user who sent message
  let data = await expModel.findOne({
    memberID: message.author.id,
  });

  // Xp that user gets (Between 8 and 12)
  var options = {
    min: 8,
    max: 12,
    integer: true,
  };
  rn(options);
  const randomNumber = rn(options);

  if (data) {
    // Add the number to their xp
    x = data.xp + randomNumber;
    data.xp = x;

    // Get their level, xp, and how much xp they need to level up
    var level = data.level;
    var xp = data.xp;
    var xpNeeded = 5 * Math.pow(data.level, 2) + 60 * data.level + 100;

    // If they have enough xp to level up
    if (xpNeeded < xp) {
      // Add one to their level
      z = level + 1;
      data.level = z;

      // Remove the xp needed to level up
      y = data.xp - xpNeeded;
      data.xp = y;

      const permissions = message.channel.permissionsFor(message.client.user);
      const mainGuild = await client.guilds.fetch(constants.guildId);
      if (permissions.has("AttachFiles") && permissions.has("SendMessages")) {
        // Build their card
        const image = await build(message.author, data);
        const attachment = new AttachmentBuilder(image, { name: "rank.png" });
        message.reply({ content: "You leveled up!", files: [attachment] });

        if (z >= 150) {
          let role = await mainGuild.roles.fetch("1044126473696591872");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 100) {
          let role = await mainGuild.roles.fetch("906079492798291979");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 80) {
          let role = await mainGuild.roles.fetch("1044125303200563270");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 75) {
          let role = await mainGuild.roles.fetch("1044125027756421191");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 50) {
          let role = await mainGuild.roles.fetch("906079430592565268");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 40) {
          let role = await mainGuild.roles.fetch("1044124570254327829");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 25) {
          let role = await mainGuild.roles.fetch("1044125406321709146");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 20) {
          let role = await mainGuild.roles.fetch("1044124395486060585");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 15) {
          let role = await mainGuild.roles.fetch("1044126922361278565");
          if (role) {
            message.member.roles.add(role);
          }
        } else if (z >= 10) {
          let role = await mainGuild.roles.fetch("1044124293019209781");
          if (role) {
            message.member.roles.add(role);
          }
        }
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
