import React from "react";

import { getProfile } from "../../data/user/userActions";

class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    getProfile().then(profile => {
      this.setState(profile);
    });
  }

  render() {
    return (
      <div>
        <h1>Profile</h1>
        <h3>Your user id: {this.state.user}</h3>
      </div>
    );
  }
}

export default ProfilePage;
