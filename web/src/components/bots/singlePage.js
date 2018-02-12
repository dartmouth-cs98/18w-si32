import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { fetchBots, updateBotCode } from "../../data/bot/botActions";

class BotSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  handleFileChange = event => {
    // store handle to the selected file
    this.state.botFile = event.target.files[0];
  };

  submit = event => {
    console.log("submitted");
    event.preventDefault();
    // TODO validation

    this.props.upload(this.state.botFile);
  };


  render() {
    return (
      <Page>
        <h1>Bot: {this.props.bot.name}</h1>
        <h3>{this.props.id}</h3>
        <p>Version {this.props.bot.version}</p>
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
      </Page>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  fetchBots: () => dispatch(fetchBots()),
  upload: (file) => dispatch(updateBotCode(props.id, file)),
});

const mapStateToProps = (state, props) => ({
  bot: state.bots.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(BotSinglePage);
