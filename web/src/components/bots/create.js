import React from "react";
import { connect } from "react-redux";
import Page from "../layout/page";
import { Link, history } from "../../router";
import { createBot } from "../../data/bot/botActions";

class BotCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {botName: ""};
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleFileChange = event => {
    // store handle to the selected file
    this.state.botFile = event.target.files[0];
  };

  submit = (event) => {
    console.log("submitted");
    event.preventDefault();
    // TODO validation

    this.props.create(this.state.botName, this.state.botFile);
  };


  render() {
    return (
      <Page>
        <h1>Create a Bot</h1>
        <form onSubmit={this.submit}>
          <label>
            Username:
            <input
              name="botName"
              type="text"
              value={this.state.botName}
              onChange={this.handleInputChange}
            />
          </label>
          <br/>
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

const mapDispatchToProps = dispatch => ({
  create: (name, file) => dispatch(createBot(name, file)),
});

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(BotCreatePage);
