import React from "react";
import { Link } from "../../router.js";

class Navigation extends React.PureComponent {
  render() {
    return (
      <nav>
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    );
  }
}

export default Navigation;
