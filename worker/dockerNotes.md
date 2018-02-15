# Docker Setup Notes

Notes about docker setup complexities.

### Connecting to external api

In order to poll for games we must poll the api for next games and the code files if there is a game.
Whether we hit localhost or a production endpoint must be determined by an environment variable.

The makefile looks for $API_ROUTE set in the environment, and passes it to docker as a build arg.

The Dockerfile turns this build arg into an environment variable in the Docker container, and if it
is not passed (aka is not set in your environment) it defaults to `http://docker.for.mac.host.internal:5000/worker`
which is a special Docker networking convention that points to your Mac's localhost (where the api will be running
  locally).

The Python code can now use os.environ['api_route'] when making api calls, ensuring it hits the right api url.

Note that this solution for accessing your computer's localhost only works for Mac. If they need to test the full flow locally, Windows and Linux users can
set their environment variable to a remote url or ip address accessible over the internet, or use a bridge solution.
**However, they can always use `runLocalGame` when running locally to avoid Docker entirely.**
