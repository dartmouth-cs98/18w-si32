import React from "react";
import { connect } from "react-redux";
import Color from "color";

import Link from "../layout/link";
import Page from "../layout/page";
import { history } from "../../router";
import { login } from "../../data/session/sessionActions";

import {
  INPUT_HEIGHT,
  BUTTON_HEIGHT,
  PALETTE_PRIMARY,
  PALETTE_BACKGROUND
} from "../../style/constants";

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
        history.push("/dashboard");
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
        <div style={styles.wrapper}>
          <div style={styles.titleContainer}>Awesome tagline.</div>
          <form style={styles.form} onSubmit={this.doLogin}>
            <input
              name="username"
              key="username"
              placeholder="Username"
              type="text"
              style={styles.input}
              value={this.state.username}
              onChange={this.handleInputChange}
            />
            <input
              name="password"
              key="password"
              placeholder="Password"
              type="password"
              style={styles.input}
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <input type="submit"
                 value="Log In"
                 style={styles.submitButton}
            />
          </form>
          <div style={styles.registerContainer}>
            <span style={styles.registerText}>New to SI32? </span>
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
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "20%"
  },
  titleContainer: {
    fontSize: "30px",
    fontFamily: "Roboto",
    padding: "15px 0"
  },
  form: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    width: "100%",
    height: INPUT_HEIGHT,
    fontFamily: "Roboto",
    fontSize: "16px",
    margin: "10px 0",
    ":focus": {
      borderColor: Color(PALETTE_PRIMARY).lighten(0.7).string(),
      borderStyle: "solid",
      borderWidth: "1px"
    }
  },
  submitButton: {
    width: "50%",
    height: BUTTON_HEIGHT,
    margin: "15px 0",
    backgroundColor: PALETTE_BACKGROUND,
    color: PALETTE_PRIMARY,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: PALETTE_PRIMARY,
    borderRadius: "2px",
    ":hover": {
      backgroundColor: PALETTE_PRIMARY,
      color: PALETTE_BACKGROUND,
      cursor: "pointer"
    }
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
    color: PALETTE_PRIMARY,
    ":hover": {
      cursor: "pointer",
      textDecoration: "underline"
    }
  }
};

export default connect(null, mapDispatchToProps)(LoginPage);
