/*
 * electron.js
 * App entry point.
 */

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const MAIN_WINDOW_WIDTH = 1200;
const MAIN_WINDOW_HEIGHT = 800;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: MAIN_WINDOW_WIDTH,
    height: MAIN_WINDOW_HEIGHT,
    icon: path.join(__dirname, "icons/png/64x64.png")
   });
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
  mainWindow.on("closed", () => mainWindow = null);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
