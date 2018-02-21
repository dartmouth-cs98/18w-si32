import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../layout/link";

import MatchList from "../matches/MatchList";
import BotList from "../bots/BotList";

import { MainTitle, SubTitle } from "../dashboard/titles";

import { fetchUsers, fetchUser, followUser, unfollowUser } from "../../data/user/userActions";
import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchMatches();
    this.props.fetchBots();
    this.props.fetchUser();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchUser();
    }
  }

  renderFollowLink = () => {
    if (this.props.sessionUser._id === this.props.profileUser._id) {
      // if session user is identical to profile user, this is our profile
      return;
    } else if (_.includes(this.props.profileUser.followers, this.props.sessionUser._id)) {
      // if the session user is currently following the profile user
      return <Link onClick={this.props.unfollowUser}>Unfollow</Link>;
    } else {
      // if the session user is not currently following the profile user
      return <Link onClick={this.props.followUser}>Follow</Link>;
    }
  }

  render() {
    if (!this.props.profileUser) return <div></div>;

    return (
      <Page>
        { this.renderFollowLink() }
        <MainTitle>Profile: { this.props.profileUser.username }</MainTitle>
        <SubTitle>Score</SubTitle>
        <p>{ this.props.profileUser.trueSkill.mu.toFixed(1) }</p>

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
  fetchMatches: () => dispatch(fetchMatches(props.id)),
  fetchBots: () => dispatch(fetchBots(props.id)),
  fetchUser: () => dispatch(fetchUser(props.id)),
});

const mapStateToProps = (state, props) => ({
  sessionUser: state.session.user || {},
  profileUser: state.users.records[props.id],
  matches: getMatchesForUser(state, props.id),
  bots: getBotsForUser(state, props.id),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
