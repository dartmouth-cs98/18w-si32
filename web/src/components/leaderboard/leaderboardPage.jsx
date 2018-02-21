import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../common/link";

import { MainTitle, SubTitle } from "../common/titles";
import { fetchUsers } from "../../data/user/userActions";

const RankedList = ({ users }) => {
  return _.map(users, (u) => (
    <Link key={u._id} href={`/users/${u._id}`}>{u.username} ({u.trueSkill.mu.toFixed(1)})</Link>
  ));
};

class LeaderboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    return (
      <Page>
        <div style={styles.wrapper}>
          <MainTitle>Leaderboard</MainTitle>
          <SubTitle>Global</SubTitle>
          <RankedList users={this.props.users} />

          <SubTitle>People you Follow</SubTitle>
        </div>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(fetchUsers()),
});

const mapStateToProps = state => ({
  users: state.users.records,
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
