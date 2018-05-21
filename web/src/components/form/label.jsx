import React from "react";
import Radium from "radium";

import {
  colors,
  constants,
} from "../../style";

const Label = ({ kind, children }) => (
  <label style={[styles.base, styles[kind]]}>
    { children }
  </label>
);

const styles = {
  base: {
    marginTop: "15px",
    display: "block",
    color: colors.darkGray,
    fontSize: constants.fontSizes.small,
  },
  sub: {
    color: colors.medGray,
  }
};

export default Radium(Label);
