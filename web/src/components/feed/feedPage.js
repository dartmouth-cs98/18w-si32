import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";

class FeedPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Page>
        <div>
          Feed Content
        </div>
      </Page>
    );
  }
}

export default connect(null, null)(FeedPage);