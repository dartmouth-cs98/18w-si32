import React from "react";
import Color from "color";

import { colors } from "../../style";

const PIXI = require("pixi.js");

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
const GRID_OUTLINE_COLOR = 0x56666b;

const ROWS = 20;
const COLS = 20;

const CELL_W = 20;
const CELL_H = 20;

const SCENE_W = CELL_W * COLS;
const SCENE_H = CELL_H * ROWS;

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

    this.refs.gameCanvas.appendChild(this.app.view);

    this.renderer.backgroundColor = SCENE_BACKGROUND_COLOR;
    this.renderer.autoResize = true;

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
    let rect = new PIXI.Graphics();
    rect.lineStyle(1, GRID_OUTLINE_COLOR, 1);

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        rect.drawRect(CELL_H * i, CELL_W * j, CELL_W, CELL_W);
        this.stage.addChild(rect);
      }
    }
  }

  // recursively render the stage with renderer
  animate() {
    // render the stage container
    this.addGridToStage();
    this.renderer.render(this.stage);
    //this.frame = requestAnimationFrame(this.animate);
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
