import { httpGetAction } from "../httpCollectionActions";

const fetchLeaderboard = (groupId, page) => {
  const uri = groupId ? `/leaderboards/${groupId}` : "/leaderboards";
  return httpGetAction("LEADERBOARD", uri, { page }, { doMerge: false, isSingle: true });
};

export { fetchLeaderboard };
