import React from "react";
import { connect } from "react-redux";
import mixpanel from "mixpanel-browser";

import history from "../../history";

import Page from "../layout/page";
import LandingCanvas from "./LandingCanvas";
import Canvas from "../replay/Canvas";

import { fetchLog } from "../../data/match/matchRoutes";

import { colors, constants } from "../../style/";

const MATCH_ID = 0;//

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);
    mixpanel.track("Landing page visit");

    this.state = {
      currentFrame: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    // manually redirect from landing page to dash if logged in
    if (nextProps.user) {
      history.push("/dashboard");
    }
  }

  loadMatch = () => {
    return this.props.fetchMatch().then(res => {
      // load the game log from S3
      if (res.body.logUrl) {
        return fetchLog(res.body.logUrl);
      } else {
        return false;
      }
    }).then(log => {
      this.setState({ log });
    });
  }

  setFrame = (frameNo) => {
    this.setState({
      currentFrame: frameNo,
    });
  }

  incrementCurrentFrame = () => {
    const nextFrame = this.state.currentFrame + 1;
    this.setFrame(nextFrame);

    if ((nextFrame + 1) === this.props.replay.turns.length) {
      // if we have reached the end of the game, reset to beginning
      this.setState({ currentFrame: 0 });
    }
  }

  render() {
    return (
      <Page style={styles.page}>
        <div style={styles.landingCanvasContainer}>
          <LandingCanvas />
        </div>
        <div style={styles.overlayContainer}>
          <div style={styles.overlayPageColumn}>
            <div style={styles.titleText}>Monad</div>
            <div style={styles.subtitleContainer}>
              <div style={styles.subtitle}>The World's First Provably-Deterministic Hash Function.</div>
            </div>
            <div style={styles.iconContainer}>
              <i style={styles.arrowDown}></i>
              <i style={styles.arrowDown}></i>
              <i style={styles.arrowDown}></i>
            </div>
          </div>
          <div style={styles.overlayPageRow}>
            <div style={styles.column}>
              <div style={styles.paragraphTitle}>Welcome to Monad.</div>
              <div style={styles.paragraphContainer}>
                <p>
                  Monad is a programming challenge in which
                  you design and implement an artificial intelligence agent
                  to compete with those of other users in a turn-based
                  strategy game on a two-dimensional grid.
                </p>
              </div>
            </div>
            <div style={styles.column}>
              {/*
              <Canvas size={null}
                replay={this.props.replay}
                frame={this.state.currentFrame}
                incrementFrame={this.incrementCurrentFrame}
                showNums={false}
                onCellClicked={this.viewOnly}
                selectedCell={null}
                play={true} />
              */}
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
    fontSize: constants.fontSizes.largest,
    fontWeight: 300,
  },
  overlayPageColumn: {
    position: "relative",
    width: "100%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayPageRow: {
    position: "relative",
    width: "100%",
    height: "90vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: constants.fontSizes.ultimate,
    color: colors.blue
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px"
  },
  subtitle: {
    padding: "5px",
  },
  column: {
    width: "50%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  paragraphTitle: {
    paddingBottom: "10px"
  },
  paragraphContainer: {
    width: "90%",
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
    backgroundColor: "rgba(255,255,255,0.6)"
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
  }
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchMatch: () => dispatch(fetchMatch(MATCH_ID)),
});

const mapStateToProps = state => ({
  user: state.session.user,
  userId: state.session.userId,
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
