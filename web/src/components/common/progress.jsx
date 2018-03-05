import React from "react";
import Radium from "radium";

import { constants, colors } from "../../style";

class Progress extends React.PureComponent {
  render() {
    const { percentage } = this.props;
    const fillPercentage = { width: `${percentage}%` };
    return (
      <div style={styles.wrapper}>
        <div style={{...styles.fill, ...fillPercentage }}></div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    width: "100%",
    height: constants.PROGRESS_HEIGHT,
    borderColor: colors.red,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
  },
  fill: {
    height: "100%",
    transition: "width .1s",
    backgroundColor: colors.red,
  }
};

export default Radium(Progress);
