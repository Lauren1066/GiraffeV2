const monthlyVoiceModel = require("../Model/monthlyVoice.js");
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    // If they join a voice channel
    if (newState.channelId != null && oldState.channelId == null) {
      // Get their data
      let monthlyVoiceData = await monthlyVoiceModel.findOne({ memberID: oldState.id });
      // If they have both datas
      if (monthlyVoiceData) {
        // Sets last join to right now and saves
        monthlyVoiceData.lastJoin = Date.now();
        monthlyVoiceData.save();
        // If they don't have any data
      } else if (!monthlyVoiceData) {
        // Make new data for them and save
        await monthlyVoiceModel.create({ memberID: oldState.id, lastJoin: Date.now(), minutes: 0 });
      }
      // If they leave a voice channel
    } else if (newState.channelId == null && oldState.channelId != null) {
      // Find their data
      let monthlyVoiceData = await monthlyVoiceModel.findOne({ memberID: oldState.id });
      // Subtract time now from when they joined. Divide that to convert it from ms to minutes. Add that to their total minutes.
      let y = monthlyVoiceData.minutes + Math.floor((Date.now() - monthlyVoiceData.lastJoin) / 60000);
      // Update & save
      monthlyVoiceData.minutes = y;
      monthlyVoiceData.save();
    }
  },
};
