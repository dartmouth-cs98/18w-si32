import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../common/link";
import { Wrapper } from "../layout/wrappers";

import MatchList from "../matches/MatchList";
import BotList from "../bots/BotList";
import GroupList from "../groups/GroupList";
import groupSearchbar from "../groups/groupSearchbar";


import { MainTitle, SubTitle } from "../common/titles";

import { fetchRankings, fetchUser, followUser, unfollowUser, joinGroup, leaveGroup } from "../../data/user/userActions";
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
    // this.props.fetchRankings();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchUser();
    }
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

  joinGroup = () => {
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : null;

    if (groupId) {
      this.props.joinGroup(this.state.selectedGroup.value);
      this.setState({
        selectedGroup: null,
      });
    }
  }

  renderJoinGroupLink = () => {
    return <button onClick={this.joinGroup} disabled={!this.state.selectedGroup}>Join Group</button>;
  }

  renderExploreGroupLink = () => {
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : null;

    if (groupId) {
      return <button><a style={{color: "black", textDecoration: "none"}} href={`/leaderboards/${groupId}`} target="_blank">Explore Group</a></button>;
    } else {
      return <button disabled={true}>Explore Group</button>;
    }
  }

  renderGroupActionBox = () => {
    return (
      <div style={styles.groupActionBox}>
        {this.renderJoinGroupLink()}
        {this.renderExploreGroupLink()}
        <button><Link style={{color: "black", textDecoration: "none"}} href="/groups/create">Create Group</Link></button>;
      </div>
    );
  }

  render() {
    if (!this.props.profileUser || !_.get(this.props.profileUser, "ranks.global")) return <div></div>;

    const globalRank = this.props.profileUser.ranks ? this.props.profileUser.ranks.global : "...";

    return (
      <Page>
        <Wrapper>
          { this.renderFollowLink() }
          <MainTitle>Profile: { this.props.profileUser.username }</MainTitle>
          <SubTitle>Rating</SubTitle>
          <p>{this.props.profileUser.trueSkill.mu}</p>

          <SubTitle>Global Rank</SubTitle>
          <p>{globalRank.rank}/{globalRank.of}</p>

          <SubTitle>Bots</SubTitle>
          <BotList bots={this.props.bots} />

          <SubTitle>Matches</SubTitle>
          <MatchList matches={this.props.matches} />

          <SubTitle>Groups</SubTitle>
          <GroupList groups={this.props.profileUser.groups} ranks={this.props.profileUser.ranks} leaveGroup={this.props.leaveGroup} />
          {groupSearchbar(this.state.selectedGroup, this.didSelectGroup, {placeholder: "Search for new groups to join"})}
          {this.renderGroupActionBox()}
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  followUser: () => dispatch(followUser(props.id)),
  unfollowUser: () => dispatch(unfollowUser(props.id)),
  joinGroup: (groupId) => dispatch(joinGroup(groupId)),
  leaveGroup: (groupId) => dispatch(leaveGroup(groupId)),
  fetchMatches: () => dispatch(fetchMatches(props.id)),
  fetchRankings: () => dispatch(fetchRankings(props.id)),
  fetchBots: () => dispatch(fetchBots(props.id)),
  fetchUser: () => dispatch(fetchUser(props.id, true)),
});

const mapStateToProps = (state, props) => ({
  sessionUser: state.session.user || {},
  profileUser: state.users.records[props.id],
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
