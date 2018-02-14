import React from "react";
import { initRouter } from "./router";
import Navigation from "./components/layout/navigation";

class App extends React.Component {
  constructor() {
    super();

    this.updateMain = this.updateMain.bind(this);
  }

  componentWillMount() {
    initRouter(this.updateMain);
  }

  updateMain(html) {
    // store the new view (not in state since it could be large)
    this.main = html;

    // touch state to trigger a render
    this.setState({ a: Math.random() });
  }

  render() {
    return (
      <div>
        <Navigation />
        <div id="main">{this.main}</div>
      </div>
    );
  }
}

export default App;
