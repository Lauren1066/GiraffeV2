const mongoose = require("mongoose");

const weeklyMessages = mongoose.Schema({
  memberID: String,
  messages: {
    default: 0,
    type: Number,
  },
});
module.exports = mongoose.model("weeklyMessages", weeklyMessages);
