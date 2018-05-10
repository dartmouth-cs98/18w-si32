import "babel-polyfill";
import React from "react";
import { connect } from "react-redux";
import { initRouter } from "./router";
import mixpanel from "mixpanel-browser";
import config from "./config";

const { MIXPANEL_TOKEN } = config;

import { setUserForSession } from "./data/session/sessionActions";

import Navigation from "./components/layout/navigation";

import socket from "./util/socket";

class App extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    initRouter(this.updateMain);
    if (this.props.userId && !this.props.user) {
      // if a session is active, but the user is not in state
      this.props.setUserForSession(this.props.userId);
    }

    // default to just a dummy dev token
    mixpanel.init(MIXPANEL_TOKEN || "51172a1996a5e6e2714b3b2050c446d8");
  }

  updateMain = (html) => {
    // store the new view (not in state since it could be large)
    this.main = html;

    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Navigation />
        <div id="main">{this.main}</div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setUserForSession: (userId) => dispatch(setUserForSession(userId))
});

const mapStateToProps = state => ({
  user: state.session.user,
  userId: state.session.userId,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
