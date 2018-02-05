import React from "react";
import { initRouter, Link } from "./router.js";

class App extends React.Component {
  constructor() {
    super();
    initRouter(this.updateMain);
  }

  updateMain = (html) => {
    // store the new view (not in state since it could be large)
    this.main = html;

    // touch state to trigger a render
    this.setState({a: Math.random()});
  }

  render() {
    return (
      <div>
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <div>{ this.main }</div>
      </div>
    );
  }
}

export default App;
