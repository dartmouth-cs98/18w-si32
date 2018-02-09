import React from "react";
import UniversalRouter from "universal-router";

import history from "./history";
import LoginPage from "./components/user/login";
import RegisterPage from "./components/user/register";
import ProfilePage from "./components/user/profile";
import BotListPage from "./components/bots/list";
import BotCreatePage from "./components/bots/create";

// TODO split these out into modules?
const routes = [
  {
    path: "",
    action: () => <h1>Home</h1>
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
        action: () => <BotListPage />,
      },
      {
        path: "/create",
        action: () => <BotCreatePage />
      }
    ],
  },
];

const router = new UniversalRouter(routes);

// start listening to history changes and call renderFn with new route contents
const initRouter = renderFn => {
  // on changes, resolve the route and tell the function
  history.listen((location, action) => {
    router.resolve(location).then(html => renderFn(html));
  });

  // render the view we started on
  router.resolve(history.location).then(html => renderFn(html));
};

// helper component to use history push to navigate
class Link extends React.PureComponent {
  clicked = event => {
    // if not attempting to open in new window or something else funky,
    // do nothing
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    history.push(this.props.href);
    event.preventDefault();
  };

  render() {
    return (
      <a onClick={this.clicked} {...this.props}>
        {this.props.children}
      </a>
    );
  }
}

export { Link, history, initRouter };