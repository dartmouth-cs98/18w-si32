import React from "react";
import { connect } from "react-redux";
import color from "color";

import config from "../../config";

import Link from "../common/link";
import Message from "../common/message";
import Page from "../layout/page";
import history from "../../history";
import Input from "../form/input";
import Button from "../common/button";
import { register } from "../../data/session/sessionActions";

import {
  colors,
} from "../../style";

const { PASSWORD_MIN_LENGTH } = config;

class RegisterPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPasswordMessage: false,
      showUsernameMessage: false
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

  onPasswordInputFocus = () => {
    this.setState({ showPasswordMessage: false });
  }

  verifyPassword = () => {
    return this.state.password.length >= PASSWORD_MIN_LENGTH;
  }

  doRegister = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!this.verifyPassword()) {
      this.setState({ showPasswordMessage: true });
      return;
    }

    this.setState({
      submitting: true,
      error: false,
    });

    this.props.register(this.state.username, this.state.password)
      .then(() => {
        history.push("/dashboard");
      })
      .catch((err) => {
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
    let passwordMessageContainer;
    if (this.state.showPasswordMessage) {
      passwordMessageContainer = (
        <div style={styles.passwordMessageContainer}>
          <span>{`Password must be at least ${PASSWORD_MIN_LENGTH} characters!`}</span>
        </div>
      );
    } else {
      passwordMessageContainer = (
        <div style={styles.passwordMessageContainer}></div>
      );
    }

    return (
      <Page style={styles.pageStyles}>
        <div style={styles.wrapper}>
          <div style={styles.titleContainer}>Register for Monad</div>
          <form style={styles.form} onSubmit={this.doRegister}>
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
              value={this.state.password}
              onChange={this.handleInputChange}
              onFocus={this.onPasswordInputFocus}
            />
            <input type="submit" style={{display: "none"}} />
            <Button kind="primary" style={{width: 200}} onClick={this.doRegister} disabled={this.state.submitting || !this.state.username || !this.state.password}>
              { this.state.submitting ? "Registering...": "Register" }
            </Button>
          </form>
          {passwordMessageContainer}
          <div style={styles.registerContainer}>
            <span style={styles.registerText}>Have an account?</span>
            <Link
              key="login-link"
              href="/login"
              style={styles.registerLink}>
              Log In
            </Link>
          </div>
        </div>
      </Page>
    );
  }
}

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
    alignItems: "center",
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
    marginBottom: 15,
  },
  registerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  passwordMessageContainer: {
    height: "20px",
    marginBottom: 15,
    color: color(colors.primary).lighten(0.4).hex()
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

const mapDispatchToProps = dispatch => ({
  register: (username, password) => dispatch(register(username, password))
});

export default connect(null, mapDispatchToProps)(RegisterPage);
