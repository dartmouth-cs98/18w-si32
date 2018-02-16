import React from "react";
import Radium from "radium";

import { constants } from "../../style";

class Page extends React.PureComponent {
  render() {
    return <div style={[styles.base]}>{this.props.children}</div>;
  }
}

const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const pageHeight = vh - constants.NAVBAR_HEIGHT*2;

const styles = {
  base: {
    minHeight: pageHeight,
    maxWidth: 1080,
    margin: "0px auto",
  }
};

export default Radium(Page);
