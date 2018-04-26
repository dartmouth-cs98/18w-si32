# Monad Visualizer

A native desktop visualizer for Monad match replays.

## Development

Within the `visualizer/` directory, run `npm run electron-dev` to build the
application and serve it in the Electron environment.

Changes made to any files within the `src/` directory should propagate
without needing to rebuild.

## Deployment

`npm run electron-pack` builds the production version of the internal application
in the `build/` directory, and subsequently uses this to build the
finished Electron application in the `dist/` directory. 
