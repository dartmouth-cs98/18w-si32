import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import history from "../../history";
import { register } from "../../data/session/sessionActions";

class RegisterPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  // TODO use redux-form or something better here
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  doRegister = (event) => {
    event.preventDefault();
    this.props.register(this.state.username, this.state.password)
      .then(() => {
        history.push("/profile");
      })
      .catch((err) => {
        /* eslint-disable no-console */
        console.log(err);
        console.log("FAIL");
        /* eslint-enable no-console */
      });
  }

  render() {
    return (
      <Page>
        <h1>Register for Si32</h1>
        <form onSubmit={this.doRegister}>
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
  register: (username, password) => dispatch(register(username, password))
});

export default connect(null, mapDispatchToProps)(RegisterPage);
