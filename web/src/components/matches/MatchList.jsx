import React from "react";
import Radium from "radium";
import moment from "moment";
import _ from "lodash";
import Button from "../common/button";

import { colors, constants } from "../../style";

class MatchList extends React.PureComponent {

  renderBotList = (match) => {
    const bots = _.sortBy(match.bots, "rank");
    return _.map(bots, b => (
      <div key={b._id} style={[styles.bot]}>
        <div style={{display: "flex", alignItems: "flex-end"}}>
          <span style={styles.botRank}>{b.rank}</span>
          <span style={styles.botName}>{b.name}</span>
          <span style={styles.botVersion}>v{b.version}</span>
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

  render() {
    const items = _.map(this.props.matches, m =>
      <div key={m._id} style={styles.wrapper}>
        <div style={styles.header}>
          <Button style={styles.matchLink} kind="tertiary" href={`/matches/${m._id}`}>See match replay &rarr;</Button>
          <div style={styles.date}>{ moment(m.updatedAt).fromNow() }</div>
        </div>
        { this.renderBotList(m) }
      </div>
    );

    return <div>{items}</div>;
  }
}

const styles = {
  matchLink: {
    fontSize: constants.fontSizes.medium,
  },
  header: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: colors.lightGray,
  },
  wrapper: {
    padding: "15px 0",
    borderBottom: `1px solid ${colors.border}`,
  },
  botSkill: {
    flex: 1,
    fontSize: constants.fontSizes.medium,
    textAlign: "right",
  },
  botSkillDelta: {
    marginLeft: 5,
    width: 40,
    display: "inline-block",
  },
  botVersion: {
    color: colors.lightGray,
    fontSize: constants.fontSizes.medium,
    marginLeft: 5,
  },
  botDeltaPositive: {
    color: colors.green,
  },
  botDeltaNegative: {
    color: colors.red,
  },
  bot: {
    padding: "5px 0px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  botName: {
    color: colors.darkGray,
    fontWeight: 500,
    fontSize: constants.fontSizes.medium,
  },
  botRank: {
    color: colors.medGray,
    width: 20,
    fontSize: constants.fontSizes.medium,
  },

};

export default Radium(MatchList);
