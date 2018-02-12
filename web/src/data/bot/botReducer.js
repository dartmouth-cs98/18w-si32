import { RECEIVED_BOTS } from "./botActions";
import httpCollectionReducer from "../httpCollectionReducer";

const botReducer = httpCollectionReducer("BOTS", (state, action) => {
  return state;
});

export default botReducer;
