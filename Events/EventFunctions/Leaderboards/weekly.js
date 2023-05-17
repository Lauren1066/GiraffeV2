const constants = require("../../../Storage/constants.js");
const weeklyMessages = require("../../../Model/weeklyMessages.js");
const { EmbedBuilder } = require("discord.js");

async function weekly(client, weeklyJob) {
  const [{ year, month, day, hour, minute, second }] = weeklyJob.nextDates(1);
  const date = new Date(year, month, day - 7, hour, minute, second);
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  try {
    const channel = await client.channels.fetch(constants.leaderboardChannel);
    const guild = await client.guilds.fetch(constants.guildId);
    await guild.members.fetch({});

    const res = await weeklyMessages
      .find({})
      .sort([["messages", "descending"]])
      .limit(10);

    const embed = new EmbedBuilder().setTitle("Weekly Leaderboard");
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
    await weeklyMessages.deleteMany({});
  } catch (err) {
    console.error(err);
  }
}

module.exports = { weekly };
