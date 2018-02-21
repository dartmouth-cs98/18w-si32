import React from "react";
import Radium from "radium";
import _ from "lodash";
import Link from "../common/link";

import { colors, constants, colorStyles, fontStyles } from "../../style";

const BotCard = ({ bot, style, hasDivider }) => (
  <div style={[
    styles.wrapper,
    hasDivider ? styles.cardWithBorder : null,
    style
  ]}>
    <Link style={styles.title} href={`/bots/${bot._id}`}>
      {bot.name} <span style={styles.version}>v{bot.version}</span>
    </Link>

    <h4 style={styles.subtitle}>Skill Rating</h4>
    <div style={styles.skillWrapper}>
      <p style={[colorStyles.darkGray, fontStyles.large]}>{bot.trueSkill.mu.toFixed(1)}</p>
      <p style={[fontStyles.small, colorStyles.lightGray]}><span style={colorStyles.green}>+5.3</span> since last week</p>
    </div>

    <h4 style={styles.subtitle}>Rankings</h4>
    <table style={styles.rankTable}>
      <tbody>
        <tr style={styles.rankTableRow}>
          <td style={[colorStyles.medGray, fontStyles.medBold, fontStyles.small]}>
            Global
          </td>
          <td style={[colorStyles.darkGray, fontStyles.large]}>
            14/312
          </td>
          <td style={[colorStyles.lightGray, fontStyles.small, styles.rankDiff]}>
            <span style={[colorStyles.green]}>&uarr;18</span> since last week
          </td>
        </tr>
        <tr style={styles.rankTableRow}>
          <td style={[colorStyles.medGray, fontStyles.medBold, fontStyles.small]}>
            Dartmouth
          </td>
          <td style={[colorStyles.darkGray, fontStyles.large]}>
            4/73
          </td>
          <td style={[colorStyles.lightGray, fontStyles.small, styles.rankDiff]}>
            <span style={[colorStyles.red]}>&darr;3</span> since last week
          </td>
        </tr>
      </tbody>
    </table>

  </div>
);

const styles = {
  wrapper: {
    paddingBottom: 10,
    paddingTop: 10,
  },
  rankTable: {
    width: "100%",
    marginTop: 5,
  },
  rankTableRow: {
    height: 30,
  },
  rankDiff: {
    textAlign: "right",
  },
  cardWithBorder: {
    paddingLeft: "30px",
    marginLeft: "30px",
    borderLeft: `1px solid ${colors.border}`,
  },
  title: {
    fontSize: constants.fontSizes.larger,
    color: colors.darkGray,
    fontWeight: 400,
    display: "block",
    ":hover": {
      color: colors.red,
    },
  },
  version: {
    paddingLeft: 10,
    fontWeight: 300,
    color: colors.lightGray,
  },
  subtitle: {
    color: colors.red,
    fontWeight: 300,
    marginTop: 20,
    fontSize: constants.fontSizes.smaller,
    textTransform: "uppercase",
  },
  skillWrapper: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0 25px 0",
    justifyContent: "space-between",
  },
};

export default Radium(BotCard);
