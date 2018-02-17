import React from "react";
import { connect } from "react-redux";
import Radium from "radium";
import Color from "color";

import { fetchUsers } from "../../data/user/userActions";

import Link from "../layout/link";

import { SubTitle } from "./titles";

import {
  colors,
  constants,
} from "../../style";

const UserList = ({ users }) => {
  if (_.size(users) < 1) {
    return <div>No Users Match Your Query</div>;
  }

  const items = _.map(users, u =>
    <Link key={u._id} href={`/users/${u._id}`}>{u.username}</Link>
  );

  return <div>{items}</div>;
};

class UserSearch extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      query: ""
    };
  }

  handleInputChange = (event) => {
    this.setState({
      query: event.target.value
    });
  }

  doUserQuery = (event) => {
    event.preventDefault();
    this.props.fetchUsers(this.state.query);
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <SubTitle>Search for Users</SubTitle>
        <form style={styles.form} onSubmit={this.doUserQuery}>
          <input
            name="user-search"
            key="user-search"
            placeholder="Username"
            type="text"
            style={styles.input}
            value={this.state.query}
            onChange={this.handleInputChange}
          />
          <input type="submit"
               value="Search"
               style={styles.submitButton}
          />
        </form>
        <UserList users={this.props.users} />
      </div>
    );
  }
}

const styles = {
  wrapper: {
    width: "50%",
  },
  form: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    width: "75%",
    height: constants.INPUT_HEIGHT,
    fontSize: "16px",
    margin: "10px 0",
    ":focus": {
      borderColor: Color(colors.primary).lighten(0.7).string(),
      borderStyle: "solid",
      borderWidth: "1px"
    }
  },
  submitButton: {
    width: "20%",
    height: constants.INPUT_HEIGHT,
    backgroundColor: colors.background,
    color: colors.primary,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.primary,
    borderRadius: "2px",
    ":hover": {
      backgroundColor: colors.primary,
      color: colors.background,
      cursor: "pointer"
    }
  },
}

const mapStateToProps = state => ({
  users: state.users.records,
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchUsers: (userQuery) => dispatch(fetchUsers(userQuery)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(UserSearch));
