const { EmbedBuilder } = require("discord.js");
module.exports.run = async (client, message, args) => {
  const embed = new EmbedBuilder().setTitle("Commands list");
  const commandArray = [];
  let commandString = "";
  client.commands.forEach((element) => {
    commandArray.push(`${element.help.name}**\n${element.help.description}`);
  });
  await commandArray.sort();
  commandArray.forEach((command) => {
    commandString = commandString + "**g." + command + "\n\n";
  });
  embed.setDescription(commandString);
  message.channel.send({ embeds: [embed] });
};
module.exports.help = {
  name: "help",
  description: "Show a list of commands",
  aliases: [],
  category: "Info",
};
