import React from "react";
import Radium from "radium";
import Button from "../common/button";
import { MainTitle } from "../common/titles";
import { Wrapper } from "./";
import {
  colors,
  constants,
} from "../../style";

class TitleBar extends React.PureComponent {
  renderButton = () => {
    if (!this.props.buttonLabel || !this.props.buttonAction) {
      return null;
    }

    return (
      <Button
        kind="primary"
        size="small"
        style={styles.buttonStyles}
        onClick={this.props.buttonAction}>
        { this.props.buttonLabel }
      </Button>
    );
  }

  render() {
    return (
      <Wrapper innerStyle={styles.wrap}>
        <MainTitle>{ this.props.title }</MainTitle>
        <div style={styles.right}>
          <div style={styles.rightTitle}>{ this.props.right }</div>
          { this.renderButton() }
        </div>
      </Wrapper>
    );
  }
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 10,
    paddingTop: 10
  },
  right: {
    display: "flex",
    alignItems: "center",
  },
  rightTitle: {
    marginTop: 0,
    color: colors.lightGray,
    fontSize: constants.fontSizes.large,
  },
  buttonStyles: {
    padding: "0 40px",
    height: 40,
    marginLeft: 20,
  }
};

export default Radium(TitleBar);
