import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import { fetchBots, fetchBot, updateBotCode } from "../../data/bot/botActions";

class BotSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchBot();
  }

  handleFileChange = (event) => {
    // store handle to the selected file
    this.setState({
      botFile: event.target.files[0]
    });
  }

  submit = (event) => {
    event.preventDefault();
    // TODO validation

    this.props.upload(this.state.botFile);
  }

  renderForm = () => {
    if (this.props.userId != this.props.bot.user) {
      return null;
    }

    return (
      <form onSubmit={this.submit}>
        <label>
          Bot file (zip only):
          <input
            name="botFile"
            type="file"
            onChange={this.handleFileChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }

  render() {
    return (
      <Page>
        <h1>Bot: {this.props.bot.name}</h1>
        <h3>{this.props.id}</h3>
        <p>Version {this.props.bot.version}</p>
        { this.renderForm() }

      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchBot: () => dispatch(fetchBot(props.id)),
  upload: (file) => dispatch(updateBotCode(props.id, file)),
});

const mapStateToProps = (state, props) => ({
  bot: state.bots.records[props.id] || {},
  userId: state.session.userId,
});

export default connect(mapStateToProps, mapDispatchToProps)(BotSinglePage);
