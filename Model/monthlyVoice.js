const mongoose = require("mongoose");

const monthlyVoice = mongoose.Schema({
  memberID: String,
  lastJoin: Number,
  minutes: {
    default: 0,
    type: Number,
  },
});
module.exports = mongoose.model("monthlyVoice", monthlyVoice);
