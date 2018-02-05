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
          <Link style={styles.link} href="/profile">Profile</Link>
          <Link style={styles.link} href="#" onClick={this.logout}>
            Logout
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <Link style={styles.link} href="/register">Register</Link>
          <Link style={styles.link} href="/login">Log in</Link>
        </div>
      );
    }
  };

  render() {
    return (
      <nav style={styles.wrapper}>
        <Link style={styles.link} href="/">Home</Link>
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
    justifyContent: "space-between",
    padding: 10,
  },
  link: {
    color: "white",
    fontSize: 18,
    textDecoration: "none",
    margin: "0 10px",
  },
};


const mapStateToProps = state => ({
  isLoggedIn: !!state.session.token
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});


export default Radium(connect(mapStateToProps, mapDispatchToProps)(Navigation));
