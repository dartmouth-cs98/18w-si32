import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import Color from "color";

import Link from "./link";
import history from "../../history";
import { logout } from "../../data/session/sessionActions";

import {
  NAVBAR_HEIGHT,
  PALETTE_BACKGROUND,
  PALETTE_PRIMARY,
  PALETTE_DETAIL_0,
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
          <Link style={styles.link} href="/docs">Docs</Link>
          <Link style={styles.link} href="/leaderboard">Leaderboard</Link>
          <Link style={styles.link} href="/replay">Replay</Link>
          <Link style={styles.link} href="/bots">Bots</Link>
          <Link style={styles.link} href="/matches">Matches</Link>
        </div>
      );
    } else {
      return (
        <div style={styles.mainNav}>
          <Link style={styles.link} href="/docs">Docs</Link>
          <Link style={styles.link} href="/leaderboard">Leaderboard</Link>
          <Link style={styles.link} href="/replay">Replay</Link>
        </div>
      );
    }
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
    backgroundColor: PALETTE_BACKGROUND,
    borderStyle: "hidden hidden solid hidden",
    borderWidth: "1px",
    borderColor: PALETTE_PRIMARY
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
    color: PALETTE_DETAIL_0,
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: 300,
    textDecoration: "none",
    textTransform: "uppercase",
    margin: "0 10px",
    ":hover": {
      color: Color(PALETTE_PRIMARY).lighten(0.2).string(),
      cursor: "pointer"
    }
  },
  homeLink: {
    color: PALETTE_PRIMARY,
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
