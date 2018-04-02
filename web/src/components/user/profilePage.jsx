import React from "react";
import Radium from "radium";
import _ from "lodash";
import { connect } from "react-redux";

import { Page, Wrapper, TitleBar } from "../layout";
import Button from "../common/button";

import MatchList from "../matches/MatchList";
import GroupList from "../groups/GroupList";
import groupSearchbar from "../groups/groupSearchbar";

import { SubTitle } from "../common/titles";

import { fetchRankings, fetchUser, followUser, unfollowUser, joinGroup, leaveGroup } from "../../data/user/userActions";
import { fetchBots } from "../../data/bot/botActions";
import { fetchMatches } from "../../data/match/matchActions";
import { getMatchesForUser } from "../../data/match/matchSelectors";
//import { getBotsForUser } from "../../data/bot/botSelectors";
import { colors, constants } from "../../style";

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
      return <Button
                kind="primary"
                style={styles.followingButton} 
                onClick={this.props.unfollowUser}
                hoverContent="Unfollow"
              >
                Following
              </Button>;
    } else {
      // if the session user is not currently following the profile user
      return <Button kind="primary" style={{padding: "0 40px", height: 40}} onClick={this.props.followUser}>Follow</Button>;
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
    return <Button kind="secondary" style={{marginRight: 20}} onClick={this.joinGroup} disabled={!this.state.selectedGroup}>Join group</Button>;
  }

  renderExploreGroupLink = () => {
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : null;
    return <Button disabled={!groupId} kind="secondary" href={`/leaderboards/${groupId}`}>Explore group &rarr;</Button>;
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
    if (!this.props.profileUser || !_.get(this.props.profileUser, "ranks.global")) return <div></div>;

    const globalRank = this.props.profileUser.ranks ? this.props.profileUser.ranks.global : "...";

    return (
      <Page>
        <Wrapper>
          <TitleBar title={this.props.profileUser.username} right={this.renderFollowLink()} />
          <div style={styles.statsRow}>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <div style={styles.statTitle}>Current Rating</div>
                <p style={styles.statBody}>{this.props.profileUser.trueSkill.mu.toFixed(1)}</p>
              </div>

              <div style={styles.stat}>
                <div style={styles.statTitle}>Global Rank</div>
                <p style={styles.statBody}>{globalRank.rank}/{globalRank.of}</p>
              </div>
            </div>

            <div style={styles.skillGraphWrap}>
            </div>

          </div>

          <div style={styles.secondary}>
            <div style={styles.secondary.main}>
              <SubTitle>Matches</SubTitle>
              <MatchList matches={this.props.matches} />
            </div>
            <div style={styles.secondary.sidebar}>
              <SubTitle>
                <div style={styles.groupTitle}>
                  <span style={{marginRight: 20}}>Groups</span>
                  { this.props.isOwnProfile ? <Button kind="secondary" href="/groups/create">+ Create Group</Button> : null }
                </div>
              </SubTitle>
              <div style={styles.groupList}>
                <GroupList groups={this.props.profileUser.groups} ranks={this.props.profileUser.ranks} leaveGroup={this.props.leaveGroup} />
              </div>
              { this.props.isOwnProfile ? groupSearchbar(this.state.selectedGroup, this.didSelectGroup, {placeholder: "Search for new groups to join"}) : null }
              { this.props.isOwnProfile ? this.renderGroupActionBox() : null }
            </div>
          </div>


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
  isOwnProfile: (state.session.user || {})._id === props.id,
  // bots: getBotsForUser(state, props.id),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ProfilePage));

const styles = {
  groupActionBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px"
  },
  followingButton: {
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.medGray,
    width: 150,
    height: 40,
    ":hover": {
      background: "transparent",
      borderWidth: 2,
      color: colors.medGray,
    },
  },
  statTitle: {
    color: colors.red,
    fontSize: constants.fontSizes.smaller,
    textTransform: "uppercase",
  },
  statBody: {
    color: colors.darkGray,
    fontSize: constants.fontSizes.larger,
    marginTop: 5,
  },
  stat: {
    margin: "15px 0",
  },
  secondary: {
    display: "flex",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 20,
    marginTop: 30,
    main: {
      width: "60%",
      marginRight: 50,
      flexGrow: 0,
    },
    sidebar: {
      flex: 1,
    },
  },
  groupList: {
    marginBottom: 15,
    marginTop: 5,
  },
  groupTitle: {
    display: "flex",
    alignItems: "center",
  },
};
