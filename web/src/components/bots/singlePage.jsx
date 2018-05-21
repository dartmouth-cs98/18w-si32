import React from "react";
import Radium from "radium";
import { connect } from "react-redux";
import history from "../../history";
import { Page, Wrapper, TitleBar } from "../layout";
import { fetchBot } from "../../data/bot/botActions";
import { colors, constants } from "../../style";
import SkillHistoryChart from "../common/SkillHistoryChart";

class BotSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchBot();
  }

  // when upload button pressed, open the file input
  updateBotClicked = (e) => {
    if (e) {
      e.preventDefault();
    }

    history.push(`/bots/${this.props.id}/update`);
  }

  render() {
    if (!this.props.bot) {
      return null;
    }

    return (
      <Page>
        <TitleBar
          title={this.props.bot.name}
          right={`v${this.props.bot.version}`}
          buttonLabel={(this.props.userId == this.props.bot.user) && "Update Bot"}
          buttonAction={this.updateBotClicked}
        />
        <input ref={(input) => this.input = input} type="file" style={styles.inputFile} onChange={this.handleFileChange} />
        <Wrapper>
           <div style={styles.statsRow}>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <div style={styles.statTitle}>Current Rating</div>
                <p style={styles.statBody}>{this.props.bot.trueSkill.mu.toFixed(1)}</p>
              </div>
            </div>

            <div style={[styles.skillGraphWrap, styles.stat]}>
              <div style={styles.statTitle}>Rating history</div>
              <div style={styles.skillGraph}>
                <SkillHistoryChart
                  height={350}
                  width={900}
                  useBotName={false}
                  data={this.props.bot.trueSkillHistory}
                  bots={[this.props.bot]}
                />
              </div>
            </div>

          </div>
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
  },
  groupActionBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20px"
  },
  followingButton: {
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.medGray,
    width: 150,
    height: 40,
    ":hover": {
      background: "transparent",
      borderWidth: 2,
      color: colors.medGray,
    },
  },
  statTitle: {
    color: colors.red,
    fontSize: constants.fontSizes.smaller,
    textTransform: "uppercase",
  },
  statBody: {
    color: colors.darkGray,
    fontSize: constants.fontSizes.larger,
    marginTop: 5,
  },
  statsRow: {
    display: "flex",
  },
  stat: {
    margin: "15px 0",
  },
  stats: {
    flex: 1,
  },
  secondary: {
    display: "flex",
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 20,
    marginTop: 0,
    main: {
      width: "60%",
      marginRight: 50,
      flexGrow: 0,
    },
    sidebar: {
      flex: 1,
    },
  },
  skillGraph: {
    marginTop: 15,
  },
  groupList: {
    marginBottom: 15,
    marginTop: 5,
  },
  groupTitle: {
    display: "flex",
    alignItems: "center",
  },
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchBot: () => dispatch(fetchBot(props.id)),
});

const mapStateToProps = (state, props) => ({
  bot: state.bots.records[props.id] || null,
  userId: state.session.userId,
});


export default connect(mapStateToProps, mapDispatchToProps)(Radium(BotSinglePage));
