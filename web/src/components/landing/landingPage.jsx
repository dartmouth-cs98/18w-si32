import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";
import Canvas from "../replay/Canvas";

const game = require("./game.json");

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <div style={styles.wrapper}>
          <Canvas replay={game} />
        </div>
      </Page>
    );
  }
}

const styles = {
  wrapper: {
    padding: "0 15px"
  }
};

export default connect(null, null)(LandingPage);
