import localConfig from "./config.local";
import prodConfig from "./config.prod";
import stagingConfig from "./config.staging";

let config = {};

if (ENV == "PRODUCTION") {
  config = prodConfig;
} else if (ENV == "STAGING") {
  config = stagingConfig;
} else {
  config = localConfig;
}

export default config;
