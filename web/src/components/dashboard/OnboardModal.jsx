import Modal from "react-modal";
import { connect } from "react-redux";
import React, { Component } from "react";

import config from "../../config";

import Button from "../common/button";
import { Link } from "../layout";
import { Input, FileInput } from "../form";

import { createBot } from "../../data/bot/botActions";

import { colors, constants, fontStyles, colorStyles } from "../../style";

const { DEVKIT_URL } = config;

class OnboardModal extends Component {
  constructor(props) {
    super(props);
    this.state = { botName: "" };
  }

  downloadDevkit = () => {
    window.open(DEVKIT_URL, "_blank");
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleFileChange = (file) => {
    // store handle to the selected file
    this.setState({
      botFile: file,
    });
  }

  submit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (this.state.botName === "" || !this.state.botFile) {
      // very basic validation
      return;
    }

    this.setState({
      submitting: true,
      error: false,
    });

    // NOTE: always submitting an empty list of params here.
    // I just went ahead and assumed we dont want to get any
    // more involved than necessary on the onboard bot, but we
    // could alter this in the future.
    this.props.create(this.state.botName, this.state.botFile, []).then(() => {
      // mark the user as onboarded back on the dash
      // just closes the modal and brings back to dash
      this.props.markUserOnboarded();
    })
    .catch(err => {
      this.setState({
        error: _.get(err, "response.body.error") || err,
      });
    })
    .finally(() => {
      this.setState({
        submitting: false,
      });
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        style={styles.modalStyles}
        contentLabel="Monad Onboarding">
        <div style={styles.modalTitle}>Welcome to Monad!</div>
        <div style={styles.subtitle}>Follow the 4 steps below to get started by uploading your first bot.</div>
        <div style={styles.listContainer}>
          <div style={styles.listItem}>1. Download and unpack the <Link href="#" onClick={this.downloadDevkit}>development kit</Link></div>
          <div style={styles.listItem}>2. Copy and paste the code below into 'bot.py' where indicated</div>
          <div style={styles.codeBlock}>
            cells = game.get_my_cells()
            <br/>
            for cell in cells:
            <br/>
            <span style={styles.indent}>game.move(cell.position, 1, choice(game.get_movement_directions()))</span>
          </div>
          <form style={styles.form} onSubmit={this.submit}>
            <div style={styles.listItem}>3. Name your bot</div>
            <div style={styles.justifyLeft}>
              <Input
                name="botName"
                type="text"
                value={this.state.botName}
                onChange={this.handleInputChange}/>
            </div>
            <div style={styles.listItem}>4. Select your {"bot's"} code file <span style={colorStyles.lightGray}>(.py only!)</span></div>
            <div style={styles.justifyLeft}>
              <FileInput
                name="botFile"
                onChange={this.handleFileChange}/>
            </div>
            <input type="submit" style={{display: "none"}} />
          </form>
        </div>
        <div style={styles.buttonContainer}>
          <Button kind="primary" onClick={this.submit} style={styles.submitButton} disabled={this.state.submitting}>
            { this.state.submitting ? "Creating your bot" : "Create bot" }
          </Button>
        </div>
      </Modal>
    )
  }
}

const styles = {
  modalStyles: {
    content : {
      width: "80%",
      height: "70%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "rubik",
      fontWeight: 300,
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderColor: colors.blue,
      borderStyle: "solid"
    }
  },
  modalTitle: {
    fontSize: constants.fontSizes.larger,
    color: colors.blue,
    padding: "10px"
  },
  subtitle: {
    color: colors.lightGray
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "10px"
  },
  listItem: {
    padding: "10px"
  },
  codeBlock: {
    backgroundColor: "#eee",
    border: "1px solid #999",
    display: "block",
    padding: "15px",
    marginLeft: "30px"
  },
  indent: {
    paddingLeft: "15px"
  },
  justifyLeft: {
    "marginLeft": "30px"
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  submitButton: {
    width: 300,
    margin: "20px auto",
  },
}

const mapDispatchToProps = dispatch => ({
  create: (name, file, params) => dispatch(createBot(name, file, params)),
});

export default connect(null, mapDispatchToProps)(OnboardModal);
