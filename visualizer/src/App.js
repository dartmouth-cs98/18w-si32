import React, { Component } from "react";

import "./App.css";
import ReplayReader from "./ReplayReader";
import ReplayVisualizer from "./ReplayVisualizer";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      replayLoaded: false
    }
  }

  handleReplayLoad = () => {
    this.setState({
      replayedLoaded: true
    });
  }

  render() {
    const main = this.state.replayLoaded ? <ReplayVisualizer /> : <ReplayReader />

    return (
      <div className="App">
        {main}
      </div>
    );
  }
}

export default App;
