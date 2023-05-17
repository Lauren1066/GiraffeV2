const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message, args) => {
  const msg = await message.channel.send("Pinging...");
  const pingEmbed = new EmbedBuilder()
    .setTitle("Giraffe's Ping")
    .addFields(
      { name: "Websocket ping", value: `${client.ws.ping}ms` },
      { name: "Client ping", value: `${msg.createdTimestamp - message.createdTimestamp}ms` }
    );
  await msg.edit({ content: "", embeds: [pingEmbed] });
};

module.exports.help = {
  name: "ping",
  description: "Check the bot ping",
  aliases: [],
  category: "Info",
};
