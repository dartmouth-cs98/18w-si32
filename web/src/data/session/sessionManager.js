// stores/handles local aspects of session

let curSession = {};
curSession.token = localStorage["s"];

const init = token => {
  localStorage["s"] = token;
  curSession.token = token;
};

const isLoggedIn = () => {
  return !!curSession.token;
}

const getToken = () => {
  return curSession.token;
};

const destroy = () => {
  curSession = {};
  localStorage["s"] = "";
};

export {
  isLoggedIn,
  init,
  getToken,
  destroy
};
