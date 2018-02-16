import React from "react";
import { connect } from "react-redux";

import Link from "../layout/link";
import Page from "../layout/page";

import { getProfile } from "../../data/user/userActions";

class DashboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    getProfile().then(profile => {
      this.setState(profile);
    });
  }

  render() {

    // NOTE: moved links to bots and matches here so that they could still be accessed

    return (
      <Page>
        <div style={styles.wrapper}>
          <h1>Dashboard Content</h1>
          <h3>Your user id: {this.state.user}</h3>
          <br />
          <Link href="/bots">Bots</Link>
          <br />
          <Link href="/matches">Matches</Link>
        </div>
      </Page>
    );
  }
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }
};

export default connect(null, null)(DashboardPage);
