import React from "react";
import Radium from "radium";
import Color from "color";

import history from "../../history";
import { constants, colors } from "../../style";

// generic button class
// kind=primary|secondary|tertiary
// TODO implement size prop
class Message extends React.PureComponent {
  render() {
    if (!this.props.children) {
      return null;
    }

    return (
      <div style={[styles.base, styles[this.props.kind], this.props.style]}>{ this.props.children }</div>
    );
  }
}

const styles = {
  base: {
    backgroundColor: colors.sand,
    padding: "10px 15px",
    fontWeight: 300,
    fontSize: constants.fontSizes.small,
    borderRadius: 3,
    lineHeight: 1.4,
  },
  error: {
    color: colors.red,
    border: `1px solid ${colors.red}`,
  },
};

export default Radium(Message);
