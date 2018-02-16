import * as http from "../util/http.js";

// base actions for typical http requests

/* eslint-disable no-unused-vars */
// TODO: getState, options creating eslint error here because they are not used,
// do we need it?

const httpGetAction = (collectionName, endpoint, params, options={}) => (dispatch, getState) => {
  dispatch({
    type: `REQUESTED_${collectionName}`
  });
  return http
    .get(endpoint)
    .query(params)
    .then(res => {
      dispatch({
        type: `RECEIVED_${collectionName}`,
        doMerge: options.doMerge,
        payload: options.isSingle ? [res.body] : res.body,
      });
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, params, err); // eslint-disable-line
    });
};

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
      console.log("HTTP error", collectionName, endpoint, body, err); // eslint-disable-line
    });
};

export { httpGetAction, httpPostAction };
