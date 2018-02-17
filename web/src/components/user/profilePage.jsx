import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../layout/link";

import MatchList from "../matches/MatchList";
import BotList from "../bots/BotList";

import { MainTitle, SubTitle } from "../dashboard/titles";

import { fetchUsers, followUser, unfollowUser } from "../../data/user/userActions";
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

  renderFollowLink = () => {
    if (_.includes(this.props.curUser.following, this.props.user._id)) {
      return <Link onClick={this.props.unfollowUser}>Unfollow</Link>;
    }

    return <Link onClick={this.props.followUser}>Follow</Link>;
  }

  render() {
    return (
      <Page>
        { this.renderFollowLink() }
        <MainTitle>Profile: { this.props.user.username }</MainTitle>
        <SubTitle>Bots</SubTitle>
        <BotList bots={this.props.bots} />

        <SubTitle>Matches</SubTitle>
        <MatchList matches={this.props.matches} />

      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  followUser: () => dispatch(followUser(props.id)),
  unfollowUser: () => dispatch(unfollowUser(props.id)),
  fetchUsers: () => dispatch(fetchUsers()),              // TODO this should load only this user
  fetchMatches: () => dispatch(fetchMatches(props.id)),
  fetchBots: () => dispatch(fetchBots(props.id)),
});

const mapStateToProps = (state, props) => ({
  curUser: state.users.records[state.session.userId] || {},
  user: state.users.records[props.id] || {},
  matches: getMatchesForUser(state, props.id),
  bots: getBotsForUser(state, props.id),
});


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
