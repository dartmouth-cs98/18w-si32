
// for when authenticated user attempts to do something they're not allowed to
class AccessError extends Error {}

/* eslint-disable node/no-unsupported-features */
export default {
  AccessError,
};

/* eslint-enable node/no-unsupported-features */
