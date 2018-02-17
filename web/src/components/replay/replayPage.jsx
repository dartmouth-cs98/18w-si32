import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";

class ReplayPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <div>
          Replay Content
        </div>
      </Page>
    );
  }
}

export default connect(null, null)(ReplayPage);
