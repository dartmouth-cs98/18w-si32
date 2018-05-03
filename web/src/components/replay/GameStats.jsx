import React from "react";
import Radium from "radium";
import _ from "lodash";

import { constants, colors } from "../../style";
import { 
  getPlayerColor,
  NEUTRAL_CELL_COLOR,
} from "./Canvas";

const playerColorString = (playerNum) => {
  if (playerNum == undefined) {
    return "#" + NEUTRAL_CELL_COLOR.toString(16);
  }

  return "#" + getPlayerColor(playerNum).toString(16);
};

const GameStats = ({ turn=0, log, bots }) => {
  if (!log) {
    return <div style={{ color: colors.lightGray, fontSize: constants.fontSizes.medium}}>
      Waiting for game replay to load...
    </div>;
  }

  let thisTurn = log.turns[turn];

  let units = [];
  let buildings = [];
  let area = [];

  if (!thisTurn) {
    return <div style={{ color: colors.lightGray, fontSize: constants.fontSizes.medium}}>
    </div>;
  }
  let resources = thisTurn.res;

  // initialize the arrays to 0
  _.each(log.rankedBots, () => {
    units.push(0);
    buildings.push(0);
    area.push(0);
  });

  // compile the actual stats for this turn
  _.each(thisTurn.map, row => {
    _.each(row, cell => {
      // track presence of player for area stat
      let player = null;

      if (cell.u > 0) {
        units[cell.p] += cell.u;
        player = cell.p;
      }
      if ("b" in cell) {
        buildings[cell.b] += 1;
        player = cell.b;
      }

      if (player != null) {
        area[player] += 1;
      }

    });
  });

  // zip them into one array
  const stats = _.zip(units, buildings, area, resources);

  return (
    <table style={styles.table} width="100%">
      <thead>
        <tr>
          <th></th>
          <th style={styles.th}>Units</th>
          <th style={styles.th}>Buildings</th>
          <th style={styles.th}>Area</th>
          <th style={styles.th}>Resources</th>
        </tr>
      </thead>
      <tbody>
        { _.map(stats, (stat, i) => (
            <tr key={i} style={styles.botRow}>
              <td style={[styles.botName, { color: playerColorString(i) }]}>{ bots[i].name }</td>
              <td style={styles.stat}>{stat[0]}</td>
              <td style={styles.stat}>{stat[1]}</td>
              <td style={styles.stat}>{stat[2]}</td>
              <td style={styles.stat}>{stat[3]}</td>
            </tr>
        )) }
      </tbody>
    </table>
  );

};

const styles = {
  table: {
    marginTop: 15,
  },
  th: {
    textAlign: "left",
    textTransform: "uppercase",
    color: colors.lightGray,
    fontWeight: 500,
    fontSize: constants.fontSizes.smaller,
    paddingBottom: 10,
  },
  botRow: {
    borderTop: `1px solid ${colors.border}`,
  },
  botName: {
    fontSize: constants.fontSizes.medium,
    padding: "10px 25px 10px 5px",
    width: 1,
    whiteSpace: "nowrap",
  },
  stat: {
    fontWeight: 400,
    width: "15%",
  },
};

export default Radium(GameStats);
