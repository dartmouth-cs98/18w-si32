const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const BOT_BUCKET = "s3-bots";

const upload = (bucket, key, payload) => {
  return new Promise((resolve, reject) => {
    s3.upload({
      Bucket: "s3-bots",
      Key: key,
      Body: payload
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          url: data.Location
        });
      }
    });
  });
};

const uploadBot = (userId, botName, code) => {
  // TODO verify bot is a zip
  if (code.mimetype != "text/x-python-script") {
    return Promise.reject("Bot must be a python file");
  }

  return upload(BOT_BUCKET, userId + "/" + botName + code.name, code.data);
};

module.exports = {
  uploadBot
};
