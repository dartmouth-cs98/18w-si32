import devConfig from "./config.dev";
import prodConfig from "./config.prod";

let config = {};

if (PRODUCTION) {
  config = prodConfig;
} else {
  config = devConfig;
}

export default config;
