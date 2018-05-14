import React from "react";
import Radium from "radium";

import { constants } from "../style";

// puts children into a max-width child but wrapper spans full width of screen
const Wrapper = Radium((props) => (
  <div style={{...styles.wrapper, ...props.style}}>
    <div style={[styles.row, props.innerStyle]}>
      { props.children }
    </div>
  </div>
));

const styles = {
  wrapper: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  row: {
    maxWidth: constants.BODY_WIDTH,
    margin: "0px auto",
  }
};

export default Wrapper;
