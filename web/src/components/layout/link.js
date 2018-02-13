import React from 'react';
import Radium from 'radium';

import history from "../../history";

class Link extends React.PureComponent {
  clicked = event => {
    // if not attempting to open in new window or something else funky,
    // do nothing
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    history.push(this.props.href);
    event.preventDefault();
  };

  render() {
    return (
      <div onClick={this.clicked} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export default Radium(Link);
