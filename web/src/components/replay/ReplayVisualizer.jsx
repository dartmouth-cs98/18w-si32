import React from "react";

import Canvas from "./Canvas";
import Button from "../common/button";
import Progress from "../common/progress";

import { colors } from "../../style"

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
      wrapperWidth: this.refs.wrapper.offsetWidth,
    });
  }

  toggleReplayControl = () => {
    this.setState({ play: !this.state.play });
    if (this.state.currentFrame === (this.props.replay.turns.length - 1)) {
      // if we have reached the final frame, reset on button click
      this.setState({ currentFrame: 0 });
    }
  }

  incrementCurrentFrame = () => {
    const nextFrame = this.state.currentFrame + 1
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
      <Canvas size={this.state.wrapperWidth}
        replay={this.props.replay}
        frame={this.state.currentFrame}
        incrementFrame={this.incrementCurrentFrame}
        play={this.state.play} />
    );
  }

  render() {
    let controlButtonText;
    if (this.state.play) {
      controlButtonText = "Pause Replay";
    } else if (this.state.currentFrame == 0 || this.state.currentFrame === (this.props.replay.turns.length - 1)) {
      controlButtonText = "Start Replay";
    } else {
      controlButtonText = "Resume Replay";
    }

    const progressPercentage = this.state.currentFrame === 0 ? 0 : Math.floor((this.state.currentFrame / (this.props.replay.turns.length - 1  ))*100);

    return (
      <div style={styles.wrapper} ref="wrapper">
        { this.renderCanvas() }
        <div style={styles.controls}>
          <Button kind={"primary"} style={styles.button} onClick={this.toggleReplayControl}>
            <div>{controlButtonText}</div>
          </Button>
          <div style={styles.progressContainer}>
            <Progress percentage={progressPercentage} />
          </div>
        </div>
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
  controls: {
    marginTop: 10,
    display: "flex",
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
  },
  pageHeader: {
    color: colors.primary,
    fontSize: "30px"
  },
  button: {
    width: 160,
    marginRight: 10,
  },
  progressContainer: {
    flex: 1,
    marginBottom: 1,
  }
};

export default ReplayVisualizer;
