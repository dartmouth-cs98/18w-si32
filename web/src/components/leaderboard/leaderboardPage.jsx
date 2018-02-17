import React from "react";
import _ from "lodash";
import { connect } from "react-redux";

import Page from "../layout/page";
import Link from "../layout/link";

import { MainTitle, SubTitle } from "../dashboard/titles";
import { fetchUsers } from "../../data/user/userActions";

const RankedList = ({ users }) => {
  return _.map(users, (u) => (
    <Link key={u._id} href={`/users/${u._id}`}>{u.username}</Link>
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
        <MainTitle>Leaderboard</MainTitle>
        <SubTitle>Global</SubTitle>
        <RankedList users={this.props.users} />

        <SubTitle>People you Follow</SubTitle>

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


export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
