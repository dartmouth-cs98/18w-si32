import React from "react";
import { connect } from "react-redux";
import Color from "color";

import Link from "../common/link";
import Message from "../common/message";
import Page from "../layout/page";
import { history } from "../../router";
import Input from "../form/input";
import Button from "../common/button";
import { login } from "../../data/session/sessionActions";

import {
  colors,
  constants,
} from "../../style";

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
    if (event) {
      event.preventDefault();
    }

    this.setState({
      submitting: true,
      error: false,
    });

    this.props
      .login(this.state.username, this.state.password)
      .then(() => {
        history.push("/dashboard");
      })
      .catch((err, res) => {
        this.setState({
          error: err.response.body.error
        });
      }).finally(() => {
        this.setState({
          submitting: false,
        });
      });
  }

  render() {
    return (
      <Page style={styles.pageStyles}>
        <div style={styles.wrapper}>
          <div style={styles.titleContainer}>Awesome tagline.</div>
          <form style={styles.form} onSubmit={this.doLogin}>
            <Message kind="error">{ this.state.error }</Message>
            <Input
              name="username"
              key="username"
              placeholder="Username"
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
            <Input
              name="password"
              key="password"
              placeholder="Password"
              type="password"
              style={styles.input}
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <input type="submit" style={{display: "none"}} />
            <Button kind="primary" style={{width: 200}} onClick={this.doLogin} disabled={this.state.submitting || !this.state.username || !this.state.password}>
              { this.state.submitting ? "Logging In...": "Log In" }
            </Button>
          </form>
          <div style={styles.registerContainer}>
            <span style={styles.registerText}>New to Monad? </span>
            <Link
              key="register-link"
              href="/register"
              style={styles.registerLink}>
              Create an Account
            </Link>
          </div>
        </div>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))
});

const styles = {
  pageStyles: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  titleContainer: {
    fontSize: "30px",
    padding: "15px 0"
  },
  form: {
    width: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  registerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  registerText: {
    marginRight: "5px"
  },
  registerLink: {
    color: colors.red,
    ":hover": {
      cursor: "pointer",
      textDecoration: "underline"
    }
  }
};

export default connect(null, mapDispatchToProps)(LoginPage);
