import React from "react";
import { connect } from "react-redux";

import { Page, Wrapper } from "../layout";
import { createBot } from "../../data/bot/botActions";

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

  handleFileChange = (event) => {
    // store handle to the selected file
    this.setState({
      botFile: event.target.files[0]
    });
  }

  submit = (event) => {
    event.preventDefault();
    // TODO validation

    this.props.create(this.state.botName, this.state.botFile);
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <h1>Create a Bot</h1>
          <form onSubmit={this.submit}>
            <label>
              Bot name:
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
        </Wrapper>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  create: (name, file) => dispatch(createBot(name, file)),
});

export default connect(null, mapDispatchToProps)(BotCreatePage);
