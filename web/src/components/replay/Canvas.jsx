import React from "react";
import Color from "color";

import { colors } from "../../style";

const PIXI = require("pixi.js");

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
const GRID_OUTLINE_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;

const CELL_OFFSET_X = 1;
const CELL_OFFSET_Y = 1;

const BORDER_OFFSET_X = 20;
const BORDER_OFFSET_Y = 20;

const BASE_SCENE_W = 500;
const BASE_SCENE_H = 500;

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

    this.frame = 0;

    // start the animation
    this.animate();
  }

  // compute the scene parameters based on map dimensions
  computeSceneParameters = () => {
    this.sp = {};

    this.sp.rows = this.props.map.width;
    this.sp.cols = this.props.map.height;

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
    for (let i = 0; i < this.sp.rows; i++) {
      for (let j = 0; j < this.sp.cols; j++) {
        this.mapGraphics.beginFill(NEUTRAL_CELL_COLOR, 0.1)
        const xpos = j * (this.sp.cell_w + CELL_OFFSET_X) + BORDER_OFFSET_X;
        const ypos = i * (this.sp.cell_h + CELL_OFFSET_Y) + BORDER_OFFSET_Y;
        this.mapGraphics.drawRect(xpos, ypos, this.sp.cell_w, this.sp.cell_h);
        this.mapGraphics.endFill();
      }
    }
  }

  // recursively render the stage with renderer
  animate() {
    this.mapGraphics.clear();
    this.addGridToStage();
    this.addBorderToStage();

    // render the stage container
    this.renderer.render(this.stage);

    // and setup to render again in the future
    setTimeout(() => requestAnimationFrame(this.animate), 2000);

    this.frame = this.props.play ? this.frame + 1 : this.frame;
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