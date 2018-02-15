const mongoose = require("mongoose");

const DB_URI = (process.env.DB_URI || "mongodb://mongo:27017") + "/si32";

mongoose.connect(DB_URI);

const db = mongoose.connection;

db.once("open", () => {
  /* eslint-disable no-console */
  console.log("connected");
  /* eslint-enable no-console */
});

module.exports = db;
