import React from "react";
import Radium from "radium";

import config from "../../config";

import Link from "../common/link";
import Logo from "../common/logo";

import { constants, colors } from "../../style";

const { FEEDBACK_URL, PRIVACY_POLICY_URL } = config;

class Footer extends React.PureComponent {
  openFeedback = () => {
    window.open(FEEDBACK_URL, "_blank");
  }

  openPrivacyPolicy = () => {
    window.open(PRIVACY_POLICY_URL, "_blank");
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <div style={styles.linksContainer}>
          <Link style={styles.link} href="#" onClick={this.openFeedback}>
            Feedback
          </Link>
          <Link style={styles.link} href="#" onClick={this.openPrivacyPolicy}>
            Privacy Policy
          </Link>
        </div>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>MONAD</div>
          <div>© Monad by CS98. All Rights Reserved.</div>
        </div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: constants.FOOTER_HEIGHT,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px",
    borderStyle: "solid none none none",
    borderWidth: "1px",
    borderColor: colors.primary
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: colors.medGray,
    padding: "10px"
  },
  logo: {
    color: colors.red,
    padding: "5px"
  },
  linksContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  link: {
    color: colors.medGray,
    fontSize: 18,
    fontWeight: 300,
    textDecoration: "none",
    marginLeft: 10,
    marginRight: 10,
    ":hover": {
      color: colors.blue,
      opacity: .8,
    }
  },
};

export default Radium(Footer);
