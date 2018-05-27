import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import config from "../../config";

import { Link } from "../layout";

import { createBot } from "../../data/bot/botActions";

import { colors, constants, fontStyles, colorStyles } from "../../style";

const { DEVKIT_URL } = config;

class OnboardModal extends Component {
  downloadDevkit = () => {
    window.open(DEVKIT_URL, "_blank");
  }

  render() {
    const { showModal, markUserOnboarded } = this.props;

    return (
      <Modal
        isOpen={showModal}
        style={styles.modalStyles}
        contentLabel="Monad Onboarding">
        <div style={styles.modalTitle}>Welcome to Monad!</div>
        <div>Follow the 3 steps below to get started by uploading your first bot.</div>
        <div style={styles.listContainer}>
          <div style={styles.listItem}>1. Download the <Link href="#" onClick={this.downloadDevkit}>development kit</Link></div>
          <div style={styles.listItem}>2. Copy and paste the code below into 'bot.py' where indicated</div>
          <div style={styles.codeBlock}>
            cells = game.get_my_cells()
            <br/>
            for cell in cells:
            <br/>
            <span style={styles.indent}>game.move(cell.position, 1, choice(game.get_movement_directions()))</span>
          </div>
          <div style={styles.listItem}>3. Upload your bot from the <Link href="/bots/create" onClick={markUserOnboarded}>bot creation page</Link></div>
        </div>
      </Modal>
    )
  }
}

const styles = {
  modalStyles: {
    content : {
      width: "80%",
      height: "60%",
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
  listContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "10px"
  },
  listItem: {
    padding: "15px"
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
  }
}

export default OnboardModal;
