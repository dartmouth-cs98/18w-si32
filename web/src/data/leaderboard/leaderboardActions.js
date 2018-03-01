import { httpGetAction } from "../httpCollectionActions";

const SET_SELECTED_GROUP = "SET_SELECTED_GROUP";

const fetchLeaderboard = (groupId, page) => {
  const uri = groupId ? `/leaderboards/${groupId}` : "/leaderboards";
  return httpGetAction("LEADERBOARD", uri, { page }, { doMerge: false, isSingle: true });
};

const setSelectedGroup = (groupId, groupName) => dispatch => {
  dispatch({
    type: SET_SELECTED_GROUP,
    payload: {
      id: groupId,
      name: groupName
    }
  });
};

export {
  fetchLeaderboard,
  setSelectedGroup,
  SET_SELECTED_GROUP,
};
