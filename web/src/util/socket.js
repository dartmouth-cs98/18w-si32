import io from "socket.io-client";
import config from "../config";

const { API_URL } = config;
 
const socket = io(API_URL);

export default socket;
