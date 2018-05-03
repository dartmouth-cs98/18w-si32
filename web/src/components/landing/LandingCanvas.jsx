import React from "react";

import { constants } from "../../style";

import { Application, Graphics, Point, Polygon } from "pixi.js";

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;

const ACTIVE_CELL_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;
const NEUTRAL_CELL_ALPHA = 0.1;

const HEX_RADIUS = 16;

const CELL_OFFSET_X = 0;
const CELL_OFFSET_Y = 0;

const CELLS_IN_ROW = 75;
const CELLS_IN_COL = 25;

// TODO: tune these
const FADE_DELAY_FACTOR = 5;
const MAX_CELL_VALUE = 255;

// TODO: can we abstract this out so it is only done in one place,
// and always recomputed on resize
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

const pageHeight = vh - constants.NAVBAR_HEIGHT;
const pageWidth = vw;

const getHexagonCorner = (center, i) => {
  let angle_deg = 60 * i   + 30;
  let angle_rad = Math.PI / 180 * angle_deg;
  return new Point(
    center.x + HEX_RADIUS * Math.cos(angle_rad),
    center.y + HEX_RADIUS * Math.sin(angle_rad),
  );
};


class LandingCanvas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
    this.drawHex = this.drawHex.bind(this);
    this.addHexCells = this.addHexCells.bind(this);
    this.toBeMapped = null;
    this.active = {};
  }

  componentDidMount() {
    // compute scene parameters based on game map dimensions
    this.computeSceneParameters();

    // setup pixi canvas
    this.app = new Application({
      width: this.sp.w,
      height: this.sp.h
    });

    this.stage = this.app.stage;
    this.renderer = this.app.renderer;

    this.renderer.autoResize = true;
    this.renderer.backgroundColor = SCENE_BACKGROUND_COLOR;

    // create the root graphics and add it as child of the stage
    this.mapGraphics = new Graphics();
    this.mapGraphics.interactive = true;

    this.stage.addChild(this.mapGraphics);

    // inject the canvas
    this.landingCanvasRef.appendChild(this.app.view);

    // start the animation
    this.animate();
  }

  // compute the scene parameters based on map dimensions
  computeSceneParameters = () => {
    this.sp = {};

    // define cell width and height as function of # and the base values
    this.sp.cell_w = Math.floor(pageWidth / CELLS_IN_ROW);
    this.sp.cell_h = Math.floor(pageHeight / CELLS_IN_COL);

    this.sp.cellsInRow = Math.floor(pageWidth / HEX_RADIUS*2)+1;
    this.sp.cellsInCol = Math.floor(pageHeight / HEX_RADIUS*2)+1;

    this.sp.cell_r = 10;

    this.sp.w = CELLS_IN_ROW * (this.sp.cell_w + CELL_OFFSET_X);
    this.sp.h = CELLS_IN_COL * (this.sp.cell_h + CELL_OFFSET_Y);
  }

  cellContainsPoint = (cX, cY, pX, pY) => {
    return pX > cX && pX < cX + this.sp.cell_w && pY > cY && pY < cY + this.sp.cell_h;
  }

  getCellColorAlpha = (j, i) => {
    if (this.active[`${j} ${i}`]) {
      return { "c": ACTIVE_CELL_COLOR, "a": (this.active[`${j} ${i}`] / MAX_CELL_VALUE) };
    } else {
      return { "c": NEUTRAL_CELL_COLOR, "a": NEUTRAL_CELL_ALPHA };
    }
  }

  drawHex = (row, col) => {

    const r = this.getCellColorAlpha(col, row);

    this.mapGraphics.beginFill(r.c, r.a);

    const center = {
      x: col * (2*HEX_RADIUS + CELL_OFFSET_X),
      y: row * (2*HEX_RADIUS  + CELL_OFFSET_Y),
    };

    if (row % 2 === 0) {
      center.x += HEX_RADIUS;
    }

    const corners = new Polygon(_.range(0,6).map(i => getHexagonCorner(center, i)));

    this.mapGraphics.drawPolygon(corners);
    this.mapGraphics.endFill();

    return corners;
  }


  addHexCells = () => {
    // get the mouse location from the renderer
    const mouse = this.renderer.plugins.interaction.mouse.global;
    // iterate over rows
    for (let i = 0; i < this.sp.cellsInRow; i++) {
      // iterate over columns
      for (let j = 0; j < this.sp.cellsInCol; j++) {

        const r = this.getCellColorAlpha(j, i);

        // Draw hex and then check if it contains mouse
        let hex = this.drawHex(i, j);

        if (hex.contains(mouse.x, mouse.y)) {
          // the mouse is in this cell, increment its value
          if (this.active[`${j} ${i}`]) {
            // don't allow the cell value to grow arbitrarily
            this.active[`${j} ${i}`] = Math.min(this.active[`${j} ${i}`] + 1*FADE_DELAY_FACTOR, MAX_CELL_VALUE);
          } else {
            this.active[`${j} ${i}`] = 1*FADE_DELAY_FACTOR;
          }
        } else {
          // the mouse is not in this cell, decrement its value
          if (this.active[`${j} ${i}`]) {
            if (this.active[`${j} ${i}`] == 1) {
              delete this.active[`${j} ${i}`];
            } else {
              this.active[`${j} ${i}`] -= 2;
            }
          }
        }

      }
    }
  }

  // add the grid to main map graphics
  addGridToStage = () => {
    // get the mouse location from the renderer
    const mouse = this.renderer.plugins.interaction.mouse.global;

    // iterate over rows
    for (let i = 0; i < CELLS_IN_ROW; i++) {
      // iterate over columns
      for (let j = 0; j < CELLS_IN_COL; j++) {

        const xpos = j * (this.sp.cell_w + CELL_OFFSET_X);
        const ypos = i * (this.sp.cell_h + CELL_OFFSET_Y);

        const r = this.getCellColorAlpha(j, i);

        let hex = this.drawHex(i,j);

        //this.mapGraphics.drawRect(xpos, ypos, this.sp.cell_w, this.sp.cell_h);

        if (this.cellContainsPoint(xpos, ypos, mouse.x, mouse.y)) {
          // the mouse is in this cell, increment its value
          if (this.active[`${j} ${i}`]) {
            // don't allow the cell value to grow arbitrarily
            this.active[`${j} ${i}`] = Math.min(this.active[`${j} ${i}`] + 1*FADE_DELAY_FACTOR, MAX_CELL_VALUE);
          } else {
            this.active[`${j} ${i}`] = 1*FADE_DELAY_FACTOR;
          }
        } else {
          // the mouse is not in this cell, decrement its value
          if (this.active[`${j} ${i}`]) {
            if (this.active[`${j} ${i}`] == 1) {
              delete this.active[`${j} ${i}`];
            } else {
              this.active[`${j} ${i}`]--;
            }
          }
        }

      }
    }
  }

  animate() {
    this.mapGraphics.clear();
    this.addHexCells();

    // render the stage container
    this.renderer.render(this.stage);

    requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div ref={ref => { this.landingCanvasRef = ref; }} style={styles.canvasWrapper}></div>
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

export default LandingCanvas;
