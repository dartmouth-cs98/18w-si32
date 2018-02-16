import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import Color from "color";

import Link from "./link";
import history from "../../history";
import { logout } from "../../data/session/sessionActions";

import {
  NAVBAR_HEIGHT,
  PALETTE_PRIMARY,
  PALETTE_DETAIL,
  PALETTE_BACKGROUND,
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
        <Link style={styles.link} href="/docs">Docs</Link>
        <Link style={styles.link} href="/leaderboard">Leaderboard</Link>
        <Link style={styles.link} href="/replay">Replay</Link>
      </div>
    );
  }

  render() {
    const mainLinkDest = this.props.isLoggedIn ? "/dashboard" : "/";

    return (
      <nav style={styles.wrapper}>
        <div style={styles.mainNav}>
          <Link style={styles.mainLinkContainer} href={mainLinkDest}>
            <div key="main-logo" style={styles.logoContainer}>
              <div style={styles.logoOuter}><div style={styles.logoInner}></div></div>
            </div>
            <div key="main-title" style={{...styles.link, ...styles.homeLink}}>MONAD</div>
          </Link>
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
  mainLinkContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
      cursor: "pointer"
    }
  },
  userAreaContainer: {
    display: "flex",
    flexDirection: "row"
  },
  link: {
    color: PALETTE_DETAIL,
    fontSize: 16,
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
    fontSize: 24
  },
  logoContainer: {
    position: "relative",
    width: "30px",
    height: "30px"
  },
  logoOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: PALETTE_PRIMARY,
    backgroundColor: "#FFFFFF"
  },
  logoInner: {
    position: "absolute",
    marginTop: "40%",
    marginLeft: "40%",
    width: "20%",
    height: "20%",
    borderRadius: "50%",
    backgroundColor: PALETTE_PRIMARY
  }
};

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.token
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Navigation));
