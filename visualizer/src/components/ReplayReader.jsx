import React, { PureComponent } from "react";

import Button from "./button";

import { colors, constants } from "../style";

// need to do 'window.require' here instead of 'require'
// to deconflict electron and webpack require functions
const fs = window.require("fs");
const { dialog } = window.require("electron").remote;

class ReplayReader extends PureComponent {
  // TODO: more rigorous file verification
  verifyReplayFile = (json) => {
    if (!json.w || !json.h) {
      // must have width and height properties
      return false;
    } else if (!json.turns || !Array.isArray(json.turns)) {
      // turns array must be present
      return false;
    }
    return true;
  };

  openFileDialog = () => {
    dialog.showOpenDialog((filenames) => {
      if (filenames === undefined) {
        // TODO: inform user
        return;
      }

      // use the filesystem to read the local file
      fs.readFile(filenames[0], "utf-8", (err, data) => {
        if (err) {
          // TODO: alert user to bad file, or other error when reading
          return;
        }
        let result;
        try {
          result = JSON.parse(data);
        } catch(SyntaxError) {
          // thrown by failed JSON.parse()
          // TODO: inform user
          return;
        }

        if (this.verifyReplayFile(result)) {
          // good to go
          this.props.setReplayFile(result);
        } else {
          // TODO: inform user
          return;
        }
      });
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.mainText}>Monad Match Visualizer</div>
        <Button kind={"primary"} style={styles.fileSelectButton} onClick={this.openFileDialog}>
          <div>Select a Replay File</div>
        </Button>
      </div>
    );
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  mainText: {
    fontSize: constants.fontSizes.largest,
    color: colors.blue,
    paddingBottom: "30px",
  },
  fileSelectButton: {
    width: 180,
  }
}

export default ReplayReader;
