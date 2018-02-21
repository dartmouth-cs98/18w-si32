## Si32 Worker

The base ("si32-worker") Docker container will hold the actual game code.
When it comes time to run a game, the worker spawns a Docker container per bot that is in the game,
and uses stdout/stdin to read from/write to those containers. Thus, each bot is isolated from each other
and the game code itself, has no network connections, and has severely limited abilites to mess with the
host OS.

### Using the worker
Prerequisite: you need Docker installed/running.

Additionally, ensure that `./game` is a symlink to `AI` (the game engine) in the root of the repo.

**Build the Docker images:** Run `make all` from inside the worker directory.

**Running games through Docker:** `./start.sh` runs the docker parent worker. Right now, this immediately launches a child
image for the two hardcoded "bots" included. It does some simple communication with them as a proof of concept.

**Running games locally:** `python runLocalGame.py {bot1dir} {bot2dir} ...` will run a game and directly execute the `bot.py`
inside each passed in directory. For game testing/development, this is quicker than using the heavy-handed docker solution.
