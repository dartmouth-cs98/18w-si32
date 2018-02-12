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

const httpPostAction = (collectionName, endpoint, body={}, options={}) => (dispatch, getState) => {
  dispatch({
    type: `REQUESTED_${collectionName}`
  });
  return http
    .post(endpoint)
    .send(body)
    .then(res => {
      dispatch({
        type: `RECEIVED_${collectionName}`,
        doMerge: true, // whatever we get back, merge in without replacing everything still there
        payload: res.body.updatedRecords
      });
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, body, err);
    });
}

export { httpGetAction, httpPostAction };
