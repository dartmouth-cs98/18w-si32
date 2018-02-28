import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import { MainTitle, SubTitle } from "../common/titles";
import { Page, Wrapper, TitleBar } from "../layout";
import { fetchBot, updateBotCode } from "../../data/bot/botActions";

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
    // TODO check on client side that this is valid
    this.props.upload(event.target.files[0]);
  }

  // when upload button pressed, open the file input
  uploadNewBot = () => {
    this.input.click();
  }

  submit = (event) => {
    event.preventDefault();
    // TODO validation


  }

  render() {
    return (
      <Page>
        <TitleBar
          title={this.props.bot.name}
          right={`v${this.props.bot.version}`}
          buttonLabel={(this.props.userId == this.props.bot.user) && "Upload a new version"}
          buttonAction={this.uploadNewBot}
        />
        <input ref={(input) => this.input = input} type="file" style={styles.inputFile} onChange={this.handleFileChange} />
        <Wrapper>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  inputFile: {
    width: 0,
    height: 0,
    position: "absolute",
    top: -10,
    display: "none",
    left: -10,
  }
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchBot: () => dispatch(fetchBot(props.id)),
  upload: (file) => dispatch(updateBotCode(props.id, file)),
});

const mapStateToProps = (state, props) => ({
  bot: state.bots.records[props.id] || {},
  userId: state.session.userId,
});


export default connect(mapStateToProps, mapDispatchToProps)(Radium(BotSinglePage));
