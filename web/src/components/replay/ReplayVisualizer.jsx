import React from "react";

import Canvas from "./Canvas";
import Button from "../common/button";
import Progress from "../common/progress";

import { colors } from "../../style";

class ReplayVisualizer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      currentFrame: 0,
    };
  }

  componentDidMount() {
    this.setState({
      wrapperWidth: this.wrapperRef.offsetWidth,
    });
  }

  toggleReplayControl = () => {
    this.setState({ play: !this.state.play });
    if (this.state.currentFrame === (this.props.replay.turns.length - 1)) {
      // if we have reached the final frame, reset on button click
      this.setState({ currentFrame: 0 });
    }
  }

  replayStepBack = () => {
    this.setState({ 
      play: false,
      currentFrame: this.state.currentFrame - 1,
    });
  }

  replayStepForward = () => {
    this.setState({ 
      play: false,
      currentFrame: this.state.currentFrame + 1,
    });
  }

  resetReplayFile = () => {
    this.props.resetReplayFile();
  }

  incrementCurrentFrame = () => {
    const nextFrame = this.state.currentFrame + 1;
    this.setState({ currentFrame: nextFrame });

    if ((nextFrame + 1) === this.props.replay.turns.length) {
      // if we have reached the end of the game
      this.setState({ play: false });
    }
  }

  renderCanvas = () => {
    if (!this.state.wrapperWidth) {
      return null;
    }
    return (
      <Canvas size={null}
        replay={this.props.replay}
        frame={this.state.currentFrame}
        incrementFrame={this.incrementCurrentFrame}
        play={this.state.play} />
    );
  }

  render() {
    let ctrlButton;
    if (this.state.play) {
      ctrlButton = <i className="fa fa-pause"></i>;
    } else {
      ctrlButton = <i className="fa fa-play"></i>;
    }

    const progressPercentage = this.state.currentFrame === 0 ? 0 : Math.floor((this.state.currentFrame / (this.props.replay.turns.length - 1  ))*100);

    return (
      <div style={styles.wrapper} ref={(ref) => { this.wrapperRef = ref; }}>
        { this.renderCanvas() }
        <div style={styles.controls}>
          <Button kind={"primary"} style={styles.controlButton} onClick={this.toggleReplayControl}>
            {ctrlButton}
          </Button>
          <Button kind={"tertiary"} style={styles.controlButtonSmall} onClick={this.replayStepBack}>
             <i className="fa fa-step-backward"></i>
          </Button>
          <Button kind={"tertiary"} style={styles.controlButtonSmall} onClick={this.replayStepForward}>
             <i className="fa fa-step-forward"></i>
          </Button>
          <div style={styles.progressContainer}>
            <Progress percentage={progressPercentage} />
          </div>
        </div>
        { this.props.hideSelectButton ? "" :
            <div style={styles.subRow}>
              <Button kind={"tertiary"} style={styles.navigateButton} onClick={this.resetReplayFile}>
                <div>&larr; Select Another File</div>
              </Button>
            </div>
        }
      </div>
    );
  }
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 0 0 0"
  },
  subRow: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  controls: {
    width: "80%",
    marginTop: 10,
    display: "flex",
    flex: 1,
    alignItems: "center",
  },
  pageHeader: {
    color: colors.primary,
    fontSize: "30px"
  },
  controlButton: {
    width: 110,
    marginRight: 10,
  },
  controlButtonSmall: {
    width: 30,
    marginRight: 10,
    fontSize: 15,
  },
  navigateButton: {
    width: 160,
  },
  progressContainer: {
    flex: 1,
    marginBottom: 1,
  }
};

export default ReplayVisualizer;
