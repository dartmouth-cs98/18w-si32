import React from "react";
import { connect } from "react-redux";
import { initRouter } from "./router";

import { setUserForSession } from "./data/session/sessionActions";

import Navigation from "./components/layout/navigation";

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
