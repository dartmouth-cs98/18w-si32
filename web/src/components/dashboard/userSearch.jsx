import React from "react";
import Radium from "radium";
import Color from "color";

import { Input } from "../form";
import Button from "../common/button";
import UserList from "../user/UserList";

import { getUsersForSearch } from "../../data/user/userRoutes";

import {
  colors,
  constants,
} from "../../style";

class UserSearch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      results: [],
    };
  }

  onInputFocus = () => {
    this.setState({
      query: "",
      hasSearched: false,
      results: []
    });
  }

  handleInputChange = (event) => {
    this.setState({
      query: event.target.value,
      newQuery: true,
    });
  }

  doUserQuery = (event) => {
    if (event) event.preventDefault();
    if (this.state.query === "") return;

    this.setState({
      hasSearched: true,
      isSearching: true,
      newQuery: false,
    });

    getUsersForSearch(this.state.query)
      .then(results => {
        this.setState({
          results: results,
          isSearching: false,
        });
      });
  }

  renderUserList() {
    if (!this.state.hasSearched) {
      return null;
    }

    // until they've searched, don't show anything
    if (this.state.isSearching) {
      return <div style={styles.searching}>Searching for users...</div>;
    }

    if (this.state.results.length < 1) {
      return <div style={styles.noResults}>No matching users found :(</div>;
    }

    return <UserList users={this.state.results} />;
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div>Search for Users</div>
        <form style={styles.form} onSubmit={this.doUserQuery}>
          <Input
            name="user-search"
            autoComplete="off"
            placeholder="search by username..."
            type="text"
            value={this.state.query}
            onChange={this.handleInputChange}
            onFocus={this.onInputFocus}
          />
          <input type="submit" style={{display: "none"}} />
          <Button kind="primary" onClick={this.doUserQuery} style={styles.submitButton}>
            Search
          </Button>
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
    height: 38,
    width: 120,
    marginLeft: 10,
  },
  searching: {
    color: colors.medGray,
    marginTop: 5,
    fontSize: constants.fontSizes.small,
  },
  noResults: {
    color: colors.darkGray,
    marginTop: 5,
    fontSize: constants.fontSizes.small,
  },
};

export default Radium(UserSearch);
