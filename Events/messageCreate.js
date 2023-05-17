const prefix = "g.";
const { xp } = require("./EventFunctions/Messages/xp.js");
const fs = require("fs");
const dailyMessages = require("../Model/dailyMessages.js");
const weeklyMessages = require("../Model/weeklyMessages.js");
const monthlyMessages = require("../Model/monthlyMessages.js");
const { apiKey } = require("../Storage/config.json");
const { guildId } = require("../Storage/constants.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (
      message.guild &&
      message.guild.id == guildId &&
      message.embeds.length > 0 &&
      message.embeds[0].author &&
      message.embeds[0].author.name === "Lauren1066"
    ) {
      await message.channel.send("Attempting to restart...");
      const url = "https://panel.storinatemc.tech/api/client/servers/d8ca082b/power?signal=restart";

      axios({
        method: "POST",
        url: url,
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then(function (response) {
          console.log(`${response.status}: ${response.statusText}`);
        })
        .catch(function (error) {
          console.log(`${error.code}`);
          interaction.reply("An error occured!");
        });
    }

    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) {
      xp(message);

      // Find the monthly, daily, and weekly message count
      const [dailyData, weeklyData, monthlyData] = await Promise.all([
        dailyMessages.findOne({ memberID: message.author.id }),
        weeklyMessages.findOne({ memberID: message.author.id }),
        monthlyMessages.findOne({ memberID: message.author.id }),
      ]);

      // Must be in Peachy! server
      if (message.guild.id !== "863149116062433339") {
        return;
      }

      if (dailyData) {
        dailyData.messages++;
        await dailyData.save();
      } else {
        await dailyMessages.create({ memberID: message.author.id, messages: 1 });
      }

      if (weeklyData) {
        weeklyData.messages++;
        await weeklyData.save();
      } else {
        await weeklyMessages.create({ memberID: message.author.id, messages: 1 });
      }

      if (monthlyData) {
        monthlyData.messages++;
        await monthlyData.save();
      } else {
        await monthlyMessages.create({ memberID: message.author.id, messages: 1 });
      }
    } else {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commands = [];

      fs.readdirSync(__dirname + "/../commands").forEach((folder) => {
        fs.readdirSync(__dirname + `/../commands/${folder}`).forEach((file) => {
          const command = require(`../commands/${folder}/${file}`);
          message.client.commands.set(command.help.name, command);
          if ([command.help.name, ...command.help.aliases].some((alias) => alias.toLowerCase() === args[0].toLowerCase())) {
            commands.push(command);
          }
        });
      });

      if (commands.length) {
        const permissions = message.channel.permissionsFor(message.client.user);
        if (permissions.has("AttachFiles") && permissions.has("SendMessages") && permissions.has("EmbedLinks")) {
          for (const command of commands) {
            await command.run(client, message, args);
          }
        } else {
          message.channel.send("I'm missing one of the following permissions:\n`SEND_MESSAGES`\n`EMBED_LINKS`\n`ATTACH_FILES`");
        }
      }
    }
  },
};
