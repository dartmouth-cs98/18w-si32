import React, { PureComponent } from "react";

import ReplayReader from "./components/ReplayReader";
import ReplayVisualizer from "./components/ReplayVisualizer";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      replay: null,
    };
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
      <div className="App">
        {main}
      </div>
    );
  }
}

export default App;
