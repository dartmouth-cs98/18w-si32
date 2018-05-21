import React from "react";
import Radium from "radium";
import _ from "lodash";
import { connect } from "react-redux";

import Button from "../common/button";
import Message from "../common/message";
import history from "../../history";
import { Label, FileInput } from "../form";
import { Page, Wrapper } from "../layout";
import { createBot, fetchBot, updateBot } from "../../data/bot/botActions";
import BotParamSelect from "./BotParamSelect";

import { fontStyles, colorStyles } from "../../style";

class BotUpdatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { botName: "", params: [] };
  }

  componentDidMount() {
    this.props.fetchBot();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bot.params != _.get(this.props, "bot.params")) {
      this.setState({ params: nextProps.bot.params });
    }
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

    this.props.update(this.state.botFile, this.state.params).then(() => {
      history.push(`/bots/${this.props.id}`);
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
    if (!this.props.bot) {
      return null;
    }

    return (
      <Page>
        <Wrapper>
          <div style={styles.uploadWrap}>
            <h1 style={[fontStyles.large, colorStyles.red]}>Update {this.props.bot.name}</h1>
            <p style={{marginTop: 15, lineHeight: 1.4}}>
              You can update your {"bot's"} code and/or its parameters. You can leave the file selection
              empty if you only want to update parameters.
            </p>
            <form style={styles.form} onSubmit={this.submit}>
              <Message kind="error">{ this.state.error }</Message>
              <Label>
                Select your {"bot's"} code file <span style={colorStyles.lightGray}>(.py only!)</span>
              </Label>
              <FileInput
                name="botFile"
                onChange={this.handleFileChange}
              />

              <div style={{marginTop: 30}}>
                <BotParamSelect
                  initialParams={this.state.params}
                  file={this.state.botFile}
                  onChange={this.paramsChanged}
                />
              </div>

              <input type="submit" style={{display: "none"}} />
              <Button kind="primary" onClick={this.submit} style={styles.submitButton} disabled={this.state.submitting}>
                { this.state.submitting ? "Updating your bot..." : "Update bot" }
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

const mapDispatchToProps = (dispatch, props) => ({
  fetchBot: () => dispatch(fetchBot(props.id)),
  create: (name, file) => dispatch(createBot(name, file)),
  update: (file, params) => dispatch(updateBot(props.id, file, params)),
});

const mapStateToProps = (state, props) => ({
  bot: state.bots.records[props.id] || null,
  userId: state.session.userId,
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(BotUpdatePage));
