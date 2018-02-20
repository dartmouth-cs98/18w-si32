import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../layout/link";

import MatchList from "../matches/MatchList";
import BotList from "../bots/BotList";
import GroupList from "../groups/GroupList";
import groupSearchbar from "../groups/groupSearchbar";

import { MainTitle, SubTitle } from "../dashboard/titles";

import { fetchUsers, fetchUser, followUser, unfollowUser } from "../../data/user/userActions";
import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";
import { getBotsForUser } from "../../data/bot/botSelectors";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null
    };
  }

  componentDidMount() {
    this.props.fetchMatches();
    this.props.fetchBots();
    this.props.fetchUser();
  }

  componentWillReceiveProps(nextProps) {
  }

  didSelectGroup = (selectedGroup) => {
    this.setState({selectedGroup});
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

  renderJoinGroupLink = () => {
    return <button onClick={this.props.joinGroup} disabled={!this.state.selectedGroup}>Join Group</button>;
  }

  renderExploreGroupLink = () => {
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : null;

    if (groupId) {
      return <button><a style={{color: "black", textDecoration: "none"}} href={`/group/${groupId}`} target="_blank">Explore Group</a></button>;
    } else {
      return <button disabled={true}>Explore Group</button>;
    }
  }

  renderGroupActionBox = () => {
    return (
      <div style={styles.groupActionBox}>
        {this.renderJoinGroupLink()}
        {this.renderExploreGroupLink()}
      </div>
    );
  }

  render() {
    if (!this.props.profileUser) return <div></div>;

    return (
      <Page>
        { this.renderFollowLink() }
        <MainTitle>Profile: { this.props.profileUser.username }</MainTitle>
        <SubTitle>Bots</SubTitle>
        <BotList bots={this.props.bots} />

        <SubTitle>Matches</SubTitle>
        <MatchList matches={this.props.matches} />

        <SubTitle>Groups</SubTitle>
        <GroupList groups={this.props.profileUser.groups} />
        {groupSearchbar(this.state.selectedGroup, this.didSelectGroup, {placeholder: "Search for new groups to join"})}
        {this.renderGroupActionBox()}
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
  profileUser: state.users.records[props.id] || {},
  matches: getMatchesForUser(state, props.id),
  bots: getBotsForUser(state, props.id),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

const styles = {
  groupActionBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px"
  },
};
