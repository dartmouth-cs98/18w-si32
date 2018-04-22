import React from "react";
import UniversalRouter from "universal-router";

import history from "./history";

import LandingPage from "./components/landing/landingPage";

import LoginPage from "./components/user/loginPage";
import ProfilePage from "./components/user/profilePage";
import RegisterPage from "./components/user/registerPage";
import DashboardPage from "./components/dashboard/dashboardPage";

import LeaderboardPage from "./components/leaderboard/leaderboardPage";
import ReplayPage from "./components/replay/replayPage";
import DownloadPage from "./components/download/downloadPage";

import BotListPage from "./components/bots/listPage";
import BotSinglePage from "./components/bots/singlePage";
import BotCreatePage from "./components/bots/createPage";

import MatchListPage from "./components/matches/listPage";
import MatchCreatePage from "./components/matches/createPage";
import MatchSinglePage from "./components/matches/singlePage";

import GroupCreatePage from "./components/groups/createPage";
import GroupSinglePage from "./components/groups/singlePage";


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
    path: "/dashboard",
    action: () => <DashboardPage />
  },
  {
    path: "/downloads",
    action: () => <DownloadPage />
  },
  {
    path: "/leaderboards",
    children: [
      {
        path: "",
        action: () => <LeaderboardPage id={"global"} />
      },
      {
        path: "/:id",
        action: ({ params: { id }}) => <LeaderboardPage id={id}/>
      }
    ],
  },
  {
    path: "/replay",
    action: () => <ReplayPage />
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
  {
    path: "/users",
    children: [
      {
        path: "",
        action: () => <LeaderboardPage />,
      },
      {
        path: "/:id",
        action: ({ params: { id }}) => <ProfilePage id={id} />
      },
    ],
  },
  {
    path: "/groups",
    children: [
      {
        path: "/create",
        action: () => <GroupCreatePage />,
      },
      {
        path: "/:id",
        action: ({ params: { id }}) => <GroupSinglePage id={id} />
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
    window.scrollTo(0,0); // on every url change, reset to the top
    router.resolve(location).then(html => renderFn(html));
  });
  /* eslint-disable no-unused-vars */

  // render the view we started on
  router.resolve(history.location).then(html => renderFn(html));
};

export { history, initRouter };
