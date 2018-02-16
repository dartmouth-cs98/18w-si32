import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Link from "../layout/link";
import Page from "../layout/page";

import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getProfile } from "../../data/user/userActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

import { MainTitle, SubTitle } from "./titles";

const DashBotList = ({ bots }) => {
  const items = _.map(bots, b =>
    <div key={b._id}>
      <Link href={`/bots/${b._id}`}>{b.name}</Link>
    </div>
  );

  return <div>{items}</div>;
};

const DashMatchList = ({ matches }) => {
  const items = _.map(matches, m =>
    <div key={m._id}>
      <Link href={`/matches/${m._id}`}>{m.status} {m._id}</Link>
    </div>
  );

  return <div>{items}</div>;
};



class DashboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    getProfile().then(profile => {
      this.setState(profile);
    });
  }

  componentDidMount() {
    this.props.fetchBots(this.props.userId);
    this.props.fetchMatches();
  }

  render() {
    return (
      <Page>
        <div style={{paddingTop: 20}}>
          <MainTitle>Dashboard</MainTitle>
          <h3>Your user id: {this.state.user}</h3>

          <SubTitle>Your Bots</SubTitle>
          <DashBotList bots={this.props.bots} />
          <Link href="/bots/create">+ Create a new bot</Link>

          <SubTitle>Your Latest Matches</SubTitle>
          <DashMatchList matches={this.props.matches} />
          <Link href="/matches">View all &rarr;</Link>
        </div>
      </Page>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  fetchBots: (userId) => dispatch(fetchBots(userId)),
  fetchMatches: () => dispatch(fetchMatches()),
});

const mapStateToProps = state => ({
  userId: state.session.userId,
  matches: getMatchesForUser(state, state.session.userId),
  bots: getBotsForUser(state, state.session.userId),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
