import React from "react";
import Color from "color";

import { colors } from "../../style";

const PIXI = require("pixi.js");

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
const GRID_OUTLINE_COLOR = 0x56666b;

const ROWS = 20;
const COLS = 20;

const CELL_W = 25;
const CELL_H = 25;

const X_OFFSET = 2;
const Y_OFFSET = 2;

const SCENE_W = CELL_W * COLS + X_OFFSET * COLS;
const SCENE_H = CELL_H * ROWS + Y_OFFSET * ROWS;

const APP_OPTIONS = {
  width: SCENE_W,
  height: SCENE_H,
}

class Canvas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    // setup pixi canvas
    this.app = new PIXI.Application(APP_OPTIONS);
    this.stage = this.app.stage;
    this.renderer = this.app.renderer;

    this.renderer.backgroundColor = SCENE_BACKGROUND_COLOR;
    this.renderer.autoResize = true;

    // create the root graphics and add it as child of the stage
    this.mapGraphics = new PIXI.Graphics();
    this.stage.addChild(this.mapGraphics);

    this.refs.gameCanvas.appendChild(this.app.view);

    // start the animation
    this.animate();
  }

  addBorderToStage = () => {
    let border = new PIXI.Graphics();
    border.lineStyle(1, GRID_OUTLINE_COLOR, 1);
    border.drawPolygon([
      0, 0,
      SCENE_W - 1, 1,
      SCENE_W - 1, SCENE_H - 1,
      1, SCENE_H - 1,
      0, 0
    ]);

    this.stage.addChild(border);
  }

  addGridToStage = () => {
    this.mapGraphics.clear();

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        this.mapGraphics.beginFill(0x000000, ((i+j)/(ROWS+COLS)))
        const xpos = CELL_W * j + X_OFFSET * j;
        const ypos = CELL_H * i + Y_OFFSET * i;
        this.mapGraphics.drawRect(xpos, ypos, CELL_W, CELL_H);
        this.mapGraphics.endFill();
      }
    }
  }

  // recursively render the stage with renderer
  animate() {
    this.addGridToStage();

    // render the stage container
    this.renderer.render(this.stage);
    this.frame = setTimeout(() => requestAnimationFrame(this.animate), 2000);
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
    padding: "40px 5px 5px 5px",
  }
}

export default Canvas;
