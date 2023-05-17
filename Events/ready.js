const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;

// Require information from other files
const { mongoPath } = require("../Storage/config.json");
const constants = require("../Storage/constants.js");

// Functions
const { weekly } = require("./EventFunctions/Leaderboards/weekly.js");
const { daily } = require("./EventFunctions/Leaderboards/daily.js");
const { monthly } = require("./EventFunctions/Leaderboards/monthly.js");

module.exports = {
  name: "ready",
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);

    // Connect to mongoose
    await mongoose.connect(mongoPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Daily leaderboard
    var dailyJob = new CronJob(
      constants.cronDaily,
      async function () {
        daily(client, dailyJob);
      },
      null,
      true,
      "America/New_York"
    );

    // Weekly leaderboard
    var weeklyJob = new CronJob(
      constants.cronWeekly,
      async function () {
        weekly(client, weeklyJob);
      },
      null,
      true,
      "America/New_York"
    );

    // Monthly leaderboard
    var monthlyJob = new CronJob(
      constants.cronMonthly,
      async function () {
        monthly(client, monthlyJob);
      },
      null,
      true,
      "America/New_York"
    );
  },
};
