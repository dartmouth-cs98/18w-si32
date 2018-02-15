import React from "react";
import Radium from "radium";
import { connect } from "react-redux";

import Link from "./link";
import history from "../../history";
import { logout } from "../../data/session/sessionActions";

import {
  NAVBAR_HEIGHT,
  PALETTE_WHITE,
  PALETTE_RED,
} from "../../style/constants";

class Navigation extends React.PureComponent {
  logout = () => {
    this.props.logout().then(() => {
      history.push("/");
    });
  }

  renderUserArea() {
    if (this.props.isLoggedIn) {
      return (
        <div style={styles.userAreaContainer}>
          <Link style={styles.link} href="/profile">
            Profile
          </Link>
          <Link style={styles.link} href="#" onClick={this.logout}>
            Logout
          </Link>
        </div>
      );
    } else {
      return (
        <div style={styles.userAreaContainer}>
          <Link style={styles.link} href="/register">
            Register
          </Link>
          <Link style={styles.link} href="/login">
            Log in
          </Link>
        </div>
      );
    }
  }

  renderMainNav() {
    if (this.props.isLoggedIn) {
      return (
        <div style={styles.mainNav}>
          <Link style={styles.link} href="/bots">Bots</Link>
          <Link style={styles.link} href="/matches">Matches</Link>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <nav style={styles.wrapper}>
        <div style={styles.mainNav}>
          <Link style={{...styles.link, ...styles.homeLink}} href="/">SI32</Link>
          {this.renderMainNav()}
        </div>

        {this.renderUserArea()}
      </nav>
    );
  }
}

const styles = {
  wrapper: {
    height: NAVBAR_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
    backgroundColor: PALETTE_WHITE
  },
  mainNav: {
    display: "flex",
    alignItems: "center"
  },
  userAreaContainer: {
    display: "flex",
    flexDirection: "row"
  },
  link: {
    color: PALETTE_RED,
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: 300,
    textDecoration: "none",
    textTransform: "uppercase",
    margin: "0 10px",
    ":hover": {
      cursor: "pointer"
    }
  },
  homeLink: {
    fontSize: 30
  }
};

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.token
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Navigation));
