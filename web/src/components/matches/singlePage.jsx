import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { Page, Wrapper, TitleBar, Link } from "../layout";
import { fetchMatch } from "../../data/match/matchActions";
import { fetchLog } from "../../data/match/matchRoutes";
import ReplayVisualizer from "../replay/ReplayVisualizer";
import CellDetail from "../replay/CellDetails";
import { constants, colors } from "../../style";
import { COLORS } from "../replay/Canvas";

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

  onFrameChanged = (frameNumber) => {
    this.setState({ frameNumber });
  }

  onCellSelected = ({row, col}) => {
    this.setState({
      selectedRow: row, 
      selectedCol: col, 
    });
  }

  renderBots = () => {
    let bots = _.map(this.props.match.bots, (b, i) => ({ ...b, i }));
    bots = _.sortBy(bots, "rank");

    return _.map(bots, b => (
      <div key={b._id} style={[styles.botRow, b.user._id == this.props.sessionUserId ? styles.ownBot : null]}>
        { b.crashed ? <div style={styles.crashed}>Crashed!</div> : "" }
        { b.timedOut ? <div style={styles.crashed}>Timed Out!</div> : "" }
        <div key={b._id} style={styles.bot}>
          <div style={{display: "flex", alignItems: "flex-end"}}>
            <span style={styles.botRank}>{b.rank}</span>
            <Link style={[styles.botName, { color: "#" + COLORS[b.i].toString(16) }]} href={`/bots/${b._id}`}>{b.name}</Link>
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
      </div>
    ));
  }

  renderFailed = () => {
    return (<div><div style={[styles.replayAreaBox, styles.failureMessage]}>{"we don't have a replay for this game :("}</div></div>);
  }

  renderReplay = () => {
    if (this.props.match.result.success == false) {
      return this.renderFailed();
    }

    if (this.state.log) {
      if (this.state.log.turns.length === 0) {
        return this.renderFailed();
      }

      return  <ReplayVisualizer 
        hideSelectButton
        replay={this.state.log}
        onFrameChanged={this.onFrameChanged}
        onCellSelected={this.onCellSelected}
      />;
    } else {
      return <div><div style={[styles.replayAreaBox, styles.loading]}>Loading replay...</div></div>;
    }
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
              <div style={styles.cellDetail}>
                <h3 style={styles.title}>Cell Details</h3>
                { this.state.selectedRow != undefined ? 
                    <CellDetail
                      log={this.state.log}
                      turn={this.state.frameNumber}
                      row={this.state.selectedRow} 
                      col={this.state.selectedCol} 
                    /> : <div style={styles.cellDetail.placeholder}>Click on a cell to see specifics.</div> }
              </div>
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
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  botRow: {
    padding: "10px",
    borderBottom: `1px solid ${colors.border}`,
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
    fontWeight: 300,
  },
  otherBotTag: {
    color: colors.medGray,
    fontSize: constants.fontSizes.small,
    marginLeft: 10,
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
  replayAreaBox: {
    width: 570,
    height: 540,
    borderRadius: 3,
    display: "flex",
    margin: "0px auto",
    alignItems: "center",
    justifyContent: "center",
    fontSize: constants.fontSizes.large,
  },
  failureMessage: {
    border: `2px solid ${colors.border}`,
    color: colors.medGray,
  },
  loading: {
    border: `2px dashed ${colors.border}`,
    color: colors.lightGray,
  },
  crashed: {
    textTransform: "uppercase",
    fontWeight: 300,
    color: colors.darkGray,
    marginBottom: 3,
    fontSize: constants.fontSizes.small,
  },
  cellDetail: {
    marginTop: 30,
    placeholder: {
      color: colors.lightGray,
      fontSize: constants.fontSizes.medium,
    }
  }
};

const mapDispatchToProps = (dispatch, props) => ({
  fetchMatch: () => dispatch(fetchMatch(props.id)),
});

const mapStateToProps = (state, props) => ({
  sessionUserId: state.session.userId,
  match: state.matches.records[props.id] || {},
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchSinglePage);
