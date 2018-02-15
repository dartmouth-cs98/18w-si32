import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <div style={styles.wrapper}>
          hello world
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
