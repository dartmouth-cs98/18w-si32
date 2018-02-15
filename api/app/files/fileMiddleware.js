const fs = require("fs");
const _ = require("lodash");

// middleware to clean up any leftover files
const purgeFiles = async (ctx, next) => {
  // run everything downstream first
  await next();

  // delete any files that were uploaded and not handled elsewhere
  // TODO prevent people from uploading them to begin with
  if (!_.isEmpty(ctx.request.body.files)) {
    /* eslint-disable no-console */
    console.log("deleting remaining files", ctx.request.body.files);
    /* eslint-enable no-console */
    
    _.each(ctx.request.body.files, f => {
      fs.unlink(f.path, _.noop);
    });
  }
};

module.exports = purgeFiles;
