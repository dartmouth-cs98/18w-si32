import React from "react";
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
          <Link href="/profile">Profile</Link>
          <Link href="#" onClick={this.logout}>
            Logout
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <Link href="/register">Register</Link>
          <Link href="/login">Log in</Link>
        </div>
      );
    }
  };

  render() {
    return (
      <nav>
        <Link href="/">Home</Link>
        {this.renderUserArea()}
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: !!state.session.token
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
