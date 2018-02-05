import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import { Link } from "../../router";
import { logout } from "../../data/session/sessionActions";
import history from "../../history";

class Navigation extends React.PureComponent {
  logout = () => {
    this.props.logout().then(() => {
      history.push("/");
    });
  };

  renderUserArea = () => {
    if (this.props.isLoggedIn) {
      return (
        <div>
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
        <div>
          <Link style={styles.link} href="/register">
            Register
          </Link>
          <Link style={styles.link} href="/login">
            Log in
          </Link>
        </div>
      );
    }
  };

  render() {
    return (
      <nav style={styles.wrapper}>
        <div style={styles.mainNav}>
          <Link style={{ ...styles.link, ...styles.homeLink }} href="/">
            Si32
          </Link>
          <Link style={styles.link} href="/bots">
            Bots
          </Link>
        </div>

        {this.renderUserArea()}
      </nav>
    );
  }
}

const styles = {
  wrapper: {
    backgroundColor: "#141529",
    borderBottom: "1px solid #9B51E0",
    display: "flex",
    height: 56,
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px"
  },
  mainNav: {
    display: "flex",
    alignItems: "center"
  },
  link: {
    color: "white",
    fontSize: 18,
    textDecoration: "none",
    textTransform: "uppercase",
    margin: "0 10px"
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
