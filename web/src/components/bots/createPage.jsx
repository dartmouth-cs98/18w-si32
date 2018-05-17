import React from "react";
import Radium from "radium";
import _ from "lodash";
import { connect } from "react-redux";

import Button from "../common/button";
import Message from "../common/message";
import history from "../../history";
import { Input, Label, FileInput } from "../form";
import { Page, Wrapper } from "../layout";
import { createBot } from "../../data/bot/botActions";
import BotParamSelect from "./BotParamSelect";

import { fontStyles, colorStyles } from "../../style";

class BotCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { botName: "", params: [] };
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

    this.setState({
      submitting: true,
      error: false,
    });

    this.props.create(this.state.botName, this.state.botFile, this.state.params).then(() => {
      // after making a bot, users probably want to start a match with it
      // TODO pre-select the bot
      history.push("/matches/create");
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

  paramsChanged = (params) => {
    this.setState({
      params,
    });
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.uploadWrap}>
            <h1 style={[fontStyles.large, colorStyles.red]}>Create a Bot</h1>
            <form style={styles.form} onSubmit={this.submit}>
              <Message kind="error">{ this.state.error }</Message>
              <Label>Name your bot</Label>
              <Input
                name="botName"
                type="text"
                value={this.state.botName}
                onChange={this.handleInputChange}
              />
              <Label>
                Select your {"bot's"} code file <span style={colorStyles.lightGray}>(.py only!)</span>
              </Label>
              <FileInput
                name="botFile"
                onChange={this.handleFileChange}
              />

              <div style={{marginTop: 30}}>
                <BotParamSelect file={this.state.botFile} onChange={this.paramsChanged} />
              </div>

              <input type="submit" style={{display: "none"}} />
              <Button kind="primary" onClick={this.submit} style={styles.submitButton} disabled={this.state.submitting}>
                { this.state.submitting ? "Creating your bot" : "Create bot" }
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
    maxWidth: 600,
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
  create: (name, file, params) => dispatch(createBot(name, file, params)),
});

export default connect(null, mapDispatchToProps)(Radium(BotCreatePage));
