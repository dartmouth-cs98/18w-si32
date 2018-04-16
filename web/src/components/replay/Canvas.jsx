import React from "react";
import _ from "lodash";

import { Application, Graphics, Point, Polygon, Text } from "pixi.js";

const TICK_SPEED = 25;

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
// const GRID_OUTLINE_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;
const NEUTRAL_CELL_ALPHA = 0.1;

const CELL_OFFSET_X = 1;
const CELL_OFFSET_Y = 1;

const BASE_SCENE_W = 600;

export const COLORS = [
  0xec0b43,
  0x274c77,
  0x22EB1A,
  0xEB8D0C,
];

// Helper functions for hexagonal math
const getHexagonCorner = (center, size, i) => {
  let angle_deg = 60 * i   + 30;
  let angle_rad = Math.PI / 180 * angle_deg;
  return new Point(
    center.x + size * Math.cos(angle_rad),
    center.y + size * Math.sin(angle_rad),
  );
};

const getPlayerColor = (playerN) => {
  return COLORS[playerN];
};

// TODO: calibrate this value
const MAX_UNITS = 5;

class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // compute scene parameters based on game map dimensions
    this.computeSceneParameters();

    // setup pixi canvas
    this.app = new Application({
      width: this.sp.w,
      height: this.sp.h,
      antialias: true,
    });
    this.stage = this.app.stage;
    this.renderer = this.app.renderer;

    this.renderer.autoResize = true;
    this.renderer.backgroundColor = SCENE_BACKGROUND_COLOR;

    // create the root graphics and add it as child of the stage
    this.mapGraphics = new Graphics();
    this.stage.addChild(this.mapGraphics);

    this.textElements = {};

    this.timeout = null;

    // inject the canvas
    this.gameCanvasRef.appendChild(this.app.view);

    // start the animation
    this.animate();
  }

  // never re-render the actual div
  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(prevProps) {
    // frame number changed but not playing, meaning user stepped
    // call animate manually to re-render state
    if ((this.props.frame != prevProps.frame && !this.props.play) || this.props.play != prevProps.play) {
      setTimeout(() => {
        this.animate();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.app.destroy();
  }

  // compute the scene parameters based on map dimensions
  computeSceneParameters = () => {
    this.sp = {};

    // rows and columns derived explicitly from height and width
    this.sp.rows = this.props.replay.h;
    this.sp.cols = this.props.replay.w;

    // define cell width and height as function of # and the base values
    this.sp.cell_r = Math.floor((this.props.size || BASE_SCENE_W) / this.sp.cols / 2);
    this.sp.cell_height = this.sp.cell_r * 2;
    this.sp.cell_width = this.sp.cell_height * Math.sqrt(3) / 2;

    this.sp.w = (this.sp.cols + 1) * this.sp.cell_width + CELL_OFFSET_X * this.sp.cols;
    this.sp.h = (this.sp.rows + .5) * this.sp.cell_height * 3/4 + CELL_OFFSET_Y * this.sp.rows;
  }

  drawCell = (row, col, cell) => {
    if (cell.u > 0) {
      //console.log("cell has units", row, col, cell.u, cell.p)
    }

    let { color, alpha, building } = this.getCellColorAlpha(cell);

    this.mapGraphics.beginFill(color, alpha);
    const center = {
      x: col * (this.sp.cell_width + CELL_OFFSET_X) + this.sp.cell_width/2,
      y: row * (this.sp.cell_height * 3/4 + CELL_OFFSET_Y) + this.sp.cell_height/2,
    };

    if (row % 2 == 0) {
      center.x += this.sp.cell_width / 2;
    }

    const corners = new Polygon(_.range(0,6).map(i => getHexagonCorner(center, this.sp.cell_r, i)));
    this.mapGraphics.drawPolygon(corners);

    if (building) {
      this.mapGraphics.beginFill(0xFFFFFF);
      this.mapGraphics.drawStar(center.x, center.y, 6, this.sp.cell_r - 2, this.sp.cell_r / 3);
    }

    this.mapGraphics.endFill();

    const textKey = `${row},${col}`;

    // if no units
    if (cell.u == 0 || cell.u == undefined) {
      // and there was text there
      if (textKey in this.textElements) {
        // remove the text
        this.mapGraphics.removeChild(this.textElements[textKey]);
        delete this.textElements[textKey];
      }
    } else if(cell.u > 0) {
      // if there are units, draw the label
      let textColor = (alpha < .7 || alpha > 10) ? ("#" + COLORS[cell.p].toString(16)) : "#ffffff";
      if (building) {
        textColor = "#" + COLORS[cell.p].toString(16);
      }

      // if text already exists, just update it; otherwise create a text el and add it to the canvas
      if (textKey in this.textElements) {
        this.textElements[textKey].text = cell.u;
        this.textElements[textKey].style.fill = textColor;
      } else {
        var text = new Text(cell.u, { fontFamily: "Arial", fontSize: 12, fill: textColor});

        // setting the anchor point to 0.5 will center align the text... great for spinning!
        text.anchor.set(0.5);
        text.position.x = center.x;
        text.position.y = center.y;
        this.textElements[textKey] = text;
        this.mapGraphics.addChild(text);
      }
    }
  }

  // add the grid to main map graphics
  addGridToStage = () => {
    // iterate over rows
    for (let i = 0; i < this.sp.rows; i++) {
      // iterate over columns
      for (let j = 0; j < this.sp.cols; j++) {
        const cell = this.props.replay.turns[this.props.frame].map[i][j];

        /* TODO pass var on whether text should be updated?
        let prevCell = { u: [0, 0] };
        if (this.props.frame > 0) {
          prevCell = this.props.replay.turns[this.props.frame - 1].map[i][j];
        }
        */

        this.drawCell(j, i, cell);
      }
    }
  }

  getCellColorAlpha = (cell) => {
    const units = cell.u;
    const building = cell.b;
    if (building != undefined) {
      return { "color": getPlayerColor(building), "alpha": 1, "building": true };
    }

    if (!units) {
      return { "color": NEUTRAL_CELL_COLOR, "alpha": NEUTRAL_CELL_ALPHA, "building": false };
    }
    let color, alpha = 0;

    if (cell.u > 0) {
      //console.log(cell);
      color = COLORS[cell.p];
      alpha = cell.u / MAX_UNITS;
    }
    return { color, alpha, building };
   }

  drawCurrentFrame() {
    this.mapGraphics.clear();
    //this.mapGraphics.removeChildren();
    this.addGridToStage();
    //
    // render the stage container
    this.renderer.render(this.stage);
  }

  // recursively render the stage with renderer
  animate() {
    clearTimeout(this.timeout);

    this.drawCurrentFrame();

    if (this.props.play && (this.props.frame + 1) < this.props.replay.turns.length) {
      this.props.incrementFrame();

      // if playing, render again
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => requestAnimationFrame(this.animate), TICK_SPEED);
    }
  }

  render() {
    return (
      <div ref={(ref) => {this.gameCanvasRef = ref;}} style={styles.canvasWrapper}></div>
    );
  }
}

const styles = {
  canvasWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
};

export default Canvas;
