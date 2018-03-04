import React from "react";
import { connect } from "react-redux";

import history from "../../history";

import { Page, Wrapper, TitleBar } from "../layout";
import { fetchBots } from "../../data/bot/botActions";

import BotList from "./BotList";

class BotListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  createBot = () => {
    history.push("/bots/create");
  }

  render() {
    return (
      <Page>
        <TitleBar
          title="Your Bots"
          buttonLabel="Create a new bot"
          buttonAction={this.createBot}
        />
        <Wrapper>
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
