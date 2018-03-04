import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";
import groupSearchbar from "../groups/groupSearchbar";
import LeaderboardTable from "./LeaderboardTable";

import capitalize from "../../util/capitalize";

import { MainTitle, SubTitle } from "../common/titles";
import { fetchGroupRank } from "../../data/user/userActions";
import { getSessionUser } from "../../data/user/userSelectors";

class LeaderboardPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user._id !== this.props.user._id) {
      const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : null;
      this.props.fetchGroupRank(groupId, nextProps.user._id);
    }
  }

  didSelectGroup = (selectedGroup) => {
    const groupId = selectedGroup ? selectedGroup.value : null;
    this.props.fetchGroupRank(groupId, this.props.user._id);
    this.setState({
      selectedGroup,
    });
  }

  render() {
    const groupLabel = this.state.selectedGroup ? capitalize(this.state.selectedGroup.label) : "Global";
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : "global";
    const userRank = this.props.user.ranks ? this.props.user.ranks[groupId] : null;

    return (
      <Page>
        <div style={styles.wrapper}>
          <MainTitle>Leaderboard</MainTitle>
          <SubTitle>{groupLabel}</SubTitle>
          {groupSearchbar(this.state.selectedGroup, this.didSelectGroup, {placeholder: "Choose A Specific Group"})}
          <span>My Rank: {userRank ? userRank.rank : ""}</span>
          <LeaderboardTable groupId={groupId} />
        </div>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchGroupRank: (groupId, userId) => dispatch(fetchGroupRank(groupId, userId)),
});

const mapStateToProps = state => ({
  user: getSessionUser(state) || state.session.user || {},
});

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px"
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
