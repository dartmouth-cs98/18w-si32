import * as http from "../util/http.js";

// base actions for typical http requests

/* eslint-disable no-unused-vars */

const httpGetAction = (collectionName, endpoint, params, options={}) => (dispatch, getState) => {
  dispatch({
    type: `REQUESTED_${collectionName}`
  });
  return http
    .get(endpoint)
    .query(params)
    .then(res => {
      const payloadBody = options.isSingle ? [res.body] : res.body;
      const payload = options.customPayloadFn ? options.customPayloadFn(res.body) : payloadBody;
      dispatch({
        type: `RECEIVED_${collectionName}`,
        doMerge: options.doMerge || options.isSingle,
        payload,
      });
      return res;
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, params, err); // eslint-disable-line
      return Promise.reject(err);
    });
};

const httpPostAction = (collectionName, endpoint, body={}, options={}) => (dispatch, getState) => {
  dispatch({
    type: `POSTED_${collectionName}`
  });
  return http
    .post(endpoint)
    .send(body)
    .then(res => {
      dispatch({
        type: `UPDATED_${collectionName}`,
        doMerge: true, // whatever we get back, merge in without replacing everything still there
        payload: res.body.updatedRecords
      });
      return res.body.updatedRecords;
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, body, err); // eslint-disable-line
      return Promise.reject(err);
    });
};

const httpPutAction = (collectionName, endpoint, body={}, options={}) => (dispatch, getState) => {
  dispatch({
    type: `PUT_${collectionName}`
  });
  return http
    .put(endpoint)
    .send(body)
    .then(res => {
      dispatch({
        type: `UPDATED_${collectionName}`,
        doMerge: true, // whatever we get back, merge in without replacing everything still there
        payload: res.body.updatedRecords
      });
      return res.body.updatedRecords;
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, body, err); // eslint-disable-line
      return Promise.reject(err);
    });
};

const httpPutActionMultipleUpdate = (collectionNames, endpoint, body={}, options={}) => (dispatch, getState) => {
  collectionNames.forEach(collectionName => {
    dispatch({
      type: `PUT_${collectionName}`
    });
  });
  return http
    .put(endpoint)
    .send(body)
    .then(res => {
      const updatedCollections = res.body.updatedCollections || [];
      updatedCollections.forEach(collection => {
        dispatch({
          type: `UPDATED_${collection.collection}`,
          doMerge: true, // whatever we get back, merge in without replacing everything still there
          payload: collection.updatedRecords
        });
      });
      return updatedCollections;
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, body, err); // eslint-disable-line
      return Promise.reject(err);
    });
};

const httpDeleteAction = (collectionName, endpoint, body={}, options={}) => (dispatch, getState) => {
  dispatch({
    type: `DELETE_${collectionName}`
  });
  return http
    .del(endpoint)
    .send(body)
    .then(res => {
      dispatch({
        type: `UPDATED_${collectionName}`,
        doMerge: true, // whatever we get back, merge in without replacing everything still there
        payload: res.body.updatedRecords
      });
    }).catch(err => {
      // TODO what to do in the store here?
      console.log("HTTP error", collectionName, endpoint, body, err); // eslint-disable-line
      return Promise.reject(err);
    });
};

export { httpGetAction, httpPostAction, httpPutAction, httpDeleteAction };
