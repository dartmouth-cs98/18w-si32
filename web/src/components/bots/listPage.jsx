import React from "react";
import { connect } from "react-redux";

import { Page, Link, Wrapper } from "../layout";
import { fetchBots } from "../../data/bot/botActions";

import BotList from "./BotList";

class BotListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <h1>Your Bots</h1>
          <Link href="/bots/create">Create a new bot</Link>
          <BotList bots={this.props.bots} />
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = state => ({
  bots: state.bots.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(BotListPage);
