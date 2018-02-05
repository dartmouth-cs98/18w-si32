import React from "react";
import Radium from "radium";

class Page extends React.PureComponent {
  render() {
    return (
      <div style={[styles.base]}>
        { this.props.children }
      </div>
    );
  }
}

const styles = {
  base: {
    maxWidth: 1080,
    margin: '0px auto',
  }
};

export default Radium(Page);
