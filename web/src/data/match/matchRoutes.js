import request from "superagent";
import msgpack from "msgpack-lite";

const fetchLog = (logUrl) => {
  return request.get(logUrl).responseType("arraybuffer")
          .then(res => msgpack.decode(new Uint8Array(res.body)));
};

export {
  fetchLog
};
