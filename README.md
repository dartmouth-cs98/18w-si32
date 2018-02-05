# Project Name

Si32 will be an online environment where players can submit their own bots to play against each other in a very simple Starcraft-style turn-based strategy game. Each bot will control an army of "units" which will build "factories" that will spawn more units; the objective of the game is to destroy all of the opponent's factories. Bots will control all aspects of gameplay and will direct how each and every unit will move.

Basic functionalities we're hoping to implement:
- The game (obviously)
- A leaderboard
- Basic stats/analysis for each user

Stretch goals:
- Guided tutorials/AIs of incremental difficulties for players to train their bots against
- Statistical analysis during the match (of advantage, positions, etc.)
- Team VS gameplay
- More advanced graphics
![Alt text](https://i.imgur.com/faV8fWC.png)
![Alt text](https://i.imgur.com/P7w6uWA.png)
![Alt text](https://i.imgur.com/1LnASxh.png)
![Alt text](https://i.imgur.com/fAbwxMw.png)
## Architecture

There are several distinct but connected parts of this project. They are

* API and Frontend

This is where users can create accounts, upload their code, and see results. An interface that exposes
the game infrastructure to the outside world. We are using SPA structure with a REST backend.

* Database

This is where users, bots, and game results are kept. We are using MongoDB.

* Game Runner

This is the Docker infrastructure for running games. It is a a python process that spins up child docker containers for
each bot in the game, and communicates with them through STDIN and STDOUT. This will all be in
python, except for the subprocesses which may be different if we support more languages.

* Code Starter Kits / Libraries

This abstracts away the complications of communicating with the central game server through STDIN/STDOUT.
Users can import the library and simply call `game.send_moves()` to get the state sent to the game manager.
Furthermore, these provide helpful classes for objects in the game that make it easier for the user to focus on
strategy. These will at first only be in Python.


## Setup

### Frontend / Database

View README in respective directories `api` and `web`. Docker compose will create and link together mongo, redis, and the web components for you.


### Game Runner

Set up Docker on your computer, following official documentation. Now, in the `worker` repo, call `make`.
You should now be ready to run `./start.sh` and see a 'game' spin up, where the bots do nothing. If it is not working,
try manually running the make commands as there is currently an issue open about sometimes needing to do this.

Again, follow README in `worker`. 


## Deployment

TODO: figure this one out


## Authors

Gabe Boning

Kyle Dotterrer

Robin Jayaswal

Paul Spangfort

Tong Xu

## Acknowledgments

Inspiration: Halite.
