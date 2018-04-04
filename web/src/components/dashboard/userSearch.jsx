import _ from "lodash";
import React from "react";
import Radium from "radium";
import Color from "color";

import Link from "../common/link";
import { SubTitle } from "../common/titles";

import { getUsersForSearch } from "../../data/user/userRoutes";

import {
  colors,
  constants,
} from "../../style";

const UserSearchEntry = ({ u, r }) => {
  return (
    <div style={styles.searchEntryContainer}>
      <div style={styles.searchEntryNumeric}>{r}</div>
      <div style={styles.searchEntryString}>
        <Link key={u._id} href={`/users/${u._id}`}>{u.username}</Link>
      </div>
      <div style={styles.searchEntryNumeric}>{r}</div>
    </div>
  );
};

class UserSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      results: [],
    };
  }

  handleInputChange = (event) => {
    this.setState({
      query: event.target.value
    });
  }

  doUserQuery = (event) => {
    event.preventDefault();
    if (this.state.query === "") return;
    getUsersForSearch(this.state.query)
      .then(results => {
        this.setState({
          results: results
        });
      });
  }

  renderUserList() {
    if (this.state.results.length < 1) {
      return null;
    }

    const items = _.map(this.state.results, (u, i) =>
      <UserSearchEntry key={u._id} u={u} r={i} />
    );

    return (
      <div>
        <div style={styles.searchResultsHeaderContainer}>
          <span style={styles.searchEntryNumeric}>Rank</span>
          <span style={styles.searchEntryString}>Username</span>
          <span style={styles.searchEntryNumeric}>Rating</span>
        </div>
        {items}
      </div>
    );

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
            onChange={this.handleInputChange} />
          <input type="submit"
             value="Search"
             style={styles.submitButton}/>
        </form>

        {this.renderUserList()}

      </div>
    );
  }
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    width: "85%",
    height: constants.INPUT_HEIGHT,
    fontSize: "16px",
    margin: "10px 0",
    ":focus": {
      borderColor: Color(colors.red).lighten(0.7).string(),
      borderStyle: "solid",
      borderWidth: "1px"
    }
  },
  submitButton: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.blue,
    textDecoration: "none",
    borderRadius: "50px",
    boxShadow: "0 2px 5px rgba(0,0,0,.15)",
    padding: "5px 15px",
    height: 30,
    fontSize: constants.fontSizes.small,
    transition: "box-shadow .1s",
    ":hover": {
      boxShadow: "0 3px 5px rgba(0,0,0,.23)",
    },
  },
  emptyResultsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.detail
  },
  searchResultsHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: "5px"
  },
  searchEntryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: "1px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: Color(colors.detail).lighten(0.7).string(),
    padding: "5px 0 5px 0",
    marginBottom: "5px"
  },
  searchEntryNumeric: {
    width: "15%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  searchEntryString: {
    width: "65%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderStyle: "hidden solid hidden solid",
    borderWidth: "1px",
    borderColor: Color(colors.detail).lighten(0.7).string(),
    paddingLeft: "2.5%",
    paddingRight: "2.5%",
  }
};

export default Radium(UserSearch);
