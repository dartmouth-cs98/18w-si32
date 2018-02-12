// a default reducer for basic loading of data types. Wraps a passed in reducer
// and manages the isLoading and data values

const INITIAL_STATE = {
  isLoading: false,
  data: [], // do we want this to be a keyed map?
};

const createHttpReducer = (collectionName, collectionReducer) => {
  return function collection(state = INITIAL_STATE, action) {
    switch (action.type) {
      case `REQUESTED_${collectionName}`:
        return {
          ...state,
          isLoading: true
        };
      case `RECEIVED_${collectionName}`:
        return {
          ...state,
          isLoading: false,
          data: action.data
        };
    }

    return collectionReducer(state, action);
  }
};

export default createHttpReducer;
