const AWS = require("aws-sdk");
const fs = require("fs");

const s3 = new AWS.S3({signatureVersion: "v4"});

// const MATCH_LOG_BUCKET = "si32-matches";
const BOT_BUCKET = "si32-bots";
const MATCH_BUCKET = "si32-matches";

const BOT_EXPIRE = 60 * 5;
const MATCH_EXPIRE = 60 * 60;

const upload = (bucket, key, file, options={}) => {
  let body = file;
  if ("path" in file) {
    body = fs.createReadStream(file.path);
  }

  return new Promise((resolve, reject) => {
    s3.upload({
      Bucket: bucket,
      Key: key,
      Body: body,
      ...options              // eslint-disable-line
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

const uploadBot = (userId, botId, code) => {
  if (code.type != "text/x-python-script") {
    return Promise.reject("Bot must be a python file");
  }

  return upload(BOT_BUCKET, `${userId}/${botId}.py`, code);
};

// returns a link with a signature that allows holder access to the bot file
const getBotUrl = (botKey) => {
  const url  = s3.getSignedUrl("getObject", {
    Bucket: BOT_BUCKET,
    Key: botKey,
    Expires: BOT_EXPIRE,
  });

  return url;
};

const uploadLog = (matchId, log) => {
  return upload(MATCH_BUCKET, `${matchId}.mp`, log, { ContentEncoding: "gzip" });
};

const getLogUrl = (logKey) => {
  return s3.getSignedUrl("getObject", {
    Bucket: MATCH_BUCKET,
    Key: logKey,
    Expires: MATCH_EXPIRE,
  });
};

module.exports = {
  uploadBot,
  getBotUrl,
  uploadLog,
  getLogUrl,
};
