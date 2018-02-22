import React from "react";
import Radium from "radium";
import _ from "lodash";
import Link from "../common/link";
import Button from "../common/button";
import { Wrapper } from "../layout/wrappers";

import { colors, constants, colorStyles, fontStyles } from "../../style";

const HeaderStatsBar = ({ user }) => (
  <Wrapper style={styles.wrapper} innerStyle={styles.inner}>
    <div style={styles.statContainer}>
      <h3 style={styles.title}>Your skill rating</h3>
      <div style={styles.statRow}>
        <span style={styles.stat}>{user.trueSkill.mu.toFixed(1)}</span>
        <span style={styles.adjustment}>
          <span style={colorStyles.green}>+14</span> since last week
        </span>
      </div>

    </div>
    <div style={styles.statContainer}>
      <h3 style={styles.title}>Your ranking at <span style={fontStyles.bold}>Dartmouth</span></h3>
      <div style={styles.statRow}>
        <span style={styles.stat}>19/1,234</span>
        <span style={styles.adjustment}>
          <span style={colorStyles.green}>&uarr;14</span> since last week
        </span>
      </div>
    </div>
    <div style={styles.statContainer}>
      <h3 style={styles.title}>Your global ranking in <span style={fontStyles.bold}>all of Monad</span></h3>
      <div style={styles.statRow}>
        <span style={styles.stat}>19/1,234</span>
        <span style={styles.adjustment}>
          <span style={colorStyles.green}>&uarr;14</span> since last week
        </span>
      </div>
    </div>
    <div style={styles.action}>
      <Button href="/matches/create" kind="primary">Start a match</Button>
    </div>

  </Wrapper>
);

const styles = {
  wrapper: {
    backgroundColor: colors.sand,
    paddingTop: 20,
    paddingBottom: 20,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  stat: {
    fontSize: constants.fontSizes.larger,
  },
  adjustment: {
    color: colors.lightGray,
  },
  action: {
    width: 200,
  },
};

export default Radium(HeaderStatsBar);
