import React from "react";
import { connect } from "react-redux";
import mixpanel from "mixpanel-browser";

import history from "../../history";

import Page from "../layout/page";
import LandingCanvas from "./LandingCanvas";

import { colors, constants } from "../../style/";

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);
    mixpanel.track("Landing page visit");
  }

  componentWillReceiveProps(nextProps) {
    // manually redirect from landing page to dash if logged in
    if (nextProps.user) {
      history.push("/dashboard");
    }
  }

  render() {
    return (
      <Page style={styles.page}>
        <div style={styles.landingCanvasContainer}>
          <LandingCanvas />
        </div>
        <div style={styles.overlayContainer}>
          <div style={styles.overlayPage}>
            <div style={styles.titleText}>Monad</div>
            <div style={styles.mainTextContainer}>
              <div style={styles.mainText}>The World's First Provably-Deterministic Hash Function.</div>
            </div>
            <div style={styles.iconContainer}>
              <i style={styles.arrowDown}></i>
              <i style={styles.arrowDown}></i>
              <i style={styles.arrowDown}></i>
            </div>
          </div>
          <div style={styles.overlayPage}>
            <div style={styles.subtitleContainer}>What is Monad?</div>
            <div style={styles.subTextContainer}>
              <div>Monad is a artificial intelligence programming challenge</div>
              <div>in which users implement bots to do things.</div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
  },
  wrapper: {
    padding: "0 15px"
  },
  landingCanvasContainer: {
    position: "fixed"
  },
  overlayContainer: {
    position: "absolute",
    width: "100%",
    overflow: "scroll",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: colors.black,
    fontSize: constants.fontSizes.largest
  },
  overlayPage: {
    position: "relative",
    width: "100%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  mainTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px"
  },
  subTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "3px",
    borderColor: colors.primary,
    padding: "15px",
    fontSize: constants.fontSizes.large,
  },
  iconContainer: {
    position: "absolute",
    bottom: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowDown: {
    border: "solid black",
    borderWidth: "0 2px 2px 0",
    display: "inline-block",
    padding: "5px",
    transform: "rotate(45deg)"
  },
  titleText: {
    fontSize: constants.fontSizes.ultimate,
    color: colors.blue
  },
  mainText: {
    padding: "5px",
    //color: colors.blue
  },
  subtitleContainer: {
    paddingBottom: "10px"
  }
};

const mapStateToProps = state => ({
  user: state.session.user,
  userId: state.session.userId,
});

export default connect(mapStateToProps, null)(LandingPage);
