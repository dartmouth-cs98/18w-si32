import React, { PureComponent } from "react";

// need to do window.require here instead of require
// to deconflict electron and webpack 'require' functions
const fs = window.require("fs");
const { dialog } = window.require("electron").remote;

class ReplayReader extends PureComponent {
  openFileDialog = () => {
    dialog.showOpenDialog((filenames) => {
      if (filenames === undefined) {
        return;
      }

      // use the filesystem to read the local file
      fs.readFile(filenames[0], "utf-8", (err, data) => {
        if (err) {
          // TODO: alert user to bad file, or other error when reading
          return;
        }
        // got the file data, so set the replay file to contents
        this.props.setReplayFile(data);
      });
    });
  }

  render() {
    return (
      <div onClick={this.openFileDialog}>Click Me</div>
    );
  }
}

export default ReplayReader;
