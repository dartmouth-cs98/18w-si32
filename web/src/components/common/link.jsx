import React from "react";
import Radium from "radium";
import Color from "color";

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
    color: colors.blue,
    cursor: "pointer",
    textDecoration: "none",
    ":hover": {
      ":hover": {
        color: Color(colors.blue).darken(0.4).string(),
      },
    },
  }
};


export default Radium(Link);
