import { httpGetAction, httpPostAction } from "../httpCollectionActions";

const fetchMatches = () => httpGetAction("MATCH", "/matches", null);

const createMatch = (bots) => httpPostAction("MATCH", "/matches", { botIds: bots });

export { fetchMatches, createMatch };
