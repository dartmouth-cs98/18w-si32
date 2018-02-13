import React from "react";
import Radium from "radium";

import { FOOTER_HEIGHT } from "../../style/constants";

class Footer extends React.PureComponent {
  render() {
    return (
      <div style={styles.wrapper}>
        hello footer
      </div>
    )
  }
}

const styles = {
  wrapper: {
    height: FOOTER_HEIGHT,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 15px"
  }
}

export default Radium(Footer);
