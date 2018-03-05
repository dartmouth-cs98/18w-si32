import React from "react";
import Radium from "radium";
import moment from "moment";

import { colorStyles } from "../../style";

const NUM_BACK_HISTORY = 15;

const StatDifference = ({ history }) => {
  // takes the last N entries and displays differential over those. By using "last N"
  // instead of a fixed period, the stat will reflect how active the user is. If they
  // are super active, they'll see the difference over a couple hours or days; if less
  // active they'll see over a week. This way it scales somewhat per-user
  if (history.length <= 1) {
    return null;
  }

  let curStat = history[history.length - 1];
  let prevStat = null;
  if (history.length < NUM_BACK_HISTORY) {
    prevStat = history[0];
  } else {
    prevStat = history[history.length - NUM_BACK_HISTORY];
  }

  const diff = curStat.score.mu - prevStat.score.mu;

  let diffEl = null;
  if (diff > 0) {
    diffEl = <span style={colorStyles.green}>&uarr;{ diff.toFixed(1) }</span>;
  } else {
    diffEl = <span style={colorStyles.red}>&darr;{ Math.abs(diff).toFixed(1) }</span>;
  }

  const timeEl = <span style={colorStyles.lightGray}>since { moment(prevStat.timestamp).fromNow() }</span>;

  return <div>{diffEl} {timeEl}</div>;
};


export default Radium(StatDifference);
