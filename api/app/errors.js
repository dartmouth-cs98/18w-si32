const assert = require("assert");

// for when authenticated user attempts to do something they're not allowed to
class AccessError extends Error {
  getStatus() {
    return 403;
  }
}

// resource not found
class NotFoundError extends Error {
  getStatus() {
    console.log("not found"); // eslint-disable-line
    return 404;
  }
}

// token not included and needed, token invalid, bad password
class AuthError extends Error {
  getStatus() {
    return 401;
  }
}

// request asked the server to do something that it can't do
// use this for validation errrors
class MalformedError extends Error {
  getStatus() {
    return 422;
  }
}

// map built-in errors onto the classes that they would fall under
const errorMap = {
  MongooseError: MalformedError,
};

// if error is a built-in error, and we're mapping it onto something, return the mapping
// otherwise just pass through the original error
const handleBuiltInError = (err) => {
  if (err.constructor.name in errorMap) {
    return new errorMap[err.constructor.name](err.message);
  }

  return err;
};

// set error status and body
const errorMiddleware = async (ctx, next) =>  {
  try {
    await next();
  } catch(err) {
    // log for debugging
    console.log(err); // eslint-disable-line

    // assertions only used for internal purposes (worker/sanity checking) so we
    // want to just pass the error straight through for debugging
    if (err instanceof assert.AssertionError) {
      ctx.body = Object.assign({}, err, {stack: err.stack});
      ctx.status = 500;
      return;
    }

    const mappedErr = handleBuiltInError(err);
    if (mappedErr.constructor.name in module.exports) {
      // send body/status based on error class
      ctx.body = {
        error: mappedErr.message,
      };
      ctx.status = mappedErr.getStatus();
    } else {
      // handle generic error
      ctx.body = {
        error: err.message,
      };
      ctx.status = 500;
    }
  }
};

// built-in errors, and map other errors onto the types we want to handle them
module.exports = {
  AccessError,
  NotFoundError,
  AuthError,
  MalformedError,
  errorMiddleware,
};
