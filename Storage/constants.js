const guildId = "863149116062433339";
const leaderboardChannel = "923821634735980594";
const cronDaily = "0 22 21 */1 * *"; // Every day at midnight
const cronWeekly = "0 0 0 * * */5"; // Every Friday at midnight
const cronMonthly = "0 0 1 1 */1 *";
const testLeaderboardChannel = "988279196054867998";
const testCron = "0 */1 * * * *";

module.exports = {
  guildId: guildId,
  leaderboardChannel: leaderboardChannel,
  cronDaily: cronDaily,
  cronWeekly: cronWeekly,
  cronMonthly: cronMonthly,
  testCron: testCron,
  testLeaderboardChannel: testLeaderboardChannel,
};
