const constants = require("../../../Storage/constants.js");
const monthlyMessages = require("../../../Model/monthlyMessages.js");
const { EmbedBuilder } = require("discord.js");

async function monthly(client, monthlyJob) {
  const [{ year, month, day, hour, minute, second }] = monthlyJob.nextDates(1);
  const date = new Date(year, month - 1, day, hour, minute, second);
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  try {
    const channel = await client.channels.fetch(constants.leaderboardChannel);
    const guild = await client.guilds.fetch(constants.guildId);
    await guild.members.fetch({});

    const res = await monthlyMessages
      .find({})
      .sort([["messages", "descending"]])
      .limit(10);

    const embed = new EmbedBuilder().setTitle("Monthly Leaderboard");
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
    await monthlyMessages.deleteMany({});
  } catch (err) {
    console.error(err);
  }
}

module.exports = { monthly };
