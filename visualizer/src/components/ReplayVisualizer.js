import React from "react";

import Canvas from "./Canvas";
import Button from "./button";
import Progress from "./progress";

import { colors, constants } from "../style";

class ReplayVisualizer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      currentFrame: 0,
      showNums: true,
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

  toggleNums = () => {
    this.setState({
      showNums: !this.state.showNums,
    });
  }

  scrubTo = (percentage) => {
    this.setState({
      currentFrame: Math.floor(this.props.replay.turns.length * percentage),
    });
  }

  replayStepBack = () => {
    this.setState({
      play: false,
      currentFrame: Math.max(0,this.state.currentFrame - 1),
    });
  }

  replayStepForward = () => {
    this.setState({
      play: false,
      currentFrame: Math.min(this.state.currentFrame + 1, this.props.replay.turns.length - 1),
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
        showNums={this.state.showNums}
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
            <Progress onClick={this.scrubTo} percentage={progressPercentage} />
          </div>
        </div>
        <div style={styles.options}>
          { this.props.hideSelectButton ? "" :
              <Button kind={"tertiary"} style={styles.navigateButton} onClick={this.resetReplayFile}>
                <div>&larr; Select Another File</div>
              </Button>
          }
          <label style={styles.option}><input type="checkbox" checked={this.state.showNums} onChange={this.toggleNums} /> <span style={styles.option.label}>Show numbers</span></label>

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
  options: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderTop: `1px solid ${colors.border}`,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 10,
  },
  option: {
    fontSize: constants.fontSizes.small,
    color: colors.medGray,
    display: "flex",
    alignItems: "center",
    label: {
      marginLeft: 5,
    }
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
    fontSize: constants.fontSizes.small,
    marginRight: 20,
  },
  progressContainer: {
    flex: 1,
    marginBottom: 1,
  }
};

export default ReplayVisualizer;
