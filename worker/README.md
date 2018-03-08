# Monad Worker

The worker component of Monad.

The base ("si32-worker") Docker container will hold the actual game code.
When it comes time to run a game, the worker spawns a Docker container per bot that is in the game,
and uses stdout/stdin to read from/write to those containers. Thus, each bot is isolated from each other
and the game code itself, has no network connections, and has severely limited abilities to mess with the
host OS.

## Using the worker

Prerequisite: you need Docker installed/running.

Additionally, ensure that `./game` is a symlink to `AI` (the game engine) in the root of the repo.

**Build the Docker images:** Run `make all` from inside the worker directory.

**Running games through Docker:** `./start.sh` runs the docker parent worker. Right now, this immediately
launches a child image for the two hardcoded "bots" included. It does some simple communication with them as a
proof of concept.

**Running games locally:** `python runLocalGame.py {bot1dir} {bot2dir} ...` will run a game
and directly execute the `bot.py` inside each passed in directory. For game testing/development,
this is quicker than using the heavy-handed docker solution.

## Docker Setup Notes

In order to poll for games we must poll the api for next games and the code files if there is a game.
Whether we hit localhost or a production endpoint must be determined by an environment variable.

The makefile looks for $API_ROUTE set in the environment, and passes it to docker as a build arg.

The Dockerfile turns this build arg into an environment variable in the Docker container, and if it
is not passed (aka is not set in your environment) it defaults to
`http://docker.for.mac.host.internal:5000/worker`
which is a special Docker networking convention that points to your Mac's localhost
(where the api will be running locally).

The Python code can now use os.environ['api_route'] when making api calls, ensuring it hits the right api url.

Note that this solution for accessing your computer's localhost only works for Mac. If they need
to test the full flow locally, Windows and Linux users can set their environment variable to a
remote url or ip address accessible over the internet, or use a bridge solution.

**However, one can always use `runLocalGame` when running locally to avoid Docker entirely.**
