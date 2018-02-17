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
    },
    key: {
      type: String,
    }
  }
}, {
  timestamps: true
});

_Bot.statics.findByUser = (userId) => {
  return Bot.find({
    user: userId,
  });
};

const Bot = mongoose.model("Bot", _Bot);

module.exports = Bot;
