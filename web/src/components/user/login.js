import React from "react";
import { Link, history } from "../../router.js";
import { login } from "../../data/session/sessionActions.js";

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  doLogin = event => {
    event.preventDefault();
    login(this.state.username, this.state.password)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        console.log("FAIL");
      });
  };

  render() {
    return (
      <div>
        <h1>Login page</h1>
        <form onSubmit={this.doLogin}>
          <label>
            Username:
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label>
            Password
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default LoginPage;
