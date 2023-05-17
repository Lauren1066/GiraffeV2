const Mee6LevelsApi = require("mee6-levels-api");
const expModel = require("../../Model/exp.js");
const constants = require("../../Storage/constants.js");

module.exports.run = async (client, message, args) => {
  try {
    const user = await Mee6LevelsApi.getUserXp(constants.guildId, message.author.id);

    if (!user) {
      return message.channel.send("You don't have any data from Mee6 to move!");
    }

    const data = await expModel.findOne({ memberID: message.author.id });

    if (data.level > user.level) {
      return message.reply("Your current level in the bot is greater than your Mee6 level");
    }

    await expModel.findOneAndDelete({ memberID: message.author.id });

    await expModel.create({ guildId: constants.guildId, xp: user.xp.userXp, memberID: message.author.id, level: user.level });

    let newData = await expModel.findOne({ memberID: message.author.id });
    message.channel.send(`Data updated! You are now level ${newData.level}.`);
  } catch (err) {
    console.error(err);
    message.channel.send("An error occurred while updating your data. Please DM (don't ping) Toast for more information!");
  }
};

module.exports.help = {
  name: "forceUpdate",
  description: "Updates your levels to Mee6 levels",
  category: "levels",
  aliases: [],
};
