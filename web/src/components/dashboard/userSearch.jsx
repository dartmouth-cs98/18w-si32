import React from "react";
import Radium from "radium";
import Color from "color";

import { getUsersForSearch } from "../../data/user/userRoutes";

import Link from "../layout/link";

import { SubTitle } from "./titles";

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
}

class UserSearch extends React.PureComponent {
  constructor(props) {
    super(props)

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
      return (
        <div style={styles.emptyResultsContainer}>
          Results
        </div>
      );
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
    )

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

        {this.renderUserList()}

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
      borderColor: Color(colors.red).lighten(0.7).string(),
      borderStyle: "solid",
      borderWidth: "1px"
    }
  },
  submitButton: {
    width: "20%",
    height: constants.INPUT_HEIGHT,
    backgroundColor: colors.background,
    color: colors.red,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.red,
    borderRadius: "2px",
    ":hover": {
      backgroundColor: colors.red,
      color: colors.background,
      cursor: "pointer"
    }
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
}

export default Radium(UserSearch);
