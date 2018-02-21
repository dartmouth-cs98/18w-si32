import React from "react";
import Radium from "radium";

import history from "../../history";

import { colors } from "../../style";

class Link extends React.PureComponent {
  clicked = event => {
    // if attempting to open in new window or something else funky, do nothing
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }

    history.push(this.props.href);
    event.preventDefault();
  };

  render() {
    return (
      // use the <a> here so that "open in new tab" and such works
      <a href={this.props.href} style={styles.base} onClick={this.clicked} {...this.props}>
        {this.props.children}
      </a>
    );
  }
}

const styles = {
  base: {
    color: colors.red,
    cursor: "pointer",
    textDecoration: "none",
    ":hover": {
      opacity: .7, // just something for now
    },
  }
};


export default Radium(Link);
