import React from "react";
import { connect } from "react-redux";

import history from "../../history";

import { Page, Wrapper, TitleBar } from "../layout";
import { fetchBots } from "../../data/bot/botActions";
import { getBotsForUser } from "../../data/bot/botSelectors";

import BotList from "./BotList";

class BotListPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchBots(this.props.userId);
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
          <div style={{clear: "both"}}></div>
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchBots: (userId) => dispatch(fetchBots(userId)),
});

const mapStateToProps = state => ({
  userId: state.session.userId,
  bots: getBotsForUser(state, state.session.userId, { limit: 15 }),
});

export default connect(mapStateToProps, mapDispatchToProps)(BotListPage);
