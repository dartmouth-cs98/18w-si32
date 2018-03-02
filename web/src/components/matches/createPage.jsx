import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import _ from "lodash";
import history from "../../history";
import Button from "../common/button";
import Message from "../common/message";
import { createMatch } from "../../data/match/matchActions";
import { fetchBots } from "../../data/bot/botActions";
import { Page, Wrapper } from "../layout";

import { fontStyles, colorStyles, colors, constants } from "../../style";

const BotView = Radium(({ bot }) => {
  return (
    <div style={styles.bot.wrapper}>
      <div style={styles.bot.title}>
        { bot.name }
      </div>
      <div style={styles.bot.skill}>{ bot.trueSkill.mu.toFixed(1) }</div>
    </div>
  );

});

const MatchBotList = ({ bots, selectedBotIds, botClicked }) => (
  _.map(bots, (b) => (
    <div onClick={() => botClicked(b._id)} key={b._id} style={styles.listBot}>
      <BotView bot={b} />
    </div>
  ))
);

class MatchCreatePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { ownBot: false, otherBot: false };
  }

  componentDidMount() {
    this.props.fetchBots();
  }

  chooseOwnBot = (botId) => {
    this.setState({
      ownBot: this.props.bots[botId],
    });
  }

  chooseOtherBot = (botId) => {
    this.setState({
      otherBot: this.props.bots[botId],
    });
  }

  create = () => {
    this.setState({
      submitting: true,
      error: false,
    });

    this.props.create([this.state.ownBot._id, this.state.otherBot._id]).then((m) => {
      history.push(`/matches/${m[0]._id}`);
    })
    .catch(err => {
      console.log("goterr", err);
      this.setState({
        error: _.get(err, "response.body.error"),
      });
    })
    .finally(() => {
      this.setState({ submitting: false });
    });
  }

  renderTitleBox = (bot, text) => {
    if (bot) {
      return (
        <div style={styles.selectedBots.bot}>
          <BotView bot={bot} />
        </div>
      );
    }

    return (
      <div style={styles.selectedBots.box}>
        <h3 style={styles.selectTitle}>{ text }</h3>
      </div>
    );
  }

  render() {
    return (
      <Page>
        <Wrapper>
          <div style={styles.createWrap}>
            <h1 style={styles.mainTitle}>Start a Match</h1>

            <Message kind="error" style={{marginTop: 15, alignSelf: "center"}}>{ this.state.error }</Message>

            <div style={styles.selectedBots.row}>
              { this.renderTitleBox(this.state.ownBot, "Choose one of your own bots") }
              <div style={styles.betweenSelector}>
                VS
              </div>
              { this.renderTitleBox(this.state.otherBot, "Choose a bot to compete against") }
            </div>

            <div style={styles.botSelectionRow}>
                <div style={styles.selector}>
                  <MatchBotList
                    botClicked={this.chooseOwnBot}
                    bots={ _.filter(this.props.bots, { user: this.props.sessionUserId }) }
                    selectedBotIds={this.state.bots}
                  />
                </div>
              <div style={styles.betweenSelector}>
              </div>

              <div style={styles.selector}>
                  <MatchBotList
                    botClicked={this.chooseOtherBot}
                    bots={ _.filter(this.props.bots, b =>  b.user != this.props.sessionUserId ) }
                    selectedBotIds={this.state.bots}
                  />
              </div>

            </div>

            <Button kind="primary" style={styles.createButton} onClick={this.create}>Create!</Button>
          </div>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  createWrap: {
    maxWidth: 800,
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
  },
  mainTitle: {
    color: colors.red,
    fontSize: constants.fontSizes.large,
  },
  selectTitle: {
    color: colors.medGray,
  },
  selectedBots: {
    row: {
      display: "flex",
      marginTop: 25,
    },
    bot: {
      flex: 1,
      border: `2px solid ${colors.border}`,
      backgroundColor: colors.sand,
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
    },
    box: {
      flex: 1,
      border: `2px dashed ${colors.border}`,
      borderRadius: 3,
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  bot: {
    wrapper: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      justifyContent: "space-between",
    },
    title: {
      color: colors.red,
      fontSize: constants.fontSizes.large,
      fontWeight: 400,
    },
    owner: {

    },
    skill: {
      fontSize: constants.fontSizes.small,
    },
  },
  listBot: {
    cursor: "pointer",
    margin: "5px 0",
  },
  botSelectionRow: {
    display: "flex",
    alignItems: "top",
    paddingTop: 25,
  },
  betweenSelector: {
    margin: 20,
    width: 30,
    textAlign: "center",
    color: colors.lightGray,
  },
  selector: {
    flex: 1,
    alignItems: "flex-start",
  },
  createButton: {
    width: 300,
    margin: "40px auto",
  },
};


const mapDispatchToProps = dispatch => ({
  create: (bots) => dispatch(createMatch(bots)),
  fetchBots: () => dispatch(fetchBots()),
});

const mapStateToProps = state => ({
  bots: state.bots.records,
  sessionUserId: _.get(state, "session.userId", ""),
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MatchCreatePage));
