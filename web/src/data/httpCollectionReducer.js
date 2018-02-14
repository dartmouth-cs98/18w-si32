// a default reducer for basic loading of data types. Wraps a passed in reducer
// and manages the isLoading and data values

// TODO keep track of some dirtiness checking in here to avoid needing to fire
// requests on every single page load

const INITIAL_STATE = {
  isLoading: false,
  records: {},
};

// if doMerge is true, adds/overwrites in existing records
// otherwise replaces existingRecords
const mergeRecords = (existingRecords, newRecords, doMerge) => {
  const rById = doMerge ? existingRecords : {}; // need to create new ref in either case
  newRecords.forEach(r => rById[r._id] = r);
  return rById;
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
          records: mergeRecords(state.records, action.payload, action.doMerge),
        };
    }

    return collectionReducer(state, action);
  };
};

export default createHttpReducer;
