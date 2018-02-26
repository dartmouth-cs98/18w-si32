import React from "react";
import Color from "color";

import { colors } from "../../style";

const PIXI = require("pixi.js");

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
const GRID_OUTLINE_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;
const NEUTRAL_CELL_ALPHA = 0.1;

const CELL_OFFSET_X = 1;
const CELL_OFFSET_Y = 1;

const BORDER_OFFSET_X = 10;
const BORDER_OFFSET_Y = 10;

const BASE_SCENE_W = 500;
const BASE_SCENE_H = 500;

// TODO: generalize to n players?
const COLOR_P0 = 0xec0b43;
const COLOR_P1 = 0x274c77;

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
    this.app = new PIXI.Application({
      width: this.sp.w,
      height: this.sp.h
    });
    this.stage = this.app.stage;
    this.renderer = this.app.renderer;

    this.renderer.autoResize = true;
    this.renderer.backgroundColor = SCENE_BACKGROUND_COLOR;

    // create the root graphics and add it as child of the stage
    this.mapGraphics = new PIXI.Graphics();
    this.stage.addChild(this.mapGraphics);

    // inject the canvas
    this.refs.gameCanvas.appendChild(this.app.view);

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
    this.sp.cell_w = Math.floor(BASE_SCENE_W / this.sp.cols);
    this.sp.cell_h = Math.floor(BASE_SCENE_H / this.sp.rows);

    this.sp.w = this.sp.cols * (this.sp.cell_w + CELL_OFFSET_X) + BORDER_OFFSET_X*2;
    this.sp.h = this.sp.rows * (this.sp.cell_h + CELL_OFFSET_Y) + BORDER_OFFSET_Y*2;
  }

  // add the border to main map graphics
  addBorderToStage = () => {
    this.mapGraphics.lineStyle(1, GRID_OUTLINE_COLOR, 1);
    this.mapGraphics.drawPolygon([
      0, 0,
      this.sp.w - 1, 1,
      this.sp.w - 1, this.sp.h - 1,
      1, this.sp.h - 1,
      0, 0
    ]);
  }

  // add the grid to main map graphics
  addGridToStage = () => {
    // iterate over rows
    for (let i = 0; i < this.sp.rows; i++) {
      // iterate over columns
      for (let j = 0; j < this.sp.cols; j++) {
        const r = this.getCellColorAlpha(i, j);
        this.mapGraphics.beginFill(r.c, r.a);

        const xpos = j * (this.sp.cell_w + CELL_OFFSET_X) + BORDER_OFFSET_X;
        const ypos = i * (this.sp.cell_h + CELL_OFFSET_Y) + BORDER_OFFSET_Y;

        this.mapGraphics.drawRect(xpos, ypos, this.sp.cell_w, this.sp.cell_h);
        this.mapGraphics.endFill();
      }
    }
  }

  getCellColorAlpha = (r, c) => {
    const units = this.props.replay.turns[this.props.frame].map[r][c].u
    if (!units) {
      return { "c": NEUTRAL_CELL_COLOR, "a": NEUTRAL_CELL_ALPHA };
    }
    let color, alpha;
    if (units[0] > 0) {
      color = COLOR_P0;
      alpha = units[0] / MAX_UNITS;
    } else if (units[1] > 0) {
      color = COLOR_P1;
      alpha = units[1] / MAX_UNITS;
    }
    return { "c": color, "a": alpha };
  }

  // recursively render the stage with renderer
  animate() {
    this.mapGraphics.clear();
    this.addGridToStage();
    this.addBorderToStage();

    // render the stage container
    this.renderer.render(this.stage);

    // and setup to render again in the future
    // TODO: how quickly can we clock this and still get a smooth animation?
    // do we for sure want to do a new frame every timestep of the animation?
    // or do we maybe want to uncouple these?
    setTimeout(() => requestAnimationFrame(this.animate), 500);

    if (this.props.play && (this.props.frame + 1) < this.props.replay.turns.length) {
      this.props.incrementFrame();
    }
  }

  render() {
    return (
      <div ref="gameCanvas" style={styles.canvasWrapper}></div>
    );
  }
}

const styles = {
  canvasWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  }
}

export default Canvas;
