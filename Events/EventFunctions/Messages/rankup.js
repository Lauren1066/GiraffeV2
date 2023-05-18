const constants = require("../../../Storage/constants.js");

async function rankUp(message, level) {
  const mainGuild = await message.client.guilds.fetch(constants.guildId);
  switch (true) {
    case level >= 150: {
      let role = await mainGuild.roles.fetch("1044126473696591872");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 100: {
      let role = await mainGuild.roles.fetch("906079492798291979");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 80: {
      let role = await mainGuild.roles.fetch("1044125303200563270");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 75: {
      let role = await mainGuild.roles.fetch("1044125027756421191");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 50: {
      let role = await mainGuild.roles.fetch("906079430592565268");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 40: {
      let role = await mainGuild.roles.fetch("1044124570254327829");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 25: {
      let role = await mainGuild.roles.fetch("1044125406321709146");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 20: {
      let role = await mainGuild.roles.fetch("1044124395486060585");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 15: {
      let role = await mainGuild.roles.fetch("1044126922361278565");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
    case level >= 10: {
      let role = await mainGuild.roles.fetch("1044124293019209781");
      if (role) {
        message.member.roles.add(role);
      }
      break;
    }
  }
}
module.exports = { rankUp };
