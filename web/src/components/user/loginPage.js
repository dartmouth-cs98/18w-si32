import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import { history } from "../../router";
import { login } from "../../data/session/sessionActions";

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  doLogin = (event) => {
    event.preventDefault();
    this.props
      .login(this.state.username, this.state.password)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        /* eslint-disable no-console */
        console.log("FAIL");
        /* eslint-enable no-console */
      });
  }

  render() {
    return (
      <Page>
        <h1>Login</h1>
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
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))
});

export default connect(null, mapDispatchToProps)(LoginPage);
