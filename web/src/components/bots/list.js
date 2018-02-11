import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";

class BotListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <h1>Your Bots</h1>
        <Link href="/bots/create">Create a new bot</Link>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
});

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BotListPage);
