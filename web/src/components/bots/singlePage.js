import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { fetchBots } from "../../data/bot/botActions";

class BotSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  render() {
    return (
      <Page>
        <h1>Bot: {this.props.bot.name}</h1>
        <h3>{this.props.id}</h3>
        <p>Version {this.props.bot.version}</p>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = (state, props) => ({
  bot: state.bots.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(BotSinglePage);
