const constants = require("../../Storage/constants.js");
const expModel = require("../../Model/exp.js");

const levels = [
  { role: "1044126473696591872", level: 150 },
  { role: "906079492798291979", level: 100 },
  { role: "1044125303200563270", level: 80 },
  { role: "1044125027756421191", level: 75 },
  { role: "906079430592565268", level: 50 },
  { role: "1044124570254327829", level: 40 },
  { role: "1044125406321709146", level: 25 },
  { role: "1044124395486060585", level: 20 },
  { role: "1044126922361278565", level: 15 },
  { role: "1044124293019209781", level: 10 },
];

module.exports.run = async (client, message, args) => {
  const data = await expModel.findOne({ memberID: message.author.id });
  const mainGuild = await client.guilds.fetch(constants.guildId);

  const memberRoles = message.member.roles.cache;

  for (const { role, level } of levels) {
    const levelRole = await mainGuild.roles.fetch(role);

    if (data.level >= level && !memberRoles.has(levelRole.id)) {
      message.member.roles.add(levelRole);
    } else if (data.level < level && memberRoles.has(levelRole.id)) {
      message.member.roles.remove(levelRole);
    }
  }

  message.channel.send(`Roles updated!`);
};

module.exports.help = {
  name: "forceRoleUpdate",
  description: "Updates your level role",
  aliases: [],
  category: "Levels",
};
