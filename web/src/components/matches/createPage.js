import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Page from "../layout/page";
import { createMatch } from "../../data/match/matchActions";
import { fetchBots } from "../../data/bot/botActions";

const MatchBotList = ({ bots, selectedBotIds, toggleBot }) => (
  _.map(bots, (b) => (
    <div onClick={() => toggleBot(b._id)} key={b._id}>
      {b.name} {selectedBotIds[b._id] ? "SELECTED" : "" }
    </div>
  ))
);

class MatchCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { bots: {} };
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  toggleBot = (botId) => {
    this.setState({
      bots: {
        ...this.state.bots,
        [botId]: !this.state.bots[botId],
      }
    });
  }

  create = () => {
    this.props.create(Object.keys(this.state.bots));
  }

  render() {
    return (
      <Page>
        <h1>Create a Match</h1>
        <MatchBotList toggleBot={this.toggleBot} bots={this.props.bots} selectedBotIds={this.state.bots} />
        <input type="button" value="create" onClick={this.create} />
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  create: (bots) => dispatch(createMatch(bots)),
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = state => ({
  bots: state.bots.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchCreatePage);
