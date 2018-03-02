import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import Color from "color";

import Link from "../common/link";
import history from "../../history";
import { logout } from "../../data/session/sessionActions";
import Logo from "../common/logo";

import {
  colors,
  constants,
} from "../../style";

// TODO: determine this based on environment var
const DOCS_URL = "http://localhost:4001";

class Navigation extends React.PureComponent {
  logout = () => {
    this.props.logout().then(() => {
      history.push("/");
    });
  }

  openDocs = () => {
    window.open(DOCS_URL, "_blank");
  }

  renderUserArea() {
    if (this.props.isLoggedIn) {
      return (
        <div style={styles.userAreaContainer}>
          <Link style={styles.link} href={`/users/${this.props.userId}`}>
            Profile
          </Link>
          <Link style={styles.link} href="#" onClick={this.logout}>
            Log Out
          </Link>
        </div>
      );
    } else {
      return (
        <div style={styles.userAreaContainer}>
          <Link style={styles.link} href="/login">
            Log In
          </Link>
        </div>
      );
    }
  }

  renderMainNav() {
    return (
      <div style={styles.mainNav}>
        <Link style={styles.link} href="/leaderboard">Leaderboard</Link>
        {/* <Link style={styles.link} href="/feed">Feed</Link> */}

        <Link style={styles.link} href="#" onClick={this.openDocs}>Docs</Link>
        <Link style={styles.link} href="/replay">Replay</Link>
      </div>
    );
  }

  render() {
    const mainLinkDest = this.props.isLoggedIn ? "/dashboard" : "/";

    return (
      <nav style={styles.wrapper}>
        <div style={styles.inner}>
          <div style={styles.mainNav}>
            <Link style={{...styles.link, ...styles.homeLink}} href={mainLinkDest}>
              <Logo style={styles.logo} />
              <span style={styles.logoText}>MONAD</span>
            </Link>
            {this.renderMainNav()}
          </div>

          {this.renderUserArea()}
        </div>
      </nav>
    );
  }
}

const styles = {
  wrapper: {
    width: "100%",
    height: constants.NAVBAR_HEIGHT,
    position: "fixed",
    top: "0",
    left: "0",
    backgroundColor: colors.background,
    borderBottom: `2px solid ${colors.sand}`,
    borderColor: colors.sand,
    zIndex: 1000
  },
  inner: {
    width: constants.BODY_WIDTH,
    height: constants.NAVBAR_HEIGHT,
    margin: "0px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: colors.medGray,
    fontSize: 18,
    fontWeight: 300,
    textDecoration: "none",
    marginLeft: 10,
    marginRight: 10,
    ":hover": {
      opacity: .8,
    }
  },
  logoText: {
    marginLeft: 10,
  },
  homeLink: {
    color: colors.red,
    fontSize: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 0,
    alignItems: "center",
  },
};

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.token,
  userId: state.session.userId,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});


export default connect(mapStateToProps, mapDispatchToProps)(Radium(Navigation));
