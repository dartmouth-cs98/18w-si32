import React from "react";
import { Link } from "../../router.js";
import { isLoggedIn } from "../../data/session/sessionManager.js";
import { logout } from "../../data/session/sessionActions.js";
import history from "../../history.js";

class Navigation extends React.PureComponent {
  logout = () => {
    logout().then(() => {
      history.push("/");
    });
  }

  renderUserArea = () => {
    if (isLoggedIn()) {
      return (
        <div>
          <Link href="/profile">Profile</Link>
          <Link href="#" onClick={this.logout}>Logout</Link>
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
  }

  render() {
    return (
      <nav>
        <Link href="/">Home</Link>
        { this.renderUserArea() }
      </nav>
    );
  }
}

export default Navigation;
