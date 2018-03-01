import React from "react";
import { connect } from "react-redux";

import history from "../../history";

import Page from "../layout/page";
import LandingCanvas from "./LandingCanvas";

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      replay: null,
      frame: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    // manually redirect from landing page to dash if logged in
    if (nextProps.user) {
      history.push("/dashboard");
    }
  }

  render() {
    return (
      <Page>
        <LandingCanvas />
      </Page>
    );
  }
}

const styles = {
  wrapper: {
    padding: "0 15px"
  }
};

const mapStateToProps = state => ({
  user: state.session.user,
  userId: state.session.userId,
});

export default connect(mapStateToProps, null)(LandingPage);
