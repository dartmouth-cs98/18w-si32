import { httpGetAction, httpPostAction } from "../httpCollectionActions";

const fetchMatches = (userId) => httpGetAction("MATCH", "/matches", { userId });

const fetchMatch = (matchId) => httpGetAction("MATCH", `/matches/${matchId}`, null, { isSingle: true });

const fetchLandingMatch = () => httpGetAction("MATCH", `/matches/landing`, null, { isSingle: true });

const createMatch = (bots) => httpPostAction("MATCH", "/matches", { botIds: bots });

export {
  createMatch,
  fetchMatch,
  fetchLandingMatch,
  fetchMatches,
};
