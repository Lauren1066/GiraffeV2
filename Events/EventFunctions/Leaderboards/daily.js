const constants = require("../../../Storage/constants.js");
const dailyMessages = require("../../../Model/dailyMessages.js");
const { EmbedBuilder } = require("discord.js");

async function daily(client, dailyJob) {
  const timeNow = new Date();

  // convert each date to a Unix timestamp
  const unixTimestamp = Math.floor(timeNow.getTime() / 1000) + 86400;

  try {
    const channel = await client.channels.fetch(constants.leaderboardChannel);
    const guild = await client.guilds.fetch(constants.guildId);
    await guild.members.fetch({});

    const res = await dailyMessages
      .find({})
      .sort([["messages", "descending"]])
      .limit(10);

    const embed = new EmbedBuilder().setTitle("Daily Leaderboard");
    const mainGuild = client.guilds.cache.get(constants.guildId);
    let i = 1;
    for (const member of res) {
      const fetchedUser = await mainGuild.members.fetch(member.memberID);
      const username = fetchedUser.user.username || "Unknown username";
      embed.addFields({ name: `${i}) ${username}`, value: `Messages: ${member.messages}` });
      i++;
    }

    await channel.send(`Next leaderboard update <t:${unixTimestamp}:R>`);
    await channel.send({ embeds: [embed] });
    await dailyMessages.deleteMany({});
  } catch (err) {
    console.error(err);
  }
}

module.exports = { daily };
