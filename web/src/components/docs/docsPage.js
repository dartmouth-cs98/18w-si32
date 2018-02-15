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
        <div>
          Docs
        </div>
      </Page>
    );
  }
}

export default connect(null, null)(DocsPage);
