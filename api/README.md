# Monad Web API

The web API component of Monad.

## Building and Running

1. Within the `api/` directory, run `npm run build` (`docker-compose build`)
2. Run `npm run up` (`docker-compose up`), which will launch all needed containers (mongo, redis, and node)

## Deploying

To heroku: from within this directory, run `heroku container:push web -a APPNAME`
to deploy to the application at APPNAME.  
