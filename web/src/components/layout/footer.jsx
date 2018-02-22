import React from "react";
import Radium from "radium";

import {
  constants,
  colors,
} from "../../style";

class Footer extends React.PureComponent {
  render() {
    return (
      <div style={styles.wrapper}>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: constants.FOOTER_HEIGHT,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 15px",
  }
};

export default Radium(Footer);
