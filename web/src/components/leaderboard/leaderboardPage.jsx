import React from "react";
import { connect } from "react-redux";

import Page from "../layout/page";
import groupSearchbar from "../groups/groupSearchbar";
import LeaderboardTable from "./LeaderboardTable";

import capitalize from "../../util/capitalize";

import { MainTitle, SubTitle } from "../common/titles";
import { fetchLeaderboard } from "../../data/leaderboard/leaderboardActions";

class LeaderboardPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null,
      page: 0,
    };
  }

  componentDidMount() {
    this.props.fetchLeaderboard(null, 0);
  }

  getSelectedGroupId = () => {
    return this.state.selectedGroup ? this.state.selectedGroup.value : "global";
  }

  didSelectGroup = (selectedGroup) => {
    const groupId = selectedGroup ? selectedGroup.value : null;
    this.props.fetchLeaderboard(groupId, 0);
    this.setState({
      selectedGroup,
      page: 0,
    });
  }

  onPageChange = () => {

  }

  onFetchPage = (state) => {
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : null;
    this.props.fetchLeaderboard(groupId, state.page);
  }

  render() {
    const groupLabel = this.state.selectedGroup ? capitalize(this.state.selectedGroup.label) : "Global";
    const groupId = this.state.selectedGroup ? this.state.selectedGroup.value : "global";
    const leaderboard = this.props.leaderboards[groupId] || {users: []};
    const users = leaderboard.users;
    const numPages = leaderboard.numPages;

    return (
      <Page>
        <div style={styles.wrapper}>
          <MainTitle>Leaderboard</MainTitle>
          <SubTitle>{groupLabel}</SubTitle>
          {groupSearchbar(this.state.selectedGroup, this.didSelectGroup, {placeholder: "Choose A Specific Group"})}
          <LeaderboardTable users={users} totalPages={numPages} loading={false} fetchPage={this.onFetchPage} />
        </div>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchLeaderboard: (groupId, page) => dispatch(fetchLeaderboard(groupId, page)),
});

const mapStateToProps = state => ({
  leaderboards: state.leaderboards.records,
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
