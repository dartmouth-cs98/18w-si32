import React from "react";
import Radium from "radium";
import { connect } from "react-redux";

import Button from "../common/button";
import { Input, Label, FileInput } from "../form";
import { Page, Wrapper } from "../layout";
import { createBot } from "../../data/bot/botActions";

import { fontStyles, colorStyles } from "../../style";

class BotCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { botName: "" };
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
    // TODO validation

    this.props.create(this.state.botName, this.state.botFile);
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.uploadWrap}>
            <h1 style={[fontStyles.large, colorStyles.red]}>Create a Bot</h1>
            <form style={styles.form} onSubmit={this.submit}>
              <Label>Name your bot</Label>
              <Input
                name="botName"
                type="text"
                value={this.state.botName}
                onChange={this.handleInputChange}
              />
              <Label>
                Select your bot's code file <span style={colorStyles.lightGray}>(.py only!)</span>
              </Label>
              <FileInput
                name="botFile"
                onChange={this.handleFileChange}
              />

              <input type="submit" style={{display: "none"}} />
              <Button kind="primary" onClick={this.submit} style={styles.submitButton}>
                Create new bot!
              </Button>
            </form>
          </div>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  uploadWrap: {
    maxWidth: 500,
    margin: "20px auto",
  },
  form: {
    marginTop: 20,
  },
  submitButton: {
    width: 300,
    margin: "40px auto",
  },
};

const mapDispatchToProps = dispatch => ({
  create: (name, file) => dispatch(createBot(name, file)),
});

export default connect(null, mapDispatchToProps)(Radium(BotCreatePage));
