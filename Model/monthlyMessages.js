const mongoose = require("mongoose");

const monthlyMessages = mongoose.Schema({
  memberID: String,
  messages: {
    default: 0,
    type: Number,
  },
});
module.exports = mongoose.model("monthlyMessages", monthlyMessages);
