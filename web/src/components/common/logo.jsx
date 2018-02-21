import React from "react";
import Radium from "radium";
import {
  colors,
  constants,
} from "../../style";
import Link from "../layout/link";

const Logo = (props) => {
  return (
    <div key="main-logo" style={styles.logoContainer}>
      <div style={styles.logoOuter}><div style={styles.logoInner}></div></div>
    </div>
  );
};

const styles = {
  logoOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: "3px",
    borderColor: colors.red,
    backgroundColor: "#FFFFFF"
  },
  logoInner: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: colors.red
  },
  logoContainer: {
    position: "relative",
    width: "30px",
    height: "30px"
  },
};

export default Radium(Logo);
