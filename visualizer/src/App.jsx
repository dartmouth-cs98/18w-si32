import React, { PureComponent } from "react";

import ReplayReader from "./components/ReplayReader";
import ReplayVisualizer from "./components/ReplayVisualizer";

import { constants } from "./style";

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
    //
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
    this.setState({
      replay: null
    });
  }

  render() {
    let main;
    if (this.state.replay) {
      main = <ReplayVisualizer replay={this.state.replay} resetReplayFile={this.resetReplayFile} />;
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
  }
}

export default App;
