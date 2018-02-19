import { httpGetAction, httpPostAction } from "../httpCollectionActions";

const fetchMatches = (userId) => httpGetAction("MATCH", "/matches", { userId });

const createMatch = (bots) => httpPostAction("MATCH", "/matches", { botIds: bots });

export { fetchMatches, createMatch };
