const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const _Bot = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  version: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    required: true
  },
  code: {
    url: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

_Bot.methods.getCodeLink = function() { 

};

const Bot = mongoose.model("Bot", _Bot);

module.exports = Bot;
