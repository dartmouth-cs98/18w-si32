import * as http from "../../util/http.js";
import { httpGetAction } from "../httpCollectionActions";
import history from "../../history";

const fetchMatches = () => httpGetAction("MATCH", "/matches", null);

const createMatch = () => {};

export { fetchMatches, createMatch };
