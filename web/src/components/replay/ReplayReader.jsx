import React from "react";
import { connect } from "react-redux";
import Color from "color";

import Page from "../layout/page";

import { colors, constants } from "../../style"

class ReplayReader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dragOver: false
    };
  }

  componentWillMount() {
    this.reader = this.setupFileReader();
  }

  componentDidMount() {
    const dropZone = document.getElementById('dropZone');

    dropZone.addEventListener('dragenter', this.handleDragEnter, false);
    dropZone.addEventListener('dragleave', this.handleDragLeave, false);
    dropZone.addEventListener('dragover', this.handleDragOver, false);
    dropZone.addEventListener('drop', this.handleFileSelect, false);
  }

  componentWillUnmount() {
    const dropZone = document.getElementById('dropZone');

    dropZone.removeEventListener('dragenter', this.handleDragEnter, false);
    dropZone.removeEventListener('dragleave', this.handleDragLeave, false);
    dropZone.removeEventListener('dragover', this.handleDragOver, false);
    dropZone.removeEventListener('drop', this.handleFileSelect, false);
  }

  setupFileReader = () => {
    const reader = new FileReader();
    reader.onload = (f) => {
      this.props.setReplayFile(JSON.parse(f.target.result));
    };

    return reader;
  };

  handleDragEnter = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ dragOver: true });
  };

  handleDragLeave = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ dragOver: false });
  };

  handleDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();

    event.dataTransfer.dropEffect = "copy";
  };

  handleFileSelect = (event) => {
    event.stopPropagation();
    event.preventDefault();

    let file;
    if (event.dataTransfer) {
      // if this is a drag / drop event
      file = event.dataTransfer.files[0];

    } else {
      // if this is a traditional input event
      file = event.target.files[0];
    }

    this.reader.readAsText(file, "utf-8");
  };

  renderFileSelectButton() {
    return (
      <div style={styles.buttonContainer}>
        <input type="file"
               name="file"
               id="file"
               style={styles.hiddenInput}
               onChange={this.handleFileSelect}
               name="files[]" />
         <label style={styles.selectButton}
                htmlFor="file">
                Choose a file
         </label>
      </div>
    );
  }

  render() {
    const dropZoneCnd = this.state.dragOver ? styles.dropZoneLit : {}
    const fileSelectButton = this.state.dragOver ? null : this.renderFileSelectButton();

    return (
      <Page>
        <div style={styles.wrapper}>
          <div style={styles.uploadHeader}>Replay Your Bot</div>

          <div style={{...styles.dropZoneBase, ...dropZoneCnd}} id="dropZone">
            {fileSelectButton}
            Drop a Replay File to Upload
          </div>

        </div>
      </Page>
    );
  }
}

const styles = {
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "40px"
  },
  uploadHeader: {
    color: colors.red,
    fontSize: "30px"
  },
  dropZoneBase: {
    width: "60%",
    height: "400px",
    borderStyle: "solid",
    borderRadius: "2px",
    borderColor:  Color(colors.detail).lighten(0.7).string(),
    borderWidth: "1px",
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  dropZoneLit: {
    backgroundColor: Color(colors.red).lighten(0.9).string()
  },
  buttonContainer: {
    width: "50%"
  },
  hiddenInput: {
    width: "0.1px",
    height: "0.1px",
    opacity: "0",
    overflow: "hidden",
    position: "absolute",
    zIndex: "-1"
  },
  selectButton: {
    width: "100%",
    height: constants.BUTTON_HEIGHT,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "15px 0",
    backgroundColor: colors.background,
    color: colors.red,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.red,
    borderRadius: "2px",
    ":hover": {
      backgroundColor: colors.red,
      color: colors.background,
      cursor: "pointer"
    }
  }
};

export default connect(null, null)(ReplayReader);
