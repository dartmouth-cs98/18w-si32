import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { Page, Wrapper, TitleBar, Link } from "../layout";
import { fetchMatch } from "../../data/match/matchActions";
import { fetchLog } from "../../data/match/matchRoutes";
import ReplayVisualizer from "../replay/ReplayVisualizer";
import { constants, colors } from "../../style";

class MatchSinglePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchMatch().then(res => {
      // load the game log from S3
      if (res.body.logUrl) {
        return fetchLog(res.body.logUrl);
      } else {
        return {};
      }
    }).then(log => {
      this.setState({ log });
    });
  }

  renderBots = () => {
    const bots = _.sortBy(this.props.match.bots, "rank");
    return _.map(bots, b => (
      <div key={b._id} style={[styles.bot, b.user._id == this.props.sessionUserId ? styles.ownBot : null]}>
        <div style={{display: "flex", alignItems: "flex-end"}}>
          <span style={styles.botRank}>{b.rank}</span>
          <span style={styles.botName}>{b.name}</span>
          <span style={styles.botVersion}>v{b.version}</span>
          { b.user._id == this.props.sessionUserId ?
            <span style={styles.ownBotTag}>(You)</span> :
            <Link style={styles.otherBotTag} href={`/users/${ b.user._id }`}>{b.user.username}</Link>}
        </div>
        <div style={styles.botSkill}>
          {b.trueSkill.mu.toFixed(1)}
          <span style={[styles.botSkillDelta, b.trueSkill.delta > 0 ? styles.botDeltaPositive : styles.botDeltaNegative]}>
            { b.trueSkill.delta > 0 ? "+" : ""}{b.trueSkill.delta.toFixed(1)}
          </span>
        </div>
      </div>
    ));
  }

  renderReplay = () => {
    if (this.state.log) {
      return <ReplayVisualizer replay={this.state.log} />;
    }

    return null;
  }

  renderNotDone = () => (
      <Page>
        <Wrapper>
        <div>Game is currently running, check back in a bit</div>
      </Wrapper>
    </Page>
  )

  render() {
    if (!this.props.match) return null;

    if (this.props.match.status !== "DONE") {
      return this.renderNotDone();
    }

    return (
      <Page>
        <Wrapper>
          <TitleBar
            title={"Match Results"}
            right={moment(this.props.match.createdAt).format("MMMM D")}
          />
          <div style={styles.matchRow}>
            <div style={styles.gameViewer}>
              { this.renderReplay() }
            </div>
            <div style={styles.matchInfo}>
              <h3 style={styles.title}>Bot Finish Order</h3>
              { this.renderBots() }
            </div>
          </div>
        </Wrapper>
      </Page>
    );
  }
}

const styles = {
  gameViewer: {
    flex: 1,
    padding: "0 20px",
  },
  matchRow: {
    display: "flex",
  },
  matchInfo: {
    marginTop: 10,
    minWidth: 500,
  },
  title: {
    fontSize: constants.fontSizes.large,
    fontWeight: 400,
    margin: "0 0 10px 0",
  },
  bot: {
    padding: "10px 10px",
    borderBottom: `1px solid ${colors.border}`,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  botName: {
    color: colors.red,
    fontSize: constants.fontSizes.large,
  },
  botRank: {
    color: colors.medGray,
    fontWeight: 500,
    width: 30,
    fontSize: constants.fontSizes.medium,
  },
  ownBot: {
    background: colors.sand,
  },
  ownBotTag: {
    color: colors.lightGray,
    fontSize: constants.fontSizes.small,
    marginLeft: 10,
    alignSelf: "center",
    fontWeight: 300,
  },
  otherBotTag: {
    color: colors.medGray,
    fontSize: constants.fontSizes.small,
    marginLeft: 10,
    alignSelf: "center",
    fontWeight: 400,
    ":hover": {
      color: colors.red,
    },
  },
  botSkill: {
    flex: 1,
    fontSize: constants.fontSizes.medium,
    textAlign: "right",
  },
  botSkillDelta: {
    marginLeft: 10,
    width: 50,
    display: "inline-block",
  },
  botVersion: {
    color: colors.lightGray,
    fontSize: constants.fontSizes.large,
    marginLeft: 10,
  },
  botDeltaPositive: {
    color: colors.green,
  },
  botDeltaNegative: {
    color: colors.red,
  },
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchMatch: () => dispatch(fetchMatch(props.id)),
});

const mapStateToProps = (state, props) => ({
  sessionUserId: state.session.userId,
  match: state.matches.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchSinglePage);
