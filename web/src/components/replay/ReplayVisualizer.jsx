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
      currentFrame: 0
    };
  }

  toggleReplayControl = () => {
    this.setState({ play: !this.state.play });
  }

  incrementCurrentFrame = () => {
    this.setState({ currentFrame: this.state.currentFrame + 1 });
  }

  render() {
    const controlButtonText = this.state.play ? "Pause Replay" : "Play Replay"
    const progressPercentage = this.state.currentFrame === 0 ? 0 : Math.floor(((this.state.currentFrame+1) / this.props.replay.turns.length)*100);

    return (
      <div style={styles.wrapper}>
        <div style={styles.pageHeader}>Game Replay</div>
        <Canvas replay={this.props.replay}
                frame={this.state.currentFrame}
                incrementFrame={this.incrementCurrentFrame}
                play={this.state.play} />
        <Button kind={"primary"} onClick={this.toggleReplayControl}>
          <div>{controlButtonText}</div>
        </Button>
        <div style={styles.progressContainer}>
          <Progress percentage={progressPercentage} />
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
    padding: "40px 0 0 0"
  },
  pageHeader: {
    color: colors.primary,
    fontSize: "30px"
  },
  progressContainer: {
    width: "40%",
    padding: "10px"
  }
};

export default ReplayVisualizer;
