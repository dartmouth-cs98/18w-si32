import React from "react";
import _ from "lodash";

import { constants } from "../../style";

import { Application, Graphics, Point, Polygon } from "pixi.js";

const SCENE_BACKGROUND_COLOR = 0xFFFFFF;

const ACTIVE_CELL_COLOR = 0xec0b43;
const NEUTRAL_CELL_COLOR = 0x56666b;
const NEUTRAL_CELL_ALPHA = 0.1;

const HEX_RADIUS = 16;

const CELL_OFFSET_X = 0;
const CELL_OFFSET_Y = 0;

// TODO: tune these
const FADE_DELAY_FACTOR = 5;
const MAX_CELL_VALUE = 255;

// TODO: can we abstract this out so it is only done in one place,
// and always recomputed on resize
let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
let vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

let pageHeight = vh - constants.NAVBAR_HEIGHT;
let pageWidth = vw;

let CELLS_IN_ROW = pageWidth / (2*HEX_RADIUS);
let CELLS_IN_COL = pageHeight / (2*HEX_RADIUS);

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
    this.initializeGraphics = this.initializeGraphics.bind(this);
    this.updateCellColor = this.updateCellColor.bind(this);
    this.generateCanvas = this.generateCanvas.bind(this);
    this.toBeMapped = null;
    this.active = {};
  }

  updateParameters() {
    vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    pageHeight = vh - constants.NAVBAR_HEIGHT;
    pageWidth = vw;

    CELLS_IN_ROW = pageWidth / (2*HEX_RADIUS);
    CELLS_IN_COL = pageHeight / (2*HEX_RADIUS);
  }

  initializeGraphics() {
    this.app = new Application({
      width: pageWidth,
      height: pageHeight,
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

  generateCanvas() {

    if (this.app) {
      this.landingCanvasRef.removeChild(this.app.view);
      this.app.destroy();
    }

    this.updateParameters();
    this.initializeGraphics();
  }

  componentDidMount() {
    // compute scene parameters based on game map dimensions
    this.generateCanvas();
    window.addEventListener("resize", this.generateCanvas);
  }

  componentWillUnmount() {
    this.app.destroy();
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
    // iterate over columns
    for (let i = 0; i < CELLS_IN_COL; i++) {
      // iterate over rows
      for (let j = 0; j < CELLS_IN_ROW; j++) {

        // Draw hex and then check if it contains mouse
        let hex = this.drawHex(i, j);
        this.updateCellColor(hex, mouse, i, j);

      }
    }
  }

  updateCellColor(hex, mouse, i, j) {
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
