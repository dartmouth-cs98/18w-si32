import React from "react";
import Radium from "radium";
import Color from "color";

import { constants, colors } from "../../style";

class Progress extends React.PureComponent {
  render() {
    const { percentage } = this.props;
    const fillPercentage = { width: `${percentage}%` };
    return (
      <div style={styles.wrapper}>
        <div style={{...styles.fill, ...fillPercentage }}></div>
      </div>
    )
  }
}

const styles = {
  wrapper: {
    width: "100%",
    height: constants.PROGRESS_HEIGHT,
    borderColor: colors.primary,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "2px",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary
  }
}

export default Progress;
