import React from "react";
import Color from "color";

import { colors, constants } from "../../style";

const PIXI = require("pixi.js");

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;
const GRID_OUTLINE_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;
const NEUTRAL_CELL_ALPHA = 0.1;

const CELL_OFFSET_X = 2;
const CELL_OFFSET_Y = 2;

const CELLS_IN_ROW = 12;
const CELLS_IN_COL = 12;

const ACTIVE_CELL_COLOR = 0xec0b43;

// TODO: can we abstract this out so it is only done in one place,
// and always recomputed on resize
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

const pageHeight = vh - constants.NAVBAR_HEIGHT;
const pageWidth = vw;

class LandingCanvas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
    this.toBeMapped = null;
    this.active = {};
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
    this.mapGraphics.interactive = true;

    this.mapGraphics.click = (event) => {
      this.toBeMapped = event.data.global;
    }

    this.stage.addChild(this.mapGraphics);

    // inject the canvas
    this.refs.gameCanvas.appendChild(this.app.view);

    // start the animation
    this.animate();
  }

  // compute the scene parameters based on map dimensions
  computeSceneParameters = () => {
    this.sp = {};

    // define cell width and height as function of # and the base values
    this.sp.cell_w = Math.floor(pageWidth / CELLS_IN_ROW);
    this.sp.cell_h = Math.floor(pageHeight / CELLS_IN_COL);

    this.sp.w = CELLS_IN_ROW * (this.sp.cell_w + CELL_OFFSET_X);
    this.sp.h = CELLS_IN_COL * (this.sp.cell_h + CELL_OFFSET_Y);
  }

  cellContainsPoint = (cX, cY, pX, pY) => {
    return pX > cX && pX < cX + this.sp.cell_w && pY > cY && pY < cY + this.sp.cell_h;
  }

  getCellColor = (x, y, j, i) => {
    const m = this.renderer.plugins.interaction.mouse.global;
    if (this.cellContainsPoint(x, y, m.x, m.y)) {
      return ACTIVE_CELL_COLOR;
    } else if (this.active[`${j} ${i}`]) {
      return ACTIVE_CELL_COLOR;
    } else {
      return NEUTRAL_CELL_COLOR;
    }
  }

  // add the grid to main map graphics
  addGridToStage = () => {
    // iterate over rows
    for (let i = 0; i < CELLS_IN_ROW; i++) {
      // iterate over columns
      for (let j = 0; j < CELLS_IN_COL; j++) {
        const xpos = j * (this.sp.cell_w + CELL_OFFSET_X);
        const ypos = i * (this.sp.cell_h + CELL_OFFSET_Y);

        const r = this.getCellColor(xpos, ypos, j, i);

        this.mapGraphics.beginFill(r, NEUTRAL_CELL_ALPHA);

        this.mapGraphics.drawRect(xpos, ypos, this.sp.cell_w, this.sp.cell_h);
        this.mapGraphics.endFill();

        if (this.toBeMapped && this.cellContainsPoint(xpos, ypos, this.toBeMapped.x, this.toBeMapped.y)) {
          this.active[`${j} ${i}`] = true;
          this.toBeMapped = null;
        }
      }
    }
  }

  animate() {
    this.mapGraphics.clear();
    this.addGridToStage();

    // render the stage container
    this.renderer.render(this.stage);

    // and setup to render again in the future
    // TODO: how quickly can we clock this and still get a smooth animation?
    // do we for sure want to do a new frame every timestep of the animation?
    // or do we maybe want to uncouple these?
    requestAnimationFrame(this.animate);
    //setTimeout(() => requestAnimationFrame(this.animate), 500)

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
  }
}

export default LandingCanvas;
