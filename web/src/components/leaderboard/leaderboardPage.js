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
        <div style={styles.wrapper}>
          <div>Leaderboard Content</div>
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

export default connect(null, null)(LeaderboardPage);
