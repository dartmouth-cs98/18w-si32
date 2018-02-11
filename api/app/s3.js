const AWS = require("aws-sdk");

const s3 = new AWS.S3({signatureVersion: "v4"});

const BOT_BUCKET = "s3-bots";
const SIGNED_URL_EXPIRE_SECONDS = 60 * 5;

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
          url: data.Location,
          key: key
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

  return upload(BOT_BUCKET, `${userId}/${botName}_${code.name}`, code.data);
};

// returns a link with a signature that allows holder access to the bot file
const getBotUrl = (botKey) => {
  const url  = s3.getSignedUrl("getObject", {
    Bucket: BOT_BUCKET,
    Key: botKey,
    Expires: SIGNED_URL_EXPIRE_SECONDS,
  });

  return url;
};

module.exports = {
  uploadBot,
  getBotUrl,
};
