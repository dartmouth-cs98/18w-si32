import React from "react";
import Radium from "radium";
import _ from "lodash";

import { constants } from "../../style";
import { 
  getPlayerColor,
  NEUTRAL_CELL_COLOR,
} from "./Canvas";

const DIRECTIONS = {
  EAST: 1,
  WEST: 2,
  NORTHEAST: 3,
  NORTHWEST: 4,
  SOUTHEAST: 5,
  SOUTHWEST: 6,
  NONE: 7
};

const WIDTH = 200;

const playerColorString = (playerNum) => {
  if (playerNum == undefined) {
    return "#" + NEUTRAL_CELL_COLOR.toString(16);
  }

  return "#" + getPlayerColor(playerNum).toString(16);
};

const DirectionArrows = Radium(({ directionStyle, inMove, outMove }) => {
  const isWesterly = directionStyle == styles.arrows.west || directionStyle == styles.arrows.southWest || directionStyle == styles.arrows.northWest;
  const outColor = playerColorString(outMove.player);
  const inColor = playerColorString(inMove.player);

  return (
    <div style={styles.arrows.wrap}>
      <div style={[styles.arrows.common, directionStyle]}>
        <div style={[styles.arrows.outWrap, outMove.n == 0 ? styles.arrows.inactive : null ]}>
          <span style={[
              styles.arrows.numberOut, 
              isWesterly ? styles.arrows.numberOutWest : null,
            ]}>
            { outMove.n }
          </span>
          <i style={[styles.arrows.arrowOut, {color: outColor}]} className="fa fa-long-arrow-right"></i>
        </div>
        <div style={[styles.arrows.inWrap, inMove.n == 0 ? styles.arrows.inactive : null]}>
          <i style={styles.arrows.arrowIn} className="fa fa-long-arrow-left"></i>
          <span style={[
              styles.arrows.numberIn, 
              isWesterly ? styles.arrows.numberInWest : null,
              {color: inColor},
            ]}>
            { inMove.n }
          </span>
        </div>
      </div>
    </div>
  );
});

class CellDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  // return how many units moving out of current cell in direction 
  outInDirection(commands, direction) {
    const { turn = 0, row, col, log } = this.props;
    const cell = log.turns[turn].map[row][col];
    let player = cell.p;
    if (player == undefined) {
      player = cell.b;
    }
    const loc = col * log.w + row;
    const forDirection = commands.filter(c => (c.p == loc && c.d == direction));
    const n = forDirection.map(c => c.n);
    return { player, n: _.reduce(n, (a, curVal) => a+curVal, 0) };
  }

  // return who is moving into current cell with direction 
  inFromDirection(commands, direction) {
    const { row, col, log } = this.props;
    const loc = col * log.w + row;
    const forDirection = commands.filter(c => (c.t == loc && c.d == direction));
    if (!forDirection || forDirection.length == 0) {
      return { n: 0 };
    }

    const n = forDirection.map(c => c.n);
    return { player: forDirection[0].u, n: _.reduce(n, (a, curVal) => a+curVal, 0) };
  }

  getResources = () => {
    let i = this.props.turn || 0;
    while (i > 0 && !("r" in this.props.log.turns[i].map[this.props.row][this.props.col])) {
      i--;
    }

    return this.props.log.turns[i].map[this.props.row][this.props.col].r;
  }

  render() {
    const { turn = 0, row, col, log } = this.props;
    if (!log) {
      return null;
    }

    const cell = log.turns[turn].map[row][col];
    const loc = col * log.w + row;
    const commands = log.turns[turn].cmd.filter(c => (c.t == loc || c.p == loc && c.d != DIRECTIONS.NONE));

    let playerColor = "#" + NEUTRAL_CELL_COLOR.toString(16);
    if ("p" in cell) {
      playerColor = playerColorString(cell.p);
    } else if ("b" in cell) {
      playerColor = playerColorString(cell.b);
    }

    return (
      <div style={styles.container}>
        <div style={styles.hexagon.wrap}>
          <div style={[styles.hexagon.middle, { backgroundColor: playerColor }]}>
            <div style={[styles.hexagon.top, { borderBottomColor: playerColor }]}></div>
            <div style={[styles.hexagon.bottom, { borderTopColor: playerColor }]}></div>
          </div>

          <DirectionArrows
            directionStyle={styles.arrows.east}
            inMove={this.inFromDirection(commands, DIRECTIONS.WEST)}
            outMove={this.outInDirection(commands, DIRECTIONS.EAST)}
          />
          <DirectionArrows
            directionStyle={styles.arrows.southEast}
            inMove={this.inFromDirection(commands, DIRECTIONS.NORTHWEST)}
            outMove={this.outInDirection(commands, DIRECTIONS.SOUTHEAST)}
          />
          <DirectionArrows
            directionStyle={styles.arrows.southWest}
            inMove={this.inFromDirection(commands, DIRECTIONS.NORTHEAST)}
            outMove={this.outInDirection(commands, DIRECTIONS.SOUTHWEST)}
          />
          <DirectionArrows
            directionStyle={styles.arrows.west}
            inMove={this.inFromDirection(commands, DIRECTIONS.EAST)}
            outMove={this.outInDirection(commands, DIRECTIONS.WEST)}
          />
          <DirectionArrows
            directionStyle={styles.arrows.northWest}
            inMove={this.inFromDirection(commands, DIRECTIONS.SOUTHEAST)}
            outMove={this.outInDirection(commands, DIRECTIONS.NORTHWEST)}
          />
          <DirectionArrows
            directionStyle={styles.arrows.northEast}
            inMove={this.inFromDirection(commands, DIRECTIONS.SOUTHWEST)}
            outMove={this.outInDirection(commands, DIRECTIONS.NORTHEAST)}
          />

          <div style={styles.inner.wrap}>
            <div>
              <h3 style={styles.inner.title}>Units</h3>
              <p style={styles.inner.stat}>{ cell.u || "-" }</p>
              <h3 style={styles.inner.title}>Resources</h3>
              <p style={styles.inner.stat}>{ this.getResources() }</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const ARROW_OFFSET = "99px";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  hexagon: {
    middle: {
      position: "relative",
      width: WIDTH,
      height: WIDTH*.576173,
      backgroundColor: "red",
      marginTop: .289*WIDTH,
      marginBottom: .289*WIDTH,
    },
    top: {
      position: "absolute",
      width: 0,
      borderLeftWidth: WIDTH/2,
      borderRightWidth: WIDTH/2,
      bottom: "100%",
      borderBottomWidth: .289*WIDTH,
      borderStyle: "solid",
      borderColor: "transparent",
      borderBottomColor: "red",
    },
    bottom: {
      top: "100%",
      position: "absolute",
      width: 0,
      borderLeftWidth: WIDTH/2,
      borderRightWidth: WIDTH/2,
      borderTopWidth: .289*WIDTH,
      borderStyle: "solid",
      borderColor: "transparent",
      borderTopColor: "red",
    },
    wrap: {
      position: "relative",
    },
  },
  arrows: {
    wrap: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    common: {
      transformOrigin: "50% 50%",
    },
    numberOut: {
      width: 40,
      textAlign: "right",
      color: "white",
      fontSize: constants.fontSizes.small,
      fontWeight: 500,
      paddingRight: 5,
    },
    numberOutWest: {
      transform: "rotate(180deg)",
      textAlign: "left",
      paddingRight: 0,
      paddingLeft: 5,
    },
    numberIn: {
      width: 40,
      color: "red",
      fontSize: constants.fontSizes.small,
      fontWeight: 500,
      textAlign: "left",
      paddingLeft: 5,
    },
    numberInWest: {
      transform: "rotate(180deg)",
      textAlign: "right",
      paddingRight: 5,
      paddingLeft: 0,
    },

    arrowIn: {
      fontSize: 40,
      color: "white",
    },
    arrowOut: {
      fontSize: 40,
      color: "black",
    },
    inactive: {
      opacity: .2,
    },

    outWrap: {
      display: "flex",
      alignItems: "center",

    },
    inWrap: {
      display: "flex",
      alignItems: "center",
      marginTop: -10,
    },

    east: {
      transform: `rotate(0deg) translateX(${ARROW_OFFSET})`,
    },
    southEast: {
      transform: `rotate(60deg) translateX(${ARROW_OFFSET})`,
    },
    northEast: {
      transform: `rotate(-60deg)translateX(${ARROW_OFFSET})`,
    },
    southWest: {
      transform: `rotate(120deg) translateX(${ARROW_OFFSET})`,
    },
    west: {
      transform: `rotate(180deg) translateX(${ARROW_OFFSET})`,
    },
    northWest: {
      transform: `rotate(240deg) translateX(${ARROW_OFFSET})`,
    },
  },

  inner: {
    wrap: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: constants.fontSizes.large,
      fontWeight: 300,
      textAlign: "center",
    },
    title: {
      fontSize: constants.fontSizes.smaller,
      fontWeight: 500,
      textTransform: "uppercase",
      marginTop: 5,
    },
    stat: {
      margin: "5px 0 8px",
    },
  }
};

export default Radium(CellDetail);

