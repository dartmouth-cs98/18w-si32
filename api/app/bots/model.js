const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const _Bot = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
  name: {
    type: String,
    required: true
  },
  codeUrl: {
    type: String,
    required: true
  }
});

const Bot = mongoose.model("Bot", _Bot);

module.exports = Bot;
