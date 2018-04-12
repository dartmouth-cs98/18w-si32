import React from "react";
import _ from "lodash";

import { Application, Graphics, Point, Polygon } from "pixi.js";

const TICK_SPEED = 30;

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
// const GRID_OUTLINE_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;
const NEUTRAL_CELL_ALPHA = 0.1;

const CELL_OFFSET_X = 1;
const CELL_OFFSET_Y = 1;

const BASE_SCENE_W = 600;

// TODO: generalize to n players?
const COLOR_P0 = 0xec0b43;
const COLOR_P1 = 0x274c77;

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
  if (playerN == 0) {
    return COLOR_P0;
  }
  return COLOR_P1;
};

// TODO: calibrate this value
const MAX_UNITS = 5;

class Canvas extends React.PureComponent {
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

    // inject the canvas
    this.gameCanvasRef.appendChild(this.app.view);

    // start the animation
    this.animate();
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

  drawCell = (row, col, color, hasBuilding) => {
    this.mapGraphics.beginFill(color.c, color.a);
    const center = {
      x: col * (this.sp.cell_width + CELL_OFFSET_X) + this.sp.cell_width/2,
      y: row * (this.sp.cell_height * 3/4 + CELL_OFFSET_Y) + this.sp.cell_height/2,
    };

    if (row % 2 == 0) {
      center.x += this.sp.cell_width / 2;
    }

    const corners = new Polygon(_.range(0,6).map(i => getHexagonCorner(center, this.sp.cell_r, i)));
    this.mapGraphics.drawPolygon(corners);

    if (hasBuilding) {
      this.mapGraphics.beginFill(0xFFFFFF);
      this.mapGraphics.drawStar(center.x, center.y, 6, this.sp.cell_r - 2, this.sp.cell_r / 3);
    }

    this.mapGraphics.endFill();
  }

  // add the grid to main map graphics
  addGridToStage = () => {
    // iterate over rows
    for (let i = 0; i < this.sp.rows; i++) {
      // iterate over columns
      for (let j = 0; j < this.sp.cols; j++) {
        const r = this.getCellColorAlpha(i, j);
        this.drawCell(j, i, r, r.building);
      }
    }
  }

  getCellColorAlpha = (r, c) => {
    const building = this.props.replay.turns[this.props.frame].map[r][c].b;
    if (building != undefined) {
      return { "c": getPlayerColor(building), "a": 1, "building": true };
    }

    const units = this.props.replay.turns[this.props.frame].map[r][c].u;
    if (!units) {
      return { "c": NEUTRAL_CELL_COLOR, "a": NEUTRAL_CELL_ALPHA, "building": false };
    }
    let color, alpha;
    if (units[0] > 0) {
      color = COLOR_P0;
      alpha = units[0] / MAX_UNITS;
    } else if (units[1] > 0) {
      color = COLOR_P1;
      alpha = units[1] / MAX_UNITS;
    }
    return { "c": color, "a": alpha, "building": false };
  }

  // recursively render the stage with renderer
  animate() {
    this.mapGraphics.clear();
    this.addGridToStage();

    // render the stage container
    this.renderer.render(this.stage);

    // and setup to render again in the future
    // TODO: how quickly can we clock this and still get a smooth animation?
    // do we for sure want to do a new frame every timestep of the animation?
    // or do we maybe want to uncouple these?
    setTimeout(() => requestAnimationFrame(this.animate), TICK_SPEED);

    if (this.props.play && (this.props.frame + 1) < this.props.replay.turns.length) {
      this.props.incrementFrame();
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
