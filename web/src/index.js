const _ = require("lodash");
require("./style.css");

function component() {
  var element = document.createElement("div");

  element.innerHTML = _.join(["Hello ", "webpacking"], " ");

  return element;
}

document.body.appendChild(component());
