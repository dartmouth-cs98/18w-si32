import * as http from "../../util/http.js";
import { httpGetAction, httpPostAction } from "../httpCollectionActions";
import history from "../../history";

const fetchMatches = () => httpGetAction("MATCH", "/matches", null);

const createMatch = (bots) => httpPostAction("MATCH", "/matches", { botIds: bots });

export { fetchMatches, createMatch };
