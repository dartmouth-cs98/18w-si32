import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../layout/link";

import MatchList from "../matches/MatchList";
import BotList from "../bots/BotList";

import { MainTitle, SubTitle } from "../dashboard/titles";

import { fetchUsers, followUser, unfollowUser } from "../../data/user/userActions";
import { getUser } from "../../data/user/userRoutes";
import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      profileUser: null
    };
  }

  componentDidMount() {
    getUser(this.props.id)
      .then(user => {
        this.setState({ profileUser: user });
      });
    this.props.fetchMatches();
    this.props.fetchBots();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      getUser(nextProps.id)
        .then(user => {
          this.setState({ profileUser: user });
        })
    }
  }

  renderFollowLink = () => {
    if (this.props.sessionUser._id === this.state.profileUser._id) {
      // if session user is identical to profile user, this is our profile
      return;
    } else if (_.includes(this.props.sessionUser.following, this.state.profileUser._id)) {
      // if the session user is currently following the profile user
      return <Link onClick={this.props.unfollowUser}>Unfollow</Link>;
    } else {
      // if the session user is not currently following the profile user
      return <Link onClick={this.props.followUser}>Follow</Link>;
    }
  }

  render() {
    if (!this.state.profileUser) return <div></div>;

    return (
      <Page>
        { this.renderFollowLink() }
        <MainTitle>Profile: { this.state.profileUser.username }</MainTitle>
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
});

const mapStateToProps = (state, props) => ({
  sessionUser: state.session.user,
  matches: getMatchesForUser(state, props.id),
  bots: getBotsForUser(state, props.id),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
