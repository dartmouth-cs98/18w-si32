"use strict";

/* fire up db */
require("dotenv").config(); // load environment vars from .env
require("../app/db");

const chai = require("chai");

// Setup chai plugins
chai.use(require("dirty-chai"));
