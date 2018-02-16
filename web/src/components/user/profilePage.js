import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../layout/link";

import MatchList from "../matches/MatchList";
import BotList from "../bots/BotList";
import { MainTitle, SubTitle } from "../dashboard/titles";
import { fetchUsers } from "../../data/user/userActions";
import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUsers();
    this.props.fetchMatches();
    this.props.fetchBots();
  }

  render() {
    console.log(this.props.bots);
    return (
      <Page>
        <MainTitle>Profile: { this.props.user.username }</MainTitle>
        <SubTitle>Bots</SubTitle>
        <BotList bots={this.props.bots} />

        <SubTitle>Matches</SubTitle>
        <MatchList matches={this.props.matches} />

      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(fetchUsers()), // TODO this should load only this user
  fetchMatches: () => dispatch(fetchMatches()), // TODO this should only load matches for this user
  fetchBots: () => dispatch(fetchBots()), // TODO this should only load bots for this user
});

const mapStateToProps = (state, props) => ({
  user: state.users.records[props.id] || {},
  matches: getMatchesForUser(state, props.id),
  bots: getBotsForUser(state, props.id),
});


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
