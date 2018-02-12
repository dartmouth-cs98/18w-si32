import * as http from "../util/http.js";

// base actions for typical http requests

const httpGetAction = (collectionName, endpoint, params, options={}) => (dispatch, getState) => {
  dispatch({
    type: `REQUESTED_${collectionName}`
  });
  return http
    .get(endpoint)
    .then(res => {
      dispatch({
        type: `RECEIVED_${collectionName}`,
        doMerge: options.doMerge,
        payload: res.body
      });
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, params, err);
    });
}

export { httpGetAction };
