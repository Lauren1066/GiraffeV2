const mongoose = require("mongoose");

const dailyMessages = mongoose.Schema({
  memberID: String,
  messages: {
    default: 0,
    type: Number,
  },
});
module.exports = mongoose.model("dailyMessages", dailyMessages);
