import React from "react";

import Canvas from "./Canvas";
import Button from "../common/button";

import { colors } from "../../style"

class ReplayVisualizer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      play: false
    };
  }

  toggleReplayControl = () => {
    this.setState({
      play: !this.state.play
    });
  }

  render() {
    const controlButtonText = this.state.play ? "Pause Replay" : "Play Replay"

    return (
      <div style={styles.wrapper}>
        <div style={styles.pageHeader}>Game Replay</div>
        <Canvas replay={this.props.replay}
                play={this.state.play} />
        <Button kind={"primary"} onClick={this.toggleReplayControl}>
          <div>{controlButtonText}</div>
        </Button>
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
  }
};

export default ReplayVisualizer;
