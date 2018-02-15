import React from "react";
import { connect } from "react-redux";
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
    return (
      <Page>
        <h1>Dashboard</h1>
        <h3>Your user id: {this.state.user}</h3>
      </Page>
    );
  }
}

export default connect(null, null)(DashboardPage);
