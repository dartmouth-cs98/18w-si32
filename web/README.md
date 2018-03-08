# Monad Web

The web client component of Monad.

## Development

Within the the `web/` directory, run `npm run start` to build the client and serve
it on your machine at `localhost:4000`.

There is also the option of running locally with Docker.
Within the `web/` directory, run `docker-compose build` and then `docker-compose up`
to build the client and serve it on your machine at `localhost:4000`.

In either case, any changes to code inside `/src` should propagate through without
needing to rebuild.  

## Deploying

`npm run build` will build the app for deployment into the `/dist` folder.

`npm run deploy` will first build the application for deployment, and will
then deploy with Surge.

## Anatomy

* Landing Page
	- Introduces users to the site
* Login / Register Page
	- Allows existing users to log in
	- Allows new users to create an account
* Dashboard (Profile) Page
	- Allow users to upload a bot  
	- Allow users to view their global stats
	- Allow users to view the stats for their current bot(s)
	- Allow users to view the stats for previous bots
	- Allow users to view their game history
	- Allow users to request to challenge a known opponent
* Docs Page
	- Allow users to interact with a variety of documentation / resources
* Leaderboard Page
	- Allow users to view the global leaderboard
	- Allow users to view their position on global leaderboard
	- Allow users to view the position of other known users on leaderboard
* Replay Page
	- Allow users to upload a replay file
	- Allow users to view a game visualization from uploaded replay file
	- Allow users to view game stats from uploaded replay file
