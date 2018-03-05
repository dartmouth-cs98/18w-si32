import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";
import groupSearchbar from "../groups/groupSearchbar";
import LeaderboardTable from "./LeaderboardTable";

import capitalize from "../../util/capitalize";
import history from "../../history";

import TitleBar from "../layout/TitleBar";
import { getSessionUser } from "../../data/user/userSelectors";
import { fetchGroup } from "../../data/group/groupActions";
import { setSelectedGroup } from "../../data/leaderboard/leaderboardActions";
import { joinGroup, leaveGroup, fetchGroupRank } from "../../data/user/userActions";

class LeaderboardPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null,
    };
  }

  componentWillMount() {
    const groupId = this.props.id || "global";
    const groupLabel = groupId === "global" ? "Global" : null;

    this.props.fetchGroupRank(groupId, this.props.user._id);

    if (groupId && groupId !== "global") {
      this.props.fetchGroup();
    }

    this.props.setSelectedGroup(groupId, groupLabel);
    this.setState({
      selectedGroup: {
        value: groupId,
        label: groupLabel,
      }
    });
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
      this.props.setSelectedGroup(this.props.selectedGroup.id, label);
    }

  }

  didSelectGroup = (selectedGroup) => {
    const groupId = selectedGroup ? selectedGroup.value : "global";
    const label = selectedGroup ? selectedGroup.label : "Global";
    this.props.setSelectedGroup(groupId, label);
    history.push(`/leaderboards/${groupId}`);
  }

  joinGroup = () => {
    this.props.joinGroup(this.props.selectedGroup.id);
  }

  leaveGroup = () => {
    this.props.leaveGroup(this.props.selectedGroup.id);
  }

  getRightTitleOptions() {
    if (!this.props.selectedGroup || !this.props.selectedGroup.id || this.props.selectedGroup.id === "global") {
      return {};
    }

    let userInGroup = false;
    if (this.props.user.groups) {
      const groupIds = this.props.user.groups.map(g => g._id);
      userInGroup = groupIds.includes(this.props.selectedGroup.id);
    }

    const inGroupOptions = {
      right: "Member",
      buttonLabel: "Leave Group",
      buttonAction: this.leaveGroup,
    };

    const notInGroupOptions = {
      right: "Not A Member",
      buttonLabel: "Join Group",
      buttonAction: this.joinGroup,
    };

    return userInGroup ? inGroupOptions : notInGroupOptions;
  }

  render() {
    const groupLabel = this.props.selectedGroup ? capitalize(this.props.selectedGroup.name || "Loading...") : "Global";
    const groupId = this.props.selectedGroup ? this.props.selectedGroup.id : "global";
    const userRank = this.props.user.ranks ? this.props.user.ranks[groupId] : null;

    const titleOptions = this.getRightTitleOptions();

    return (
      <Page>
        {groupSearchbar({value: groupId, label: groupLabel}, this.didSelectGroup, {placeholder: "Choose A Specific Group"})}
        <TitleBar
          title={groupLabel}
          right={titleOptions.right}
          buttonLabel={titleOptions.buttonLabel}
          buttonAction={titleOptions.buttonAction}
        />
        <span>My Rank: {userRank ? userRank.rank: ""}</span>
        <LeaderboardTable groupId={groupId} />
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
  selectedGroup: state.leaderboards.selectedGroup || {id: "global", name: "Global"},
  group: state.groups.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
