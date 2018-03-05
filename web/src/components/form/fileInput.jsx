import React from "react";
import Radium from "radium";

import {
  colors,
  constants,
} from "../../style";


class FileInput extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  onChange = (event) => {
    this.setState({
      file: event.target.files[0],
    });

    this.props.onChange(event.target.files[0]);
  }

  chooseFile = () => {
    this.fileInput.click();
  }

  renderInner = () => {
    if (!this.state.file) {
      return (
        <div style={styles.chooseBot}>
          Choose a file...
        </div>
      );
    }

    return (
      <div style={styles.botName}>
        {this.state.file.name}
      </div>
    );
  }

  render() {
    const { name } = this.props;
    return (
      <div style={styles.input} onClick={this.chooseFile}>
        { this.renderInner() }

        <input style={{ display: "none" }} ref={(input) => { this.fileInput = input; }} type="file" onChange={this.onChange} name={name} />
      </div>
    );
  }
}

const styles = {
  input: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: 3,
    padding: 10,
    height: constants.INPUT_HEIGHT,
    fontSize: constants.fontSizes.small,
    margin: "10px 0",
    cursor: "pointer",
    ":hover": {
      borderColor: colors.lightGray,
    },
  },
  chooseBot: {
    fontSize: constants.fontSizes.small,
    color: colors.blue,
  },
  botName: {
    fontSize: constants.fontSizes.small,
  },
  fileButton: {
    width: 150,
  },
};

export default Radium(FileInput);
