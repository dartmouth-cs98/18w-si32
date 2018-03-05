import React from "react";
import Radium from "radium";
import _ from "lodash";

import Button from "../common/button";
import StatDifference from "../common/statDifference";
import { Wrapper } from "../layout/wrappers";

import { colors, constants, fontStyles } from "../../style";

const HeaderStatsBar = ({ user }) => {
  if (!_.get(user, "ranks.global")) {
    return null;
  }

  // arbitrarily chosen group to show
  const group = user.groups[0];
  const groupRank = user.ranks[group && group._id];

  return (<Wrapper style={styles.wrapper} innerStyle={styles.inner}>
    <div style={styles.statContainer}>
      <h3 style={styles.title}>Your skill rating</h3>
      <div style={styles.statRow}>
        <span style={styles.stat}>{user.trueSkill.mu.toFixed(1)}</span>
        <StatDifference history={user.trueSkillHistory} />
      </div>

    </div>
    { group && groupRank ? <div style={styles.statContainer}>
      <h3 style={styles.title}>Your ranking in <span style={fontStyles.bold}>{group.name}</span></h3>
      <div style={styles.statRow}>
        <span style={styles.stat}>{groupRank.rank} <span style={styles.rankOf}>of {groupRank.of}</span></span>
        <span style={styles.adjustment}>
          <Button kind="tertiary" href={`/groups/${group._id}`}>See group &rarr;</Button>
        </span>
      </div>
    </div> : null }
    <div style={styles.statContainer}>
      <h3 style={styles.title}>Your global ranking in <span style={fontStyles.bold}>all of Monad</span></h3>
      <div style={styles.statRow}>
        <span style={styles.stat}>{user.ranks.global.rank} <span style={styles.rankOf}>of {user.ranks.global.of}</span></span>
        <span style={styles.adjustment}>
          <Button kind="tertiary" href="/leaderboard">See leaderboard &rarr;</Button>
        </span>
      </div>
    </div>
    <div style={styles.action}>
      <Button href="/matches/create" kind="primary">Start a match</Button>
    </div>

  </Wrapper>);
};

const styles = {
  wrapper: {
    width: "100%",
    backgroundColor: colors.sand,
    paddingTop: 20,
    paddingBottom: 20
  },
  inner: {
    display: "flex",
  },
  statContainer: {
    flex: 1,
    paddingRight: 60,
  },
  title: {
    color: colors.red,
    fontSize: constants.fontSizes.small,
    marginBottom: 8,
  },
  statRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stat: {
    fontSize: constants.fontSizes.larger,
  },
  rankOf: {
    fontWeight: 300,
    color: colors.medGray,
  },
  adjustment: {
    color: colors.lightGray,
    paddingLeft: "5px"
  },
  action: {
    width: 200,
  },
};

export default Radium(HeaderStatsBar);
