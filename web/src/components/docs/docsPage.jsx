import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";

class DocsPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <div style={styles.wrapper}>
          <div>Docs Content</div>
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
    paddingTop: "20px"
  }
};

export default connect(null, null)(DocsPage);
