import React, { PureComponent } from "react";

import Wrapper from "./components/wrapper";
import CellDetail from "./components/CellDetail";
import ReplayReader from "./components/ReplayReader";
import ReplayVisualizer from "./components/ReplayVisualizer";

import { constants, colors } from "./style";

const remote = window.require("electron").remote;
const win = remote.getCurrentWindow();

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      replay: null,
      mainWidth: win.getSize()[0],
      mainHeight: win.getSize()[1]
    };
  }

  componentWillMount() {
    // dynamically set the root element width / height on
    // electron app window resize event
    win.on("resize", () => {
      this.setState({
        mainWidth: win.getSize()[0],
        mainHeight: win.getSize()[1]
      });
    });
  }

  setReplayFile = (f) => {
    this.setState({ replay: f });
  }

  resetReplayFile = () => {
    this.setState({ replay: null });
  }

  onFrameChanged = (frameNumber) => {
    this.setState({ frameNumber });
  }

  onCellSelected = ({row, col}) => {
    this.setState({
      selectedRow: row,
      selectedCol: col, 
    });
  }

  render() {
    let main;
    if (this.state.replay) {
      main = (
        <Wrapper innerStyle={{display: "flex"}}>
          <div style={styles.leftCol}>
            <ReplayVisualizer
              replay={this.state.replay}
              resetReplayFile={this.resetReplayFile}
              onFrameChanged={this.onFrameChanged}
              onCellSelected={this.onCellSelected}
            />
          </div>
          <div style={styles.rightCol}>
          { this.state.selectedRow !== undefined ?
              <CellDetail
                log={this.state.replay}
                turn={this.state.frameNumber}
                row={this.state.selectedRow}
                col={this.state.selectedCol}
                /> : <div style={styles.cellDetail.placeholder}>Click on a cell to see specifics.</div> }
          </div>
        </Wrapper>
      );
    } else {
      main = <ReplayReader setReplayFile={this.setReplayFile} />;
    }

    return (
      <div style={{
          ...styles.container,
          width: this.state.mainWidth,
          height: this.state.mainHeight - constants.MAIN_WINDOW_VERTICAL_PADDING
        }}>
        {main}
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    minWidth: 500,
  },
  cellDetail: {
    marginTop: 30,
    placeholder: {
      color: colors.lightGray,
      fontSize: constants.fontSizes.medium,
    }
  }
}

export default App;
