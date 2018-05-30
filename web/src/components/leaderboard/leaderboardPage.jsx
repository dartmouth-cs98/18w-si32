import React from "react";
import Radium from "radium";
import { connect } from "react-redux";

import Page from "../layout/page";
import { Wrapper } from "../layout/wrappers";
import Button from "../common/button";
import groupSearchbar from "../groups/groupSearchbar";
import LeaderboardTable from "./LeaderboardTable";

import capitalize from "../../util/capitalize";
import history from "../../history";

import TitleBar from "../layout/TitleBar";
import { getSessionUser } from "../../data/user/userSelectors";
import { fetchGroup } from "../../data/group/groupActions";
import { setSelectedGroup } from "../../data/leaderboard/leaderboardActions";
import { joinGroup, leaveGroup, fetchGroupRank } from "../../data/user/userActions";
import { colors, constants } from "../../style";

class LeaderboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const groupId = this.props.id || "global";
    const groupLabel = groupId === "global" ? "Global" : null;

    this.props.fetchGroupRank(groupId, this.props.user._id);

    if (groupId && groupId !== "global") {
      this.props.fetchGroup();
    }

    this.props.setSelectedGroup(groupId, groupLabel);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user._id !== this.props.user._id) {
      const groupId = this.props.selectedGroup ? this.props.selectedGroup.id : null;
      this.props.fetchGroupRank(groupId, nextProps.user._id);
    }

    if (nextProps.id !== this.props.id) {
      this.props.fetchGroupRank(nextProps.id, this.props.user._id);
      if (nextProps.id !== "global") {
        this.props.fetchGroup(nextProps.id);
      }
    }

    if (nextProps.group.name !== this.props.group.name) {
      const label = nextProps.id === "global" ? "Global" : nextProps.group.name;
      this.props.setSelectedGroup(nextProps.id, label);
    }

  }

  didSelectGroup = (selectedGroup) => {
    const groupId = selectedGroup ? selectedGroup.value : "global";
    // const label = selectedGroup ? selectedGroup.label : "Global";
    // this.props.setSelectedGroup(groupId, label);
    history.push(`/leaderboards/${groupId}`);
  }

  joinGroup = () => {
    this.props.joinGroup(this.props.selectedGroup.id);
  }

  leaveGroup = () => {
    this.props.leaveGroup(this.props.selectedGroup.id);
  }

  renderButton = (group) => {
    if (group.isGlobal) {
      return null;
    }
    if (group.userInGroup) {
      return <Button
                kind="primary"
                style={styles.memberButton}
                onClick={this.leaveGroup}
                hoverContent="Leave Group"
              >
                Member 
              </Button>;
    } else {
      return <Button kind="primary" style={{padding: "0 40px", height: 40}} onClick={this.joinGroup}>Join Group</Button>;
    }
  }

  getRightTitleOptions() {
    if (!this.props.group || !this.props.group._id || this.props.group._id === "global") {
      return { isGlobal: true };
    }

    let userInGroup = false;
    if (this.props.user.groups) {
      const groupIds = this.props.user.groups.map(g => g._id);
      userInGroup = groupIds.includes(this.props.group._id);
    }

    return { isGlobal: false, userInGroup };
  }

  render() {
    let groupLabel = this.props.group ? capitalize(this.props.group.name || "Loading...") : "Global";
    const groupId = this.props.group ? this.props.group._id : "global";
    const userRank = this.props.user.ranks ? this.props.user.ranks[groupId] : null;

    const groupInfo = this.getRightTitleOptions();
    const button = this.renderButton(groupInfo);

    const title = <div>
      { groupLabel }
      <span style={styles.rank}>
        <span style={styles.rank.title}>Rank:</span>
        <span style={styles.rank.rank}>{_.get(userRank, "rank", "-")}</span>
        /
        { _.get(userRank, "of", "-") }
        </span>
      </div>;

    return (
      <Page>
        <Wrapper style={styles.selectWrapper} innerStyle={styles.inner}>
          <div style={styles.selectTitle}>Select a group to view your ranking:</div>
          {groupSearchbar({value: groupId, label: groupLabel}, this.didSelectGroup, {showGlobal: true, placeholder: "Choose A Specific Group"})}
        </Wrapper>
        <Wrapper>
          <TitleBar
            title={title}
            right={button}
          />
          <LeaderboardTable groupId={groupId} />
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchGroup: (id) => dispatch(fetchGroup(id || props.id)),
  fetchGroupRank: (groupId, userId) => dispatch(fetchGroupRank(groupId, userId)),
  joinGroup: (id) => dispatch(joinGroup(id)),
  leaveGroup: (id) => dispatch(leaveGroup(id)),
  setSelectedGroup: (groupId, groupName) => dispatch(setSelectedGroup(groupId, groupName))
});

const mapStateToProps = (state, props) => ({
  user: getSessionUser(state) || state.session.user || {},
  selectedGroup: state.leaderboards.selectedGroup || {_id: "global", name: "Global"},
  group: state.groups.records[props.id] || {_id: "global", name: "Global"},
});

const styles = {
  selectWrapper: {
    width: "100%",
    backgroundColor: colors.sand,
    paddingTop: 10,
    paddingBottom: 10,
  },
  rank: {
    color: colors.medGray,
    marginLeft: 15,
    fontSize: constants.fontSizes.large,
    position: "relative",
    bottom: 3,
    fontWeight: 300,
    rank: {
      fontWeight: 500,
    },
    title: {
      paddingRight: 5,
    },
  },
  selectTitle: {
    color: colors.medGray,
    marginRight: 15,
  },
  inner: {
    display: "flex",
    alignItems: "center",
  },
  memberButton: {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(LeaderboardPage));
