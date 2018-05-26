import React from "react";
import { connect } from "react-redux";
import mixpanel from "mixpanel-browser";

import history from "../../history";

import Page from "../layout/page";
import LandingCanvas from "./LandingCanvas";
import Canvas from "../replay/Canvas";
import Button from "../common/button";

import { fetchLog } from "../../data/match/matchRoutes";
import { fetchLandingMatch } from "../../data/match/matchActions";

import { colors, constants } from "../../style/";

import REPLAY_LOG from "../../static/landingReplay.json"

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);
    mixpanel.track("Landing page visit");

    this.state = {
      currentFrame: 0
    }
  }

  componentWillMount() {
    this.loadJSON((response) => {
      this.setState({
        log: JSON.parse(response)
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    // manually redirect from landing page to dash if logged in
    if (nextProps.user) {
      history.push("/dashboard");
    }
  }

  goToLogin = () => {
    history.push("/login");
  }

  loadJSON = (next) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', REPLAY_LOG, true);
    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == 200) {
        // .open will NOT return a value but simply returns undefined in async mode so use a callback
        next(xobj.responseText);
      }
    }
    xobj.send(null);
  }

  setFrame = (frameNo) => {
    this.setState({
      currentFrame: frameNo,
    });
  }

  incrementCurrentFrame = () => {
    const nextFrame = this.state.currentFrame + 1;
    this.setFrame(nextFrame);

    if ((nextFrame + 1) === this.state.log.turns.length) {
      // if we have reached the end of the game, reset to beginning
      this.setState({ currentFrame: 0 });
    }
  }

  render() {
    if (!this.state.log) return (<div></div>);

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
            <div style={styles.leftColumn}>
              <div style={styles.leftColumnItem}>
                <div style={styles.paragraphTitle}>Welcome to Monad.</div>
                <div style={styles.paragraphContainer}>
                  <p>
                    Monad is a programming challenge in which
                    you design and implement an artificial intelligence agent
                    to compete with those of other users in a turn-based
                    strategy game.
                  </p>
                </div>
              </div>
              <Canvas size={null}
                replay={this.state.log}
                frame={this.state.currentFrame}
                incrementFrame={this.incrementCurrentFrame}
                showNums={false}
                onCellClicked={this.viewOnly}
                selectedCell={null}
                play={true}/>
            </div>
            <div style={styles.rightColumn}>
              <div style={styles.rightColumnItem}>
                <div style={styles.paragraphTitle}>The Evolution of Intelligence.</div>
                <div style={styles.paragraphContainer}>
                  <p>
                    Monad's universe is centered around not a specific spatial
                    location, but rather a specific time — the early stages of life.
                    You command a swarm of simple autonomous agents, and with them
                    attempt to reproduce, expand, and ultimately assert supremacy
                    over your environment.
                  </p>
                </div>
              </div>
              <div style={styles.rightColumnItem}>
                <div style={styles.paragraphTitle}>Universal Appeal.</div>
                <div style={styles.paragraphContainer}>
                  <p>
                    The game underlying Monad is simple to understand yet
                    difficult to master, making it suitable for programmers of all ability levels.
                  <br/> <br/>
                    Whether you are just starting out, or are already well on
                    your way to implementing AGI on a single-tape Turing Machine,
                    Monad has something for you.
                  </p>
                </div>
              </div>
              <div style={styles.rightColumnItem}>
                <div style={styles.paragraphTitle}>What Are You Waiting For?</div>
                <Button kind={"primary"} onClick={this.goToLogin} style={styles.startButton}>
                  GET STARTED
                </Button>
              </div>
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
  leftColumn: {
    width: "55%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  leftColumnItem: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  rightColumn: {
    width: "45%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  rightColumnItem: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  paragraphContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "3px",
    borderColor: colors.primary,
    padding: "15px",
    margin: "10px",
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
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "0 2px 2px 0",
    display: "inline-block",
    padding: "5px",
    transform: "rotate(45deg)"
  },
  startButton: {
    width: "300px",
    margin: "10px"
  }
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchLandingMatch: () => dispatch(fetchLandingMatch()),
});

const mapStateToProps = state => ({
  user: state.session.user,
  userId: state.session.userId,
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
