import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";

class LeaderboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <div>
          Leaderboard Content
        </div>
      </Page>
    );
  }
}

export default connect(null, null)(LeaderboardPage);
