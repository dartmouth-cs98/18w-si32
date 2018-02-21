import React from "react";
import Radium from "radium";
import Color from "color";

import history from "../../history";
import { constants, colors } from "../../style";

// generic button class
// kind=primary|secondary|tertiary
// TODO implement size prop
class _Button extends React.PureComponent {
  onClick = (event) => {
    // if the button should just act like a link and take us somewhere
    if (this.props.href) {
      // if attempting to open in new window or something else funky, do nothing
      if (event.shiftKey || event.ctrlKey || event.metaKey) {
        return;
      }

      history.push(this.props.href);
      event.preventDefault();
    } else if(this.props.onClick) { // otherwise, use onClick passed in by consumer
      this.props.onClick();
    } else { // whoops!
      console.log("No onClick prop passed!"); // eslint-disable-line
    }
  }

  render() {
    const { style, kind, href, size, children } = this.props;
    return (
      // using anchor to be able to get native browser behavior when we want it
      <a href={href} onClick={this.onClick} style={[
        styles.base.wrapper,
        styles[kind].wrapper,
        (styles[kind][size] || {}).wrapper,
        style
      ]}>
        <span style={[styles.base.inner, styles[kind].inner]}>
          { children }
        </span>
      </a>
    );
  }
}

const Button = Radium(_Button);

const styles = {
  base: {
    wrapper: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: constants.fontSizes.medium,
      color: colors.blue,
      textDecoration: "none",
    },
    inner: {
    },
  },
  primary: {
    wrapper: {
      borderWidth: 3,
      borderStyle: "solid",
      borderColor: colors.blue,
      borderRadius: "100px", // just something large to make a pill
      padding: "5px 10px",
      height: 50,
      fontWeight: 500,
      ":hover": {
        background: colors.blue,
        color: "white",
      },
    },
    inner: {
    },
    small: {
      wrapper: {
        fontSize: constants.fontSizes.small,
        fontWeight: 400,
        height: "initial",
        padding: "5px 20px",
      },
    }
  },
  secondary: {
    wrapper: {
      borderRadius: "50px",
      boxShadow: "0 2px 5px rgba(0,0,0,.15)",
      padding: "4px 15px",
      height: 25,
      fontSize: constants.fontSizes.smaller,
      transition: "box-shadow .1s",
      ":hover": {
        boxShadow: "0 3px 5px rgba(0,0,0,.23)",
      },
    },
    inner: {
    },
  },
  tertiary: {
    wrapper: {
      height: 25,
      padding: "3px 5px",
      fontSize: constants.fontSizes.smaller,
      ":hover": {
        color: Color(colors.blue).darken(0.4).string(),
      },
    },
    inner: {
    },
  },
};

export default Button;
