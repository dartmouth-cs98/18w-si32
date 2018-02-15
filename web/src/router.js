import React from "react";
import UniversalRouter from "universal-router";

import history from "./history";

import LandingPage from "./components/landing/landingPage";

import LoginPage from "./components/user/loginPage";
import RegisterPage from "./components/user/registerPage";
import ProfilePage from "./components/user/profilePage";
import BotListPage from "./components/bots/listPage";
import BotSinglePage from "./components/bots/singlePage";
import BotCreatePage from "./components/bots/createPage";

import MatchListPage from "./components/matches/listPage";
import MatchCreatePage from "./components/matches/createPage";
import MatchSinglePage from "./components/matches/singlePage";

// TODO split these out into modules?
/* eslint-disable react/display-name */
const routes = [
  {
    path: "",
    action: () => <LandingPage />
  },
  {
    path: "/login",
    action: () => <LoginPage />
  },
  {
    path: "/register",
    action: () => <RegisterPage />
  },
  {
    path: "/profile",
    action: () => <ProfilePage />
  },
  {
    path: "/bots",
    children: [
      {
        path: "",
        action: () => <BotListPage />
      },
      {
        path: "/create",
        action: () => <BotCreatePage />
      },
      {
        path: "/:id",
        action: ({ params: { id }}) => <BotSinglePage id={id}/>
      }
    ],
  },
  {
    path: "/matches",
    children: [
      {
        path: "",
        action: () => <MatchListPage />,
      },
      {
        path: "/create",
        action: () => <MatchCreatePage />
      },
      {
        path: "/:id",
        action: ({ params: { id }}) => <MatchSinglePage id={id} />
      },
    ],
  },

];

/* eslint-enable react/display-name */

const router = new UniversalRouter(routes);

// start listening to history changes and call renderFn with new route contents
const initRouter = renderFn => {
  // on changes, resolve the route and tell the function

  /* eslint-disable no-unused-vars */
  history.listen((location, action) => {
    console.log(location)
    router.resolve(location).then(html => renderFn(html));
  });
  /* eslint-disable no-unused-vars */

  // render the view we started on
  router.resolve(history.location).then(html => renderFn(html));
};

export { history, initRouter };
