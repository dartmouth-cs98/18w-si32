import React from "react";
import Radium from "radium";

import {
  colors,
  constants,
} from "../../style";

class Input extends React.PureComponent {
  render() {
    const {
      kind,
      ...restProps
    } = this.props;
    return (
      <input
        {...restProps}
        style={[styles.base, styles[kind]]}
      />
    );
  }
}

const styles = {
  base: {
    width: "100%",
    height: constants.INPUT_HEIGHT,
    fontSize: constants.fontSizes.small,
    padding: 10,
    margin: "10px 0",
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: "2px",
    borderRadius: 3,
    ":focus": {
      borderColor: colors.lightGray,
    }
  },
};

export default Radium(Input);
