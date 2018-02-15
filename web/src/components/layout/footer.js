import React from "react";
import Radium from "radium";

import {
  FOOTER_HEIGHT,
  PALETTE_PRIMARY
} from "../../style/constants";

class Footer extends React.PureComponent {
  render() {
    return (
      <div style={styles.wrapper}>
        Footer Content Here.
      </div>
    );
  }
}

const styles = {
  wrapper: {
    height: FOOTER_HEIGHT,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 15px",
    borderStyle: "solid hidden hidden hidden",
    borderWidth: "1px",
    borderColor: PALETTE_PRIMARY
  }
};

export default Radium(Footer);
