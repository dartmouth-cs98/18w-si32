import React from "react";
import { connect } from "react-redux";

import { constants, colors } from "../../style";
import { Page, Wrapper } from "../layout";

import ReplayReader from "./ReplayReader";
import ReplayVisualizer from "./ReplayVisualizer";
import CellDetail from "./CellDetails";

class ReplayPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      replay: null,
    };
  }

  componentWillMount() {
    // check for the various File API support we need
    // TODO: what should we do for browsers without File API support?
    if (!window.File || !window.FileReader) {
      console.log("FILE API ERROR");  // eslint-disable-line
    }
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

  setReplayFile = (f) => {
    this.setState({ replay: f });
  }

  resetReplayFile = () => {
    this.setState({
      replay: null
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
            { this.state.selectedRow != undefined ? 
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
      <Page>
        {main}
      </Page>
    );
  }
}

const styles ={
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
};

export default connect(null, null)(ReplayPage);
